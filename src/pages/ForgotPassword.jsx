import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!email) {
      setError("Por favor, ingrese su correo electrónico");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://www.hs-service.api.crealape.com/api/v1/auth/forgot-password",
        { email }
      );
      setMessage(
        res.data.message ||
          "📩 Si el correo está registrado, recibirás un enlace para restablecer tu contraseña"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <svg
            className="w-8 h-8 text-blue-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu correo y recibirás un enlace para cambiar tu clave
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 cursor-pointer px-4 rounded-lg font-semibold transition-colors duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 text-green-700 text-sm rounded-lg bg-green-50">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 text-red-700 text-sm rounded-lg bg-red-50">
            {error}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
