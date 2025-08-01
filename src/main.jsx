import React from 'react';
import ReactDOM from 'react-dom/client'; // Asegúrate de importar desde 'react-dom/client'
import './style.css'; // Estilos básicos
import App from './App'; // Componente principal que contiene la lógica de Phantom Wallet

// Crea el root y renderiza la aplicación React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);