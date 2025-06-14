"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart, decrementQty, incrementQty } from "@/redux/cartSlice";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchProducts = async () => {
    const res = await fetch("/api/product");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onAddOrUpdateProduct = async (data: any) => {
    try {
      if (editProduct) {
        await axios.put(`/api/product/${editProduct._id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post("/api/product", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      reset();
      setEditProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save product");
    }
  };

  const handleEdit = (product: any) => {
    setEditProduct(product);
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("category", product.category);
    setValue("description", product.description);
    setValue("image", product.image);
    setValue("stock", product.stock);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    const matchesPrice = priceFilter
      ? priceFilter === "low"
        ? p.price <= 100
        : priceFilter === "mid"
        ? p.price > 100 && p.price <= 500
        : p.price > 500
      : true;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-y-5">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-auto"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded cursor-pointer"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((p: any) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="border p-2 rounded cursor-pointer"
        >
          <option value="">All Prices</option>
          <option value="low">Under ₹100</option>
          <option value="mid">₹100 - ₹500</option>
          <option value="high">Above ₹500</option>
        </select>
      </div>

      {user.role === "admin" && (
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditProduct(null);
              reset();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
          >
            {showForm ? "Cancel" : "Add Product"}
          </button>

          {showForm && (
            <form
              onSubmit={handleSubmit(onAddOrUpdateProduct)}
              className="border p-4 rounded shadow bg-white w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col gap-3"
            >
              <div
                onClick={() => {
                  setShowForm(!showForm);
                  setEditProduct(null);
                  reset();
                }}
                className="w-full "
              >
                <p className="cursor-pointer font-extrabold text-lg tracking-widest text-gray-500 float-right">X</p>
              </div>
              <input {...register("name")} placeholder="Product Name" className="border p-2 rounded" />
              <input {...register("price")} placeholder="Price" className="border p-2 rounded" />
              <input {...register("category")} placeholder="Category" className="border p-2 rounded" />
              <textarea {...register("description")} placeholder="Description" className="border p-2 rounded" />
              <input {...register("stock")} placeholder="Stock" className="border p-2 rounded" />
              <input {...register("image")} placeholder="Image URL" className="border p-2 rounded" />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProducts.map((p: any) => {
          const itemInCart = cart.items.find((item : any) => item._id === p._id);
          return (
            <div key={p._id} className="border p-3 rounded shadow bg-white relative">
              <img src={p.image} className="w-full h-40 object-contain mb-2 rounded" />
              <div className="font-semibold">{p.name}</div>
              <div className="text-gray-600">₹{p.price}</div>
              <div className="text-sm text-gray-500">{p.category}</div>
              <div className="text-sm text-gray-500">{p.description}</div>
              <div className="text-sm text-gray-500">Stock: {p.stock}</div>

              {itemInCart ? (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="bg-gray-200 px-2 rounded cursor-pointer"
                    onClick={() => dispatch(decrementQty(p._id))}
                  >
                    -
                  </button>
                  <span>{itemInCart.qty}</span>
                  <button
                    className="bg-gray-200 px-2 rounded cursor-pointer"
                    onClick={() => dispatch(incrementQty(p._id))}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded cursor-pointer"
                  onClick={() => dispatch(addToCart(p))}
                >
                  Add to Cart
                </button>
              )}

              {user.role === "admin" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-sm text-yellow-600 border border-yellow-600 px-2 py-1 rounded hover:bg-yellow-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-sm text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
