import React from "react";
import { useApi } from "../hooks/useApi";

export default function DetalleFiltro({
  display,
  setFiltradoPais,
  setFiltradoEscuela,
  setFiltradoEstado,
}) {
  const { data: pais } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/countries"
  );
  const { data: escuela } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/schools/"
  );
  console.log(escuela);

  const handlePushPais = (pais) => {
    setFiltradoPais((prev) => {
      // Verificamos si ya está seleccionado
      const existe = prev.some((item) => item.pais === pais);

      if (existe) {
        // Si existe, lo quitamos
        return prev.filter((item) => item.pais !== pais);
      } else {
        // Si no existe, lo agregamos
        return [...prev, { pais }];
      }
    });
  };
  const handlePushEscuela = (escuela) => {
    setFiltradoEscuela((prev) => {
      // Verificamos si ya está seleccionado
      const existe = prev.some((item) => item.escuela === escuela);

      if (existe) {
        // Si existe, lo quitamos
        return prev.filter((item) => item.escuela !== escuela);
      } else {
        // Si no existe, lo agregamos
        return [...prev, { escuela }];
      }
    });
  };
  return (
    <div
      className={`${
        display === true ? "flex" : "hidden" + " "
      } justify-center `}
    >
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 w-full  mb-4 lg:mb-6">
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Pais</h3>

            <div className="flex gap-4 flex-wrap">
              {pais?.map((e) => (
                <button
                  key={e.id}
                  value={e.name}
                  onClick={(e) => handlePushPais(e.target.value)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l"
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold ">Escuela</h3>
            <div className="flex flex-wrap gap-4">
              {escuela?.map((e) => (
                <button
                  key={e.id}
                  value={e.name}
                  onClick={(e) => handlePushEscuela(e.target.value)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l"
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold py-2">Estado</h3>
          <div className="flex flex-wrap gap-4">
            <button
              value={"Activo"}
              onClick={(e) => setFiltradoEstado(e.target.value)}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm md:text-l"
            >
              Activo
            </button>
            <button
              value={"Inactivo"}
              onClick={(e) => setFiltradoEstado(e.target.value)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm md:text-l"
            >
              Inactivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
