// routes/themeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getThemes,
  createTheme,
  updateTheme,
  deleteTheme,
} = require("../controllers/themeController");

/**
 * @swagger
 * /api/theme:
 *   get:
 *     description: Get all themes
 *     responses:
 *       200:
 *         description: A list of themes
 */
router.get("/theme", getThemes);

/**
 * @swagger
 * /api/theme:
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
router.post("/theme", createTheme);

/**
 * @swagger
 * /api/themes/{id}:
 *   put:
 *     description: Update a theme by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 */
router.put("/themes/:id", updateTheme);

/**
 * @swagger
 * /api/themes/{id}:
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
 */
router.delete("/themes/:id", deleteTheme);

module.exports = router;
