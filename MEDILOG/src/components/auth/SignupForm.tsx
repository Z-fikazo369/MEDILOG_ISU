// components/auth/SignupForm.tsx (buong file)

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import Logo from "../Logo";

const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    lrn: "",
    studentId: "",
    preferredLoginMethod: "email" as "email" | "studentId",

    // ✅ --- MGA BAGONG FIELDS --- ✅
    department: "",
    program: "",
    yearLevel: "",
    // ✅ -------------------------- ✅
  });

  const [idPicture, setIdPicture] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File is too large. Maximum size is 5MB.");
        setIdPicture(null);
        e.target.value = "";
      } else {
        setIdPicture(file);
        setError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.lrn.length !== 12) {
      setError("LRN must be exactly 12 digits");
      return;
    }
    if (!formData.studentId.trim()) {
      setError("Student ID is required");
      return;
    }
    if (!idPicture) {
      setError("Please upload your School ID picture for verification.");
      return;
    }
    // ✅ --- VALIDATION PARA SA BAGONG FIELDS --- ✅
    if (!formData.department || !formData.program || !formData.yearLevel) {
      setError(
        "Please fill out all fields, including Department, Program, and Year Level."
      );
      return;
    }
    // ✅ --------------------------------------- ✅

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("lrn", formData.lrn);
      formDataToSend.append("studentId", formData.studentId);
      formDataToSend.append(
        "preferredLoginMethod",
        formData.preferredLoginMethod
      );
      formDataToSend.append("role", "student");
      formDataToSend.append("idPicture", idPicture);

      // ✅ --- IDAGDAG ANG BAGONG DATA SA FORMDATA --- ✅
      formDataToSend.append("department", formData.department);
      formDataToSend.append("program", formData.program);
      formDataToSend.append("yearLevel", formData.yearLevel);
      // ✅ ------------------------------------------- ✅

      const response = await authAPI.signup(formDataToSend);

      alert(
        response.message ||
          "Account created successfully! Please wait for admin approval. You will receive an email notification once approved."
      );

      navigate("/login/student");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container split-screen">
      <div className="auth-card left-panel">
        <Logo />

        <div className="welcome-title">
          <div className="welcome-title-text">Create Your Account</div>

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
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="lrn"
                placeholder="LRN (12 digits)"
                value={formData.lrn}
                onChange={handleChange}
                maxLength={12}
                pattern="\d{12}"
                title="LRN must be exactly 12 digits"
                required
              />
              <small className="text-muted">Learner Reference Number</small>
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="studentId"
                placeholder="Student ID"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
              <small className="text-muted">
                Your university student ID number
              </small>
            </div>

            {/* ✅ --- MGA BAGONG DROPDOWNS --- ✅ */}
            {/* Paki-palitan 'yung options base sa data ninyo */}
            <div className="mb-3">
              <select
                className="form-control"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="College of Education">
                  College of Education
                </option>
                <option value="College of Business, Accountancy and Public Administration">
                  College of Business, Accountancy and Public Administration
                </option>
                <option value="College of Agriculture">
                  College of Agriculture
                </option>
                <option value="College of Computing Studies, Information and Communication Technology">
                  College of Computing Studies, Information and Communication
                  Technologys
                </option>
                <option value="School of Veterinary Medicine">
                  School of Veterinary Medicine
                </option>
                <option value="College of Engineering">
                  College of Engineering
                </option>
                <option value="College of Criminal Justice Education">
                  College of Criminal Justice Education
                </option>
                <option value="College of Nursing">College of Nursing</option>
                <option value="Institute of Fisheries">
                  Institute of Fisheries
                </option>
              </select>
            </div>

            <div className="mb-3">
              <select
                className="form-control"
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
              >
                <option value="">Select Program</option>
                <option>Doctor of Philosophy in Animal Science</option>
                <option>Doctor of Philosophy in Crop Science</option>
                <option>Doctor of Philosophy in Education</option>
                <option>Doctor of Public Administration</option>
                <option>Doctor of Philosophy in Resource Management</option>
                <option>Master of Arts in Education</option>
                <option>Master of Arts in Teaching Livelihood Education</option>
                <option>
                  Master of Science Major in Mathematics Education, Biology
                  Education and Chemistry Education
                </option>
                <option>Master of Science in Animal Science</option>
                <option>Master of Science in Crop Science</option>
                <option>Master of Science in Agricultural Engineering</option>
                <option>Master in Business Administration</option>
                <option>Master in Public Administration</option>
                <option>Master of Arts in Psychology</option>
                <option>Master of Arts in English</option>
                <option>Master in Chemistry</option>
                <option>Master in Mathematics</option>
                <option>Master of Biology</option>
                <option>Master in Psychology</option>
                <option>Master in Information Technology</option>
                <option>Doctor of Veterinary Medicine</option>
                <option>Bachelor of Science in Animal Husbandry</option>
                <option>Bachelor of Science in Agriculture</option>
                <option>Bachelor of Science in Agribusiness</option>
                <option>Bachelor of Science in Forestry</option>
                <option>Bachelor of Science in Environmental Science</option>
                <option>Bachelor of Science in Biology</option>
                <option>Bachelor of Science in Mathematics</option>
                <option>Bachelor of Science in Chemistry</option>
                <option>Bachelor of Science in Psychology</option>
                <option>Bachelor of Arts in Communication</option>
                <option>Bachelor of Arts in English Language Studies</option>
                <option>B.S. in Business Administration</option>
                <option>Bachelor in Public Administration</option>
                <option>B.S. in Management Accounting</option>
                <option>B.S. in Entrepreneurship</option>
                <option>B.S. in Accountancy</option>
                <option>B.S. in Hospitality Management</option>
                <option>B.S. in Tourism Management</option>
                <option>
                  Bachelor of Science in Agricultural and Biosystems Engineering
                </option>
                <option>B.S. in Civil Engineering</option>
                <option>Bachelor of Elementary Education</option>
                <option>Bachelor of Secondary Education</option>
                <option>Bachelor of Physical Education</option>
                <option>Bachelor of Technology and Livelihood Education</option>
                <option>Bachelor of Science in Information Technology</option>
                <option>Bachelor of Science in Information Systems</option>
                <option>Bachelor of Science in Computer Science</option>
                <option>Bachelor of Library and Information Science</option>
                <option>B.S. in Fisheries and Aquatic Sciences</option>
                <option>B.S. in Criminology</option>
                <option>
                  Bachelor of Science in Law Enforcement Administration
                </option>
                <option>Bachelor of Science in Nursing</option>
                <option>3 Year Diploma in Agricultural Technology</option>
              </select>
            </div>

            <div className="mb-3">
              <select
                className="form-control"
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="idPicture" className="form-label fw-semibold">
                <i className="bi bi-person-vcard me-2"></i>School ID Picture
              </label>
              <input
                type="file"
                className="form-control"
                id="idPicture"
                name="idPicture"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
                required
              />
              <small className="text-muted">
                Required for account verification (Max 5MB).
              </small>
            </div>

            <div className="mb-3">
              <label
                htmlFor="preferredLoginMethod"
                className="form-label fw-semibold"
              >
                <i className="bi bi-key me-2"></i>Preferred Login Method
              </label>
              <select
                className="form-control"
                id="preferredLoginMethod"
                name="preferredLoginMethod"
                value={formData.preferredLoginMethod}
                onChange={handleChange}
                required
              >
                <option value="email">Email Address</option>
                <option value="studentId">Student ID</option>
              </select>
              <small className="text-muted">
                Choose how you want to login after approval
              </small>
            </div>

            <div className="alert alert-info mb-3">
              <i className="bi bi-info-circle me-2"></i>
              <small>
                Your account will be pending approval by an administrator. Once
                approved, you'll receive an email notification...
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
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
        <h2>Join MEDILOG!</h2>
        <div className="welcome-panel-content">
          <p>Already have an account?</p>
          <Link to="/login/student" className="btn btn-outline-light">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
