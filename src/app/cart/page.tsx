"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { incrementQty, decrementQty } from "@/redux/cartSlice";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { clearCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [showCheckout, setShowCheckout] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const totalAmount = cartItems.reduce(
    (acc: any, item: any) => acc + item.qty * item.price,
    0
  );

  const onSubmitOrder = async (data: any) => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    const orderPayload = {
      products: cartItems,
      address: data.address,
      paymentMethod: data.payment,
      deliveryDate: deliveryDate.toISOString(),
      totalAmount: totalAmount,
    };

    try {
      const res = await axios.post("/api/order", orderPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Order placed successfully!");
      setShowCheckout(false);
      dispatch(clearCart());
      router.push("/orders");
    } catch (err) {
      console.error("Order placement failed", err);

      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="p-6 w-full lg:w-10/12 flex flex-col items-center justify-center gap-y-16 mx-auto">
      <h1 className="text-3xl font-bold my-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 w-full md:w-1/3">
            {cartItems.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div>
                    <div className="font-medium text-lg">{item.name}</div>
                    <div className="text-gray-600">₹{item.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(decrementQty(item._id))}
                    className="border px-2 rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => dispatch(incrementQty(item._id))}
                    className="border px-2 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right ml-auto w-full md:w-1/3">
            <p className="text-lg font-semibold">Total: ₹{totalAmount}</p>
            {user && user.isLoggedIn ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-3"
              >
                Place Order
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-3"
              >
                Login to Order
              </button>
            )}
          </div>
        </>
      )}

      {showCheckout && (
        <form
          onSubmit={handleSubmit(onSubmitOrder)}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg p-6 rounded w-full max-w-md z-20"
        >
          <div onClick={() => setShowCheckout(false)} className="w-full mb-4">
            <p className="cursor-pointer font-extrabold text-lg tracking-widest text-gray-500 float-right">
              X
            </p>
          </div>
          <h2 className="text-xl font-bold mb-4">Enter Delivery Details</h2>
          <textarea
            {...register("address", { required: true })}
            placeholder="Enter full delivery address"
            className="border p-2 rounded w-full mb-4"
            rows={4}
          />

          <select
            {...register("payment", { required: true })}
            className="border p-2 rounded w-full mb-4"
          >
            <option value="">Select Payment Method</option>
            <option value="cod">Cash on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              className="border px-4 py-2 rounded text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Confirm Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
