const express = require('express');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

paypal.configure({
  'mode': 'sandbox',
  'client_id': 'AUNCZ-X0NC8KwrFfbbtMDaw5DQa9pHhdho3mzASK5S3NwP0_EbVlacq1Ea9CaodjRy603QKjLsQjUytw',
  'client_secret': 'EE2ZN6D1a2BTm7jy_Nzk8eoLj4t8N-fOi375Rb8z8mmYdCmtucMoA_GDvxcTgcVd-ctEuPdsGw3KocMB'
});

app.post('/create-payment', async (req, res) => {
  const create_payment_json = {
    // Configuración de creación de pago
  };

  try {
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el pago' });
      } else {
        res.json({ id: payment.id });
      }
    });
  } catch (error) {
    console.error('Error en la solicitud de PayPal:', error);
    res.status(500).json({ error: 'Error en la solicitud de PayPal' });
  }
});

app.post('/execute-payment', async (req, res) => {
  const paymentId = req.body.paymentId;
  const payerId = req.body.payerId;

  const execute_payment_json = {
    // Configuración de ejecución de pago
  };

  try {
    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al ejecutar el pago' });
      } else {
        res.json(payment);
      }
    });
  } catch (error) {
    console.error('Error en la solicitud de PayPal:', error);
    res.status(500).json({ error: 'Error en la solicitud de PayPal' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
