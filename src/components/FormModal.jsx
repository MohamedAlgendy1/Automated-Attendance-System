import { useState } from "react";

function FormModal({ isOpen, onClose, onSave, type, initialData }) {
  const [form, setForm] = useState(initialData || {});

  // تحديث البيانات لما تفتح المودال
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
              <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName || ""}/>
              <input name="middleName" placeholder="Middle Name" onChange={handleChange} value={form.middleName || ""}/>
              <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName || ""}/>
            </div>

            <input name="email" placeholder="Email" onChange={handleChange} value={form.email || ""}/>
            <input name="username" placeholder="Username" onChange={handleChange} value={form.username || ""}/>
            <input name="password" placeholder="Password" onChange={handleChange} value={form.password || ""}/>
          </>
        )}

        {type === "classroom" && (
          <>
            <input name="name" placeholder="Classroom Name" onChange={handleChange} value={form.name || ""}/>
            <input name="building" placeholder="Building" onChange={handleChange} value={form.building || ""}/>
            <input name="lat" placeholder="Latitude" onChange={handleChange} value={form.lat || ""}/>
            <input name="lng" placeholder="Longitude" onChange={handleChange} value={form.lng || ""}/>
            <input name="radius" placeholder="Radius (m)" onChange={handleChange} value={form.radius || ""}/>
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