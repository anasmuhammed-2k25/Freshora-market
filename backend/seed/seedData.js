// seed/seedData.js
// This file automatically inserts default products into MongoDB when the server starts.
// If products already exist, it skips seeding so we don't get duplicates.

const Product = require("../models/Product");
const User = require("../models/User");

const defaultProducts = [
  {
    name: "Apple",
    description: "Fresh and crispy red apples, perfect for snacking",
    price: 150,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
  },
  {
    name: "Banana",
    description: "Rich in potassium, naturally sweet and energy-boosting",
    price: 75,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
  },
  {
    name: "Orange",
    description: "Packed with vitamin C, juicy and refreshing",
    price: 200,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
  },
  {
    name: "Grapes",
    description: "Sweet and juicy seedless grapes, great for snacking",
    price: 250,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1506802913710-8b73f96bd3e3?w=400&h=300&fit=crop",
  },
  {
    name: "Strawberry",
    description: "Delicious red berries, rich in antioxidants",
    price: 300,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop",
  },
  {
    name: "Carrot",
    description: "Healthy and crunchy, great for eyes and immunity",
    price: 100,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop",
  },
  {
    name: "Broccoli",
    description: "Nutrient-rich greens, high in fiber and vitamins",
    price: 175,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop",
  },
  {
    name: "Lettuce",
    description: "Crisp and fresh, ideal for salads and wraps",
    price: 120,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
  },
  {
    name: "Tomato",
    description: "Versatile and flavorful, perfect for cooking and salads",
    price: 180,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=300&fit=crop",
  },
  {
    name: "Cucumber",
    description: "Cool and hydrating, low calorie and refreshing",
    price: 130,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop",
  },
  {
    name: "Watermelon",
    description: "Sweet and hydrating, perfect for summer",
    price: 350,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&h=300&fit=crop",
  },
  {
    name: "Mango",
    description: "King of fruits, sweet and tropical",
    price: 400,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1553279768-865429fd81ce?w=400&h=300&fit=crop",
  },
  {
    name: "Spinach",
    description: "Fresh green leaves packed with iron and vitamins",
    price: 80,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
  },
  {
    name: "Potato",
    description: "Versatile root vegetable, staple for many dishes",
    price: 60,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
  },
  {
    name: "Blueberries",
    description: "Plump, sweet, and bursting with antioxidant power",
    price: 350,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop",
  },
  {
    name: "Avocado",
    description: "Creamy Hass avocados, rich in healthy fats and nutrients",
    price: 280,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop",
  },
  {
    name: "Garlic",
    description: "Fragrant organic garlic bulbs to season and elevate your dishes",
    price: 90,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400&h=300&fit=crop",
  },
  {
    name: "Onion",
    description: "Sweet and crisp red onions, freshly harvested from the fields",
    price: 70,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1508747703725-719ae257c84a?w=400&h=300&fit=crop",
  },
  {
    name: "Peach",
    description: "Juicy and velvety organic peaches, rich in natural vitamins",
    price: 220,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1595124250248-b1186b3f7fdb?w=400&h=300&fit=crop",
  },
  {
    name: "Cherry",
    description: "Dark red sweet cherries, bursting with refreshing summer flavor",
    price: 450,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop",
  },
];


const seedProducts = async () => {
  try {
    // Check how many products already exist in the database
    const count = await Product.countDocuments();

    // Only seed if no products exist — preserves any admin changes (adds/deletes)
    if (count === 0) {
      await Product.insertMany(defaultProducts);
      console.log("✅ Database seeded with default products!");
    } else {
      console.log(`ℹ️ Skipping seed — ${count} products already exist in database.`);
    }

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const admin = new User({
        username: "admin",
        password: "password123",
        role: "admin"
      });
      await admin.save();
      console.log("✅ Default Admin User created (admin / password123)");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  }
};

module.exports = seedProducts;
