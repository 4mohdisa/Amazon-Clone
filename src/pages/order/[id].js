import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import Header from '../../components/Header';
import OrderItem from '../../components/OrderItem';
import moment from 'moment';
import Currency from 'react-currency-formatter';

function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const orderRef = doc(db, 'users', user.email, 'orders', id);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error loading order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="max-w-screen-lg mx-auto p-10">
          <div className="flex items-center justify-center">
            <p>Loading order details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="max-w-screen-lg mx-auto p-10">
          <div className="flex flex-col items-center justify-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push('/orders')}
              className="button"
            >
              Back to Orders
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-3xl">Order Details</h1>
          <p className="text-sm text-gray-500">
            Order # {order?.id}
          </p>
        </div>

        {order && (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <h3 className="font-bold mb-2">Order Date</h3>
                <p>{moment.unix(order.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Order Total</h3>
                <p><Currency quantity={order.amount} currency="AUD" /></p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Shipping Cost</h3>
                <p><Currency quantity={order.shipping_cost} currency="AUD" /></p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Items</h3>
                <p>{order.items.length} items</p>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <OrderItem key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default OrderDetail;
