import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";
import TablasServicios from "./Tablas-Servicios";
import EditarPerfil from "./EditarPerfil";

export default function Perfil({ user }) {
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hreportadas, setHreportadas] = useState(0);
  const [haprobadas, setHaprobadas] = useState(0);
  const [open, setOpen] = useState(false);
  let Pendientes = hreportadas - haprobadas;

  // Función para cargar datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar servicios
      const servicesResponse = await axiosInstance.get("/services");
      setService(servicesResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let sumaA = 0;
    service.forEach((e) => (sumaA += e.amount_approved));
    setHaprobadas(sumaA ? sumaA : 0);
  }, [service]);

  useEffect(() => {
    let sumaR = 0;
    service.forEach((e) => (sumaR += e.amount_reported));
    setHreportadas(sumaR ? sumaR : 0);
  }, [service]);

  return (
    <div className="space-y-6">
      {/* Tarjeta de información del perfil */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-3 ">
          <h2 className="font-bold text-xl text-blue-800 border-b border-gray-200 pb-3 mb-4 flex items-center">
            <span className="mr-2">👤</span> Perfil
          </h2>
          <div>
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer -right-1 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-md transition-all duration-200 hover:scale-110"
              title="Editar perfil"
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
          </div>
        </div>

        <EditarPerfil open={open} onClose={setOpen} user={user} />
        <div className="space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="font-semibold text-gray-700">Nombre:</span>
            <span className="text-gray-600">
              {user?.f_name} {user?.m_name}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="font-semibold text-gray-700">Apellido:</span>
            <span className="text-gray-600">
              {user?.f_lastname} {user?.s_lastname}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="font-semibold text-gray-700">Teléfono:</span>
            <span className="text-gray-600">
              {user?.phone ? user?.phone : "No proporcionado"}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="font-semibold text-gray-700">País:</span>
            <span className="text-gray-600">{user?.student.country.name}</span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="font-semibold text-gray-700">Escuela:</span>
            <span className="text-gray-600">{user?.schools[0].name}</span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="font-semibold text-gray-700">Controller:</span>
            <span className="text-gray-600">
              {user?.student.controller.full_name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Reclutador:</span>
            <span className="text-gray-600">
              {user?.student.recruiter.full_name}
            </span>
          </div>
        </div>
      </div>

      {/* Tarjeta de estadísticas de horas */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-bold text-xl text-blue-800 border-b border-gray-200 pb-3 mb-4 flex items-center">
          <span className="mr-2">⏱</span> Horas de Servicio
        </h3>

        <div className="grid  md:grid-cols-3 gap-4">
          {[
            {
              number: hreportadas,
              label: "Horas Registradas",
              color: "blue",
              bgColor: "bg-blue-100",
              textColor: "text-blue-600",
              icon: "⏱",
            },
            {
              number: haprobadas,
              label: "Horas Aprobadas",
              color: "green",
              bgColor: "bg-green-100",
              textColor: "text-green-600",
              icon: "✅",
            },
            {
              number: Pendientes,
              label: "Horas Pendientes",
              color: "orange",
              bgColor: "bg-orange-100",
              textColor: "text-orange-600",
              icon: "⏳",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={` bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-4 border border-gray-100`}
            >
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg mr-4 text-xl`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.number}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <TablasServicios service={service} />
    </div>
  );
}
