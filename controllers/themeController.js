// controllers/themeController.js
const db = require("../config/db");
const { sendSuccess, sendError } = require("../utils/response");

exports.getThemes = (req, res) => {
  db.query("SELECT * FROM themes", (err, results) => {
    if (err) return sendError(res, 500, "DB 조회 실패", "DB_ERROR");
    sendSuccess(res, 200, "전체 테마 조회 성공", results);
  });
};

exports.createTheme = (req, res) => {
  const { title, location, description, difficulty, scariness } = req.body;

  if (!title || typeof title !== "string") {
    return sendError(
      res,
      400,
      "요청 파라미터 형식이 올바르지 않습니다.",
      "INVALID_PARAMETER_FORMAT",
      {
        field: "title",
      }
    );
  }

  if (typeof difficulty !== "number") {
    return sendError(
      res,
      400,
      "요청 파라미터 형식이 올바르지 않습니다.",
      "INVALID_PARAMETER_FORMAT",
      {
        field: "difficulty",
      }
    );
  }

  const sql = `INSERT INTO themes (title, location, description, difficulty, scariness) VALUES (?, ?, ?, ?, ?)`;
  const values = [title, location, description, difficulty, scariness];

  db.query(sql, values, (err, result) => {
    if (err) return sendError(res, 500, "테마 등록 실패", "DB_ERROR");
    sendSuccess(res, 201, "테마 등록 완료", { insertedId: result.insertId });
  });
};

exports.updateTheme = (req, res) => {
  const { id } = req.params;
  const { title, location, description, difficulty, scariness } = req.body;

  if (!id || isNaN(Number(id))) {
    return sendError(
      res,
      400,
      "요청 파라미터 형식이 올바르지 않습니다.",
      "INVALID_PARAMETER_FORMAT",
      {
        field: "id",
      }
    );
  }

  const sql = `
    UPDATE themes
    SET title = ?, location = ?, description = ?, difficulty = ?, scariness = ?
    WHERE id = ?
  `;
  const values = [title, location, description, difficulty, scariness, id];

  db.query(sql, values, (err, result) => {
    if (err) return sendError(res, 500, "테마 수정 실패", "DB_ERROR");
    if (result.affectedRows === 0) {
      return sendError(
        res,
        404,
        "해당 ID의 테마가 없습니다",
        "THEME_NOT_FOUND"
      );
    }
    sendSuccess(res, 200, "테마 업데이트 완료", { updatedId: id });
  });
};

exports.deleteTheme = (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return sendError(
      res,
      400,
      "요청 파라미터 형식이 올바르지 않습니다.",
      "INVALID_PARAMETER_FORMAT",
      {
        field: "id",
      }
    );
  }

  const sql = "DELETE FROM themes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return sendError(res, 500, "테마 삭제 실패", "DB_ERROR");
    if (result.affectedRows === 0) {
      return sendError(
        res,
        404,
        "해당 테마를 찾을 수 없습니다",
        "THEME_NOT_FOUND"
      );
    }
    sendSuccess(res, 200, "테마 삭제 완료", { deletedId: id });
  });
};
