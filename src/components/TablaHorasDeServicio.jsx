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
  const [saving, setSaving] = useState(false);

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
  }, []);

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
    setSaving(true);
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
    } finally {
      setSaving(false);
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
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p className="text-red-500">
          Error al cargar las horas de servicio: {error}
        </p>
      </div>
    );
  }

  if (!studentServices || studentServices.length === 0) {
    return (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500">No hay horas de servicio registradas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tabla para vista de escritorio */}
      <div className="hidden lg:block relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-center text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-700">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Categoría
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Horas Reportadas
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Horas Aprobadas
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">Estado</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Fecha</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Revisor</th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Comentario
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Evidencia
              </th>
              <th className="px-6 py-4 font-semibold tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {studentServices.map((service, index) => (
              <tr
                key={service.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {service.category?.name}
                </td>
                <td className="px-6 py-4 font-medium">
                  {service.amount_reported}
                </td>
                <td className="px-6 py-4">
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
                      className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="font-medium">
                      {service.amount_approved}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingRow === service.id ? (
                    <select
                      value={approvalValues.status || "2"}
                      onChange={(e) =>
                        setApprovalValues({
                          ...approvalValues,
                          status: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2">Pendiente</option>
                      <option value="1">Aprobado</option>
                      <option value="0">Rechazado</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        service.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : service.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.status === "Approved" ? (
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
                          Aprobado
                        </>
                      ) : service.status === "Pending" ? (
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Pendiente
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
                          Rechazado
                        </>
                      )}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">
                  {new Date(service.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium">
                  {service.reviewer?.full_name || "Sin revisor"}
                </td>
                <td className="px-6 py-4">
                  {editingRow === service.id ? (
                    <textarea
                      value={approvalValues.comment || ""}
                      onChange={(e) =>
                        setApprovalValues({
                          ...approvalValues,
                          comment: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                    />
                  ) : (
                    <span className="font-medium">
                      {service.comment || "Sin comentarios"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewEvidence(service.id)}
                    className="text-blue-500 bg-blue-50 hover:bg-blue-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200"
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
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-3">
                    {editingRow === service.id ? (
                      <>
                        <button
                          onClick={() => handleApproveSave(service)}
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
                          onClick={handleCancelEdit}
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
                        onClick={() => handleApproveClick(service)}
                        className="text-indigo-500 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200"
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
        {studentServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600 block mb-1 font-medium">
                  Categoría:
                </span>
                <span className="font-medium">{service.category?.name}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1 font-medium">
                  Horas Reportadas:
                </span>
                <span className="font-medium">{service.amount_reported}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1 font-medium">
                  Horas Aprobadas:
                </span>
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <span className="font-medium">{service.amount_approved}</span>
                )}
              </div>
              <div>
                <span className="text-gray-600 block mb-1 font-medium">
                  Estado:
                </span>
                {editingRow === service.id ? (
                  <select
                    value={approvalValues.status || "2"}
                    onChange={(e) =>
                      setApprovalValues({
                        ...approvalValues,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2">Pendiente</option>
                    <option value="1">Aprobado</option>
                    <option value="0">Rechazado</option>
                  </select>
                ) : (
                  <span className="font-medium">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        service.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : service.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.status === "Approved" ? (
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
                          Aprobado
                        </>
                      ) : service.status === "Pending" ? (
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Pendiente
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
                          Rechazado
                        </>
                      )}
                    </span>
                  </span>
                )}
              </div>
              <div>
                <span className="text-gray-600 block mb-1 font-medium">
                  Fecha:
                </span>
                <span className="font-medium">
                  {new Date(service.created_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1 font-medium">
                  Revisor:
                </span>
                <span className="font-medium">
                  {service.reviewer?.full_name || "Sin revisor"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 block mb-1 font-medium">
                  Comentario:
                </span>
                {editingRow === service.id ? (
                  <textarea
                    value={approvalValues.comment || ""}
                    onChange={(e) =>
                      setApprovalValues({
                        ...approvalValues,
                        comment: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                  />
                ) : (
                  <span className="font-medium">
                    {service.comment || "Sin comentarios"}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 block mb-1 font-medium">
                  Evidencia:
                </span>
                <button
                  onClick={() => handleViewEvidence(service.id)}
                  className="text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg shadow transition-all duration-200 flex items-center"
                  title="Ver evidencia en nueva pestaña"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
            <div className="flex justify-end space-x-3">
              {editingRow === service.id ? (
                <>
                  <button
                    onClick={() => handleApproveSave(service)}
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
                    onClick={handleCancelEdit}
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
                <button
                  onClick={() => handleApproveClick(service)}
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
                  <span>Revisar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
