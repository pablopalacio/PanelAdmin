import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaHorasServicio() {
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [paisHover, setPaisHover] = useState(null);
  const [worldData, setWorldData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos GeoJSON reales desde un CDN
  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        );
        const topojsonData = await response.json();

        // Convertir TopoJSON a GeoJSON
        const { feature } = await import("topojson-client");
        const geojsonData = {
          type: "FeatureCollection",
          features: topojsonData.objects.countries.geometries.map((geom) =>
            feature(topojsonData, geom)
          ),
        };

        setWorldData(geojsonData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading world data:", error);
        setLoading(false);
      }
    };

    fetchWorldData();
  }, []);

  // Horas de servicio por país hardcodeadas
  const horasPorPais = useMemo(
    () => ({
      Chile: 15,
      Brazil: 32,
      "United States": 45,
      Spain: 18,
      Australia: 27,
      France: 22,
      Germany: 38,
      Japan: 29,
      China: 50,
      India: 35,
      Mexico: 20,
      Canada: 30,
      Argentina: 17,
      "South Africa": 19,
      Italy: 25,
    }),
    []
  );

  // Mapeo de nombres de países entre diferentes convenciones
  const nombrePaisesMap = useMemo(
    () => ({
      Chile: "Chile",
      Brazil: "Brazil",
      "United States": "United States of America",
      Spain: "Spain",
      Australia: "Australia",
      France: "France",
      Germany: "Germany",
      Japan: "Japan",
      China: "China",
      India: "India",
      Mexico: "Mexico",
      Canada: "Canada",
      Argentina: "Argentina",
      "South Africa": "South Africa",
      Italy: "Italy",
    }),
    []
  );

  // Función para determinar el color según las horas
  const getColorByHoras = useCallback((horas) => {
    if (!horas || horas === 0) return "#CCCCCC";
    const intensity = Math.min(1, horas / 50);
    const r = Math.floor(59 + 196 * intensity);
    const g = Math.floor(130 - 80 * intensity);
    const b = Math.floor(200 - 145 * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // Función para obtener el nombre del país en la API basado en el nombre del GeoJSON
  const getNombrePaisAPI = useCallback(
    (nombreGeoJSON) => {
      // Buscar si el nombre de GeoJSON está como valor en el mapeo
      for (const [key, value] of Object.entries(nombrePaisesMap)) {
        if (value === nombreGeoJSON) {
          return key;
        }
      }
      // Si no se encuentra en el mapeo, usar el nombre original
      return nombreGeoJSON;
    },
    [nombrePaisesMap]
  );

  // Estilo para cada país en el mapa
  const estiloPais = useCallback(
    (feature) => {
      const nombrePaisGeoJSON = feature.properties.name;
      const nombrePaisAPI = getNombrePaisAPI(nombrePaisGeoJSON);
      const horas = horasPorPais[nombrePaisAPI] || 0;
      const isSelected = paisSeleccionado === nombrePaisAPI;
      const isHovered = paisHover === nombrePaisAPI;

      return {
        fillColor: getColorByHoras(horas),
        weight: isSelected ? 3 : 1,
        color: isSelected ? "#FF0000" : isHovered ? "#FFFF00" : "#FFFFFF",
        opacity: 1,
        fillOpacity: isSelected ? 0.8 : isHovered ? 0.7 : 0.5,
      };
    },
    [
      horasPorPais,
      paisSeleccionado,
      paisHover,
      getColorByHoras,
      getNombrePaisAPI,
    ]
  );

  // Eventos para cada país
  const onEachPais = useCallback(
    (feature, layer) => {
      const nombrePaisGeoJSON = feature.properties.name;
      const nombrePaisAPI = getNombrePaisAPI(nombrePaisGeoJSON);
      const horas = horasPorPais[nombrePaisAPI] || 0;

      layer.on({
        mouseover: (e) => {
          setPaisHover(nombrePaisAPI);
          layer.setStyle({
            weight: 2,
            color: "#FFFF00",
            fillOpacity: 0.7,
          });
        },
        mouseout: (e) => {
          setPaisHover(null);
          layer.setStyle(estiloPais(feature));
        },
        click: (e) => {
          setPaisSeleccionado(nombrePaisAPI);
        },
      });

      // Tooltip bind
      layer.bindTooltip(`
        <div class="p-1">
          <strong>${nombrePaisAPI}</strong><br/>
          ${horas} horas de servicio
        </div>
      `);
    },
    [horasPorPais, estiloPais, getNombrePaisAPI]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Distribución de Horas por País
      </h2>

      <div className="h-96 rounded-lg overflow-hidden relative">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {worldData && (
            <GeoJSON
              data={worldData}
              style={estiloPais}
              onEachFeature={onEachPais}
            />
          )}
        </MapContainer>

        {/* Leyenda del mapa */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md z-1000">
          <div className="text-sm font-semibold mb-2">Horas de servicio</div>
          <div className="flex items-center mb-1">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "#CCCCCC" }}
            ></div>
            <span className="text-xs">Sin datos</span>
          </div>
          <div className="flex items-center mb-1">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "rgb(59, 130, 200)" }}
            ></div>
            <span className="text-xs">Pocas horas</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: "rgb(255, 50, 55)" }}
            ></div>
            <span className="text-xs">Muchas horas</span>
          </div>
        </div>
      </div>

      {/* Información del país seleccionado */}
      {paisSeleccionado && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-lg text-blue-800">
            {paisSeleccionado}
          </h3>
          <p className="text-blue-600">
            <span className="font-semibold">
              {horasPorPais[paisSeleccionado] || 0}
            </span>{" "}
            horas de servicio
          </p>
        </div>
      )}

      {/* Lista de países con horas */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">Resumen por país</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {Object.entries(horasPorPais)
            .sort((a, b) => b[1] - a[1])
            .map(([pais, horas]) => (
              <div
                key={pais}
                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                  paisSeleccionado === pais ? "bg-blue-100" : "bg-gray-50"
                }`}
                onClick={() => setPaisSeleccionado(pais)}
                onMouseEnter={() => setPaisHover(pais)}
                onMouseLeave={() => setPaisHover(null)}
              >
                <span className="text-sm text-gray-700 truncate">{pais}</span>
                <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                  {horas} hrs
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
