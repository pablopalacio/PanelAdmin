import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { useApiLogin } from "../hooks/useApiLogin";

export default function TablaHorasDeServicio() {
  const { id } = useParams();
  const { user } = useApiLogin();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [approvalValues, setApprovalValues] = useState({});

  // Función para obtener los datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/services");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente - SOLO UNA VEZ
  useEffect(() => {
    fetchData();
  }, []); // Array de dependencias vacío para que se ejecute solo una vez

  // Agregamos un useEffect para depurar la información
  useEffect(() => {
    if (user && data.length > 0) {
      console.log("Usuario logueado:", user);
      data.forEach((service) => {
        console.log(`--- Servicio ID: ${service.id} ---`);
        console.log("ID de usuario del servicio:", service.user?.id);
        console.log("Rol de usuario logueado:", user.role);
        console.log("Estado del servicio:", service.status);
      });
    }
  }, [user, data]);

  const studentServices =
    data?.filter((service) => service.user?.id === parseInt(id)) || [];

  const handleViewEvidence = (serviceId) => {
    const evidenceUrl = `https://www.hs-service.api.crealape.com/api/v1/evidence/${serviceId}`;
    window.open(evidenceUrl, "_blank", "noopener,noreferrer");
  };

  const handleApproveClick = (service) => {
    setEditingRow(service.id);
    setApprovalValues({
      amount_approved: service.amount_approved || 0,
      comment: service.comment || "",
      status:
        service.status === "Approved"
          ? "1"
          : service.status === "Rejected"
          ? "0"
          : "2",
    });
  };

  const handleApproveSave = async (service) => {
    try {
      await axiosInstance.patch(`/review/${service.id}`, {
        ...approvalValues,
        amount_approved: parseInt(approvalValues.amount_approved) || 0,
      });

      setEditingRow(null);
      fetchData(); // Refrescar los datos
      alert("¡Servicio revisado con éxito!");
    } catch (err) {
      console.error("Error completo:", err);
      let errorMessage = "Error al revisar el servicio. Inténtalo de nuevo.";
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = "No tienes permiso para realizar esta acción.";
        } else if (err.response.status === 401) {
          errorMessage =
            "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.";
        } else if (
          err.response.status === 400 &&
          err.response.data?.message?.includes("reviewed")
        ) {
          errorMessage =
            "El servicio ya ha sido revisado y no se puede modificar.";
        } else {
          errorMessage = `Error del servidor: ${
            err.response.data?.message || err.message
          }`;
        }
      }
      alert(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setApprovalValues({});
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-3">Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-red-500">
          Error al cargar las horas de servicio: {error}
        </p>
      </div>
    );
  }

  if (!studentServices || studentServices.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500">No hay horas de servicio registradas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabla para vista de escritorio */}
      <div className="hidden lg:block relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-center text-gray-100 uppercase bg-blue-600">
            <tr>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Horas Reportadas</th>
              <th className="px-4 py-3">Horas Aprobadas</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Revisor</th>
              <th className="px-4 py-3">Comentario</th>
              <th className="px-4 py-3">Evidencia</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {studentServices.map((service) => (
              <tr
                key={service.id}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-4 font-medium text-gray-900">
                  {service.category?.name}
                </td>
                <td className="px-4 py-4">{service.amount_reported}</td>
                <td className="px-4 py-4">
                  {editingRow === service.id ? (
                    <input
                      type="number"
                      value={approvalValues.amount_approved || 0}
                      onChange={(e) =>
                        setApprovalValues({
                          ...approvalValues,
                          amount_approved: e.target.value,
                        })
                      }
                      className="w-20 p-1 border rounded text-center"
                    />
                  ) : (
                    service.amount_approved
                  )}
                </td>
                <td className="px-4 py-4">
                  {editingRow === service.id ? (
                    <select
                      value={approvalValues.status || "2"}
                      onChange={(e) =>
                        setApprovalValues({
                          ...approvalValues,
                          status: e.target.value,
                        })
                      }
                      className="p-1 border rounded text-center text-xs"
                    >
                      <option value="2">Pendiente</option>
                      <option value="1">Aprobado</option>
                      <option value="0">Rechazado</option>
                    </select>
                  ) : (
                    <p
                      className={`text-white px-2 py-1.5 rounded-xl text-center text-xs ${
                        service.status === "Approved"
                          ? "bg-green-500"
                          : service.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {service.status === "Approved"
                        ? "Aprobado"
                        : service.status === "Pending"
                        ? "Pendiente"
                        : "Rechazado"}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  {new Date(service.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">{service.reviewer?.full_name}</td>
                <td className="px-4 py-4">
                  {editingRow === service.id ? (
                    <textarea
                      value={approvalValues.comment || ""}
                      onChange={(e) =>
                        setApprovalValues({
                          ...approvalValues,
                          comment: e.target.value,
                        })
                      }
                      className="w-full p-1 border rounded text-sm"
                      rows="2"
                    />
                  ) : (
                    service.comment || "Sin comentarios"
                  )}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleViewEvidence(service.id)}
                    className="text[#8d8e91] hover:text-blue-400 cursor-pointer hover:scale-105 transition-colors duration-200"
                    title="Ver evidencia en nueva pestaña"
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
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center space-x-2">
                    {editingRow === service.id ? (
                      <>
                        <button
                          onClick={() => handleApproveSave(service)}
                          className="text-green-500  cursor-pointer hover:scale-105 transition-colors duration-200"
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
                          onClick={handleCancelEdit}
                          className="text-red-500  cursor-pointer hover:scale-115 transition-colors duration-200"
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
                      <button
                        onClick={() => handleApproveClick(service)}
                        className="text-[#8d8e91] hover:text-blue-400  cursor-pointer hover:scale-105 transition-colors duration-200"
                        title="Revisar"
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
        {studentServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-gray-600 block">Categoría:</span>
                <span className="font-medium">{service.category?.name}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Horas Reportadas:</span>
                <span className="font-medium">{service.amount_reported}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Horas Aprobadas:</span>
                {editingRow === service.id ? (
                  <input
                    type="number"
                    value={approvalValues.amount_approved || 0}
                    onChange={(e) =>
                      setApprovalValues({
                        ...approvalValues,
                        amount_approved: e.target.value,
                      })
                    }
                    className="w-full p-1 border rounded text-center"
                  />
                ) : (
                  <span className="font-medium">{service.amount_approved}</span>
                )}
              </div>
              <div>
                <span className="text-gray-600 block">Estado:</span>
                {editingRow === service.id ? (
                  <select
                    value={approvalValues.status || "2"}
                    onChange={(e) =>
                      setApprovalValues({
                        ...approvalValues,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-1 border rounded text-center text-xs"
                  >
                    <option value="2">Pendiente</option>
                    <option value="1">Aprobado</option>
                    <option value="0">Rechazado</option>
                  </select>
                ) : (
                  <span className="font-medium">
                    <p
                      className={`text-white px-2 py-1 rounded-xl text-center text-xs ${
                        service.status === "Approved"
                          ? "bg-green-500"
                          : service.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {service.status === "Approved"
                        ? "Aprobado"
                        : service.status === "Pending"
                        ? "Pendiente"
                        : "Rechazado"}
                    </p>
                  </span>
                )}
              </div>
              <div>
                <span className="text-gray-600 block">Fecha:</span>
                <span className="font-medium">
                  {new Date(service.created_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">Revisor:</span>
                <span className="font-medium">
                  {service.reviewer?.full_name}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 block">Comentario:</span>
                {editingRow === service.id ? (
                  <textarea
                    value={approvalValues.comment || ""}
                    onChange={(e) =>
                      setApprovalValues({
                        ...approvalValues,
                        comment: e.target.value,
                      })
                    }
                    className="w-full p-1 border rounded text-sm"
                    rows="2"
                  />
                ) : (
                  <span className="font-medium">
                    {service.comment || "Sin comentarios"}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 block">Evidencia:</span>
                <button
                  onClick={() => handleViewEvidence(service.id)}
                  className="text-[#dadde1]  transition-colors duration-200 flex items-center"
                  title="Ver evidencia en nueva pestaña"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  Ver evidencia
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {editingRow === service.id ? (
                <>
                  <button
                    onClick={() => handleApproveSave(service)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:scale-105 text-sm transition-colors duration-200"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:scale-105 text-sm transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleApproveClick(service)}
                  className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:scale-105 text-sm transition-colors duration-200"
                >
                  Revisar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
