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
    email.match(/[A-Z]/) === null && email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
  );
}
function validatePassword(password) {
  // Validate password is at least 8 letters with only letters digits and few special letters
  return password.match(/^[\w\d!?#$%&*+,\-./@^|~]{8,}$/) !== null;
}

// Validate all fields and trim
function validateFields(user) {
  let errs = [];

  if (user.email) {
    user.email = user.email.trim();
    if (!validateEmail(user.email)) errs.push("Please enter a valid email!");
  }
  if (user.fullName) {
    user.fullName = user.fullName.trim();
    if (!validateFullName(user.fullName)) errs.push("Full name is between 2 and 100 letters");
  }
  if (user.password && !validatePassword(user.password)) errs.push("Please enter a valid password");
  if (user.id && !validateIsraeliID(user.id)) errs.push("Please enter a valid id");

  if (errs.length > 0) {
    const err = new Error("Validation failed");
    err.name = "ValidationError";
    err.details = errs;
    throw err;
  }
}

// Remove password from JSON output
function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
}

module.exports = validateFields;
