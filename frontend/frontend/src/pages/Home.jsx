import "../styles/home.css";

export default function Home() {
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <i className="fas fa-user-check nav-logo-icon"></i>
          <h2 className="logo">SmartAttend</h2>
        </div>

        <ul className="nav-links">
          <li><a href="#home" className="active">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#roles">Roles</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="login-btns">
          <a href="/student-login" className="btn-student">
             <i className="fas fa-user-graduate"></i> Student
          </a>
          <a href="/login" className="btn-admin">
             <i className="fas fa-user-shield"></i> Admin
          </a>
          <a href="/login" className="btn-teacher">
             <i className="fas fa-chalkboard-teacher"></i> Teacher
          </a>
        </div>
      </nav>


      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">Next-Gen Attendance</div>
          <h1>Smart Attendance System</h1>
          <p>Harnessing AI-powered Face Recognition & Secure QR Fallbacks for the Modern Classroom.</p>
          <div className="hero-action-group">
            <button className="hero-btn">Get Started <i className="fas fa-arrow-right"></i></button>
            <div className="stats-mini">
              <span><i className="fas fa-bolt"></i> 99.9% Accuracy</span>
              <span><i className="fas fa-shield-alt"></i> Secure Data</span>
            </div>
          </div>
        </div>
      </section>


      {/* SERVICES */}
      <section id="services" className="section">
        <h2 className="section-title">Technological Services</h2>
        <div className="scroll-box">

          <div className="service-card">
            <div className="icon-wrapper"><i className="fas fa-face-smile"></i></div>
            <h3>Face Recognition</h3>
            <p>High-speed biometric scanning via DeepFace for touchless attendance.</p>
            <div className="card-gradient"></div>
          </div>

          <div className="service-card">
            <div className="icon-wrapper"><i className="fas fa-qrcode"></i></div>
            <h3>QR Fallback</h3>
            <p>Dynamic QR generation for instant marking during low-light conditions.</p>
            <div className="card-gradient"></div>
          </div>

          <div className="service-card">
            <div className="icon-wrapper"><i className="fas fa-file-invoice"></i></div>
            <h3>Smart Reports</h3>
            <p>Automated CSV exports and attendance trend analytics for staff.</p>
            <div className="card-gradient"></div>
          </div>

          <div className="service-card">
            <div className="icon-wrapper"><i className="fas fa-mobile-alt"></i></div>
            <h3>Real-time Alerts</h3>
            <p>Instant SMS and Email triggers for parents regarding student status.</p>
            <div className="card-gradient"></div>
          </div>

          <div className="service-card">
            <div className="icon-wrapper"><i className="fas fa-fingerprint"></i></div>
            <h3>Secure Profiles</h3>
            <p>Role-based access control protecting sensitive student documentation.</p>
            <div className="card-gradient"></div>
          </div>

        </div>
      </section>


      {/* ROLES */}
      <section id="roles" className="section role-section">
        <h2 className="section-title white-text">System Ecosystem</h2>
        <div className="role-box">

          <div className="role-card">
            <div className="role-header">
               <i className="fas fa-graduation-cap"></i>
               <span>Portal 01</span>
            </div>
            <h3>Student</h3>
            <p>Check daily logs, download performance reports, and raise attendance grievances.</p>
            <div className="role-stat">85% Avg Attendance</div>
          </div>

          <div className="role-card">
             <div className="role-header">
               <i className="fas fa-briefcase"></i>
               <span>Portal 02</span>
            </div>
            <h3>Teacher</h3>
            <p>Effortless enrollment, FRS activation, and direct communication with guardians.</p>
            <div className="role-stat">Class Management</div>
          </div>

          <div className="role-card">
             <div className="role-header">
               <i className="fas fa-user-lock"></i>
               <span>Portal 03</span>
            </div>
            <h3>Administrator</h3>
            <p>Oversee multiple school branches, manage teacher credentials, and system health.</p>
            <div className="role-stat">Global Control</div>
          </div>

        </div>
      </section>


      {/* ABOUT */}
      <section id="about" className="section">
        <h2 className="section-title">Our Vision</h2>
        <div className="about-wrapper">
            <div className="about-glass">
                <p className="about-text">
                  SmartAttend is a cutting-edge <strong>Full-Stack AI solution</strong> 
                  designed to eliminate the friction of manual attendance. 
                  By integrating <strong>Facial Recognition Systems (FRS)</strong> with 
                  automated reporting, we save over 20 minutes of instructional time daily.
                </p>
            </div>
        </div>
      </section>


      {/* CONTACT */}
      <section id="contact" className="section contact-area">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <i className="fas fa-paper-plane"></i>
            <h4>Email Us</h4>
            <p>tech@smartattend.com</p>
          </div>
          <div className="contact-card">
            <i className="fas fa-headset"></i>
            <h4>24/7 Support</h4>
            <p>+91 90000 12345</p>
          </div>
          <div className="contact-card">
            <i className="fas fa-globe"></i>
            <h4>Location</h4>
            <p>Bengaluru, India</p>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer>
        <div className="footer-bottom">
            <p>© 2026 SmartAttend | Built for Educational Excellence</p>
            <div className="footer-socials">
                <i className="fab fa-linkedin"></i>
                <i className="fab fa-github"></i>
            </div>
        </div>
      </footer>

    </div>
  );
}