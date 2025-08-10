import { useState } from "react";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderFormProps {
  onSubmit: (customerInfo: CustomerInfo) => void;
  totalPrice: string;
}

export default function OrderForm({ onSubmit, totalPrice }: OrderFormProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(customerInfo);
    // Reset form
    setCustomerInfo({ name: "", email: "", phone: "", address: "" });
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Delivery Information
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={customerInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={customerInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Delivery Address"
            value={customerInfo.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-20 resize-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          Place Order - ${totalPrice}
        </button>
      </form>
    </div>
  );
}
