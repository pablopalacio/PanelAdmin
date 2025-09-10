import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  const handlecontroller = () => {
    navigate("/controller");
  };
  const handleestudiante = () => {
    navigate("/panelestudiante");
  };

  const handlereclutador = () => {
    navigate("/reclutador");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white font-sans"
      style={{
        backgroundImage:
          "url('https://www.estudiantefunval.org/pluginfile.php/1/theme_moove/sliderimage1/1755880041/Earth%20day.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="min-h-screen bg-black/50 flex flex-col">
        <header className="flex justify-between items-center px-6 py-4">
          <img
            src="https://cdn.brandfetch.io/idYqRqXUhP/w/6667/h/1667/theme/light/logo.png?c=1dxbfHSJFAPEGdCLU4o5B"
            alt=""
            className="w-35"
          />
          <button
            onClick={handleLoginClick}
            className="py-2 px-5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Acceder
          </button>
          <button
            onClick={handlecontroller}
            className="py-2 px-5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md"
          >
            controller
          </button>
          <button
            onClick={handleestudiante}
            className="py-2 px-5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md"
          >
            panelEstudiante
          </button>
          <button
            onClick={handlereclutador}
            className="py-2 px-5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md"
          >
            reclutadores
          </button>
        </header>
      </div>
    </div>
  );
}

export default Home;
