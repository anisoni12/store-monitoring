const csv = require("csv-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const { StoreStatus, BusinessHours, StoreTimezone } = require("../models");

class DataIngestion {
  async loadStoreTimezones(csvPath) {
    return new Promise((resolve, reject) => {
      console.log("Loading store timezone data...");
      const timezones = [];

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          timezones.push({
            store_id: row.store_id,
            timezone_str: row.timezone_str || "America/Chicago",
          });
        })
        .on("end", async () => {
          try {
            await StoreTimezone.deleteMany({});
            await StoreTimezone.insertMany(timezones);
            console.log(`Loaded ${timezones.length} timezone records`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", reject);
    });
  }

  async loadBusinessHours(csvPath) {
    return new Promise((resolve, reject) => {
      console.log("Loading business hours data...");
      const businessHours = [];

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          businessHours.push({
            store_id: row.store_id,
            day_of_week: parseInt(row.dayOfWeek),
            start_time_local: row.start_time_local,
            end_time_local: row.end_time_local,
          });
        })
        .on("end", async () => {
          try {
            await BusinessHours.deleteMany({});
            await BusinessHours.insertMany(businessHours);
            console.log(
              `Loaded ${businessHours.length} business hours records`
            );
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", reject);
    });
  }

  async loadStoreStatus(csvPath) {
    return new Promise((resolve, reject) => {
      console.log("Loading store status data...");
      const statusRecords = [];

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          statusRecords.push({
            store_id: row.store_id,
            timestamp_utc: new Date(row.timestamp_utc),
            status: row.status,
          });
        })
        .on("end", async () => {
          try {
            await StoreStatus.deleteMany({});

            const batchSize = 1000;
            for (let i = 0; i < statusRecords.length; i += batchSize) {
              const batch = statusRecords.slice(i, i + batchSize);
              await StoreStatus.insertMany(batch);
              console.log(
                `Inserted batch ${Math.floor(i / batchSize) + 1} /${Math.ceil(
                  statusRecords.length / batchSize
                )}`
              );
            }

            console.log(`Loaded ${statusRecords.length} store status records`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", reject);
    });
  }

  async loadAllData() {
    try {
      console.log("Starting data ingestion...");

      // order : timezones first, then business hours, then status data
      await this.loadStoreTimezones("./data/store_timezone.csv");
      await this.loadBusinessHours("./data/business_hours.csv");
      await this.loadStoreStatus("./data/store_status.csv");

      console.log("All data loaded successfully!");
    } catch (error) {
      console.error("Error loading data: ", error);
      throw error;
    }
  }
}

module.exports = DataIngestion;

if (require.main === module) {
  const path = require("path");
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    const ingestion = new DataIngestion();
    await ingestion.loadAllData();
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
}
