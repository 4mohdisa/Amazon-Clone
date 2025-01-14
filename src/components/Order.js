import moment from 'moment';
import Currency from 'react-currency-formatter';

function Order({ id, amount, amountShipping, items, timestamp, images, status }) {
  return (
    <div className="relative border rounded-md">
      <div className="flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600">
        <div>
          <p className="font-bold text-xs">ORDER PLACED</p>
          <p>{moment.unix(timestamp).format('DD MMM YYYY')}</p>
        </div>

        <div>
          <p className="text-xs font-bold">TOTAL</p>
          <p>
            <Currency quantity={amount} currency="USD" /> - Next Day Delivery{" "}
            <Currency quantity={amountShipping} currency="USD" />
          </p>
        </div>

        <div className="text-sm whitespace-nowrap sm:text-xl self-end flex-1 text-right">
          <p className="font-bold">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
          <p className="text-sm text-blue-500">#{id.slice(-8)}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex space-x-6 overflow-x-auto">
          {images.map((image, i) => (
            <img 
              key={i} 
              src={image} 
              alt={`Order item ${i + 1}`}
              className="h-20 object-contain sm:h-32"
            />
          ))}
        </div>

        {/* Order Status */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-600">Status</p>
          <div className="mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold
              ${status === 'processing' ? 'bg-blue-100 text-blue-800' :
                status === 'shipped' ? 'bg-green-100 text-green-800' :
                status === 'delivered' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Items List */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">Items in this order</p>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-sm">
                <div className="flex-shrink-0 w-12 h-12">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{item.title}</p>
                  <p className="text-gray-500">
                    <Currency quantity={item.price} currency="USD" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
