import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from "../services/api";
import '../styles/auth.css';

export default function Signup() {
  const navigate = useNavigate();

  const { signup } = authService;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [error, setError] = useState(""); // ✅ ADD THIS

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup(formData);

      alert("Signup successful ✅");
      navigate('/login'); // optional

    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.error || err.response?.data?.details?.[0]?.msg;
      setError(backendError || "Signup failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🚀 Team Task Manager</h1>
        <h2>Sign Up</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required />

          <button type="submit">Sign Up</button> {/* ✅ FIX */}
        </form>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}