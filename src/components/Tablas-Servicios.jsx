import React from "react";

export default function TablasServicios({ service }) {
  const handleViewEvidence = (serviceId) => {
    const evidenceUrl = `https://www.hs-service.api.crealape.com/api/v1/evidence/${serviceId}`;
    window.open(evidenceUrl, "_blank", "noopener,noreferrer");
  };
  console.log(service);
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="font-bold text-xl text-blue-800 border-b border-gray-200 pb-3 mb-4 flex items-center">
        <span className="mr-2">👤</span> Historial Servicios
      </h2>
      {service.map((e) => (
        <div key={e.id} className="space-y-3 ">
          <div className="flex  w-full justify-between items-center border-b border-gray-100 py-1">
            <span className="w-[70%] font-semibold text-gray-700">
              {e.category.name}
            </span>
            <span className="w-[15%] text-gray-600">
              {e.amount_approved ? e.amount_approved : 0}/{e.amount_reported}
            </span>

            <button
              onClick={() => handleViewEvidence(e.evidence)}
              className="text-blue-500  bg-blue-50 hover:bg-blue-100 p-2 rounded-full shadow hover:shadow-md transition-all duration-200"
              title="Ver evidencia en nueva pestaña"
            >
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
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
