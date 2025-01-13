import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";
import { selectItems, selectTotal } from "../slices/basketSlice";
import Currency from "react-currency-formatter";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/router";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function Checkout() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const createCheckoutSession = async () => {
    if (!user) {
      setError("Please sign in to checkout");
      router.push('/auth/signin');
      return;
    }

    if (!items.length) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Failed to initialize Stripe");
      }

      console.log('Creating checkout session with:', {
        items,
        email: user.email
      });

      // Create checkout session
      const response = await axios.post("/api/create-checkout-session", {
        items,
        email: user.email,
      });

      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from server');
      }

      console.log('Checkout session created:', response.data.id);

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.error?.message ||
        err.message ||
        "An error occurred during checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex-grow m-5 shadow-sm">
          <img
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
              <CheckoutProduct key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  <Currency quantity={total} currency="AUD" />
                </span>
              </h2>

              {error && (
                <div className="text-red-500 text-sm mt-2 mb-2">{error}</div>
              )}

              <button
                role="link"
                onClick={createCheckoutSession}
                disabled={!user || loading}
                className={`button mt-2 ${
                  (loading || !user) &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Processing..."
                  : !user
                  ? "Sign in to checkout"
                  : "Proceed to checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;