import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

export default function TablaControllers({ searchTerm }) {
  const [controllers, setControllers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchControllers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users");
        const data =
          response.data.data || response.data.result || response.data;

        if (Array.isArray(data)) {
          const filteredControllers = data.filter((user) => user.role_id === 2);
          setControllers(filteredControllers);
        } else {
          throw new Error("La respuesta de la API no es un array de usuarios.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("No se pudieron cargar los datos de los controladores.");
      } finally {
        setLoading(false);
      }
    };
    fetchControllers();
  }, []);

  const handleEditClick = (controller) => {
    setEditingId(controller.id);
    setEditValues({
      f_name: controller.f_name || "",
      s_name: controller.s_name || "",
      f_lastname: controller.f_lastname || "",
      s_lastname: controller.s_lastname || "",
      phone: controller.phone || "",
      // Convertir el valor numérico a string para el select
      status:
        controller.status === 1
          ? "activo"
          : controller.status === 0
          ? "inactivo"
          : controller.status || "",
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
      setControllers((prevData) =>
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
      alert("No se pudo actualizar el controlador.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-10">
          Cargando lista de controladores...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-xl">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-center text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-700">
          <tr>
            <th className="px-6 py-4 font-semibold tracking-wide">
              Nombre Completo
            </th>
            <th className="px-6 py-4 font-semibold tracking-wide">Email</th>
            <th className="px-6 py-4 font-semibold tracking-wide">Teléfono</th>
            <th className="px-6 py-4 font-semibold tracking-wide">Estado</th>
            <th className="px-6 py-4 font-semibold tracking-wide">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {controllers && controllers.length === 0 && (
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
                    No se encontraron controladores
                  </span>
                </div>
              </td>
            </tr>
          )}
          {controllers &&
            controllers
              .filter((controller) =>
                searchTerm
                  ? (
                      controller.full_name ||
                      `${controller.f_name || ""} ${controller.s_name || ""} ${
                        controller.f_lastname || ""
                      } ${controller.s_lastname || ""}`
                    )
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    controller.email
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    controller.phone
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  : true
              )
              .map((controller, index) => (
                <tr
                  key={controller.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150`}
                >
                  <td className="px-6 py-4 text-start font-medium text-gray-900">
                    {editingId === controller.id ? (
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
                        {controller.full_name ||
                          `${controller.f_name || ""} ${
                            controller.s_name || ""
                          } ${controller.f_lastname || ""} ${
                            controller.s_lastname || ""
                          }`
                            .replace(/\s+/g, " ")
                            .trim()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{controller.email}</td>
                  <td className="px-6 py-4">
                    {editingId === controller.id ? (
                      <input
                        name="phone"
                        value={editValues.phone}
                        onChange={handleInputChange}
                        className="border px-3 py-2 rounded-lg border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Teléfono"
                      />
                    ) : (
                      <span className="font-medium">
                        {controller.phone || "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === controller.id ? (
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
                          controller.status === 1 ||
                          controller.status === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {controller.status === 1 ||
                        controller.status === "activo" ? (
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
                      {editingId === controller.id ? (
                        <>
                          <button
                            onClick={() => handleSave(controller.id)}
                            disabled={saving}
                            className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                            title="Guardar"
                          >
                            {saving ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 animate-spin"
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
                                className="h-5 w-5"
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
                              className="h-5 w-5"
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
                          onClick={() => handleEditClick(controller)}
                          className="text-indigo-500 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200"
                          title="Editar controlador"
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
                      )}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
