import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const API_KEY = import.meta.env.VITE_API_GOOGLE_MAPS as string;

const containerStyle: React.CSSProperties = {
  width: '300px',
  height: '200px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  border: '2px solid #1e90ff'
};

const center: google.maps.LatLngLiteral = {
  lat: 5.8953117,
  lng: -75.95707
};

// Tema oscuro para el mapa
const darkMapStyles: google.maps.MapTypeStyle[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#383838' }]
  }
];

export default function MyMap() {
  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          styles: darkMapStyles,
          disableDefaultUI: true,  // Opcional: oculta los controles por defecto
          zoomControl: true        // Si quieres mantener el control de zoom
        }}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
