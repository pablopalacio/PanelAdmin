// src/components/TablaEstudiantes.jsx

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";

// Este es un componente "tonto" que recibe datos y funciones por props
export default function TablaEstudiantes({
  data, // Recibe los datos del padre
  onSaveSuccess, // Recibe la función para refrescar del padre
  searchTerm,
  filtradoPais,
  filtradoEscuela,
  filtradoEstado,
}) {
  const navigate = useNavigate();

  // Usamos un estado local para manejar la data y poder actualizarla visualmente al instante
  const [localData, setLocalData] = useState([]);
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);

  const goToProfile = (studentId) => {
    // Navegamos con el ID de Estudiante, que viene de la data de /students
    navigate(`/Perfil-Estudiante/${studentId}`);
  };

  const handleEditClick = (student) => {
    setEditingId(student.id);
    setEditValues({
      f_name: student.user?.f_name || "",
      m_name: student.user?.m_name || "",
      f_lastname: student.user?.f_lastname || "",
      s_lastname: student.user?.s_lastname || "",
      phone: student.user?.phone || "",
      status: student.user?.status || "",
    });
  };

  const handleCancel = () => setEditingId(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (studentToSave) => {
    const userId = studentToSave.user?.id;
    if (!userId) {
      alert("Error: No se encontró el ID de usuario para guardar.");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.put(`/users/${userId}`, editValues);

      // Actualización visual inmediata
      setLocalData((prevData) =>
        prevData.map((item) =>
          item.id === studentToSave.id
            ? { ...item, user: { ...item.user, ...editValues } }
            : item
        )
      );
      setEditingId(null);

      // Llama a la función del padre para refrescar los datos de toda la página
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error al guardar:", error.response || error);
      alert("No se pudo actualizar el estudiante.");
    } finally {
      setSaving(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!localData) return [];
    return localData
      .filter((e) =>
        searchTerm
          ? e.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((e) =>
        filtradoEstado
          ? e.user?.status?.toLowerCase() === filtradoEstado.toLowerCase()
          : true
      )
      .filter((e) =>
        filtradoPais?.length > 0
          ? filtradoPais.some(
              (pais) => e.country?.name?.toLowerCase() === pais.toLowerCase()
            )
          : true
      )
      .filter((e) =>
        filtradoEscuela?.length > 0
          ? e.schools?.some((s) =>
              filtradoEscuela.some(
                (esc) => s.name?.toLowerCase() === esc.toLowerCase()
              )
            )
          : true
      );
  }, [localData, searchTerm, filtradoEstado, filtradoPais, filtradoEscuela]);

  // El resto del componente es solo la vista (JSX) y no necesita loading o error
  return (
    <>
      <div className="hidden lg:block relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          {/* ... (código de la tabla de escritorio que te di en la respuesta anterior, es compatible) ... */}
          <thead className="text-xs text-center text-gray-100 uppercase bg-blue-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Escuela</th>
              <th className="px-4 py-3">País</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredData.map((student) => (
              <tr
                key={student.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-4 py-4 text-start font-medium text-gray-900 whitespace-nowrap"
                >
                  {editingId === student.id ? (
                    <div className="grid grid-cols-2 gap-1 items-center">
                      <input
                        name="f_name"
                        value={editValues.f_name}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded border-gray-500 text-sm w-24"
                        placeholder="1º nombre"
                      />
                      <input
                        name="m_name"
                        value={editValues.m_name}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded border-gray-500 text-sm w-24"
                        placeholder="2º nombre"
                      />
                      <input
                        name="f_lastname"
                        value={editValues.f_lastname}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded border-gray-500 text-sm w-24"
                        placeholder="1º apellido"
                      />
                      <input
                        name="s_lastname"
                        value={editValues.s_lastname}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded border-gray-500 text-sm w-24"
                        placeholder="2º apellido"
                      />
                    </div>
                  ) : (
                    student.user?.full_name
                  )}
                </th>
                <td className="px-4 py-4">
                  {editingId === student.id ? (
                    <input
                      name="phone"
                      value={editValues.phone}
                      onChange={handleInputChange}
                      className="border px-2 py-1 rounded border-gray-500 text-sm w-32"
                      placeholder="Teléfono"
                    />
                  ) : (
                    student.user?.phone || "N/A"
                  )}
                </td>
                <td className="px-4 py-4">
                  {student.schools?.map((s) => s.name).join(", ") ||
                    "Sin escuela"}
                </td>
                <td className="px-4 py-4">
                  {student.country?.name || "Sin país"}
                </td>
                <td className="px-4 py-4">
                  {editingId === student.id ? (
                    <select
                      name="status"
                      value={editValues.status}
                      onChange={handleInputChange}
                      className="border border-gray-500 px-2 py-1 rounded text-sm"
                    >
                      <option value="">Seleccionar</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  ) : (
                    <p
                      className={`text-white px-2 py-1.5 rounded-xl text-xs ${
                        student.user?.status === "activo"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {student.user?.status === "activo"
                        ? "Activo"
                        : "Inactivo"}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center space-x-2">
                    {editingId === student.id ? (
                      <>
                        <button
                          onClick={() => handleSave(student)}
                          disabled={saving}
                          title="Guardar"
                        >
                          <svg
                            className="w-5 h-5 text-green-500 hover:text-green-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </button>
                        <button onClick={handleCancel} title="Cancelar">
                          <svg
                            className="w-5 h-5 text-red-500 hover:text-red-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => goToProfile(student.id)}
                          title="Ver perfil"
                        >
                          <svg
                            className="w-5 h-5 text-[#8d8e91] hover:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditClick(student)}
                          title="Editar estudiante"
                        >
                          <svg
                            className="w-5 h-5 text-[#8d8e91] hover:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Puedes pegar aquí el código de la vista móvil, funcionará */}
    </>
  );
}
