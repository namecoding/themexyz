import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    sales: { type: Number, default: 0 }
});

export default mongoose.models.Theme || mongoose.model('Theme', ThemeSchema);

