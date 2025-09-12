import React, { useState } from "react";
import DetalleFiltro from "./DetalleFiltro";

export default function Filtro({
  searchTerm,
  setSearchTerm,
  handleAplicarFiltros,
  filtradoPais,
  filtradoEscuela,
  filtradoEstado,
  cleanFilter,
  tempPais,
  setTempPais,
  tempEscuela,
  setTempEscuela,
  tempEstado,
  setTempEstado,
}) {
  const [toggle, setToggle] = useState(false);

  function handleToggle() {
    setToggle(!toggle);
  }

  const activeFilterCount =
    (filtradoPais?.length || 0) +
    (filtradoEscuela?.length || 0) +
    (filtradoEstado ? 1 : 0);

  return (
    <div className="mb-4">
      {" "}
      <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4 mb-3 transition-all duration-300 hover:shadow-md">
        {" "}
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          {" "}
          <div className="flex-1 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre de estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-xs lg:text-sm transition-all duration-200" // Reducido pl-11/pr-4/py-3 a pl-9/pr-3/py-2, rounded-xl a rounded-lg, ring-2 a ring-1, text-sm/text-base a text-xs/text-sm
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {" "}
            <button
              onClick={handleToggle}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center text-xs lg:text-sm font-medium text-gray-700 cursor-pointer shadow-sm hover:shadow-md"
              cursor-pointer
            >
              <svg
                className="w-4 h-4 mr-1.5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtros
              {activeFilterCount > 0 && (
                <span className="ml-1.5 bg-blue-500 text-white text-xxs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {" "}
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={cleanFilter}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center justify-center text-xs lg:text-sm font-medium text-gray-700 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={activeFilterCount === 0}
            >
              <svg
                className="w-4 h-4 mr-1.5 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 15L21 21M21 15L15 21M10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L17 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Limpiar
            </button>
          </div>
        </div>
      </div>
      <DetalleFiltro
        display={toggle}
        closeModal={handleToggle}
        aplicarFiltros={handleAplicarFiltros}
        tempPais={tempPais}
        setTempPais={setTempPais}
        tempEscuela={tempEscuela}
        setTempEscuela={setTempEscuela}
        tempEstado={tempEstado}
        setTempEstado={setTempEstado}
      />
      {/* --- Etiquetas de filtros activos --- */}
      {activeFilterCount > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-3 animate-fade-in">
          {" "}
          <h3 className="text-xs font-semibold text-gray-700 mb-2">
            {" "}
            Filtros aplicados:
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {" "}
            {filtradoPais?.map((pais) => (
              <span
                key={pais}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {pais}
              </span>
            ))}
            {/* Filtros de escuela */}
            {filtradoEscuela?.map((escuela) => (
              <span
                key={escuela}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800" //
              >
                {escuela}
              </span>
            ))}
            {filtradoEstado && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  filtradoEstado === "Activo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {filtradoEstado}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
