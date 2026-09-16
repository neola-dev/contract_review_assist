import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  findUserById,
  createUser,
} from "../dao/userDao.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "24h",
    }
  );
};

export const registerUser = async ({
  name,
  email,
  password,
  company,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error(
      "An account with this email already exists."
    );
    error.statusCode = 409;
    error.code = "duplicate_email";
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    company: company || "",
  });

  const token = generateToken(newUser);

  return {
    token,
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    const error = new Error("Incorrect email or password.");
    error.statusCode = 401;
    error.code = "invalid_credentials";
    throw error;
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!validPassword) {
    const error = new Error("Incorrect email or password.");
    error.statusCode = 401;
    error.code = "invalid_credentials";
    throw error;
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      company: user.company,
    },
  };
};

export const getCurrentUser = async (userId) => {
  return await findUserById(userId);
};