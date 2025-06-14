'use client';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post('/api/register', data);
      setMessage('Registration successful!');
      router.push("/login");
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 shadow-md p-6 rounded-lg w-2/3 my-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register("name")} placeholder="Name" className="border p-2 rounded" />
        <input {...register("email")} placeholder="Email" className="border p-2 rounded" />
        <input {...register("mobile")} placeholder="Mobile" className="border p-2 rounded" />
        <input {...register("password")} type="password" placeholder="Password" className="border p-2 rounded" />
        <select {...register("role")} className="border p-2 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded cursor-pointer">Register</button>
      </form>
      {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
    </div>
  );
}
