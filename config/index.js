const express = require("express");
const logger = require("morgan");
const cors = require("cors");

function config(app) {
  app.set("trust proxy", 1);
  
  app.use(
    cors({
      origin: [process.env.ORIGIN, "http://localhost:5173"],
    })
  );
  
  app.use(logger("dev")); 
  app.use(express.json()); 
  app.use(express.urlencoded({ extended: false }));
};

module.exports = config