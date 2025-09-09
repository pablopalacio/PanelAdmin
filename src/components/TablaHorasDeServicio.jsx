import { useApi } from "../hooks/useApi";
import { useParams } from "react-router-dom";

export default function TablaHorasDeServicio() {
  const { id } = useParams(); // Obtener el ID del estudiante de la URL
  const { data, loading, error } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/services"
  );

  const studentServices =
    data?.filter((service) => service.user?.id === parseInt(id)) || [];

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-10">Cargando perfil...</p>
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
                <td className="px-4 py-4">{service.amount_approved}</td>
                <td className="px-4 py-4">
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
                </td>
                <td className="px-4 py-4">
                  {new Date(service.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">{service.reviewer?.full_name}</td>
                <td className="px-4 py-4">
                  {service.comment || "Sin comentarios"}
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
                <span className="font-medium">{service.amount_approved}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Estado:</span>
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
                <span className="font-medium">
                  {service.comment || "Sin comentarios"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
