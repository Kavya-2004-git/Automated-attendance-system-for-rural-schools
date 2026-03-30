import Webcam from "react-webcam";
import { useRef, useState } from "react";
import api from "../../services/api";
import "../../styles/addstudent.css";

export default function AddStudent() {

  const cam = useRef();

  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    class_name: "",
    section: "",
  });

  const [capturing, setCapturing] = useState(false);
  const [openCam, setOpenCam] = useState(false);


  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // START REGISTER
  const startRegister = async () => {

    if (!form.name || !form.roll_no || !form.class_name || !form.section) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setOpenCam(true);

    setTimeout(() => {
      captureFaces();
    }, 1200);
  };


  // AUTO CAPTURE
  const captureFaces = async () => {

    if (!cam.current) return;

    setCapturing(true);

    const frames = [];

    for (let i = 0; i < 12; i++) {

      const img = cam.current.getScreenshot();

      if (img) {
        const blob = await fetch(img).then(r => r.blob());
        frames.push(blob);
      }

      await new Promise(r => setTimeout(r, 300));
    }


    const fd = new FormData();

    Object.keys(form).forEach(k => {
      fd.append(k, form[k]);
    });

    frames.forEach((f, i) => {
      fd.append("faces", f, `f${i}.jpg`);
    });


    try {

      await api.post("/teacher/add-student", fd);

      alert("✅ Student Enrolled Successfully");

      setForm({
        name: "",
        roll_no: "",
        class_name: "",
        section: "",
      });

    } catch {

      alert("❌ Registration Failed");

    }

    setCapturing(false);
    setOpenCam(false);
  };



  return (

    <div className="add-container">


      {/* HEADER */}
      <div className="add-header">
        <h2>➕ Enroll New Student</h2>
        <p>Register student with face verification</p>
      </div>


      {/* FORM CARD */}
      <div className="add-card">


        {/* FORM */}
        <div className="add-form">

          <input
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={change}
          />

          <input
            name="roll_no"
            placeholder="Roll Number"
            value={form.roll_no}
            onChange={change}
          />

          <input
            name="class_name"
            placeholder="Class"
            value={form.class_name}
            onChange={change}
          />

          <input
            name="section"
            placeholder="Section"
            value={form.section}
            onChange={change}
          />

        </div>


        {/* CAMERA */}
        {openCam && (

          <div className="camera-box">

            <Webcam
              ref={cam}
              width={260}
              screenshotFormat="image/jpeg"
            />

            <p className="capture-text">
              📸 Capturing Face Data...
            </p>

            <div className="loader"></div>

          </div>

        )}


        {/* INSTRUCTIONS */}
        <div className="instructions">

          <h4>📌 Instructions</h4>

          <ul>
            <li>Ensure proper lighting</li>
            <li>Face the camera clearly</li>
            <li>Remove mask/cap</li>
            <li>Stay still for few seconds</li>
          </ul>

        </div>


        {/* BUTTON */}
        <button
          className="register-btn"
          disabled={capturing}
          onClick={startRegister}
        >

          {capturing
            ? "Registering..."
            : "📷 Register Face"}

        </button>


      </div>

    </div>
  );
}
