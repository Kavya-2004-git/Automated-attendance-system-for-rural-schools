import React, { useState } from "react";
import "./ResetPassword.css";
import api from "../services/api";

const ResetStudentPassword = () => {
  const [form, setForm] = useState({
    roll_no: "",
    class_name: "",
    section: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = async () => {
    const { roll_no, class_name, section } = form;

    // ✅ Validation
    if (!roll_no || !class_name || !section) {
      setMessage("❌ All fields are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post(
        "/teacher/reset-student-password",
        {
          roll_no,
          class_name,
          section,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // ✅ Success
      setMessage("✅ Password reset to Student@123");

      // Clear form
      setForm({
        roll_no: "",
        class_name: "",
        section: "",
      });

    } catch (err) {
      if (err.response && err.response.data?.error) {
        setMessage("❌ " + err.response.data.error);
      } else {
        setMessage("⚠️ Server error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Reset Student Password</h2>

        <input
          type="text"
          name="roll_no"
          placeholder="Enter Roll Number"
          value={form.roll_no}
          onChange={handleChange}
        />

        <input
          type="text"
          name="class_name"
          placeholder="Enter Class"
          value={form.class_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="section"
          placeholder="Enter Section"
          value={form.section}
          onChange={handleChange}
        />

        <button onClick={handleReset} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetStudentPassword;