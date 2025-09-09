import React, { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function DetalleFiltro({
  display,
  aplicarFiltros,
  closeModal,
  tempPais,
  setTempPais,
  tempEscuela,
  setTempEscuela,
  tempEstado,
  setTempEstado,
}) {
  const { data: paises } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/countries"
  );
  const { data: escuelas } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/schools/"
  );
  const handlePushPais = (p) => {
    setTempPais((prev) =>
      prev.includes(p) ? prev.filter((pais) => pais !== p) : [...prev, p]
    );
  };

  const handlePushEscuela = (e) => {
    setTempEscuela((prev) =>
      prev.includes(e) ? prev.filter((esc) => esc !== e) : [...prev, e]
    );
  };

  const handleAplicar = () => {
    aplicarFiltros(tempPais, tempEscuela, tempEstado);
    closeModal();
  };

  return (
    <div className={`${display ? "flex" : "hidden"} justify-center`}>
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 w-full mb-4 lg:mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">País</h3>
            <div className="flex gap-4 flex-wrap">
              {paises?.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePushPais(p.name)}
                  className={`px-3 py-1 rounded-lg text-sm md:text-l transition-colors cursor-pointer ${
                    tempPais.includes(p.name)
                      ? "bg-blue-900 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-800"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Escuela</h3>
            <div className="flex flex-wrap gap-4">
              {escuelas?.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handlePushEscuela(s.name)}
                  className={`px-3 py-1 rounded-lg text-sm md:text-l transition-colors cursor-pointer ${
                    tempEscuela.includes(s.name)
                      ? "bg-violet-900 text-white"
                      : "bg-violet-500 text-white hover:bg-violet-800"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end mt-4">
          <div>
            <h3 className="font-semibold py-2">Estado</h3>
            <div className="flex gap-2">
              <button
                value="Activo"
                onClick={(e) => setTempEstado(e.target.value)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg a:bg-green-700 transition-colors cursor-pointer text-sm md:text-l"
              >
                Activo
              </button>
              <button
                value="Inactivo"
                onClick={(e) => setTempEstado(e.target.value)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm md:text-l"
              >
                Inactivo
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={handleAplicar}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l w-full"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
