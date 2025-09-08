import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Tablas({
  data,
  searchTerm,
  filtradoPais,
  filtradoEscuela,
  filtradoEstado,
  aplicarFiltros,
}) {
  const navigate = useNavigate();

  const goToProfile = (id) => {
    navigate(`/control-perfil/${id}`);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((e) =>
        searchTerm
          ? e.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((e) =>
        filtradoEstado ? e.status?.toLowerCase() === filtradoEstado : true
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
    data,
    searchTerm,
    filtradoEstado,
    filtradoPais,
    filtradoEscuela,
    aplicarFiltros,
  ]);

  if (!data) return <p>Cargando...</p>;

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
                  {e.full_name}
                </th>
                <td className="px-4 py-4">{e.phone}</td>
                <td className="px-4 py-4">
                  {e.schools.map((s) => s.name).join(", ")}
                </td>
                <td className="px-4 py-4">12/10</td>
                <td className="px-4 py-4">{e.student.country.name}</td>
                <td className="px-4 py-4">
                  <p
                    className={`text-white px-2 py-1.5 rounded-xl text-center text-xs ${
                      e.status === "activo" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {e.status === "activo" ? "Activo" : "Inactivo"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => goToProfile(e.id)}
                      className="hover:text-blue-400 hover:scale-110 cursor-pointer transition duration-300"
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
                      className="hover:text-blue-400 hover:scale-110 cursor-pointer transition duration-300"
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
                    <button className="hover:text-red-500 hover:scale-110 cursor-pointer transition duration-300">
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Vista Mobile */}
      <div className="lg:hidden space-y-3">
        {filteredData?.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
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
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-gray-600 block">Teléfono:</span>
                <span className="font-medium">{e.phone}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Escuela:</span>
                <span className="font-medium">
                  {e.schools.map((s) => s.name).join(", ")}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">Horas:</span>
                <span className="font-medium">12/10</span>
              </div>
              <div>
                <span className="text-gray-600 block">País:</span>
                <span className="font-medium">{e.student.country.name}</span>
              </div>
            </div>
            <div className="flex justify-center space-x-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => goToProfile(e.id)}
                className="p-2 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition duration-300"
              >
                <svg
                  className="w-4 h-4"
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
                className="p-2 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition duration-300"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
              <button className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-300">
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
          
    </>
  );
}
