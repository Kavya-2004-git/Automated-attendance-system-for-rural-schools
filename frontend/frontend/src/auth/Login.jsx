import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { setAuth } from "../utils/storage";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!email || !password) {
      alert("Please enter both Email & Password");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.token, res.data.role, res.data.user_id);

      if (res.data.role === "ADMIN") navigate("/admin");
      else if (res.data.role === "TEACHER") navigate("/teacher");
      else if (res.data.role === "STUDENT") navigate("/student");
    } catch (error) {
      alert("❌ Authentication Failed: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE: VISUAL BRANDING */}
      <div className="login-visual">
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <div className="badge">AI-Powered FRS</div>
          <h1>Empowering Schools with <br/><span>Precision.</span></h1>
          <p>The smarter way to manage academic attendance and student safety.</p>
        </div>
        {/* You can replace this with a local image path */}
        <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80" alt="Education" className="bg-img" />
      </div>

      {/* RIGHT SIDE: INTERACTIVE FORM */}
      <div className="login-form-side">
        <Link to="/" className="floating-back">
          <i className="fas fa-arrow-left"></i>
        </Link>
        
        <div className="form-wrapper">
          <header className="form-header">
            <div className="logo-pill">
                <i className="fas fa-user-shield"></i>
            </div>
            <h2>Welcome Back</h2>
            <p>Please enter your portal credentials</p>
          </header>

          <div className="input-stack">
            <div className="custom-input">
              <label>Email Address</label>
              <div className="input-wrap">
                <i className="far fa-envelope"></i>
                <input 
                  type="email" 
                  placeholder="name@school.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="custom-input">
              <label>Password</label>
              <div className="input-wrap">
                <i className="fas fa-lock-open"></i>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-utils">
              <label className="checkbox-container">
                <input type="checkbox" /> 
                <span>Remember me</span>
              </label>
              <a href="#reset" className="forgot-link">Forgot Password?</a>
            </div>

            <button className="submit-btn" onClick={submit} disabled={loading}>
              {loading ? "Verifying..." : "Sign into Portal"}
              {!loading && <i className="fas fa-chevron-right"></i>}
            </button>
          </div>

          <footer className="form-footer">
            <p>Authorized personnel only. <br/> <span>Secure Session Active</span></p>
          </footer>
        </div>
      </div>
    </div>
  );
}