import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./models/Place.js";

dotenv.config();

const seedData = [
  {
    name: "Trendy Café",
    location: { lat: 24.7136, lng: 46.6753 },
    category: "Cafe",
    popularItems: ["Latte", "Croissant", "Espresso"],
    images: ["https://placehold.co/600x400?text=Trendy+Cafe"],
  },
  {
    name: "Hot Burger Spot",
    location: { lat: 24.7200, lng: 46.6800 },
    category: "Restaurant",
    popularItems: ["Cheeseburger", "Fries", "Milkshake"],
    images: ["https://placehold.co/600x400?text=Hot+Burger"],
  },
  {
    name: "Chill Lounge",
    location: { lat: 24.7300, lng: 46.6900 },
    category: "Lounge",
    popularItems: ["Mocktails", "Shisha", "Nachos"],
    images: ["https://placehold.co/600x400?text=Chill+Lounge"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tiktok_places", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected...");

    await Place.deleteMany(); // مسح البيانات القديمة
    await Place.insertMany(seedData); // إضافة البيانات الجديدة

    console.log("🌱 Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
    mongoose.connection.close();
  }
};

seedDB();
