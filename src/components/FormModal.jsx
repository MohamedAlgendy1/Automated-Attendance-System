import { useState, useEffect } from "react";
import { addLecturer } from "../services/adminService";
import { createClassroom, editClassroom } from "../services/classroomService";
import { getErrorMessage } from "../services/api";

function FormModal({ isOpen, onClose, onSaved, type, initialData }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || {});
      setError("");
      setLocError("");
    }
  }, [isOpen, initialData]);


  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported"); return; }
    setLocLoading(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
        setLocLoading(false);
      },
      () => { setLocError("Failed to get location."); setLocLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (type === "lecturer") {
        await addLecturer({
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
          email: form.email,
          ssin: form.ssin,
        });
      }
      if (type === "classroom") {
        const payload = {
          name: form.name,
          buildingName: form.building || form.buildingName,
          latitude: parseFloat(form.lat || form.latitude),
          longitude: parseFloat(form.lng || form.longitude),
          radiusOfAcceptanceMeter: parseInt(form.radius || form.radiusOfAcceptanceMeter),
        };
        if (initialData?.id) {
          await editClassroom(initialData.id, payload);
        } else {
          await createClassroom(payload);
        }
      }
      onSaved && onSaved();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{type === "lecturer" ? (initialData ? "Edit Lecturer" : "Add Lecturer") : (initialData ? "Edit Classroom" : "Add Classroom")}</h2>
          <span onClick={onClose} style={{ cursor: "pointer" }}>✖</span>
        </div>

        {type === "lecturer" && (
          <>
            <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName || ""} />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName || ""} />
            <input name="email" placeholder="Email" onChange={handleChange} value={form.email || ""} />
            <input name="ssin" placeholder="SSIN" onChange={handleChange} value={form.ssin || ""} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password || ""} />
          </>
        )}

        {type === "classroom" && (
          <>
            <input name="name" placeholder="Classroom Name" onChange={handleChange} value={form.name || ""} />
            <input name="building" placeholder="Building" onChange={handleChange} value={form.building || form.buildingName || ""} />
            <button type="button" onClick={handleGetLocation} disabled={locLoading}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", background: locLoading ? "#94a3b8" : "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: locLoading ? "not-allowed" : "pointer", fontWeight: 600 }}>
              {locLoading ? "🌀 Getting location..." : "📍 Get Current Location"}
            </button>
            {locError && <p style={{ color: "red", fontSize: 13 }}>{locError}</p>}
            <input name="lat" placeholder="Latitude" onChange={handleChange} value={form.lat || form.latitude || ""} />
            <input name="lng" placeholder="Longitude" onChange={handleChange} value={form.lng || form.longitude || ""} />
            <input name="radius" placeholder="Radius (m)" onChange={handleChange} value={form.radius || form.radiusOfAcceptanceMeter || ""} />
          </>
        )}

        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
        <button className="save-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default FormModal;

