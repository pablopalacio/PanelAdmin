import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";

export default function CargarServicio() {
  const [amount_reported, setAmount_reported] = useState(0);
  const [description, setDescription] = useState("");
  const [category_id, setCategory_id] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //   console.log(amount_reported, description, category_id);
  const categories = [
    "Indexar",
    "Instructor",
    "Liderazgo",
    "Revision",
    "Templo",
  ];

  const handleClick = (value) => {
    setCategory_id(value);
    console.log("Seleccionaste:", value);
  };

  const postData = async (nuevoServicio) => {
    try {
      setLoading(true);
      loading === true ? alert("enviando...") : "";
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
      alert("✅ Enviado con Exito!");
    } catch (err) {
      console.error("Error al enviar:", err);
      setError(err.response?.data?.message || err.message);
      alert("❌ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    postData({
      amount_reported: amount_reported,
      description: description,
      category_id: category_id,
      evidence: evidence,
    });
  };

  return (
    <>
      {" "}
      <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl px-4 rounded-2xl ">
        <h3 className="font-semibold text-xl md:text-2xl text-center p-4">
          Horas de Servicio
        </h3>
        <h4 className="font-semibold lg:text-lg">Tipo de Servicio</h4>
        <div className="flex flex-wrap gap-2 p-4">
          {categories.map((cat, index) => (
            <button
              key={cat}
              value={index + 1}
              onClick={() => handleClick(index + 1)}
              className={`px-2 py-1 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md
            ${
              category_id === cat
                ? "bg-blue-800"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="py-4">
          <div>
            <h4 className="font-semibold lg:text-lg">Cantidad de Horas</h4>
            <div className="flex gap-4 p-4 items-center">
              <button
                onClick={() =>
                  amount_reported === 0
                    ? ""
                    : setAmount_reported(amount_reported - 1)
                }
                className="bg-red-600 text-white rounded-full px-3 py-1"
              >
                -
              </button>
              <span className="text-xl">{amount_reported}</span>
              <button
                onClick={() => setAmount_reported(amount_reported + 1)}
                className="bg-blue-600 text-white rounded-full px-3 py-1"
              >
                +
              </button>
            </div>
            <div className="py-4">
              <h4 className="font-semibold lg:text-lg">Descripción</h4>

              <form className="max-w-sm mx-auto">
                <textarea
                  id="message"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Escribe aqui algun comentario..."
                ></textarea>
              </form>
            </div>
          </div>
          <div>
            <h4 className="font-bold lg:text-lg">Cargar Evidencias</h4>

            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setEvidence(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex gap-3 p-4">
            <button className="px-2 py-1 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
