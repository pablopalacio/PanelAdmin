import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApiLogin } from "../hooks/useApiLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { login, error, loading } = useApiLogin();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!email || !password) {
      setLoginError("Por favor, complete todos los campos");
      return;
    }

    try {
      const result = await login(email, password);
      if (result && result.user) {
        console.log("Login exitoso, redirigiendo a estudiantes...");
        navigate("/Estudiantes");
      }
    } catch (err) {
      console.error("Error de login:", err);

      let errorMessage = err.message;
      if (
        err.message.includes("CORS") ||
        err.message.includes("Network") ||
        err.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Error de conexión. Verifique su internet o contacte al administrador.";
      }

      setLoginError(errorMessage);
    }
  };

  const handleTestCredentials = () => {
    setEmail("admin@funval.test");
    setPassword("1234567");
    setLoginError("");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 ">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa a tu cuenta administrativa</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3  cursor-pointer px-4 rounded-lg font-semibold transition-colors duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {(error || loginError) && (
          <div className=" p-3 text-red-700 rounded-lg text-sm">
            {(() => {
              const errorMessage = error || loginError;

              if (errorMessage.toLowerCase().includes("login successful")) {
                return "✅ Login exitoso! Redirigiendo...";
              }
              if (
                errorMessage.includes("CORS") ||
                errorMessage.includes("Network")
              ) {
                return "🌐 Error de conexión. Verifique su internet.";
              }
              if (errorMessage.includes("Failed to fetch")) {
                return "🔌 No se pudo conectar con el servidor.";
              }

              return `Error: ${errorMessage}`;
            })()}
          </div>
        )}

        <div className="mt-2 text-center">
          <button className="text-sm p text-blue-600 hover:text-blue-800">
            Cambiar Clave
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
