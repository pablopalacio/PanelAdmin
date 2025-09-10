import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      status: student.status || "activo",
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
      status: "activo",
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
      <div className="hidden lg:block relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-center text-gray-100 uppercase bg-blue-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Escuela</th>
              <th className="px-4 py-3">Horas</th>
              <th className="px-4 py-3">País</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredData?.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 text-gray-600">
                  No se encontraron estudiantes
                </td>
              </tr>
            )}
            {filteredData?.map((e) => (
              <tr
                key={e.id}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-4 py-4 text-start font-medium text-gray-900 whitespace-nowrap"
                >
                  {editingId === e.id ? (
                    <div className="flex flex-col ">
                      <div className="grid grid-cols-2 gap-1 items-center ">
                        <input
                          name="f_name"
                          value={editValues.f_name}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded border-gray-500 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="1º nombre"
                        />
                        <input
                          name="m_name"
                          value={editValues.m_name}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded border-gray-500 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="2º nombre"
                        />
                        <input
                          name="f_lastname"
                          value={editValues.f_lastname}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded border-gray-500  text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="1º apellido"
                        />
                        <input
                          name="s_lastname"
                          value={editValues.s_lastname}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded border-gray-500  text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="2º apellido"
                        />
                      </div>
                    </div>
                  ) : (
                    e.full_name
                  )}
                </th>
                <td className="px-4 py-4">
                  {editingId === e.id ? (
                    <input
                      name="phone"
                      value={editValues.phone}
                      onChange={handleInputChange}
                      className="border px-2 py-1 rounded border-gray-500  text-sm w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <td className="px-4 py-4">12/10</td>
                <td className="px-4 py-4">
                  {e.student?.country?.name || "Sin país"}
                </td>
                <td className="px-4 py-4">
                  {editingId === e.id ? (
                    <select
                      name="status"
                      value={editValues.status}
                      onChange={handleInputChange}
                      className="border border-gray-500  px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  ) : (
                    <p
                      className={`text-white px-2 py-1.5 rounded-xl text-center text-xs ${
                        e.status === "activo" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {e.status === "activo" ? "Activo" : "Inactivo"}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center space-x-2">
                    {editingId === e.id ? (
                      <>
                        <button
                          onClick={() => handleSave(e.id)}
                          disabled={loading}
                          className="text-green-500 hover:text-green-700 cursor-pointer hover:scale-105 transition-colors duration-200"
                          title="Guardar"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-500 hover:text-red-700 cursor-pointer hover:scale-105 transition-colors duration-200"
                          title="Cancelar"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => goToProfile(e.id)}
                          className="text-[#8d8e91] hover:text-blue-400 cursor-pointer hover:scale-105 transition-colors duration-200"
                          title="Ver perfil"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditClick(e)}
                          className="text-[#8d8e91] hover:text-blue-400 cursor-pointer hover:scale-105 transition-colors duration-200"
                          title="Editar estudiante"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                            />
                          </svg>
                        </button>
                        <button className="text-[#8d8e91] hover:text-red-500 hover:scale-110 cursor-pointer transition duration-300">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
      <div className="lg:hidden space-y-3 p-4">
        {filteredData?.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              {editingId === e.id ? (
                <div className="flex flex-col space-y-2 w-full">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="f_name"
                      value={editValues.f_name}
                      onChange={handleInputChange}
                      className="border px-2 py-1 rounded border-gray-500  text-sm col-span-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Primer nombre"
                    />
                    <input
                      name="m_name"
                      value={editValues.m_name}
                      onChange={handleInputChange}
                      className="border px-2 py-1 rounded border-gray-500  text-sm col-span-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Segundo nombre"
                    />
                    <input
                      name="f_lastname"
                      value={editValues.f_lastname}
                      onChange={handleInputChange}
                      className="border px-2 py-1 rounded border-gray-500  text-sm col-span-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Apellido paterno"
                    />
                    <input
                      name="s_lastname"
                      value={editValues.s_lastname}
                      onChange={handleInputChange}
                      className="border px-2 py-1 rounded border-gray-500  text-sm col-span-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Apellido materno"
                    />
                  </div>
                  <input
                    name="phone"
                    value={editValues.phone}
                    onChange={handleInputChange}
                    className="border px-2 py-1 rounded border-gray-500  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Teléfono"
                  />
                  <select
                    name="status"
                    value={editValues.status}
                    onChange={handleInputChange}
                    className="border px-2 py-1 rounded border-gray-500  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-800 text-sm flex-1 mr-2">
                    {e.full_name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-xl text-white text-xs ${
                      e.status === "activo" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {e.status === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </>
              )}
            </div>

            {editingId !== e.id && (
              <>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-600 block">Teléfono:</span>
                    <span>{e.phone || "No especificado"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Escuela:</span>
                    <span>
                      {Array.isArray(e.schools) && e.schools.length > 0
                        ? e.schools.map((s) => s.name).join(", ")
                        : "Sin escuela"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">País:</span>
                    <span>{e.student?.country?.name || "Sin país"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Horas:</span>
                    <span>12/10</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              {editingId === e.id ? (
                <>
                  <button
                    onClick={() => handleSave(e.id)}
                    disabled={loading}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:scale-105 text-sm transition-colors duration-200 flex-1 disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:scale-105 text-sm transition-colors duration-200 flex-1"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => goToProfile(e.id)}
                    className="text-[#8d8e91] hover:text-blue-400 cursor-pointer hover:scale-105 transition-colors duration-200"
                    title="Ver perfil"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditClick(e)}
                    className="text-[#8d8e91] hover:text-blue-400 cursor-pointer hover:scale-105 transition-colors duration-200"
                    title="Editar estudiante"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                      />
                    </svg>
                  </button>
                  <button className="text-[#8d8e91] hover:text-red-500 hover:scale-110 cursor-pointer transition duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
