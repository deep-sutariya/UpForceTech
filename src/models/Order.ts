import mongoose from 'mongoose';

const productSnapshotSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [productSnapshotSchema],
      required: true,
    },
    address: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'upi'],
      default: 'cod',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'delivered', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);