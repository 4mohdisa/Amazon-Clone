import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, query, orderBy, getDocs, enableNetwork, disableNetwork } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from '../components/Header';
import Order from '../components/Order';
import { onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async (user) => {
      try {
        console.log('Fetching orders for user:', user.email);
        setLoading(true);
        setError(null);

        // Try to enable network
        try {
          await enableNetwork(db);
          setIsOffline(false);
        } catch (networkError) {
          console.warn('Network connection failed:', networkError);
          setIsOffline(true);
        }

        const ordersRef = collection(db, 'users', user.email, 'orders');
        const ordersQuery = query(ordersRef, orderBy('timestamp', 'desc'));
        
        const querySnapshot = await getDocs(ordersQuery);
        console.log('Found orders:', querySnapshot.size);

        const userOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Processing order:', doc.id, data);
          
          // Handle different timestamp formats
          let timestamp = data.timestamp;
          if (timestamp?.seconds) {
            timestamp = timestamp.seconds;
          } else if (timestamp?.toDate) {
            timestamp = moment(timestamp.toDate()).unix();
          } else {
            timestamp = moment().unix();
          }

          return {
            id: doc.id,
            ...data,
            timestamp,
          };
        });

        console.log('Processed orders:', userOrders);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.code === 'unavailable') {
          setError('Unable to connect to the server. Please check your internet connection.');
          setIsOffline(true);
          // Try to use offline persistence
          try {
            await disableNetwork(db);
            const offlineSnapshot = await getDocs(ordersQuery);
            const offlineOrders = offlineSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.seconds || moment().unix(),
            }));
            setOrders(offlineOrders);
            setError(null);
          } catch (offlineError) {
            console.error('Offline mode failed:', offlineError);
            setError('Unable to load orders. Please try again later.');
          }
        } else {
          setError('Failed to fetch your orders. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('No user found, redirecting to signin');
        router.push('/auth/signin');
        return;
      }

      console.log('User authenticated:', user.email);
      await fetchOrders(user);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      <Header />

      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
          {isOffline && (
            <span className="text-sm text-yellow-600 ml-2">(Offline Mode)</span>
          )}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500 text-lg">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="button mt-4"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No orders found</p>
            <button
              onClick={() => router.push('/')}
              className="button mt-4"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <p>{orders.length} Orders</p>
            <div className="mt-5 space-y-4">
              {orders.map(order => (
                <Order
                  key={order.id}
                  id={order.id}
                  amount={order.amount}
                  amountShipping={order.amount_shipping}
                  items={order.items}
                  timestamp={order.timestamp}
                  images={order.images}
                  status={order.status}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
