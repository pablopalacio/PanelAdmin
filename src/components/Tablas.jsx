import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export default function Tablas({
  data,
  searchTerm,
  filtradoPais,
  filtradoEscuela,
  filtradoEstado,
  aplicarFiltros,
  token,
}) {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    f_name: "",
    m_name: "",
    f_lastname: "",
    s_lastname: "",
    phone: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState(data || []);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  const goToProfile = (id) => {
    navigate(`/Perfil-Estudiante/${id}`);
  };

  const handleEditClick = (student) => {
    setEditingId(student.id);
    setEditValues({
      f_name: student.f_name || "",
      m_name: student.m_name || "",
      f_lastname: student.f_lastname || "",
      s_lastname: student.s_lastname || "",
      phone: student.phone || "",
      status: student.status || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({
      f_name: "",
      m_name: "",
      f_lastname: "",
      s_lastname: "",
      phone: "",
      status: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      const tokenValue = token || getCookie("token");
      const url = `https://www.hs-service.api.crealape.com/api/v1/users/${id}`;
      await axios.put(
        url,
        {
          f_name: editValues.f_name,
          m_name: editValues.m_name,
          f_lastname: editValues.f_lastname,
          s_lastname: editValues.s_lastname,
          phone: editValues.phone,
          status: editValues.status,
        },
        {
          headers: tokenValue ? { Authorization: `Bearer ${tokenValue}` } : {},
          withCredentials: true,
        }
      );

      // Actualizar datos locales
      setLocalData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                f_name: editValues.f_name,
                m_name: editValues.m_name,
                f_lastname: editValues.f_lastname,
                s_lastname: editValues.s_lastname,
                phone: editValues.phone,
                status: editValues.status,
                full_name: `${editValues.f_name} ${editValues.m_name || ""} ${
                  editValues.f_lastname
                } ${editValues.s_lastname}`.trim(),
              }
            : item
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar:", error.response || error);
      alert("No se pudo actualizar el estudiante.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!localData) return [];
    return localData
      .filter((e) =>
        searchTerm
          ? e.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((e) =>
        filtradoEstado
          ? e.status?.toLowerCase() === filtradoEstado.toLowerCase()
          : true
      )
      .filter((e) =>
        filtradoPais?.length > 0
          ? filtradoPais.some(
              (pais) =>
                e.student?.country?.name?.toLowerCase() === pais.toLowerCase()
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
  }, [
    localData,
    searchTerm,
    filtradoEstado,
    filtradoPais,
    filtradoEscuela,
    aplicarFiltros,
  ]);

  if (!localData)
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-10">Cargando lista de estudiantes...</p>
      </div>
    );

  return (
    <>
      {/* Vista Desktop */}
      <div className="hidden lg:block relative overflow-x-auto shadow-lg sm:rounded-xl">
        <table className="w-full text-xs text-left rtl:text-right text-gray-700">
          <thead className="text-xs text-center text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-700">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wide">Nombre</th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Teléfono
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">Escuela</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Horas</th>
              <th className="px-6 py-4 font-semibold tracking-wide">País</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Estado</th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredData?.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-gray-500 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      No se encontraron estudiantes
                    </span>
                  </div>
                </td>
              </tr>
            )}
            {filteredData?.map((e, index) => (
              <tr
                key={e.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150`}
              >
                <th
                  scope="row"
                  className="px-3 py-4 text-start font-medium text-gray-900 whitespace-nowrap"
                >
                  {editingId === e.id ? (
                    <div className="flex flex-col">
                      <div className="grid grid-cols-2 gap-2 items-center">
                        <input
                          name="f_name"
                          value={editValues.f_name}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1º nombre"
                        />
                        <input
                          name="m_name"
                          value={editValues.m_name}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2º nombre"
                        />
                        <input
                          name="f_lastname"
                          value={editValues.f_lastname}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1º apellido"
                        />
                        <input
                          name="s_lastname"
                          value={editValues.s_lastname}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2º apellido"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="font-semibold">{e.full_name}</span>
                  )}
                </th>
                <td className="px-3 py-4">
                  {editingId === e.id ? (
                    <input
                      name="phone"
                      value={editValues.phone}
                      onChange={handleInputChange}
                      className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Teléfono"
                    />
                  ) : (
                    e.phone
                  )}
                </td>
                <td className="px-4 py-4">
                  {Array.isArray(e.schools) && e.schools.length > 0
                    ? e.schools.map((s) => s.name).join(", ")
                    : "Sin escuela"}
                </td>
                <td className="px-4 py-4 font-medium">12/10</td>
                <td className="px-4 py-4">
                  {e.student?.country?.name || "Sin país"}
                </td>
                <td className="px-4 py-4">
                  {editingId === e.id ? (
                    <select
                      name="status"
                      value={editValues.status}
                      onChange={handleInputChange}
                      className="border border-gray-300 px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Seleccionar Estado</option>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        e.status === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {e.status === "activo" ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Activo
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Inactivo
                        </>
                      )}
                    </span>
                  )}
                </td>
                <td className="px-3 py-4">
                  <div className="flex justify-center space-x-3">
                    {editingId === e.id ? (
                      <>
                        <button
                          onClick={() => handleSave(e.id)}
                          disabled={loading}
                          className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                          title="Guardar"
                        >
                          {loading ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                          title="Cancelar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => goToProfile(e.id)}
                          className="text-blue-500 bg-blue-50 hover:bg-blue-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200"
                          title="Ver perfil"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditClick(e)}
                          className="text-indigo-500 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200"
                          title="Editar estudiante"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button className="text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

      {/* Vista Mobile */}
      <div className="lg:hidden space-y-4 p-4">
        {filteredData?.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              {editingId === e.id ? (
                <div className="flex flex-col space-y-3 w-full">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="f_name"
                      value={editValues.f_name}
                      onChange={handleInputChange}
                      className="border px-3 py-2 rounded-lg border-gray-300 text-sm col-span-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Primer nombre"
                    />
                    <input
                      name="m_name"
                      value={editValues.m_name}
                      onChange={handleInputChange}
                      className="border px-3 py-2 rounded-lg border-gray-300 text-sm col-span-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Segundo nombre"
                    />
                    <input
                      name="f_lastname"
                      value={editValues.f_lastname}
                      onChange={handleInputChange}
                      className="border px-3 py-2 rounded-lg border-gray-300 text-sm col-span-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Apellido paterno"
                    />
                    <input
                      name="s_lastname"
                      value={editValues.s_lastname}
                      onChange={handleInputChange}
                      className="border px-3 py-2 rounded-lg border-gray-300 text-sm col-span-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Apellido materno"
                    />
                  </div>
                  <input
                    name="phone"
                    value={editValues.phone}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded-lg border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Teléfono"
                  />
                  <select
                    name="status"
                    value={editValues.status}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded-lg border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Seleccionar Estado</option>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-800 text-base flex-1 mr-2">
                    {e.full_name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      e.status === "activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {e.status === "activo" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Activo
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Inactivo
                      </>
                    )}
                  </span>
                </>
              )}
            </div>

            {editingId !== e.id && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600 block mb-1 font-medium">
                      Teléfono:
                    </span>
                    <span className="font-medium">
                      {e.phone || "No especificado"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1 font-medium">
                      Escuela:
                    </span>
                    <span className="font-medium">
                      {Array.isArray(e.schools) && e.schools.length > 0
                        ? e.schools.map((s) => s.name).join(", ")
                        : "Sin escuela"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1 font-medium">
                      País:
                    </span>
                    <span className="font-medium">
                      {e.student?.country?.name || "Sin país"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1 font-medium">
                      Horas:
                    </span>
                    <span className="font-medium">12/10</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3">
              {editingId === e.id ? (
                <>
                  <button
                    onClick={() => handleSave(e.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-200 flex items-center justify-center space-x-1 disabled:opacity-50 shadow-md"
                  >
                    {loading ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Guardar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition-colors duration-200 flex items-center justify-center space-x-1 shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Cancelar</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => goToProfile(e.id)}
                    className="text-blue-500 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center"
                    title="Ver perfil"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditClick(e)}
                    className="text-indigo-500 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center"
                    title="Editar estudiante"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button className="text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
