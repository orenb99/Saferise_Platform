const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Israeli ID validation function
const validateIsraeliID = (id) => {
  // Validate a 9 digit number
  const match = id.match(/\D/);
  if (match !== null || id.length !== 9) return false;

  // Calculate checksum using the Israeli ID algorithm
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    let digit = parseInt(id[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    sum += digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(id[8]);
};
function validateFullName(name) {
  // Validate the name's length
  return name.length >= 2 && name.length <= 100;
}
function validateEmail(email) {
  // Validate lowercase and correct format
  return (
    email.match(/[A-Z]/) === null &&
    email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/) === null
  );
}
function validatePassword(password) {
  // Validate password is at least 8 letters with only letters digits and few special letters
  return password.match(/^[\w\d!?#$%&*+,\-./@^|~]{8,}$/) !== null;
}
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    israeliId: {
      type: String,
      required: [true, "Israeli ID is required"],
      unique: true,
      validate: {
        validator: validateIsraeliID,
        message: "Please enter a valid Israeli ID",
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["Employee", "Supervisor", "Director"],
        message: "Role must be Employee, Supervisor, or Director",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

// Validate all fields
function validateFields(user) {
  user.email.trim();
  user.fullName.trim();
  if (!validateEmail(user.email)) throw new Error("Please enter a valid email!");

  if (!validateFullName(user.fullName)) throw new Error("Full name is between 2 and 100 letters");

  if (!validatePassword(user.password)) throw new Error("Please enter a valid password");

  if (!validateIsraeliID(user.israeliId)) throw new Error("Please enter a valid id");
  try {
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  return true;
} catch (error) {
  console.log(error);
  return false;
}

}


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
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

// Remove password from JSON output
function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
}

module.exports = mongoose.model("User", userSchema);
