import React from "react";
import { useApi } from "../hooks/useApi";

export default function Tablas() {
  const { data, loading, error } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/students"
  );
  console.log(data);
  console.log(loading);
  console.log(error);

  const students = [
    {
      id: 1,
      name: "Pablo Antonio Palacio",
      phone: "+54 9 11 90909090",
      school: "Frontend",
      hours: "18/20",
      country: "Arg",
      status: "active",
    },
    {
      id: 2,
      name: "Gabriel Nehemias Rengifo Krunfli",
      phone: "+54 9 11 90909090",
      school: "Frontend",
      hours: "09/20",
      country: "Arg",
      status: "inactive",
    },
    {
      id: 3,
      name: "Jeff Steven Gil Toribio",
      phone: "+54 9 11 90909090",
      school: "Frontend",
      hours: "15/20",
      country: "Per",
      status: "active",
    },
  ];

  return (
    <>
      {/* Vista Desktop - Tabla completa */}
      <div className="hidden lg:block relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-center text-gray-100 uppercase bg-blue-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                Nombre
              </th>
              <th scope="col" className="px-4 py-3">
                Teléfono
              </th>
              <th scope="col" className="px-4 py-3">
                Escuela
              </th>
              <th scope="col" className="px-4 py-3">
                Horas de Servicio
              </th>
              <th scope="col" className="px-4 py-3">
                País
              </th>
              <th scope="col" className="px-4 py-3">
                Estado
              </th>
              <th scope="col" className="px-4 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr className={` ${error ? "" : "hidden"}`}>
              <th>{error}</th>
            </tr>
            {/* data(e) full_name, id, phone, schools.name, status, student.country.name  */}
            {data?.map((e) => (
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
                      e.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {e.status === "active" ? "Activo" : "Inactivo"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center space-x-2">
                    <button className="hover:text-blue-400 hover:scale-110 cursor-pointer transition duration-300">
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
                    <button className="hover:text-blue-400 hover:scale-110 cursor-pointer transition duration-300">
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button className="hover:text-red-500 hover:scale-110 cursor-pointer transition duration-300">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile - Cards responsivas */}
      <div className="lg:hidden space-y-3">
        {data?.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            {/* Header con nombre y estado */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1 mr-2">
                {e.full_name}
              </h3>
              <span
                className={`px-2 py-1 rounded-xl text-white text-xs whitespace-nowrap ${
                  e.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {e.status === "active" ? "Activo" : "Inactivo"}
              </span>
            </div>

            {/* Información del estudiante */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-gray-600 block mb-1">Teléfono:</span>
                <span className="font-medium">{e.phone}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">Escuela:</span>
                <span className="font-medium">
                  {e.schools.map((s) => s.name).join(", ")}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">Horas:</span>
                <span className="font-medium">12/10</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">País:</span>
                <span className="font-medium">{e.student.country.name}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-center space-x-4 pt-3 border-t border-gray-100">
              <button className="p-2 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition duration-300">
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
              <button className="p-2 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition duration-300">
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-300">
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vista Tablet - Tabla compacta */}
      <div className="hidden md:block lg:hidden">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-xs text-left text-gray-500">
            <thead className="text-xs text-center text-gray-700 uppercase bg-blue-500/50">
              <tr>
                <th scope="col" className="px-3 py-2">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-2">
                  Teléfono
                </th>
                <th scope="col" className="px-3 py-2">
                  Escuela
                </th>
                <th scope="col" className="px-3 py-2">
                  Estado
                </th>
                <th scope="col" className="px-3 py-2">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-xs">
                        {student.name}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {student.hours} hrs • {student.country}
                      </div>
                    </div>
                  </th>
                  <td className="px-3 py-3">{student.phone}</td>
                  <td className="px-3 py-3">{student.school}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`text-gray-600 px-2 py-1 rounded-xl text-xs ${
                        student.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {student.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center space-x-1">
                      <button className="hover:text-blue-400 hover:scale-110 cursor-pointer transition duration-300">
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
                      <button className="hover:text-blue-400 hover:scale-110 cursor-pointer transition duration-300">
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button className="hover:text-red-500 hover:scale-110 cursor-pointer transition duration-300">
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
      </div>
    </>
  );
}
