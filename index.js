require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const themeRoutes = require("./routes/themeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger 설정
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Escape Room API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Swagger 문서를 자동 생성할 경로
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우팅
app.use("/api", themeRoutes);

// 서버 실행
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
