// src/components/auctions/Body.js
import React, { useContext, useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { AddAuction } from './AddAuction';
import { AuctionCard } from './AuctionCard';
import { ProgressBar } from './ProgressBar';
import PaypalButton from './PaypalButton'; // Importa el componente PaypalButton

export const AuctionBody = () => {
  const [auction, setAuction] = useState(null);
  const { currentUser, globalMsg } = useContext(AuthContext);
  const { docs } = useFirestore('auctions');
  const [winnerId, setWinnerId] = useState(null); // Estado para el ID del ganador
  const [auctionEnded, setAuctionEnded] = useState(false); // Estado para verificar si la subasta ha finalizado
  const [paypalAmount, setPaypalAmount] = useState(null); // Estado para el monto dinámico del botón de PayPal

  // Efecto para determinar el ganador y si la subasta ha finalizado
  useEffect(() => {
    if (docs && docs.length > 0) {
      const currentAuction = docs[0]; // Suponiendo que solo hay una subasta activa a la vez, ajusta según tu estructura de datos
      const now = new Date(); // Fecha actual

      // Verifica si la subasta ha finalizado
      if (currentAuction.endTime && currentAuction.endTime.toDate() < now) {
        // La subasta ha finalizado
        setAuctionEnded(true);

        // Aquí deberías tener la lógica para determinar quién es el ganador
        const highestBidderId = currentAuction.highestBidderId; // Suponiendo que tienes un campo en tu documento que registra al postor más alto
        setWinnerId(highestBidderId); // Establece el ID del ganador

        // Ajusta el monto para el botón de PayPal según el resultado de la subasta
        const finalPrice = currentAuction.finalPrice; // Ajusta según cómo almacenas el precio final en tu base de datos
        setPaypalAmount(finalPrice);
      }
    }
  }, [docs]);

  return (
    <div className="py-5">
      <div className="container">
        {auction && <ProgressBar auction={auction} setAuction={setAuction} />}

        {globalMsg && <Alert variant="info">{globalMsg}</Alert>}

        {currentUser && <AddAuction setAuction={setAuction} />}

        {docs && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {docs.map((doc) => {
              return <AuctionCard item={doc} key={doc.id} />;
            })}
          </div>
        )}

        {/* Mostrar el botón de PayPal solo para el ganador de la subasta */}
        {auctionEnded && winnerId === currentUser.uid && paypalAmount && (
          <PaypalButton amount={paypalAmount} />
        )}
      </div>
    </div>
  );
};
