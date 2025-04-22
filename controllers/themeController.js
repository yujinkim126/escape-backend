// controllers/themeController.js
const db = require("../config/db");
const s3 = require("../config/s3");
const { sendSuccess, sendError } = require("../utils/response");
const { v4: uuidv4 } = require("uuid"); // npm install uuid 필요

exports.getThemes = (req, res) => {
  db.query("SELECT * FROM themes", (err, results) => {
    if (err) return sendError(res, 500, "DB 조회 실패", "DB_ERROR");
    sendSuccess(res, 200, "전체 테마 조회 성공", results);
  });
};

exports.createTheme = async (req, res) => {
  try {
    const { title, location, description, difficulty, scariness } = req.body;
    const file = req.file;

    if (!file) {
      return sendError(res, 400, "이미지 파일이 필요합니다.", "MISSING_IMAGE");
    }

    const s3Key = `themes/${uuidv4()}_${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const s3Result = await s3.upload(params).promise();
    const imageUrl = s3Result.Location;

    const sql = `INSERT INTO themes (title, location, description, difficulty, scariness, image_url)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      title,
      location,
      description,
      difficulty,
      scariness,
      imageUrl,
    ];

    db.query(sql, values, (err, result) => {
      if (err) return sendError(res, 500, "테마 등록 실패", "DB_ERROR");

      sendSuccess(res, 201, "테마 등록 완료", {
        insertedId: result.insertId,
        image_url: imageUrl,
      });
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "서버 내부 오류", "INTERNAL_SERVER_ERROR");
  }
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
