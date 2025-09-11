import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";

export default function Perfil({ user }) {
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hreportadas, setHreportadas] = useState(0);
  const [haprobadas, setHaprobadas] = useState(0);
  let Pendientes = hreportadas - haprobadas;

  // Función para cargar datossss
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
    <>
      {" "}
      <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl px-4 rounded-2xl ">
        <h2 className="font-semibold text-xl md:text-2xl text-center p-4">
          Perfil
        </h2>
        <div className="pb-4">
          <p className="font-semibold md:text-lg lg:text-xl">
            Nombre:{" "}
            <span className="font-light text-sm lg:text-lg">
              {user?.f_name} {user?.s_name}
            </span>
          </p>
          <p className="font-semibold md:text-lg lg:text-xl  ">
            Apellido:{" "}
            <span className="font-light text-sm  lg:text-lg">
              {user?.f_lastname} {user?.s_lastname}
            </span>
          </p>
          <p className="font-semibold md:text-lg lg:text-xl  ">
            Telefono:{" "}
            <span className="font-light text-sm  lg:text-lg">
              {user?.phone ? user?.phone : "No providenciado"}
            </span>
          </p>
          <p className="font-semibold md:text-lg lg:text-xl  ">
            Pais:{" "}
            <span className="font-light text-sm lg:text-lg">
              {user?.student.country.name}
            </span>
          </p>
          <p className="font-semibold md:text-lg lg:text-xl  ">
            Escuela:{" "}
            <span className="font-light text-sm  lg:text-lg">
              {user?.schools[0].name}
            </span>
          </p>
          <p className="font-semibold md:text-lg lg:text-xl  ">
            Controller:{" "}
            <span className="font-light text-sm  lg:text-lg">
              {user?.student.controller.full_name}
            </span>
          </p>
          <p className="font-semibold md:text-lg lg:text-xl  ">
            Reclutador:{" "}
            <span className="font-light text-sm  lg:text-lg">
              {user?.student.recruiter.full_name}
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2   gap-3 p-6 rounded-2xl w-full bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl">
        {[
          {
            number: hreportadas,
            label: "Horas Registradas",
            color: "blue",
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            icon: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5",
          },
          {
            number: haprobadas,
            label: "Horas Aprobadas",
            color: "green",
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            number: Pendientes,
            label: "Horas Pendientes",
            color: "orange",
            col: "col-span-2",
            bgColor: "bg-red-100",
            textColor: "text-red-600 ",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.col} bg-white rounded-xl shadow-sm p-4`}
          >
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
                <p className="text-lg lg:text-2xl font-bold text-gray-800">
                  {stat.number}
                </p>
                <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
