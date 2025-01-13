import { buffer } from 'micro';
import * as admin from 'firebase-admin';

// Secure webhook handling
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Firebase Admin
const serviceAccount = require('../../../permissions.json');
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const fulfillOrder = async (session) => {
  try {
    console.log('Fulfilling order:', session.id);
    
    const db = admin.firestore();
    
    await db.collection('users')
      .doc(session.metadata.email)
      .collection('orders')
      .doc(session.id)
      .set({
        amount: session.amount_total / 100,
        amount_shipping: session.total_details?.amount_shipping / 100 || 0,
        images: JSON.parse(session.metadata.images),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        items: JSON.parse(session.metadata.items)
      });

    console.log(`SUCCESS: Order ${session.id} has been added to the database`);
  } catch (error) {
    console.error('Error fulfilling order:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const requestBuffer = await buffer(req);
  const payload = requestBuffer.toString();
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    console.log('Webhook event constructed:', event.type);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      await fulfillOrder(session);
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error processing order:', error);
      return res.status(500).json({ error: 'Error processing order' });
    }
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
