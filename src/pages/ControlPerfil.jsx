import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi"; // ajusta la ruta según tu proyecto

function ControlPerfil() {
  const { id } = useParams();
  const { data: student, loading, error } = useApi(
    `https://www.hs-service.api.crealape.com/api/v1/students/${id}`
  );

  if (loading) {
    return <p className="text-center mt-6">Cargando perfil...</p>;
  }

  if (error) {
    return <p className="text-center mt-6 text-red-500">{error}</p>;
  }

  if (!student) {
    return <p className="text-center mt-6">Estudiante no encontrado</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6">

        <div className="flex flex-col md:flex-row items-center md:items-start border-b pb-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.486 0 4.797.657 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="md:ml-6 mt-4 md:mt-0">
            {student.full_name && (
              <h2 className="text-2xl font-bold text-gray-800">
                {student.full_name}
              </h2>
            )}
            {student.email && <p className="text-gray-600">Email: {student.email}</p>}
            {student.phone && <p className="text-gray-600">Teléfono: {student.phone}</p>}
            {student.country?.name && (
              <p className="text-gray-600">País: {student.country.name}</p>
            )}
            {student.school?.name && (
              <p className="text-gray-600">Escuela: {student.school.name}</p>
            )}
            {student.controller && (
              <p className="text-gray-600">Controller: {student.controller}</p>
            )}
          </div>
        </div>

        {student.service_hours?.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Horas de Servicio
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo servicio</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Horas</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha aprobación</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Evidencia</th>
                  </tr>
                </thead>
                <tbody>
                  {student.service_hours.map((hora, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2 text-sm text-green-600 font-medium">
                        {hora.status || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm">{hora.type || "-"}</td>
                      <td className="px-4 py-2 text-sm">{hora.hours ? `${hora.hours} h` : "-"}</td>
                      <td className="px-4 py-2 text-sm">{hora.date || "-"}</td>
                      <td className="px-4 py-2 text-sm">{hora.approval_date || "-"}</td>
                      <td className="px-4 py-2 text-sm text-center">
                        {hora.evidence ? (
                          <a
                            href={hora.evidence}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            📄
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Mensaje si no hay horas de servicio */}
        {(!student.service_hours || student.service_hours.length === 0) && (
          <p className="text-center py-4 text-gray-500 text-sm">
            No hay horas de servicio registradas
          </p>
        )}
      </div>
    </div>
  );
}

export default ControlPerfil;