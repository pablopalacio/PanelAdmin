import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";

export default function CargarServicio() {
  const [amount_reported, setAmount_reported] = useState(0);
  const [description, setDescription] = useState("");
  const [category_id, setCategory_id] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Indexar",
    "Instructor",
    "Liderazgo",
    "Revision",
    "Templo",
  ];

  const handleClick = (value) => {
    setCategory_id(value);
  };

  const postData = async (nuevoServicio) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("amount_reported", nuevoServicio.amount_reported);
      formData.append("description", nuevoServicio.description);
      formData.append("category_id", nuevoServicio.category_id);
      formData.append("evidence", nuevoServicio.evidence);

      const response = await axiosInstance.post("/services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Respuesta POST:", response.data);
      alert("✅ ¡Enviado con Éxito!");

      // Reset form
      setAmount_reported(0);
      setDescription("");
      setCategory_id(null);
      setEvidence(null);
    } catch (err) {
      console.error("Error al enviar:", err);
      setError(err.response?.data?.message || err.message);
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!category_id) {
      alert("Por favor selecciona un tipo de servicio");
      return;
    }

    if (amount_reported === 0) {
      alert("Por favor ingresa la cantidad de horas");
      return;
    }

    if (!evidence) {
      alert("Por favor carga una evidencia");
      return;
    }

    postData({
      amount_reported: amount_reported,
      description: description,
      category_id: category_id,
      evidence: evidence,
    });
  };

  return (
    <div className="grid h-full bg-white rounded-xl shadow-md p-6">
      <h3 className="font-bold text-xl text-blue-800 border-b border-gray-200 pb-3 mb-6 flex items-center">
        <span className="mr-2">📤</span> Registrar Horas de Servicio
      </h3>

      {/* Tipo de servicio */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">🏷</span> Tipo de Servicio
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => (
            <button
              key={cat}
              value={index + 1}
              onClick={() => handleClick(index + 1)}
              className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition duration-200 shadow-sm
                ${
                  category_id === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cantidad de horas */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">🕒</span> Cantidad de Horas
        </h4>
        <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
          <button
            onClick={() =>
              amount_reported === 0
                ? ""
                : setAmount_reported(amount_reported - 1)
            }
            className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600 transition"
          >
            -
          </button>
          <span className="text-2xl font-bold text-blue-800 px-4 py-2 bg-white rounded-lg shadow-inner">
            {amount_reported}
          </span>
          <button
            onClick={() => setAmount_reported(amount_reported + 1)}
            className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-600 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📝</span> Descripción
        </h4>
        <textarea
          id="message"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block p-4 w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe las actividades de servicio realizadas..."
        ></textarea>
      </div>

      {/* Cargar evidencias */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📎</span> Cargar Evidencias
        </h4>

        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Haz clic para subir</span> o
                arrastra un archivo
              </p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
              {evidence && (
                <p className="mt-2 text-xs text-green-600">
                  Archivo seleccionado: {evidence.name}
                </p>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setEvidence(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <div>
          <button
            onClick={() => (
              setAmount_reported(0),
              setDescription(""),
              setEvidence(null),
              setCategory_id(null)
            )}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 rounded-lg font-medium transition duration-200 shadow-sm"
          >
            Cancelar
          </button>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-medium transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
