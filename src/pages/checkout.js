import React, { useState, useEffect } from 'react'
import Header from "../components/Header";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from '../components/CheckoutProduct';
import Currency from "react-currency-formatter";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import { auth } from '../firebase';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(process.env.stripe_public_key)

function Checkout() {
  const router = useRouter();
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const createCheckoutSession = async () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    try {
      setLoading(true);
      const stripe = await stripePromise;

      // Call backend to create a checkout session...
      const checkoutSession = await axios.post('/api/create-checkout-session', {
        items: items,
        email: user.email,
      });

      // Redirect user/customer to stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 h-screen">
        <Header />
        <main className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-center p-10">
            <div className="text-center">
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Amazon Basket is empty"
                : "Shopping Basket"}
            </h1>

            {items.map((item, i) => (
              <CheckoutProduct
                key={i}
                id={item.id}
                title={item.title}
                rating={item.rating}
                price={item.price}
                description={item.description}
                category={item.category}
                image={item.image}
                hasPrime={item.hasPrime}
              />
            ))}
          </div>
        </div>

        {/* Right */}
        {items.length > 0 && (
          <div className="flex flex-col bg-white p-10 shadow-md">
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  <Currency quantity={total} currency="AUD" />
                </span>
              </h2>

              <button
                role="link"
                onClick={createCheckoutSession}
                disabled={!user || loading}
                className={`button mt-2 ${
                  (!user || loading) &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing..." : !user ? "Sign in to checkout" : "Proceed to checkout"}
              </button>
            </>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;