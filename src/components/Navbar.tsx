"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { loginUser, logoutUser } from "../redux/userSlice";
import axios from "axios";

export default function Navbar() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token && !user.isLoggedIn) {
        try {
          const res = await axios.get("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(loginUser(res.data));
        } catch (err) {
          console.log("Invalid token or user fetch failed");
        }
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex flex-wrap justify-between items-center shadow">
      <div className="text-xl font-bold mb-2 sm:mb-0">
        <Link href="/">Deep Sutariya</Link>
      </div>

      <div className="flex flex-wrap gap-4 items-center text-sm">
        <Link href="/">Products</Link>
        <Link href="/orders">Orders</Link>

        {user?.isLoggedIn && user.role === "admin" ? (
          <Link href="/products">Products</Link>
        ) : user?.isLoggedIn ? (
          <Link href="/cart">Cart</Link>
        ) : null}

        {!user.isLoggedIn ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="text-green-400 font-semibold">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
