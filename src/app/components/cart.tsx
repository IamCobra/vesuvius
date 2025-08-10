interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  getTotalPrice: () => string;
}

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  getTotalPrice,
}: CartProps) {
  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-600 text-center py-4">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="space-y-4 mb-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{item.image}</span>
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <span className="text-orange-600">${item.price}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300"
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700 ml-2"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right">
        <span className="text-xl font-bold">Total: ${getTotalPrice()}</span>
      </div>
    </div>
  );
}
