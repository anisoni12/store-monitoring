# Store Monitoring System

## Project Overview
Backend API system for monitoring restaurant store uptime/downtime based on periodic polling data. The system generates reports showing how often stores were active/inactive during their business hours.

## Problem Statement
Loop monitors several restaurants in the US and needs to monitor if stores are online during business hours. Due to unknown reasons, stores might go inactive for a few hours. Restaurant owners need reports showing uptime/downtime patterns.

## Tech Stack
- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **CSV Processing**: csv-parser, json2csv
- **Timezone Handling**: moment-timezone
- **Environment Management**: dotenv
- **Development**: nodemon

## Project Structure
```
anish_08272025/
├── data/                    # CSV data files
│   ├── store_status.csv     # Store polling data (store_id, timestamp_utc, status)
│   ├── business_hours.csv   # Store business hours (store_id, dayOfWeek, start/end times)
│   └── store_timezone.csv   # Store timezones (store_id, timezone_str)
├── models/                  # MongoDB schemas
│   ├── StoreStatus.js       # Store status polling records
│   ├── BusinessHours.js     # Store business hours
│   ├── StoreTimezone.js     # Store timezone mappings
│   ├── Report.js            # Report generation tracking
│   └── index.js             # Model exports
├── routes/                  # API route handlers (coming next)
├── utils/                   # Helper functions (coming next)
├── scripts/                 # Data processing scripts
│   └── dataIngestion.js     # CSV to MongoDB data loader
├── server.js                # Main Express application
├── .env                     # Environment variables
└── README.md                # This file
```

## Database Schema

### Collections
1. **StoreStatus**: Periodic polling data
   - `store_id`: String (indexed)
   - `timestamp_utc`: Date (indexed)
   - `status`: String (active/inactive)

2. **BusinessHours**: Store operating hours
   - `store_id`: String (indexed)
   - `day_of_week`: Number (0=Monday, 6=Sunday)
   - `start_time_local`: String (HH:mm:ss format)
   - `end_time_local`: String (HH:mm:ss format)

3. **StoreTimezone**: Store timezone mapping
   - `store_id`: String (unique, indexed)
   - `timezone_str`: String (default: "America/Chicago")

4. **Report**: Report generation tracking
   - `report_id`: String (unique UUID)
   - `status`: String (Running/Complete/Failed)
   - `csv_data`: String (generated CSV content)
   - `created_at`: Date
   - `completed_at`: Date

## Data Processing Logic

### Data Sources
- **Store Status**: ~hourly polling data with gaps
- **Business Hours**: Local time business hours per day of week
- **Timezones**: Store location timezones for UTC conversion

### Key Challenges
1. **Timezone Conversion**: UTC polling data → Local business hours
2. **Sparse Data Interpolation**: Fill gaps between polling points
3. **Business Hours Filtering**: Only count uptime/downtime during business hours
4. **Time Window Calculations**: Last hour/day/week from max timestamp

## Current Status

### ✅ Completed (Day 1)
- [x] Project setup with Node.js + Express
- [x] MongoDB Atlas connection established
- [x] Database schema design and models
- [x] CSV data ingestion pipeline
- [x] Basic server with health check endpoints
- [x] All CSV data loaded into MongoDB

### 🔄 In Progress (Day 2)
- [ ] Core algorithm development
- [ ] Timezone conversion utilities
- [ ] Business hours validation logic
- [ ] Data interpolation algorithms
- [ ] Time window calculation functions

### 📋 Upcoming (Days 3-6)
- [ ] API endpoints (/trigger_report, /get_report)
- [ ] Report generation background processing
- [ ] CSV output formatting
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Documentation and demo video

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account or local MongoDB
- Git

### Installation Steps
```bash
# Clone repository
git clone <repository-url>
cd anish_08272025

# Install dependencies
npm install

# Configure environment
# Create .env file with:
# PORT=3000
# MONGODB_URI=your_mongodb_connection_string
# NODE_ENV=development

# Load data into database
node scripts/dataIngestion.js

# Start development server
npm run dev
```

### Verify Installation
- Server: http://localhost:3000 (should return API status)
- Health: http://localhost:3000/health (should return system status)

## API Endpoints (Coming Soon)

### POST /trigger_report
Triggers background report generation
- **Input**: None
- **Output**: `{ report_id: "uuid-string" }`

### GET /get_report/:report_id
Retrieves report status or CSV data
- **Input**: report_id parameter
- **Output**: 
  - If running: `{ status: "Running" }`
  - If complete: CSV file with uptime/downtime data

## Report Schema
```
store_id, uptime_last_hour(minutes), uptime_last_day(hours), uptime_last_week(hours), 
downtime_last_hour(minutes), downtime_last_day(hours), downtime_last_week(hours)
```

## Development Notes

### Data Assumptions
- Missing business hours = 24/7 operation
- Missing timezone = "America/Chicago"
- Current timestamp = max timestamp in polling data
- Interpolation between polling points based on last known status

### Performance Considerations
- Compound indexes on (store_id, timestamp_utc)
- Batch processing for large datasets (1000 records per batch)
- Background report generation to avoid API timeouts

## Future Improvements
- Database partitioning for large datasets
- Redis caching for frequently accessed data
- API rate limiting and authentication
- Real-time WebSocket updates
- Horizontal scaling with load balancers
- Advanced interpolation algorithms
- Store performance analytics dashboard

---

**Timeline**: 6 days total | **Current Day**: 2/6 | **Status**: On track
