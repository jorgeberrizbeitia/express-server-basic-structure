const router = require("express").Router();
const Card = require("../models/Card.model");
const verifyToken = require("../middlewares/auth.middlewares.js");
const verifyAdmin = require("../middlewares/admin.middleware.js");

// GET /api/cards — get all cards with optional filters
router.get("/cards", verifyToken, async (req, res, next) => {
  try {
    const { faction, type, rarity } = req.query;

    const filters = {};
    if (faction) filters.faction = faction;
    if (type) filters.type = type;
    if (rarity) filters.rarity = rarity;

    const cards = await Card.find(filters);
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
});

// GET /api/cards/:cardId — get a single card 
router.get("/cards/:cardId", verifyToken, async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return res.status(404).json({ errorMessage: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
});

// POST /api/cards — add a card (admin only, Bruno only)
router.post("/cards", verifyAdmin, async (req, res, next) => {
  try {
    const { id, set, name, faction, type, rarity, buildCost, buildSpeed, fragmentRate, integrity, processingSpeed, text, image } = req.body;

    if (
      id === undefined || !set || !name || !faction || 
      !type || !rarity || buildCost === undefined || 
      buildSpeed === undefined || fragmentRate === undefined || 
      integrity === undefined || processingSpeed === undefined || !text
    ) {
      return res.status(400).json({ errorMessage: "All fields are required" });
    }

    const newCard = await Card.create({
      id, set, name, faction, type, rarity,
      buildCost, buildSpeed, fragmentRate,
      integrity, processingSpeed, text,
      image: image || ""
    });

    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cards/:cardId — delete a card (admin only, Bruno only)
router.delete("/cards/:cardId", verifyAdmin, async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);

    if (!card) {
      return res.status(404).json({ errorMessage: "Card not found" });
    }

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;