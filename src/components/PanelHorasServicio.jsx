import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import StatsCardsHorasServicio from "./StatsCardsHorasServicio";
import MapaHorasServicio from "./MapaHorasServicio";

export default function PanelHorasServicio() {
  const [datos, setDatos] = useState({
    totalMundial: 0,
    promedioHoras: 0,
    horasValidadas: 0,
    horasPendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/services");
        const servicios = response.data;

        console.log("📋 Servicios desde Panel:", servicios);

        // Calcular estadísticas
        const totalHoras = servicios.reduce(
          (acc, servicio) => acc + (servicio.amount_approved || 0),
          0
        );

        const horasValidadas = servicios.reduce(
          (acc, servicio) =>
            servicio.status === "Approved"
              ? acc + (servicio.amount_approved || 0)
              : acc,
          0
        );

        const horasPendientes = servicios.reduce(
          (acc, servicio) =>
            servicio.status !== "Approved"
              ? acc + (servicio.amount_reported || 0)
              : acc,
          0
        );

        // Contar estudiantes únicos
        const estudiantesUnicos = new Set(servicios.map((s) => s.user?.id))
          .size;
        const promedioHoras =
          estudiantesUnicos > 0
            ? (totalHoras / estudiantesUnicos).toFixed(0)
            : 0;

        setDatos({
          totalMundial: totalHoras,
          promedioHoras,
          horasValidadas,
          horasPendientes,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setDatos({
          totalMundial: 436546,
          promedioHoras: 30,
          horasValidadas: 12,
          horasPendientes: 12,
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 mt-3">Cargando panel...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <StatsCardsHorasServicio
          totalMundial={datos.totalMundial}
          promedioHoras={datos.promedioHoras}
          horasValidadas={datos.horasValidadas}
          horasPendientes={datos.horasPendientes}
        />
      </div>

      <div className="mt-6">
        <MapaHorasServicio />
      </div>
    </>
  );
}
