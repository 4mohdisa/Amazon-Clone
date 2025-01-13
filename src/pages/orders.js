import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from '../components/Header';
import Order from '../components/Order';

function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const ordersRef = collection(db, 'users', user.uid, 'orders');
        const q = query(
          ordersRef,
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(userOrders);
        setLoading(false);
      } else {
        router.push('/auth/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      <Header />

      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-lg">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg mb-4">No orders found</p>
            <button
              onClick={() => router.push('/')}
              className="button"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl mb-4">{orders.length} Order(s)</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <Order key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
