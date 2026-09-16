import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.js";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import versionRoutes from "./routes/versionRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Existing API routes
app.use("/api/auth", authRoutes);

app.use(
  "/api/contracts",
  contractRoutes
);

app.use(
  "/api/contracts",
  reportRoutes
);

app.use(
  "/api/versions",
  versionRoutes
);

app.use(
  "/api/analyze",
  analysisRoutes
);

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Contract Analysis server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Database connection failed:",
      error
    );
  });