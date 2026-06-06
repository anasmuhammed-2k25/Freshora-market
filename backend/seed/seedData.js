
const Product = require("../models/Product");
const User = require("../models/User");


const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();

   
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
