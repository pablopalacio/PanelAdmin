import axios from "axios";
import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";

export default function Perfil({ user }) {
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Función para cargar datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar servicios
      const servicesResponse = await axiosInstance.get("/services");
      setService(servicesResponse);
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

  console.log(service);
  return (
    <>
      {" "}
      <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl px-4 rounded-2xl ">
        <h2 className="font-semibold text-xl text-center p-4">Perfil</h2>
        <div className="pb-4">
          <p className="font-semibold">
            Nombre:{" "}
            <span className="font-light text-sm">
              {user?.f_name} {user?.s_name}
            </span>
          </p>
          <p className="font-semibold">
            Apellido:{" "}
            <span className="font-light text-sm">
              {user?.f_lastname} {user?.s_lastname}
            </span>
          </p>
          <p className="font-semibold">
            Telefono:{" "}
            <span className="font-light text-sm">
              {user?.phone ? user?.phone : "No providenciado"}
            </span>
          </p>
          <p className="font-semibold">
            Pais:{" "}
            <span className="font-light text-sm">
              {user?.student.country.name}
            </span>
          </p>
          <p className="font-semibold">
            Escuela:{" "}
            <span className="font-light text-sm">{user?.schools[0].name}</span>
          </p>
          <p className="font-semibold">
            Controller:{" "}
            <span className="font-light text-sm">
              {user?.student.controller.full_name}
            </span>
          </p>
          <p className="font-semibold ">
            Reclutador:{" "}
            <span className="font-light text-sm">
              {user?.student.recruiter.full_name}
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2  gap-3 p-6 rounded-2xl w-full bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl">
        {[
          {
            number: "",
            label: "Total Estudiantes",
            color: "blue",
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          },
          {
            number: "",
            label: "Estudiantes Activos",
            color: "green",
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            number: "",
            label: "Estudiantes Inactivos",
            color: "orange",
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            number: "",
            label: "Tasa Cumplimiento",
            color: "purple",
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 ">
            <div className="flex items-center ">
              <div
                className={`${stat.bgColor} p-2 lg:p-3 rounded-lg mr-3 lg:mr-4`}
              >
                <svg
                  className={`w-4 h-4 lg:w-6 lg:h-6 ${stat.textColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.icon}
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg lg:text-2xl font-bold text-gray-800"></p>
                <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
