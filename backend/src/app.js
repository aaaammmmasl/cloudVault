const express = require("express");
const cors = require("cors");
const filesRouter = require("./routes/files");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/files", filesRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;