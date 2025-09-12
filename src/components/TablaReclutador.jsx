import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

export default function TablaReclutador({ searchTerm }) {
  const [recruiters, setRecruiters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users");
        const data =
          response.data.data || response.data.result || response.data;

        if (Array.isArray(data)) {
          const filteredRecruiters = data.filter((user) => user.role_id === 3);
          setRecruiters(filteredRecruiters);
        } else {
          throw new Error("La respuesta de la API no es an array de usuarios.");
        }
      } catch (err) {
        console.error("Error fetching recruiters:", err);
        setError("No se pudieron cargar los datos de los reclutadores.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  const handleEditClick = (recruiter) => {
    setEditingId(recruiter.id);
    setEditValues({
      f_name: recruiter.f_name || "",
      s_name: recruiter.s_name || "",
      f_lastname: recruiter.f_lastname || "",
      s_lastname: recruiter.s_lastname || "",
      phone: recruiter.phone || "",
      // Convertir el valor numérico a string para el select
      status:
        recruiter.status === 1
          ? "activo"
          : recruiter.status === 0
          ? "inactivo"
          : recruiter.status || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      // Convertir el estado de string a número para la API
      const statusValue = editValues.status === "activo" ? 1 : 0;

      const payload = {
        f_name: editValues.f_name,
        s_name: editValues.s_name,
        f_lastname: editValues.f_lastname,
        s_lastname: editValues.s_lastname,
        phone: editValues.phone,
        status: statusValue,
      };

      await axiosInstance.put(`/users/${id}`, payload);

      // Actualizar datos locales con los valores correctos
      setRecruiters((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                ...payload,
                // Asegurar que el estado se guarda como número
                status: statusValue,
                // Actualizar el nombre completo
                full_name: `${editValues.f_name} ${editValues.s_name || ""} ${
                  editValues.f_lastname
                } ${editValues.s_lastname || ""}`
                  .replace(/\s+/g, " ")
                  .trim(),
              }
            : item
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar:", error.response || error);
      alert("No se pudo actualizar el reclutador.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-10">Cargando lista de reclutadores...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tabla para vista de escritorio */}
      <div className="hidden lg:block relative overflow-x-auto shadow-lg sm:rounded-xl">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-center text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-700">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Nombre Completo
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">Email</th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Teléfono
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">Estado</th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {recruiters && recruiters.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-gray-500 text-center">
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
                    <span className="text-lg font-medium">
                      No se encontraron reclutadores
                    </span>
                  </div>
                </td>
              </tr>
            )}
            {recruiters &&
              recruiters
                .filter((recruiter) =>
                  searchTerm
                    ? (
                        recruiter.full_name ||
                        `${recruiter.f_name || ""} ${recruiter.s_name || ""} ${
                          recruiter.f_lastname || ""
                        } ${recruiter.s_lastname || ""}`
                      )
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      recruiter.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      recruiter.phone
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : true
                )
                .map((recruiter, index) => (
                  <tr
                    key={recruiter.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 text-start font-medium text-gray-900">
                      {editingId === recruiter.id ? (
                        <div className="grid grid-cols-2 gap-2 items-center">
                          <input
                            name="f_name"
                            value={editValues.f_name}
                            onChange={handleInputChange}
                            className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1º Nombre"
                          />
                          <input
                            name="s_name"
                            value={editValues.s_name}
                            onChange={handleInputChange}
                            className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="2º Nombre"
                          />
                          <input
                            name="f_lastname"
                            value={editValues.f_lastname}
                            onChange={handleInputChange}
                            className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1º Apellido"
                          />
                          <input
                            name="s_lastname"
                            value={editValues.s_lastname}
                            onChange={handleInputChange}
                            className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="2º Apellido"
                          />
                        </div>
                      ) : (
                        <span className="font-semibold">
                          {recruiter.full_name ||
                            `${recruiter.f_name || ""} ${
                              recruiter.s_name || ""
                            } ${recruiter.f_lastname || ""} ${
                              recruiter.s_lastname || ""
                            }`
                              .replace(/\s+/g, " ")
                              .trim()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{recruiter.email}</td>
                    <td className="px-6 py-4">
                      {editingId === recruiter.id ? (
                        <input
                          name="phone"
                          value={editValues.phone}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Teléfono"
                        />
                      ) : (
                        <span className="font-medium">
                          {recruiter.phone || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === recruiter.id ? (
                        <select
                          name="status"
                          value={editValues.status}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar Estado</option>
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            recruiter.status === 1 ||
                            recruiter.status === "activo"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {recruiter.status === 1 ||
                          recruiter.status === "activo" ? (
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
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-3">
                        {editingId === recruiter.id ? (
                          <>
                            <button
                              onClick={() => handleSave(recruiter.id)}
                              disabled={saving}
                              className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                              title="Guardar"
                            >
                              {saving ? (
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
                          <button
                            onClick={() => handleEditClick(recruiter)}
                            className="text-indigo-500 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200"
                            title="Editar reclutador"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
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
        {recruiters && recruiters.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-3"
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
            <p className="text-gray-500">No se encontraron reclutadores</p>
          </div>
        )}
        {recruiters &&
          recruiters
            .filter((recruiter) =>
              searchTerm
                ? (
                    recruiter.full_name ||
                    `${recruiter.f_name || ""} ${recruiter.s_name || ""} ${
                      recruiter.f_lastname || ""
                    } ${recruiter.s_lastname || ""}`
                  )
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  recruiter.email
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  recruiter.phone
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                : true
            )
            .map((recruiter) => (
              <div
                key={recruiter.id}
                className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="col-span-2">
                    <span className="text-gray-600 block mb-1 font-medium">
                      Nombre Completo:
                    </span>
                    {editingId === recruiter.id ? (
                      <div className="grid grid-cols-2 gap-2 items-center">
                        <input
                          name="f_name"
                          value={editValues.f_name}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1º Nombre"
                        />
                        <input
                          name="s_name"
                          value={editValues.s_name}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2º Nombre"
                        />
                        <input
                          name="f_lastname"
                          value={editValues.f_lastname}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1º Apellido"
                        />
                        <input
                          name="s_lastname"
                          value={editValues.s_lastname}
                          onChange={handleInputChange}
                          className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2º Apellido"
                        />
                      </div>
                    ) : (
                      <span className="font-semibold">
                        {recruiter.full_name ||
                          `${recruiter.f_name || ""} ${
                            recruiter.s_name || ""
                          } ${recruiter.f_lastname || ""} ${
                            recruiter.s_lastname || ""
                          }`
                            .replace(/\s+/g, " ")
                            .trim()}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 block mb-1 font-medium">
                      Email:
                    </span>
                    <span className="font-medium">{recruiter.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1 font-medium">
                      Teléfono:
                    </span>
                    {editingId === recruiter.id ? (
                      <input
                        name="phone"
                        value={editValues.phone}
                        onChange={handleInputChange}
                        className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Teléfono"
                      />
                    ) : (
                      <span className="font-medium">
                        {recruiter.phone || "N/A"}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1 font-medium">
                      Estado:
                    </span>
                    {editingId === recruiter.id ? (
                      <select
                        name="status"
                        value={editValues.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar Estado</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          recruiter.status === 1 ||
                          recruiter.status === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {recruiter.status === 1 ||
                        recruiter.status === "activo" ? (
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
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  {editingId === recruiter.id ? (
                    <>
                      <button
                        onClick={() => handleSave(recruiter.id)}
                        disabled={saving}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-200 flex items-center justify-center space-x-1 shadow-md"
                      >
                        {saving ? (
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
                        ) : (
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
                        )}
                        <span>{saving ? "Guardando..." : "Guardar"}</span>
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
                    <div className="w-full flex justify-center items-center">
                      <button
                        onClick={() => handleEditClick(recruiter)}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm transition-colors duration-200 flex items-center justify-center space-x-1 shadow-md"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Editar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
