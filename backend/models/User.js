const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Israeli ID validation function
const validateIsraeliID = (id) => {
  // Remove any non-digit characters
  const cleanId = id.replace(/\D/g, '');
  
  // Israeli ID must be 9 digits
  if (cleanId.length !== 9) {
    return false;
  }
  
  // Calculate checksum using the Israeli ID algorithm
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    let digit = parseInt(cleanId[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(cleanId[8]);
};

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  israeliId: {
    type: String,
    required: [true, 'Israeli ID is required'],
    unique: true,
    validate: {
      validator: validateIsraeliID,
      message: 'Please enter a valid Israeli ID'
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['Employee', 'Supervisor', 'Director'],
      message: 'Role must be Employee, Supervisor, or Director'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
