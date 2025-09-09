import React, { useState, useEffect } from "react";

export default function EditModal({ student, onClose, onSave }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [schools, setSchools] = useState([]);
  const [status, setStatus] = useState("activo");

  useEffect(() => {
    if (student) {
      setName(student.full_name || "");
      setPhone(student.phone || "");
      setCountry(student.student?.country?.name || "");
      setSchools(student.schools.map((s) => s.name) || []);
      setStatus(student.status || "activo");
    }
  }, [student]);

  const handleSubmit = () => {
    onSave({
      ...student,
      full_name: name,
      phone: phone,
      status: status,
      student: { ...student.student, country: { name: country } },
      schools: schools.map((s) => ({ name: s })),
    });
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/45 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Editar estudiante</h2>

        <label className="block mb-2">
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Teléfono:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded w-full p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          País:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border rounded w-full p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Escuelas (separadas por coma):
          <input
            type="text"
            value={schools.join(", ")}
            onChange={(e) =>
              setSchools(e.target.value.split(",").map((s) => s.trim()))
            }
            className="border rounded w-full p-2 mt-1"
          />
        </label>

        <label className="block mb-4">
          Estado:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded w-full p-2 mt-1"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </label>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
