import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Israeli ID validation function
  const validateIsraeliID = (id) => {
    const cleanId = id.replace(/\D/g, "");

    if (cleanId.length !== 9) {
      return "Israeli ID must be exactly 9 digits";
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
    return checkDigit === parseInt(cleanId[8]) || "Please enter a valid Israeli ID";
  };

  const onSubmit = async (data) => {
    try {
      data.inspectorType = false;
      await signUp(data);
      navigate("/main");
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Join the Saferise Platform today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className={`form-input ${errors.fullName ? "error" : ""}`}
              placeholder="Enter your full name"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Full name cannot exceed 100 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s\u0590-\u05FF]+$/,
                  message: "Full name can only contain letters and spaces",
                },
              })}
            />
            {errors.fullName && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.fullName.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter your email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.email.message}
              </div>
            )}
          </div>
          {/* add inspectorType */}
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              className={`form-input ${errors.phoneNumber ? "error" : ""}`}
              placeholder="Enter your 10-digit Phone Number"
              maxLength={12}
              {...register("phoneNumber", {
                required: "Phone Number is required",
                pattern: {
                  value: /^05\d[- ]?\d{3}[- ]?\d{4}$/,
                  message: "Must be a valid Israeli phone number",
                },
              })}
            />
            {errors.phoneNumber && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.phoneNumber.message}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="inspectorId" className="form-label">
              Israeli ID
            </label>
            <input
              id="inspectorId"
              type="text"
              className={`form-input ${errors.inspectorId ? "error" : ""}`}
              placeholder="Enter your 9-digit Israeli ID"
              maxLength={9}
              {...register("inspectorId", {
                required: "Israeli ID is required",
                validate: validateIsraeliID,
              })}
            />
            {errors.inspectorId && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.inspectorId.message}
              </div>
            )}
          </div>

          {/* <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className={`form-select ${errors.role ? "error" : ""}`}
              {...register("role", {
                required: "Please select a role",
              })}
            >
              <option value="">Select your role</option>
              <option value="Employee">Employee</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Director">Director</option>
            </select>
            {errors.role && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.role.message}
              </div>
            )}
          </div> */}

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Create a strong password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              })}
            />
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.password.message}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="region" className="form-label">
              Region
            </label>
            <input
              id="region"
              type="text"
              className={`form-input ${errors.region ? "error" : ""}`}
              placeholder="Enter your region"
              {...register("region", {
                required: "Region is required",
                minLength: {
                  value: 3,
                  message: "Region must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-z ]{3,100}$/,
                  message: "Region must contain only lowercase letters and spaces",
                },
              })}
            />
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.password.message}
              </div>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link to="/signin" className="link-button">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
