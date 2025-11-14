// File: components/LoginForm.tsx
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Logo from "../Logo";
import ReCAPTCHA from "react-google-recaptcha";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: "student" | "admin" }>();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please verify you are not a robot.");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({
        ...formData,
        role: role,
        captchaToken: captchaToken,
      });

      if (response.requiresOTP) {
        navigate(`/verify-otp/${role}`, {
          state: {
            email: response.email || formData.email,
            isAfterLogin: true,
          },
        });
      } else {
        // ✅ ITO ANG BINAGO NATIN
        // Dati: login(response.user);
        login(response); // 👈 Ngayon: Pinapasa na ang buong object (user + token)

        navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    console.error("VITE_RECAPTCHA_SITE_KEY is not set in .env file");
    return (
      <div className="alert alert-danger m-5">
        FATAL ERROR: CAPTCHA is not configured correctly. Please add
        VITE_RECAPTCHA_SITE_KEY to your .env file.
      </div>
    );
  }

  return (
    <div className="auth-container split-screen">
      <div className="auth-card left-panel">
        <Logo />

        <div className="welcome-title">
          <div className="welcome-title-text">Welcome To MEDILOG</div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder={
                  role === "student" ? "Email or Student ID" : "Email"
                }
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder={role === "student" ? "LRN (Password)" : "Password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {role === "student" && (
                <small className="text-muted">Use your LRN as password</small>
              )}
            </div>

            <div className="text-center mb-3">
              <Link to="/forgot-password" className="text-muted small">
                Forgot your password?
              </Link>
            </div>

            <div className="mb-3 d-flex justify-content-center">
              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={handleCaptchaChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100"
              disabled={loading || !captchaToken}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="back-link">
          <Link to="/" className="text-muted small">
            <i className="bi bi-arrow-left"></i> Back to role selection
          </Link>
        </div>
      </div>

      <div className="welcome-panel">
        <h2>Welcome Back!</h2>
        {role === "student" && (
          <div className="welcome-panel-content">
            <p>Don't have an account?</p>
            <Link to="/signup" className="btn btn-outline-light">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
