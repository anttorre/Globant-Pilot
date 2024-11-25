import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define un ícono personalizado
const defaultIcon = new L.Icon({
	iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
	iconSize: [25, 41], // Tamaño del ícono
	iconAnchor: [12, 41], // Puntos de anclaje
	popupAnchor: [1, -34], // Ubicación del popup
  });

// Componente auxiliar para ajustar el centro y el zoom del mapa dinámicamente
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

function TripRecommendator() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [mapCenter, setMapCenter] = useState([0, 0]); // Centro inicial del mapa
  const [zoomLevel, setZoomLevel] = useState(2); // Zoom inicial

  const fetchRecommendations = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDxUrriq-OQiHa9cnku3FPdsSzl_2PJS0A',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Recomienda lugares turísticos relacionados con ${query.toLowerCase()} y dame coordenadas geográficas (lat, lon). Devuelveme toda esta informacion como un json con los campos nombre, estado, descripcion, coordenadas (lat y lon).`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta completa de la API:', data); // Muestra la respuesta completa

      if (data.candidates && data.candidates.length > 0) {
        const generatedText = data.candidates[0].content.parts[0].text || '';
        console.log('Texto generado:', generatedText);

        // Parsear el texto generado por la IA para extraer los lugares
        const parsedPlaces = parseGeneratedText(generatedText);
        setPlaces(parsedPlaces);

        if (parsedPlaces.length > 0) {
          setMapCenter([parsedPlaces[0].latitude, parsedPlaces[0].longitude]);
          setZoomLevel(3); // Ajustar zoom para mostrar múltiples lugares
        } else {
          setMapCenter([0, 0]);
          setZoomLevel(2);
        }
      } else {
        console.error('No se encontraron lugares recomendados en la respuesta:', data);
        setPlaces([]); // Limpiar lugares si no se encuentra un resultado válido
      }
    } catch (error) {
      console.error('Error al obtener las recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseGeneratedText = (text) => {
	try {
	  // Paso 1: Limpiar el texto eliminando las etiquetas Markdown
	  const cleanedText = text.replace(/```json|```/g, "").trim();
  
	  console.log("Texto limpio antes de parsear:", cleanedText); // Para depurar
  
	  // Paso 2: Buscar un bloque JSON válido
	  const jsonMatch = cleanedText.match(/\[[\s\S]*\]/); // Busca un array JSON en el texto
  
	  if (!jsonMatch) {
		console.error("No se encontró un bloque JSON en el texto.");
		return []; // Si no se encuentra JSON, devolvemos un array vacío
	  }
  
	  const jsonString = jsonMatch[0]; // Obtener el bloque JSON completo
	  console.log("Texto JSON extraído:", jsonString); // Verificar el JSON extraído
  
	  // Paso 3: Parsear el JSON
	  const data = JSON.parse(jsonString);
  
	  // Paso 4: Verificar que el JSON es un array
	  if (!Array.isArray(data)) {
		console.error("El JSON extraído no es un array.");
		return [];
	  }
  
	  // Paso 5: Mapear los datos al formato esperado
	  const parsedPlaces = data.map((place, index) => {
		// Asegurarse de que el lugar tiene coordenadas válidas
		if (place.coordenadas && typeof place.coordenadas.lat !== 'undefined' && typeof place.coordenadas.lon !== 'undefined') {
		  return {
			name: place.nombre || `Lugar ${index + 1}`, // Usar un nombre genérico si no hay nombre
			latitude: place.coordenadas.lat,
			longitude: place.coordenadas.lon,
			description: place.descripcion || `Descripción no disponible para ${place.nombre || 'este lugar'}`,
		  };
		} else {
		  console.warn(`Lugar ${place.nombre || 'sin nombre'} no tiene coordenadas válidas.`);
		  return null; // Ignorar lugares sin coordenadas
		}
	  }).filter(place => place !== null); // Filtrar los lugares que no tienen coordenadas válidas
  
	  console.log("Lugares parseados:", parsedPlaces); // Verificar los lugares parseados
	  return parsedPlaces;
	} catch (error) {
	  console.error("Error al parsear el JSON:", error);
	  return []; // En caso de error, devolver un array vacío
	}
  };
    
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita recargar la página al enviar el formulario
    if (location.trim() !== '') {
      fetchRecommendations(location); // Usa el valor de 'location' en la query
    }
  };

  return (
    <div>
      <h1>Trip Recommendator</h1>
      <p>Introduce una palabra clave o un lugar para obtener recomendaciones.</p>

      {/* Formulario para ingresar la ubicación */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa una palabra clave o lugar"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', width: '80%' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>
          Buscar
        </button>
      </form>

      {loading ? (
        <p>Cargando recomendaciones...</p>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          style={{ height: '500px', width: '100%', marginTop: '20px' }}
        >
          <ChangeView center={mapCenter} zoom={zoomLevel} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {places.length > 0 && places.map((place, index) => (
			<Marker
				key={index}
				position={[place.latitude, place.longitude]} // Usando las coordenadas del lugar
				icon={defaultIcon} // Aquí puedes elegir el ícono que desees
			>
				<Popup>
				<strong>{place.name}</strong>
				<p>{place.description}</p>
				</Popup>
			</Marker>
		   ))}
        </MapContainer>
      )}
    </div>
  );
}

export default TripRecommendator;
