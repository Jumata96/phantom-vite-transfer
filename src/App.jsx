  import React, { useState, useEffect } from 'react';
  import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

  const App = () => {
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [status, setStatus] = useState('Esperando acción...');
    const [provider, setProvider] = useState(null);
    const [balance, setBalance] = useState(null);

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

    // función para consultar el saldo
    const handleCheckBalance = async () => {

      if (!account) {
        setStatusMessage("Conecta Phantom primero.", "warn");
        return;
      }
      try {
        setStatusMessage("Consultando saldo..."); 
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const publicKey = new PublicKey(account);
        const lamports = await connection.getBalance(publicKey); 
        const sol = lamports / 1e9;
        setBalance(sol);
        setStatusMessage(`Saldo: ${sol} SOL`, "ok");
      } catch (err) {
        setStatusMessage("No se pudo consultar el saldo.", "err");
      }
    };
    // Función para conectar Phantom Wallet
    const handleConnect = async () => {    const provider = getProvider();
      if (!provider) return;

      try {
        setStatusMessage("Solicitando conexión...");

        // Esto debería abrir el modal de Phantom
        const { publicKey } = await provider.connect();  // Debería abrir el modal de Phantom

        if (publicKey) {
          // Si la conexión es exitosa, actualizamos el estado
          setAccount(publicKey.toString());
          setConnected(true);
          setStatusMessage("Conectado correctamente.", "ok");
        } else {
          // Si no se obtiene una publicKey válida
          setStatusMessage("Conexión fallida.", "err");
        }
      } catch (err) {
        // Captura de errores mejorada
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
      } catch (err) {
        setStatusMessage("Firma cancelada o fallida.", "err");
      }
    };

    return (
      <div className="card">
        <h1>Conectar Phantom (Solana)</h1>
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
        <button id="btn-balance" onClick={handleCheckBalance} disabled={!connected}>
          Consultar saldo
        </button>

        <div className="row">
          <span className="pill" id="pill-installed">Phantom: {provider ? 'Detectado' : 'No detectado'}</span>
          <span className="pill" id="pill-connected">Conexión: {connected ? 'Activa' : 'Inactiva'}</span>
        </div>

        <div>
          <div><strong>Cuenta:</strong> <span className="mono">{account || '—'}</span></div>
          <div><strong>Saldo:</strong> <span className="mono">{balance !== null ? `${balance} SOL` : '—'}</span></div>
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