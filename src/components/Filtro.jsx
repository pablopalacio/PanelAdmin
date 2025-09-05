import React, { useState } from "react";

export default function Filtro() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar estudiantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 lg:h-5 lg:w-5 text-gray-400"
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

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 sm:flex-none px-3 py-2 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm lg:text-base cursor-pointer">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nuevo Estudiante
            </button>

            <button className="flex-1 sm:flex-none px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm lg:text-base cursor-pointer">
              <svg
                className="w-4 h-4 mr-2"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
