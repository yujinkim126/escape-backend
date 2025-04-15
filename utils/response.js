// utils/response.js
exports.sendError = (res, status, message, errorCode = null, data = null) => {
  return res.status(status).json({
    status,
    success: false,
    message,
    errorCode,
    data,
  });
};

exports.sendSuccess = (res, status, message, data = {}) => {
  return res.status(status).json({
    status,
    success: true,
    message,
    data,
  });
};
