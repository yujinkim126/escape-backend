require("dotenv").config(); // .env 파일을 로드

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL 연결
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Swagger 설정
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Escape Room API",
      version: "1.0.0",
    },
  },
  apis: ["./index.js"], // Swagger 문서를 자동으로 생성할 파일
});

// Swagger UI 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /theme:
 *   get:
 *     description: Get all themes
 *     responses:
 *       200:
 *         description: A list of themes
 */
app.get("/theme", (req, res) => {
  db.query("SELECT * FROM themes", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


/**
 * @swagger
 * /themes/{id}:
 *   put:
 *     summary: Update a theme
 *     description: Update an existing theme by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the theme to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: integer
 *               scariness:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Theme updated successfully
 *       404:
 *         description: Theme not found
 */
app.put("/themes/:id", (req, res) => {
  const { id } = req.params;
  const { title, location, description, difficulty, scariness } = req.body;

  const sql = `
    UPDATE themes 
    SET title = ?, location = ?, description = ?, difficulty = ?, scariness = ? 
    WHERE id = ?
  `;
  const values = [title, location, description, difficulty, scariness, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "해당 ID의 테마가 없습니다." });
    }
    res.json({ message: "테마 업데이트 완료" });
  });
});



/**
 * @swagger
 * /theme:
 *   post:
 *     description: Add a new theme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: integer
 *               scariness:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Theme added successfully
 */
app.post("/theme", (req, res) => {
  const { title, location, description, difficulty, scariness } = req.body;
  const sql =
    "INSERT INTO themes (title, location, description, difficulty, scariness) VALUES (?, ?, ?, ?, ?)";
  const values = [title, location, description, difficulty, scariness];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({
      message: "테마 등록 완료",
      insertedId: result.insertId,
    });
  });
});

/**
 * @swagger
 * /themes/{id}:
 *   delete:
 *     description: Delete a theme by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theme deleted successfully
 *       404:
 *         description: Theme not found
 */
app.delete("/themes/:id", (req, res) => {
  const themeId = req.params.id;

  const sql = "DELETE FROM themes WHERE id = ?";
  db.query(sql, [themeId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "테마를 찾을 수 없습니다." });
    }
    res.json({ message: "테마 삭제 완료" });
  });
});


// 서버 실행
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
