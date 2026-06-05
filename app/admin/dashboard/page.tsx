"use client";

import { FaDollarSign, FaShoppingCart, FaUsers, FaGem } from "react-icons/fa";

interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function Dashboard() {
  const stats: Stat[] = [
    {
      title: "Total Revenue",
      value: "₹2,45,000",
      icon: <FaDollarSign />,
    },
    {
      title: "Orders",
      value: "1,245",
      icon: <FaShoppingCart />,
    },
    {
      title: "Customers",
      value: "845",
      icon: <FaUsers />,
    },
    {
      title: "Products",
      value: "356",
      icon: <FaGem />,
    },
  ];

  const topProducts: string[] = [
    "Gold Necklace",
    "Diamond Ring",
    "Pearl Earrings",
    "Silver Bracelet",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">{item.title}</h3>

                  <h2 className="mt-2 text-3xl font-bold text-gray-600">
                    {item.value}
                  </h2>
                </div>

                <div className="text-3xl text-yellow-500">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 text-gray-600">
          <div className="h-80 rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Sales Chart</h2>

            <div className="flex h-60 items-center justify-center rounded-lg border">
              Chart Here
            </div>
          </div>

          <div className="h-80 rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Orders Chart</h2>

            <div className="flex h-60 items-center justify-center rounded-lg border">
              Chart Here
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow text-gray-600">
          <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Order ID</th>
                <th className="py-3 text-left">Customer</th>
                <th className="py-3 text-left">Amount</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-3">#1001</td>
                <td>Priya Patel</td>
                <td>₹2,500</td>
                <td>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                    Delivered
                  </span>
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-3">#1002</td>
                <td>Anjali Shah</td>
                <td>₹1,850</td>
                <td>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-600">
                    Processing
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3">#1003</td>
                <td>Riya Desai</td>
                <td>₹3,250</td>
                <td>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                    Shipped
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow text-gray-600">
          <h2 className="mb-4 text-xl font-semibold">Top Selling Products</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topProducts.map((product) => (
              <div key={product} className="rounded-lg border p-4">
                <div className="mb-3 h-40 rounded-lg bg-gray-200" />

                <h3 className="font-semibold">{product}</h3>

                <p className="font-bold text-yellow-600">₹1,999</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
