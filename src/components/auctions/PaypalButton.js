import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const PayPalButton = ({ price }) => {
  const createOrder = async (data, actions) => {
    try {
      const response = await fetch('http://localhost:5000/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price })
      });
      const { id } = await response.json();
      return id; // Retornar el ID del pedido
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await fetch('http://localhost:5000/execute-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId: data.orderID,
          payerId: data.payerID
        })
      });
      const details = await response.json();
      alert(`Pago completado por ${details.payer.payer_info.first_name}`);
    } catch (error) {
      console.error('Error al ejecutar el pago:', error);
      // Manejar el error si es necesario
    }
  };

  return (
    <PayPalScriptProvider options={{ 'client-id': 'AUNCZ-X0NC8KwrFfbbtMDaw5DQa9pHhdho3mzASK5S3NwP0_EbVlacq1Ea9CaodjRy603QKjLsQjUytw' }}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
