import moment from 'moment';
import Currency from 'react-currency-formatter';

function Order({ order }) {
  return (
    <div className="relative border rounded-md">
      <div className="flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600">
        <div>
          <p className="font-bold text-xs">ORDER PLACED</p>
          <p>{moment.unix(order.timestamp).format('DD MMM YYYY')}</p>
        </div>

        <div>
          <p className="text-xs font-bold">TOTAL</p>
          <p>
            <Currency quantity={order.amount} currency="AUD" /> - Next Day Delivery{' '}
            <Currency quantity={order.shipping_cost} currency="AUD" />
          </p>
        </div>

        <div className="text-sm whitespace-nowrap sm:text-xl self-end flex-1 text-right text-blue-500">
          {order.items.length} items
        </div>

        <p className="absolute top-2 right-2 w-40 lg:w-72 truncate text-xs whitespace-nowrap">
          ORDER # {order.id}
        </p>
      </div>

      <div className="p-5 sm:p-10">
        <div className="flex space-x-6 overflow-x-auto">
          {order.items.map((item) => (
            <div key={item.id} className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="h-20 object-contain sm:h-32"
              />
              <div className="absolute bottom-0 right-0 text-xs text-white bg-gray-900 px-2 py-1 rounded">
                <Currency quantity={item.price} currency="AUD" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Order;
