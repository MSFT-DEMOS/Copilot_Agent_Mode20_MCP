import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartSubtotal } = useCart();

  const discountRate = 0.05;
  const shipping = 10;
  const subtotal = getCartSubtotal();
  const discount = subtotal * discountRate;
  const grandTotal = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-dark pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-gray-900 rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full text-light text-center">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-4">S. No.</th>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-gray-400">Your cart is empty.</td>
                </tr>
              ) : (
                cart.map((item, idx) => (
                  <tr key={item.productId} className="border-b border-gray-800">
                    <td className="py-4">{idx + 1}</td>
                    <td>
                      <img src={`/${item.imgName}`} alt={item.name} className="h-16 mx-auto" />
                    </td>
                    <td className="font-semibold">{item.name}</td>
                    <td>${item.price}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateQuantity(item.productId, Math.max(1, Number(e.target.value)))}
                        className="w-16 text-center bg-gray-700 rounded text-light px-2 py-1"
                      />
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeFromCart(item.productId)} className="text-yellow-300 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Coupon and Update Cart row (optional, for UI parity) */}
          <div className="flex items-center justify-between bg-gray-900 p-4 border-t border-gray-800">
            <input type="text" placeholder="Coupon Code" className="bg-gray-800 text-light px-4 py-2 rounded w-1/2" disabled />
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-accent" disabled>Apply Coupon</button>
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-accent" disabled>Update Cart</button>
          </div>
        </div>
        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-gray-900 rounded-lg shadow-lg p-8 flex flex-col justify-between">
          <h2 className="text-2xl font-bold text-light mb-6 text-center">Order Summery</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-light text-lg">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-yellow-300 text-lg">
              <span>Discount(5%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-light text-lg">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-primary text-xl font-bold border-t border-gray-700 pt-4">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="bg-primary text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-accent transition-colors">Proceed To Checkout</button>
        </div>
      </div>
    </div>
  );
}
