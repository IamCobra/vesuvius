import Link from "next/link";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  showAddToCart?: boolean;
  onAddToCart?: (item: MenuItem) => void;
}

export default function MenuItemCard({
  item,
  showAddToCart = true,
  onAddToCart,
}: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="text-4xl mb-4 text-center">{item.image}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {item.name}
        </h3>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-burgundy-primary">
            ${item.price}
          </span>
          {showAddToCart &&
            (onAddToCart ? (
              <button
                onClick={() => onAddToCart(item)}
                className="bg-burgundy-primary text-white px-4 py-2 rounded-lg hover:bg-burgundy-dark transition-colors"
              >
                Tilføj
              </button>
            ) : (
              <Link
                href="/order"
                className="bg-burgundy-primary text-white px-4 py-2 rounded-lg hover:bg-burgundy-dark transition-colors"
              >
                Tilføj
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
