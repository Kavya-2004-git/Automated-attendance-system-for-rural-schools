import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/attendance.css";

export default function AttendancePage() {

  const cam = useRef();

  const [active, setActive] = useState(false);
  const [mode, setMode] = useState(null); // FACE | QR
  const [info, setInfo] = useState(null);
  const [cooldown, setCooldown] = useState(false);


  // ======================
  // AUTO CLEAR (5 sec)
  // ======================
  useEffect(() => {

    if (!info) return;

    const t = setTimeout(() => {
      setInfo(null);
      setCooldown(false);
    }, 5000);

    return () => clearTimeout(t);

  }, [info]);


  // ======================
  // AUTO SCAN (EVERY 4s)
  // ======================
  useEffect(() => {

    if (!active || !mode || cooldown) return;


    const timer = setInterval(async () => {

      if (!cam.current) return;

      const img = cam.current.getScreenshot();
      if (!img) return;

      const blob = await fetch(img).then(r => r.blob());

      if (blob.size < 15000) return;


      const fd = new FormData();


      // FACE
      if (mode === "FACE") {

        fd.append("face", blob);

        try {

          setCooldown(true);

          const res = await api.post("/attendance/face", fd);
          setInfo(res.data);

        } catch {

          setInfo({ status: "ERROR" });
          setCooldown(false);
        }

      }


      // QR
      if (mode === "QR") {

        fd.append("qr", blob);

        try {

          setCooldown(true);

          const res = await api.post("/attendance/qr-image", fd);
          setInfo(res.data);

        } catch {

          setInfo({ status: "ERROR" });
          setCooldown(false);
        }

      }

    }, 4000);


    return () => clearInterval(timer);

  }, [active, mode, cooldown]);




  return (

    <div className="attendance-container">


      {/* HEADER */}
      <h2>📷 Mark Attendance</h2>
      <p className="sub-text">
        Choose method and keep student in camera frame
      </p>



      {/* MODE SELECT */}
      {!mode && !active && (

        <div className="mode-box">

          <button
            className="mode-btn"
            onClick={() => setMode("FACE")}
          >
            😊 Face Scan
          </button>

          <button
            className="mode-btn qr"
            onClick={() => setMode("QR")}
          >
            📱 QR Scan
          </button>

        </div>

      )}




      {/* OPEN CAMERA */}
      {!active && mode && (

        <button
          className="start-btn"
          onClick={() => setActive(true)}
        >
          ▶ Start Camera
        </button>

      )}




      {/* CAMERA AREA */}
      {active && (

        <div className="camera-card">


          {/* INSTRUCTIONS */}
          <div className="instructions">

            {mode === "FACE" && (
              <>
                <h4>😊 Face Instructions</h4>
                <ul>
                  <li>Look straight at camera</li>
                  <li>Good lighting required</li>
                  <li>No mask / cap</li>
                </ul>
              </>
            )}

            {mode === "QR" && (
              <>
                <h4>📱 QR Instructions</h4>
                <ul>
                  <li>Show QR clearly</li>
                  <li>No blur</li>
                  <li>Hold steady</li>
                </ul>
              </>
            )}

          </div>



          {/* CAMERA */}
          <div className="camera-box">

            <Webcam
              ref={cam}
              screenshotFormat="image/jpeg"
              className="camera-view"
            />

            {/* FACE OVERLAY */}
            {mode === "FACE" && info && (
              <Overlay info={info} />
            )}

          </div>



          {/* QR RESULT */}
          {mode === "QR" && info && (
            <QrResult info={info} />
          )}



          {/* CLOSE */}
          <button
            className="close-btn"
            onClick={() => {

              setActive(false);
              setMode(null);
              setInfo(null);
              setCooldown(false);

            }}
          >
            ❌ Stop Camera
          </button>


        </div>
      )}

    </div>
  );
}




// =====================
// FACE OVERLAY
// =====================
function Overlay({ info }) {

  return (

    <div className="overlay">

      <StatusUI info={info} />

    </div>
  );
}



// =====================
// QR RESULT
// =====================
function QrResult({ info }) {

  return (

    <div className="qr-result">

      <StatusUI info={info} />

    </div>
  );
}



// =====================
// STATUS UI
// =====================
function StatusUI({ info }) {

  if (!info) return null;


  if (info.status === "SUCCESS") {
    return (
      <>
        <p className="ok">✅ {info.name}</p>
        <p>🆔 {info.roll}</p>
        <p>⏰ {info.time}</p>
      </>
    );
  }

  if (info.status === "INVALID") {
    return <p className="err">❌ Invalid QR</p>;
  }

  if (info.status === "NO_MATCH") {
    return <p className="err">❌ No Match</p>;
  }

  if (info.status === "ALREADY") {
    return <p className="warn">⚠ Already Marked</p>;
  }

  if (info.status === "NO_QR") {
    return <p className="warn">📷 No QR Detected</p>;
  }

  if (info.status === "ERROR") {
    return <p className="err">⚠ Scan Error</p>;
  }

  return null;
}
