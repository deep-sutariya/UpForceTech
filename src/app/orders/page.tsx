"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

type ProductSnapshot = {
  _id: string;
  name: string;
  category?: string;
  description?: string;
  image?: string;
  price: number;
  qty: number;
};

type Order = {
  _id: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  deliveryDate: string;
  status: string;
  products: ProductSnapshot[];
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const user = useAppSelector((state) => state.user);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/order", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data);
    } catch (err: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`/api/order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // setOrders((prev) => prev.filter((o) => o._id !== id));
      fetchOrders();
      toast.success("Order cancelled successfully");
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      <h1 className="text-3xl font-bold my-6">My Orders</h1>

      {user.isLoggedIn && orders.length > 0 && (
        <div className="absolute top-12 right-6 bg-gray-100 px-4 py-2 rounded shadow text-sm font-medium text-gray-700">
          Total Active Expenses: ₹
          {orders
            .filter((o) => o.status === "active")
            .reduce((acc, curr) => acc + curr.totalAmount, 0)}
        </div>
      )}

      {!user || !user.isLoggedIn ? (
        <p>
          Please{" "}
          <Link href="/login" className="underline text-blue-400">
            Login
          </Link>{" "}
          first
        </p>
      ) : loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg mb-6 shadow-sm p-5 bg-white"
          >
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold text-lg">Order ID: {order._id}</p>
                <p className="text-gray-500" suppressHydrationWarning>
                  Placed On: {mounted && format(new Date(order.createdAt), "dd MMM yyyy")}
                </p>
                <p className="text-gray-500" suppressHydrationWarning>
                  Delivery By:{" "}
                  {mounted && format(new Date(order.deliveryDate), "dd MMM yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status:</p>
                <p
                  className={`font-bold ${
                    order.status === "active"
                      ? "text-blue-600"
                      : order.status === "delivered"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {order.status.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {order.products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-contain rounded"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{product.price} × {product.qty}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-700">
                    ₹{product.price * product.qty}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod.toUpperCase()}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>
            </div>

            {order.status === "active" && (
              <button
                onClick={() => deleteOrder(order._id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
