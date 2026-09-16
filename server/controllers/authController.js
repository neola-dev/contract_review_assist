import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "missing_fields",
        message: "Name, email, and password are required.",
      });
    }

    const result = await registerUser({
      name,
      email,
      password,
      company,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode === 409
          ? error.message
          : "Registration failed.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "missing_fields",
        message: "Email and password are required.",
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    return res.json(result);
  } catch (error) {
    console.error("Login error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.code || "server_error",
      message:
        error.statusCode === 401
          ? error.message
          : "Login failed.",
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "not_found",
        message: "User not found.",
      });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        company: user.company,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      error: "server_error",
      message: "Failed to get user.",
    });
  }
};