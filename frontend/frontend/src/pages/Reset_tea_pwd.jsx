import React, { useState } from "react";
import "./ChangePassword.css";
import api from "../services/api";

const ChangeTeacherPassword = () => {
  const [form, setForm] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { email, new_password, confirm_password } = form;

    // ✅ Validation
    if (!email || !new_password || !confirm_password) {
      setMessage("❌ All fields are required");
      return;
    }

    if (new_password !== confirm_password) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (new_password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/admin/change-teacher-password", {
        email,
        new_password,
      });

      setMessage("✅ Password updated successfully");

      setForm({
        email: "",
        new_password: "",
        confirm_password: "",
      });

    } catch (err) {
      if (err.response && err.response.data?.error) {
        setMessage("❌ " + err.response.data.error);
      } else {
        setMessage("⚠️ Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-container">
      <div className="change-card">
        <h2>Change Teacher Password</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="new_password"
          placeholder="New Password"
          value={form.new_password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={form.confirm_password}
          onChange={handleChange}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ChangeTeacherPassword;