import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest stable version
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
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

    const transformedItems = items.map((item) => ({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          description: item.description?.substring(0, 100) || '',
          images: [item.image],
        },
      },
    }));

    // Get the host from environment or default to localhost
    const host = process.env.HOST || 'http://localhost:3000';

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
              amount: 599,
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
                value: 7,
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
        itemIds: JSON.stringify(items.map(item => ({
          id: item.id,
          title: item.title.substring(0, 50)
        })))
      },
    });

    console.log('Stripe session created:', session.id);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: {
        message: error.message || 'An error occurred during checkout',
        type: error.type || 'UnknownError',
        code: error.code || 500,
      },
    });
  }
}