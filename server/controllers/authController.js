const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "customer",
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    let isMatch = false;
    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const secret = process.env.JWT_SECRET || "fallback_super_secret_key_12345";
    const token = jwt.sign(
      { userId: user._id, role: user.role || "customer", username: user.username },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role || "customer" },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };

