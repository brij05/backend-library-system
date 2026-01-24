const validateStudent = (req, res, next) => {
  const { name, phone, libraryId, seatNumber, facilityType, baseFee } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!phone || !/^[+]?[\d\s-()]+$/.test(phone)) {
    errors.push('Invalid phone number format');
  }

  if (!libraryId) {
    errors.push('Library ID is required');
  }

  if (!seatNumber) {
    errors.push('Seat number is required');
  }

  if (!['AC', 'Non-AC'].includes(facilityType)) {
    errors.push('Facility type must be AC or Non-AC');
  }

  if (!baseFee || baseFee < 0) {
    errors.push('Base fee must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLibrary = (req, res, next) => {
  const { name, whatsapp } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Library name must be at least 2 characters');
  }

  if (!whatsapp || !/^[+]?[\d\s-()]+$/.test(whatsapp)) {
    errors.push('Invalid WhatsApp number format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateStudent,
  validateLibrary
};
