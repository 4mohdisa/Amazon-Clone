import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

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
  console.log('Starting order fulfillment for session:', session.id);
  
  try {
    // Parse the metadata
    const metadata = session.metadata || {};
    console.log('Session metadata:', metadata);
    
    const items = metadata.items ? JSON.parse(metadata.items) : [];
    console.log('Parsed items:', items);
    
    const email = session.customer_details?.email;
    if (!email) {
      throw new Error('No email found in session');
    }
    
    console.log('Processing order for email:', email);

    // Create a reference to the user's orders
    const orderRef = admin.firestore()
      .collection('users')
      .doc(email)
      .collection('orders')
      .doc(session.id);

    const orderData = {
      amount: session.amount_total / 100,
      amount_shipping: session.total_details?.amount_shipping / 100 || 0,
      images: items.map(item => item.image),
      items: items,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'processing',
      paymentStatus: session.payment_status,
      shippingDetails: session.shipping_details || {},
      email: email,
      id: session.id // Adding session ID explicitly
    };

    console.log('Saving order data:', orderData);

    // Save the order
    await orderRef.set(orderData, { merge: true });

    console.log('Success: Order', session.id, 'has been saved to the database');
    return true;
  } catch (error) {
    console.error('Error in fulfillOrder:', error);
    console.error('Session details:', {
      id: session.id,
      email: session.customer_details?.email,
      metadata: session.metadata,
      timestamp: new Date().toISOString()
    });
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
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    console.log('Webhook received:', event.type);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    console.error('Signature:', sig);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Processing completed checkout session:', session.id);

    try {
      await fulfillOrder(session);
      console.log('Order fulfilled successfully');
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error fulfilling order:', error);
      res.status(500).json({
        error: 'Error processing order',
        message: error.message,
        sessionId: session.id,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    console.log('Unhandled event type:', event.type);
    res.json({ received: true });
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
