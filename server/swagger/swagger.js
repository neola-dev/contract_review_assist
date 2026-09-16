import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "AI Contract Review Assistant API",
      version: "1.0.0",
      description:
        "REST API for contract management, AI-powered contract analysis, risk assessment, version management, and executive report generation.",
    },

    servers: [
      {
        url: "http://localhost:3001",
        description: "Local development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f123456789abcdef123456",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
          },
        },

        Contract: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f123456789abcdef123456",
            },
            userId: {
              type: "string",
              example: "64f123456789abcdef654321",
            },
            title: {
              type: "string",
              example: "Employment Agreement",
            },
            contractType: {
              type: "string",
              example: "Employment Agreement",
            },
            currentVersionId: {
              type: "string",
              nullable: true,
              example: "64f123456789abcdef999999",
            },
            latestVersionNumber: {
              type: "integer",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ContractVersion: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f123456789abcdef999999",
            },
            contractId: {
              type: "string",
              example: "64f123456789abcdef123456",
            },
            versionNumber: {
              type: "integer",
              example: 1,
            },
            fileName: {
              type: "string",
              example: "employment-agreement.pdf",
            },
            uploadedAt: {
              type: "string",
              format: "date-time",
            },
            riskScore: {
              type: "number",
              example: 25,
            },
            riskLevel: {
              type: "string",
              example: "Low",
            },
          },
        },

        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "not_found",
            },
            message: {
              type: "string",
              example: "Contract not found.",
            },
          },
        },
      },

      responses: {
        Unauthorized: {
          description: "Authentication token is missing.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        Forbidden: {
          description: "Authentication token is invalid or expired.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        NotFound: {
          description: "Requested resource was not found.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        ServerError: {
          description: "Internal server error.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },

    tags: [
      {
        name: "Authentication",
        description: "User registration and authentication",
      },
      {
        name: "Contracts",
        description: "Contract management APIs",
      },
      {
        name: "Versions",
        description: "Contract version management APIs",
      },
      {
        name: "Analysis",
        description: "AI-powered contract analysis APIs",
      },
      {
        name: "Reports",
        description: "Executive contract report APIs",
      },
    ],

    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: {
                      type: "string",
                      example: "John Doe",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "Password@123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully.",
            },
            400: {
              description: "Invalid or missing registration data.",
            },
            409: {
              description: "User already exists.",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "Password@123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful.",
            },
            400: {
              description: "Invalid login data.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/contracts": {
        post: {
          tags: ["Contracts"],
          summary: "Create a new contract",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: {
                      type: "string",
                      example: "Employment Agreement",
                    },
                    contractType: {
                      type: "string",
                      example: "Employment Agreement",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Contract created successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      contract: {
                        $ref: "#/components/schemas/Contract",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Contract title is missing or invalid.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },

        get: {
          tags: ["Contracts"],
          summary: "Get all contracts for the authenticated user",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "List of contracts.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Contract",
                    },
                  },
                },
              },
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/contracts/{id}": {
        get: {
          tags: ["Contracts"],
          summary: "Get a specific contract",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "MongoDB contract ID",
            },
          ],
          responses: {
            200: {
              description: "Contract details.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Contract",
                  },
                },
              },
            },
            400: {
              description: "Invalid contract ID.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            404: {
              $ref: "#/components/responses/NotFound",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },

        delete: {
          tags: ["Contracts"],
          summary: "Delete a contract",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "MongoDB contract ID",
            },
          ],
          responses: {
            200: {
              description: "Contract deleted successfully.",
            },
            400: {
              description: "Invalid contract ID.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            404: {
              $ref: "#/components/responses/NotFound",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/contracts/{id}/versions": {
        get: {
          tags: ["Versions"],
          summary: "Get all versions of a contract",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "MongoDB contract ID",
            },
          ],
          responses: {
            200: {
              description: "Contract versions.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ContractVersion",
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid contract ID.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            404: {
              $ref: "#/components/responses/NotFound",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/versions/{id}": {
        get: {
          tags: ["Versions"],
          summary: "Get a specific contract version",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "MongoDB contract version ID",
            },
          ],
          responses: {
            200: {
              description: "Contract version details.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ContractVersion",
                  },
                },
              },
            },
            400: {
              description: "Invalid version ID.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            404: {
              $ref: "#/components/responses/NotFound",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/analyze": {
        post: {
          tags: ["Analysis"],
          summary: "Analyze a contract using AI",
          description:
            "Uploads a contract PDF and performs AI-powered contract analysis. A contractId may optionally be provided to associate the analysis with an existing contract.",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                      description: "Contract PDF file",
                    },
                    contractId: {
                      type: "string",
                      description:
                        "Optional existing contract ID",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Contract analyzed successfully.",
            },
            400: {
              description: "Invalid request or missing file.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            403: {
              $ref: "#/components/responses/Forbidden",
            },
            404: {
              $ref: "#/components/responses/NotFound",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/contracts/{id}/analysis": {
        get: {
          tags: ["Analysis"],
          summary: "Get current contract analysis",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "MongoDB contract ID",
            },
          ],
          responses: {
            200: {
              description: "Current contract analysis.",
            },
            400: {
              description: "Invalid contract ID.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            404: {
              $ref: "#/components/responses/NotFound",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },

      "/api/contracts/{id}/report": {
        get: {
          tags: ["Reports"],
          summary: "Generate executive contract report",
          description:
            "Generates a PDF executive report from the latest available AI contract analysis.",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "MongoDB contract ID",
            },
          ],
          responses: {
            200: {
              description:
                "Executive contract report generated successfully.",
              content: {
                "application/pdf": {
                  schema: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
            400: {
              description: "Invalid contract ID.",
            },
            401: {
              $ref: "#/components/responses/Unauthorized",
            },
            403: {
              $ref: "#/components/responses/Forbidden",
            },
            404: {
              description:
                "Contract not found or no analysis available.",
            },
            500: {
              $ref: "#/components/responses/ServerError",
            },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;