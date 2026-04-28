import { useState } from "react";

function FormModal({ isOpen, onClose, onSave, type, initialData }) {
  const [form, setForm] = useState(initialData || {});
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  if (isOpen && Object.keys(form).length === 0 && initialData) {
    setForm(initialData);
  }

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    setForm({});
    onClose();
  };

  // ✅ جيب الموقع تلقائي
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported on this device");
      return;
    }

    setLocLoading(true);
    setLocError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setLocLoading(false);
      },
      () => {
        setLocError("Failed to get location. Please allow location access.");
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>
            {type === "lecturer"
              ? initialData ? "Edit Lecturer" : "Add Lecturer"
              : initialData ? "Edit Classroom" : "Add Classroom"}
          </h2>
          <span onClick={onClose}>✖</span>
        </div>

        {type === "lecturer" && (
          <>
            <div className="form-row">
              <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName || ""} />
              <input name="middleName" placeholder="Middle Name" onChange={handleChange} value={form.middleName || ""} />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName || ""} />
            </div>
            <input name="email" placeholder="Email" onChange={handleChange} value={form.email || ""} />
            <input name="username" placeholder="Username" onChange={handleChange} value={form.username || ""} />
            <input name="password" placeholder="Password" onChange={handleChange} value={form.password || ""} />
          </>
        )}

        {type === "classroom" && (
          <>
            <input name="name" placeholder="Classroom Name" onChange={handleChange} value={form.name || ""} />
            <input name="building" placeholder="Building" onChange={handleChange} value={form.building || ""} />

            {/* ✅ زرار الموقع التلقائي */}
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locLoading}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                background: locLoading ? "#94a3b8" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: locLoading ? "not-allowed" : "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {locLoading ? "🌀 Getting location..." : "📍 Get Current Location"}
            </button>

            {/* ✅ رسالة خطأ الموقع */}
            {locError && (
              <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{locError}</p>
            )}

            {/* ✅ Latitude و Longitude بيتملوا تلقائي */}
            <input
              name="lat"
              placeholder="Latitude"
              onChange={handleChange}
              value={form.lat || ""}
              style={{ background: form.lat ? "#f0fdf4" : "" }}
            />
            <input
              name="lng"
              placeholder="Longitude"
              onChange={handleChange}
              value={form.lng || ""}
              style={{ background: form.lng ? "#f0fdf4" : "" }}
            />
            <input name="radius" placeholder="Radius (m)" onChange={handleChange} value={form.radius || ""} />
          </>
        )}

        <button className="save-btn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}

export default FormModal;