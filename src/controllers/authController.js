import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists with the provided email
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ message: "user already exists with this email" });
  }

  // Hash the password before storing it in the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user in the database
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate a token (e.g., JWT) for the newly registered user
    const token = generateToken(user.id, res);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists with the provided email
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // verify the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  //generate a token (e.g., JWT) and send it back to the client for authentication
  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      id: user.id,
      email: user.email,
    },
    token,
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Set the cookie to expire immediately
  });
  res
    .status(200)
    .json({ status: "success", message: "User logged out successfully" });
};

export { register, login, logout };
