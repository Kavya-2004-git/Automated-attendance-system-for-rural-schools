import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { setAuth } from "../../utils/storage";
import "../../styles/studentlogin.css";

export default function StudentLogin() {
  const nav = useNavigate();
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(""); // Custom error state

  const [form, setForm] = useState({
    school: "",
    class_name: "",
    section: "",
    roll: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/student/schools").then(res => setSchools(res.data));
  }, []);

  useEffect(() => {
    if (form.school) {
      api.get(`/student/classes/${form.school}`).then(res => setClasses(res.data));
    }
  }, [form.school]);

  useEffect(() => {
    if (form.school && form.class_name) {
      api.get(`/student/sections/${form.school}/${form.class_name}`)
        .then(res => setSections(res.data));
    }
  }, [form.class_name]);

  const handle = e => {
    setError(""); // Clear error when typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const { school, class_name, section, roll, password } = form;
    if (!school || !class_name || !section || !roll || !password) {
      setError("Please fill all fields to continue");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/student/login", {
        roll_no: roll, password, school, section, class_name
      });
      setAuth(res.data.token, "STUDENT", res.data.id);
      nav("/student");
    } catch {
      setError("Invalid Credentials. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-login-container">
      {/* LEFT SIDE: VISUAL BRANDING */}
      <div className="login-visual-side">
        <div className="visual-overlay"></div>
        <div className="visual-text">
          <div className="tech-tag">Student Portal</div>
          <h1>Track Your <span>Growth.</span></h1>
          <p>Access your personalized attendance records and academic progress instantly.</p>
        </div>
        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80" alt="Student" />
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="login-form-side">
        <Link to="/" className="home-btn-circle"><i className="fas fa-home"></i></Link>
        
        <div className="student-form-wrap">
          <header>
            <div className="student-icon"><i className="fas fa-user-graduate"></i></div>
            <h2>Student Sign In</h2>
            <p>Enter your academic details below</p>
          </header>

          {/* CUSTOM ERROR ALERT */}
          {error && <div className="status-alert error">{error}</div>}

          <div className="form-grid">
            <div className="input-box full">
              <label>Select Institution</label>
              <div className="field-wrap">
                <i className="fas fa-university"></i>
                <select name="school" value={form.school} onChange={handle}>
                  <option value="">Choose School</option>
                  {schools.map((s, i) => <option key={i}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="row-fields">
              <div className="input-box">
                <label>Class</label>
                <div className="field-wrap">
                  <select name="class_name" value={form.class_name} onChange={handle}>
                    <option value="">Select</option>
                    {classes.map((c, i) => <option key={i}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-box">
                <label>Section</label>
                <div className="field-wrap">
                  <select name="section" value={form.section} onChange={handle}>
                    <option value="">Select</option>
                    {sections.map((s, i) => <option key={i}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="input-box full">
              <label>Roll Number</label>
              <div className="field-wrap">
                <i className="fas fa-id-card"></i>
                <input name="roll" placeholder="Ex: 20CS101" value={form.roll} onChange={handle} />
              </div>
            </div>

            <div className="input-box full">
              <label>Secret Password</label>
              <div className="field-wrap">
                <i className="fas fa-lock"></i>
                <input 
                  type={showPass ? "text" : "password"} 
                  name="password" 
                  placeholder="••••••••" 
                  value={form.password} 
                  onChange={handle} 
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  <i className={showPass ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            {/* REMEMBER ME ALIGNMENT */}
            <div className="form-utils">
              <label className="checkbox-container">
                <input type="checkbox" /> 
                <span>Remember me</span>
              </label>
              <a href="#reset" className="forgot-link">Forgot Password?</a>
            </div>

            <button className="login-btn-final" onClick={login} disabled={loading}>
              {loading ? (
                <span className="btn-loader-wrap">
                  <div className="mini-loader"></div> Verifying...
                </span>
              ) : "Access Dashboard"}
            </button>
          </div>

          <footer className="student-login-footer">
            <p>© 2026 SmartAttend | Secured with AI</p>
          </footer>
        </div>
      </div>
    </div>
  );
}