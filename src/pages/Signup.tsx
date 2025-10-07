import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Validation message component
const ValidationMessage = ({ validation }: { validation: { isValid: boolean; message: string } }) => {
  if (!validation.message) return null;
  
  return (
    <div className={`flex items-center space-x-2 text-xs mt-1 ${
      validation.isValid ? 'text-green-600' : 'text-red-600'
    }`}>
      <svg 
        className={`w-3 h-3 flex-shrink-0 ${
          validation.isValid ? 'text-green-500' : 'text-red-500'
        }`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {validation.isValid ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        )}
      </svg>
      <span>{validation.message}</span>
    </div>
  );
};

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [highlightFields, setHighlightFields] = useState(false);
  const [validation, setValidation] = useState({
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" },
    age: { isValid: false, message: "" },
    gender: { isValid: false, message: "" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear general error when user starts typing
    if (error) {
      setError("");
    }
    
    // Validate specific fields
    if (name === "email") {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "password") {
      setValidation(prev => ({ 
        ...prev, 
        password: validatePassword(value),
        confirmPassword: validateConfirmPassword(value, form.confirmPassword)
      }));
    } else if (name === "confirmPassword") {
      setValidation(prev => ({ 
        ...prev, 
        confirmPassword: validateConfirmPassword(form.password, value)
      }));
    } else if (name === "birthday") {
      setValidation(prev => ({ ...prev, age: validateAge(value) }));
    } else if (name === "gender") {
      setValidation(prev => ({ ...prev, gender: validateGender(value) }));
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { isValid: false, message: "" };
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }
    return { isValid: true, message: "Email looks good!" };
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return { isValid: false, message: "" };
    }
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" };
    }
    return { isValid: true, message: "Password is strong!" };
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      return { isValid: false, message: "" };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: "Passwords do not match" };
    }
    return { isValid: true, message: "Passwords match!" };
  };

  const validateAge = (birthday: string) => {
    if (!birthday) {
      return { isValid: false, message: "" };
    }
    const age = calculateAge(birthday);
    if (age < 18) {
      return { isValid: false, message: "You must be 18 years or older" };
    }
    return { isValid: true, message: `Age: ${age} years old` };
  };

  const validateGender = (gender: string) => {
    if (!gender) {
      return { isValid: false, message: "Please select your gender" };
    }
    return { isValid: true, message: "Gender selected" };
  };

  const handleDisabledButtonClick = () => {
    setHighlightFields(true);
    setHasAttemptedSubmit(true);
    
    // Show validation messages for all fields
    setValidation({
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
      age: validateAge(form.birthday),
      gender: validateGender(form.gender),
    });
    
    setError("Please complete all required fields to continue");
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightFields(false);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    // Check if all validations pass
    if (!validation.email.isValid || !validation.password.isValid || 
        !validation.confirmPassword.isValid || !validation.age.isValid || !validation.gender.isValid) {
      setError("Please fix all validation errors before submitting");
      return;
    }
    
    const age = calculateAge(form.birthday);
    const result = signup({
      firstName: form.firstName,
      lastName: form.lastName,
      name: `${form.firstName} ${form.lastName}`,
      gender: form.gender as "male" | "female" | "other",
      birthday: form.birthday,
      age,
      email: form.email,
      password: form.password,
    });
    if (!result.success) {
      setError(result.message || "Signup failed");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Main form container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm">Join us to start tracking your symptoms</p>
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm font-medium group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </button>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    !form.firstName && highlightFields ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'
                  }`}
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Last Name field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    !form.lastName && highlightFields ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'
                  }`}
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Gender field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <select
                  name="gender"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none ${
                    form.gender ? 
                      (validation.gender.isValid ? 
                        'border-green-300 focus:ring-green-500' : 
                        'border-red-300 focus:ring-red-500') : 
                      (hasAttemptedSubmit || highlightFields ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500')
                  }`}
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {hasAttemptedSubmit && <ValidationMessage validation={validation.gender} />}
            </div>

            {/* Birthday field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  name="birthday"
                  type="date"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    form.birthday ? 
                      (validation.age.isValid ? 
                        'border-green-300 focus:ring-green-500' : 
                        'border-red-300 focus:ring-red-500') : 
                      (highlightFields ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500')
                  }`}
                  value={form.birthday}
                  onChange={handleChange}
                  required
                />
              </div>
              <ValidationMessage validation={validation.age} />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    form.email ? 
                      (validation.email.isValid ? 
                        'border-green-300 focus:ring-green-500' : 
                        'border-red-300 focus:ring-red-500') : 
                      (highlightFields ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500')
                  }`}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <ValidationMessage validation={validation.email} />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    form.password ? 
                      (validation.password.isValid ? 
                        'border-green-300 focus:ring-green-500' : 
                        'border-red-300 focus:ring-red-500') : 
                      (highlightFields ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500')
                  }`}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <ValidationMessage validation={validation.password} />
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    form.confirmPassword ? 
                      (validation.confirmPassword.isValid ? 
                        'border-green-300 focus:ring-green-500' : 
                        'border-red-300 focus:ring-red-500') : 
                      (highlightFields ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500')
                  }`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <ValidationMessage validation={validation.confirmPassword} />
            </div>

            {/* Submit button */}
            <button 
              type="submit"
              disabled={!validation.email.isValid || !validation.password.isValid || 
                       !validation.confirmPassword.isValid || !validation.age.isValid || !validation.gender.isValid}
              onClick={(e) => {
                if (!validation.email.isValid || !validation.password.isValid || 
                    !validation.confirmPassword.isValid || !validation.age.isValid || !validation.gender.isValid) {
                  e.preventDefault();
                  handleDisabledButtonClick();
                }
              }}
              className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 ${
                !validation.email.isValid || !validation.password.isValid || 
                !validation.confirmPassword.isValid || !validation.age.isValid || !validation.gender.isValid
                  ? 'bg-gray-300 text-gray-500 cursor-pointer hover:bg-gray-400'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-green-500/20'
              }`}
            >
              Create Account
            </button>
          </form>

          {/* Login link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}