import { getAuth } from 'firebase-admin/auth';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest stable version
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { items, email } = req.body;

    // Console log for debugging
    console.log('Received request with email:', email);

    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: { message: 'Please provide at least one item for checkout' },
      });
    }

    if (!email) {
      return res.status(400).json({
        error: { message: 'Please provide an email address' },
      });
    }

    // Transform items for Stripe
    const transformedItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          description: item.description,
          images: [item.image],
        },
      },
      quantity: 1,
    }));

    // Get the host from environment or default to localhost
    const host = process.env.HOST || 'http://localhost:3000';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 499,
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
      line_items: transformedItems,
      mode: 'payment',
      success_url: `${host}/success`,
      cancel_url: `${host}/checkout`,
      metadata: {
        email,
        items: JSON.stringify(items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          description: item.description,
          category: item.category,
        }))),
      },
      customer_email: email,
    });

    console.log('Stripe session created:', session.id);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Error creating checkout session',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}