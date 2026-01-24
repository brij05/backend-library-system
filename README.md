# Library Management System - Backend

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create .env file:
```bash
cp .env.example .env
```

3. Update .env with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-management
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin (first time)

### Libraries
- `GET /api/libraries` - Get all libraries
- `GET /api/libraries/:id` - Get library by ID
- `POST /api/libraries` - Create library
- `PUT /api/libraries/:id` - Update library
- `DELETE /api/libraries/:id` - Delete library

### Seats
- `GET /api/seats` - Get all seats (query: libraryId, facilityType, available)
- `GET /api/seats/:id` - Get seat by ID
- `POST /api/seats` - Create seat
- `POST /api/seats/bulk` - Bulk create seats
- `PUT /api/seats/:id` - Update seat
- `DELETE /api/seats/:id` - Delete seat

### Students
- `GET /api/students` - Get all students (query: active, libraryId, paymentStatus)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Assign seat to student
- `PUT /api/students/:id` - Update student
- `POST /api/students/:id/release` - Release seat
- `PATCH /api/students/:id/payment` - Update payment status

### Time Slots
- `GET /api/timeslots` - Get all time slots (query: libraryId)
- `POST /api/timeslots` - Create time slot
- `PUT /api/timeslots/:id` - Update time slot
- `DELETE /api/timeslots/:id` - Delete time slot

### Pricing
- `GET /api/payments` - Get all pricing (query: libraryId)
- `POST /api/payments` - Create pricing
- `PUT /api/payments/:id` - Update pricing

## 🔐 Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example API Calls

### Login
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
```

### Get All Libraries
```javascript
fetch('http://localhost:5000/api/libraries')
```

### Assign Seat
```javascript
fetch('http://localhost:5000/api/students', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    name: 'John Doe',
    phone: '+91-9876543210',
    libraryId: 'library_id',
    seatNumber: 'A1',
    facilityType: 'AC',
    joinDate: '2026-01-19',
    baseFee: 1500
  })
})
```

### Get Available Seats
```javascript
fetch('http://localhost:5000/api/seats?libraryId=<id>&facilityType=AC&available=true')
```

## 🗄️ Database Schema

### Collections:
- **libraries** - Library information
- **seats** - Seat inventory
- **students** - Student/member records
- **timeslots** - Time-based pricing slots
- **pricings** - Facility pricing
- **admins** - Admin users

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT authentication
- CORS enabled
- Input validation
- Unique constraints on critical fields

## 📦 Project Structure

```
backend/
├── models/
│   ├── Admin.js
│   ├── Library.js
│   ├── Seat.js
│   ├── Student.js
│   ├── TimeSlot.js
│   └── Pricing.js
├── routes/
│   ├── auth.js
│   ├── libraries.js
│   ├── seats.js
│   ├── students.js
│   ├── timeslots.js
│   └── payments.js
├── middleware/
│   └── auth.js
├── seeders/
│   └── seed.js
├── server.js
├── package.json
├── .env.example
└── README.md