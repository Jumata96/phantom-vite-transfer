import React, { useState, useEffect } from 'react';

const App = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState('Esperando acción...');
  const [provider, setProvider] = useState(null);

  // Esta función obtiene el proveedor Phantom o redirige a la instalación si no está presente
  const getProvider = () => {
    if (window.solana && window.solana.isPhantom) {
      setStatusMessage("Phantom detectado.", "ok");
      return window.solana;
    }
    setStatusMessage("Phantom no detectado. Redirigiendo a instalación…", "warn");
    window.open("https://phantom.app/", "_blank"); // Redirige a la instalación de Phantom
    return null;
  };

  // useEffect: Actualiza el proveedor cuando el componente se monta
  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      setProvider(provider);
    }
  }, []); // Dependencia vacía para ejecutarse solo una vez

  const setStatusMessage = (message, type = 'muted') => {
    setStatus(message);
  };

  // Función para conectar Phantom Wallet
  const handleConnect = async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      setStatusMessage("Solicitando conexión...");
      console.log("Intentando conectar a Phantom...");

      // Esto debería abrir el modal de Phantom
      const { publicKey } = await provider.connect();  // Debería abrir el modal de Phantom

      if (publicKey) {
        // Si la conexión es exitosa, actualizamos el estado
        console.log("Conexión exitosa con Phantom:", publicKey.toString());
        setAccount(publicKey.toString());
        setConnected(true);
        setStatusMessage("Conectado correctamente.", "ok");
      } else {
        // Si no se obtiene una publicKey válida
        setStatusMessage("Conexión fallida.", "err");
      }
    } catch (err) {
      // Captura de errores mejorada
      console.log("Error de conexión:", err);
      setConnected(false);
      setStatusMessage("Conexión cancelada o rechazada.", "err");
    }
  };

  // Función para desconectar Phantom Wallet
  const handleDisconnect = async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      await provider.disconnect();
      setConnected(false);
      setAccount(null);
      setStatusMessage("Desconectado.", "warn");
    } catch (err) {
      setStatusMessage("No se pudo desconectar.", "err");
    }
  };

  // Función para firmar un mensaje con Phantom Wallet
  const handleSign = async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      const message = "Prueba Phantom " + new Date().toISOString();
      const encoded = new TextEncoder().encode(message);
      if (!provider.signMessage) {
        setStatusMessage("signMessage no disponible en esta instalación.", "warn");
        return;
      }
      const { signature, publicKey } = await provider.signMessage(encoded, "utf8");
      setStatusMessage(`Mensaje firmado por ${publicKey.toString().slice(0, 4)}...`, "ok");
      console.log("Mensaje:", message);
      console.log("PublicKey:", publicKey.toString());
      console.log("Firma:", signature);
    } catch (err) {
      setStatusMessage("Firma cancelada o fallida.", "err");
    }
  };

  return (
    <div className="card">
      <h1>Demo: Conectar Phantom (Solana)</h1>
      <p id="status" className="muted">{status}</p>

      <div className="row">
        <button id="btn-connect" onClick={handleConnect} disabled={connected}>
          Conectar Phantom
        </button>
        <button id="btn-disconnect" onClick={handleDisconnect} disabled={!connected}>
          Desconectar
        </button>
        <button id="btn-sign" onClick={handleSign} disabled={!connected}>
          Firmar mensaje (opcional)
        </button>
      </div>

      <div className="row">
        <span className="pill" id="pill-installed">Phantom: {provider ? 'Detectado' : 'No detectado'}</span>
        <span className="pill" id="pill-connected">Conexión: {connected ? 'Activa' : 'Inactiva'}</span>
      </div>

      <div>
        <div><strong>Cuenta:</strong> <span className="mono">{account || '—'}</span></div>
        <div><strong>Cluster (referencial):</strong> <span className="mono">Controlado por Phantom</span></div>
      </div>

      <hr style={{ borderColor: "#1f2a4a", margin: "16px 0" }} />

      <p className="muted">
        Si no tienes Phantom, instálalo desde <span className="mono">https://phantom.app/</span> (escritorio o móvil).
      </p>
    </div>
  );
};

export default App;