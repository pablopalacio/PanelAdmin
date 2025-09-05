import React from "react";

export default function DetalleFiltro({ display }) {
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
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Argentina
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Peru
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Bolivia
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Guatemala
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Ecuador
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Uruguay
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold ">Escuela</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Frontend
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Ingles
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-l">
                Escuela Tecnica
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold py-2">Estado</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm md:text-l">
              Activo
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm md:text-l">
              Inactivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
