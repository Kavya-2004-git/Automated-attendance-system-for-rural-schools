import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { logout } from "../utils/storage";
import "../styles/admin.css";
import ChangeTeacherPassword from "../pages/Reset_tea_pwd";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState("DASH");
  const [collapsed, setCollapsed] = useState(false);

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [showReset, setShowReset] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    subject: "",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    loadStats();
    loadAnalytics();
    loadSchools();
    loadSubjects();
    loadTeachers();
    loadComplaints();
  };

  const loadStats = () =>
    api.get("/admin/stats").then((res) => setStats(res.data));
  const loadAnalytics = () =>
    api.get("/admin/analytics").then((res) => setAnalytics(res.data));
  const loadSchools = () =>
    api.get("/admin/schools").then((res) => setSchools(res.data));
  const loadSubjects = () =>
    api.get("/admin/subjects").then((res) => setSubjects(res.data));
  const loadTeachers = () =>
    api.get("/admin/teachers").then((res) => setTeachers(res.data));
  const loadComplaints = () =>
    api.get("/admin/complaints").then((res) => setComplaints(res.data));

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const markRead = async (id) => {
    try {
      await api.put(`/admin/complaint/${id}/read`);
      loadComplaints();
    } catch {
      console.error("Sync failed");
    }
  };

  const create = async () => {
    if (!Object.values(form).every((v) => v)) {
      alert("teacher created");
      return;
    }
    try {
      await api.post("/admin/add-teacher", form);
      setForm({ name: "", email: "", password: "", school: "", subject: "" });
      loadAllData();
    } catch {
      alert("Backend Error: Creation failed");
    }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Permanent Action: Delete teacher?")) return;
    try {
      await api.delete(`/admin/delete-teacher/${id}`);
      loadTeachers();
      loadStats();
    } catch {
      alert("Network Error");
    }
  };

  return (
    <div className={`admin-viewport ${collapsed ? "sidebar-mini" : ""}`}>
      {/* SIDEBAR NAVIGATION */}
      <aside className="cyber-sidebar">
        <div className="sidebar-brand">
          <i className="fas fa-shield-alt brand-logo"></i>
          {!collapsed && <span>SmartAttend</span>}
        </div>

        <nav className="menu-stack">
          <button
            className={page === "DASH" ? "active" : ""}
            onClick={() => setPage("DASH")}
          >
            <i className="fas fa-chart-line"></i>{" "}
            {!collapsed && "Executive View"}
          </button>
          <button
            className={page === "ADD" ? "active" : ""}
            onClick={() => setPage("ADD")}
          >
            <i className="fas fa-user-plus"></i>{" "}
            {!collapsed && "Provision Staff"}
          </button>
          <button
            className={page === "COMP" ? "active" : ""}
            onClick={() => setPage("COMP")}
          >
            <i className="fas fa-envelope-open-text"></i>{" "}
            {!collapsed && "Grievances"}
          </button>
          <button
            className={page === "LIST" ? "active" : ""}
            onClick={() => setPage("LIST")}
          >
            <i className="fas fa-address-book"></i>{" "}
            {!collapsed && "Staff Directory"}
          </button>
          <button
  className={page === "RESET" ? "active" : ""}
  onClick={() => setPage("RESET")}
>
  <i className="fas fa-key"></i>{" "}
  {!collapsed && "Reset Teacher Password"}
</button>
        </nav>
       
        <button
          className="nav-logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <i className="fas fa-power-off"></i> {!collapsed && "Terminal Exit"}
        </button>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="main-viewport">
        <header className="glass-topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className={`fas ${collapsed ? "fa-indent" : "fa-outdent"}`}></i>
          </button>
          <div className="server-status">
            <span className="live-pulse"></span>
            <span>System: Online</span>
          </div>
          <div className="topbar-right">
            <div className="admin-chip">
              <i className="fas fa-user-shield"></i> SuperAdmin
            </div>
          </div>
        </header>
            
            
     
       
        <div className="scrollable-content">
        {page === "RESET" && (
  <div className="fade-in">
    <ChangeTeacherPassword />
  </div>
)}    {page === "DASH" && stats && analytics && (
            <div className="dashboard-fade">
              {/* BLOCK 1: IMPACT STATS */}
              <div className="impact-grid">
                <div className="glass-stat blue">
                  <div className="stat-body">
                    <h3>{stats.teachers}</h3>
                    <p>Verified Faculty</p>
                  </div>
                  <i className="fas fa-chalkboard-teacher ghost-icon"></i>
                </div>
                <div className="glass-stat green">
                  <div className="stat-body">
                    <h3>{stats.schools}</h3>
                    <p>Institutions</p>
                  </div>
                  <i className="fas fa-school ghost-icon"></i>
                </div>
                <div className="glass-stat orange">
                  <div className="stat-body">
                    <h3>{stats.students}</h3>
                    <p>Enrolled Students</p>
                  </div>
                  <i className="fas fa-user-graduate ghost-icon"></i>
                </div>
                <div className="glass-stat red">
                  <div className="stat-body">
                    <h3>{analytics.health}%</h3>
                    <p>Network Health</p>
                  </div>
                  <i className="fas fa-microchip ghost-icon heartbeat"></i>
                </div>
              </div>

              {/* DYNAMIC VISUAL ANALYTICS */}
              <div className="visual-analytics-card">
                <div className="section-header">
                  <h3>
                    <i className="fas fa-chart-pie"></i> Infrastructure Metrics
                  </h3>
                  <span className="live-label">LIVE ENGINE DATA</span>
                </div>

                <div className="graphics-grid">
                  {/* BLOCK 2: Unique Ring Container */}
                  <div className="visual-tile ring-box">
                    <div
                      className="ring-container"
                      style={{ "--ring-val": analytics.attendance }}
                    >
                      <svg viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          className="ring-bg"
                        ></circle>
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          className="ring-fill"
                        ></circle>
                      </svg>
                      <div className="ring-label">
                        <h4>{analytics.attendance}</h4>
                        <p>Attendance %</p>
                      </div>
                    </div>
                  </div>

                  {/* BLOCK 3: Re-designed Unique Bar Chart */}
                  <div className="visual-tile bar-box">
                    <div className="bar-graph-modern">
                      <div className="bar-group">
                        <div className="bar-pillar-wrap">
                          <div
                            className="bar-pillar blue"
                            style={{ height: "82%" }}
                          ></div>
                        </div>
                        <span className="bar-tag">Active</span>
                      </div>
                      <div className="bar-group">
                        <div className="bar-pillar-wrap">
                          <div
                            className="bar-pillar green"
                            style={{ height: "95%" }}
                          ></div>
                        </div>
                        <span className="bar-tag">Sync</span>
                      </div>
                      <div className="bar-group">
                        <div className="bar-pillar-wrap">
                          <div
                            className="bar-pillar orange"
                            style={{ height: "65%" }}
                          ></div>
                        </div>
                        <span className="bar-tag">Load</span>
                      </div>
                    </div>
                  </div>

                  {/* BLOCK 4: Meta List Box */}
                  <div className="visual-tile meta-list-box">
                    <div className="meta-card">
                      <div className="meta-icon">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="meta-info">
                        <span>Teachers On-Duty</span>
                        <strong>{analytics.teachers}</strong>
                      </div>
                    </div>
                    <div className="meta-card">
                      <div className="meta-icon">
                        <i className="fas fa-database"></i>
                      </div>
                      <div className="meta-info">
                        <span>Total Data Logs</span>
                        <strong>{analytics.students}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPLAINTS PAGE */}
          {/* COMPLAINTS PAGE */}
          {page === "COMP" && (
            <div className="card-container fade-in">
              <div className="header-flex">
                <div className="title-group">
                  <div className="icon-badge blue">
                    <i className="fas fa-envelope-open-text"></i>
                  </div>
                  <h3>Student Grievances</h3>
                </div>
                <button className="sync-btn" onClick={loadComplaints}>
                  <i className="fas fa-sync-alt"></i> <span>Sync Records</span>
                </button>
              </div>
              <div className="table-responsive">
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th>Student Identity</th>
                      <th>Grievance Detail</th>
                      <th>Status</th>
                      <th>Verification</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span className="bold-text">{c.student}</span>
                        </td>
                        <td>
                          <p className="msg-text">{c.msg}</p>
                        </td>
                        <td>
                        <span className={`pill ${
  c.status === "READ" ? "done" : "new"
}`}>
  {c.status === "READ" ? "Read" : "New"}
</span>
                        </td>
                        <td>
                        <div className={`verify-icon ${
  c.status === "READ" ? "green" : "orange"
}`}>
  <i
    className={
      c.status === "READ"
        ? "fas fa-check-circle"
        : "fas fa-clock"
    }
  ></i>

                            <i
                              className={
                                c.read ? "fas fa-check-circle" : "fas fa-clock"
                              }
                            ></i>
                          </div>
                        </td>
                        <td>
                        {c.status === "OPEN" && (
                            <button
                              className="mark-btn"
                              onClick={() => markRead(c.id)}
                              title="Mark as Read"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
   
          {/* ADD TEACHER PAGE */}
          {page === "ADD" && (
            <div className="card-container fade-in centered-form">
              <div className="form-header">
                <div className="icon-badge emerald">
                  <i className="fas fa-user-shield"></i>
                </div>
                <h3>Staff Provisioning Console</h3>
                <p>Configure credentials for new institutional faculty</p>
              </div>
              <div className="grid-form">
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handle}
                    placeholder="Full Name"
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-envelope"></i>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handle}
                    placeholder="Work Email"
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handle}
                    placeholder="System Password"
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-university"></i>
                  <input
                    list="schools"
                    name="school"
                    value={form.school}
                    onChange={handle}
                    placeholder="Institutional Branch"
                  />
                </div>
                <div className="input-field full">
                  <i className="fas fa-book-open"></i>
                  <input
                    list="subjects"
                    name="subject"
                    value={form.subject}
                    onChange={handle}
                    placeholder="Primary Department / Subject"
                  />
                </div>
                <datalist id="schools">
                  {schools.map((s, i) => (
                    <option key={i} value={s} />
                  ))}
                </datalist>
                <datalist id="subjects">
                  {subjects.map((s, i) => (
                    <option key={i} value={s} />
                  ))}
                </datalist>
                <button className="primary-action-btn" onClick={create}>
                  Authorize Staff Member <i className="fas fa-bolt"></i>
                </button>
              </div>
            </div>
          )}

          {/* TEACHERS LIST PAGE */}
          {page === "LIST" && (
            <div className="card-container fade-in">
              <div className="header-flex">
                <div className="title-group">
                  <div className="icon-badge navy">
                    <i className="fas fa-users-cog"></i>
                  </div>
                  <h3>Administrative Staff Directory</h3>
                </div>
              </div>
              <div className="table-responsive">
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th>Faculty Member</th>
                      <th>Email Access</th>
                      <th>School Branch</th>
                      <th>Department</th>
                      <th>Terminal Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <span className="bold-text">{t.name}</span>
                        </td>
                        <td className="dim-text">{t.email}</td>
                        <td>
                          <span className="branch-tag">{t.school}</span>
                        </td>
                        <td>{t.subject}</td>
                        <td>
                          <button
                            className="del-btn"
                            onClick={() => deleteTeacher(t.id)}
                            title="Remove Access"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
