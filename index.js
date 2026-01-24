const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));


app.use('/api/libraries', require('./routes/libraries.js'));
app.use('/api/seats', require('./routes/seats.js'));
app.use('/api/students', require('./routes/students.js'));
app.use('/api/timeslots', require('./routes/timeslots.js'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/payments', require('./routes/payments.js'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use("/public", express.static("public"));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});