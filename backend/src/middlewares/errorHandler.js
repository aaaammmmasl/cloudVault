module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};
``