import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signIn(data);
      navigate("/main");
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Welcome Back</h1>
          <p className="form-subtitle">Sign in to your Saferise account</p>
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
            <label htmlFor="id" className="form-label">
              Israeli ID
            </label>
            <input
              id="id"
              type="text"
              className={`form-input ${errors.id ? "error" : ""}`}
              placeholder="Enter your 9-digit Israeli ID"
              maxLength={9}
              {...register("id", {
                required: "Israeli ID is required",
                pattern: {
                  value: /^\d{9}$/,
                  message: "Israeli ID must be exactly 9 digits",
                },
              })}
            />
            {errors.id && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.id.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="link-button">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
