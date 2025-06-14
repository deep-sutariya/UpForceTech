"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post("/api/login", data);
      const { success, token, user } = res.data;

      localStorage.setItem("token", token);

      dispatch(loginUser(user));
      setMessage("Login successful!");
      router.push("/");
    } catch (err: any) {
      console.log(err);

      setMessage("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 shadow-md p-6 rounded-lg w-2/3 my-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded cursor-pointer"
        >
          Login
        </button>
      </form>
      {message && (
        <p className="text-center mt-4 text-sm text-red-500/70 font-bold">
          {message}
        </p>
      )}
    </div>
  );
}
