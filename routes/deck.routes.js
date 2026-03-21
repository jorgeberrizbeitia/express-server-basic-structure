const router = require("express").Router();
const Deck = require("../models/Deck.model");
const User = require("../models/User.model");
const Card = require("../models/Card.model");
const verifyToken = require("../middlewares/auth.middlewares.js");

// GET /api/user/decks — get all decks for logged in user
router.get("/user/decks", verifyToken, async (req, res, next) => {
  try {
    const decks = await Deck.find({ owner: req.payload._id });
    res.status(200).json(decks);
  } catch (error) {
    next(error);
  }
});

// POST /api/user/decks — create a new deck
router.post("/user/decks", verifyToken, async (req, res, next) => {
  try {
    const { name, archetype } = req.body;

    if (!name) {
      return res.status(400).json({ errorMessage: "Deck name is required" });
    }

    const newDeck = await Deck.create({
      name,
      archetype: archetype || "Unknown",
      owner: req.payload._id,
    });

    res.status(201).json(newDeck);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/user/decks/:deckId/name — rename a deck
router.patch("/user/decks/:deckId/name", verifyToken, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ errorMessage: "New name is required" });
    }

    const deck = await Deck.findOneAndUpdate(
      { _id: req.params.deckId, owner: req.payload._id },
      { name },
      { new: true }
    );

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/user/decks/:deckId/archetype — update archetype
router.patch("/user/decks/:deckId/archetype", verifyToken, async (req, res, next) => {
  try {
    const { archetype } = req.body;

    if (!archetype) {
      return res.status(400).json({ errorMessage: "Archetype is required" });
    }

    const deck = await Deck.findOneAndUpdate(
      { _id: req.params.deckId, owner: req.payload._id },
      { archetype },
      { new: true }
    );

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/user/decks/:deckId — delete a deck
router.delete("/user/decks/:deckId", verifyToken, async (req, res, next) => {
  try {
    const deck = await Deck.findOneAndDelete({
      _id: req.params.deckId,
      owner: req.payload._id,
    });

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    res.status(200).json({ message: "Deck deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// POST /api/user/decks/:deckId/favourite — toggle favourite
router.post("/user/decks/:deckId/favourite", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    const deckId = req.params.deckId;

    const isFavourited = user.favouriteDeckCollection.includes(deckId);

    if (isFavourited) {
      // remove from favourites
      await User.findByIdAndUpdate(req.payload._id, {
        $pull: { favouriteDeckCollection: deckId },
      });
      return res.status(200).json({ message: "Removed from favourites" });
    } else {
      // add to favourites
      await User.findByIdAndUpdate(req.payload._id, {
        $push: { favouriteDeckCollection: deckId },
      });
      return res.status(200).json({ message: "Added to favourites" });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/user/decks/:deckId/cards — remove a card from a deck
router.delete("/user/decks/:deckId/cards", verifyToken, async (req, res, next) => {
  try {
    const { cardId } = req.body;

    const deck = await Deck.findOne({ _id: req.params.deckId, owner: req.payload._id });

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    const cardIndex = deck.cards.indexOf(cardId);

    if (cardIndex === -1) {
      return res.status(404).json({ errorMessage: "Card not found in deck" });
    }

    // remove only one copy
    deck.cards.splice(cardIndex, 1);
    await deck.save();

    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
});

// POST /api/user/decks/:deckId/cards — add a card to a deck
router.post("/user/decks/:deckId/cards", verifyToken, async (req, res, next) => {
  try {
    const { cardId } = req.body;

    const deck = await Deck.findOne({ _id: req.params.deckId, owner: req.payload._id });

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    // count how many times this card is already in the deck
    const cardCount = deck.cards.filter(id => id === cardId).length;

    if (cardCount >= 5) {
      return res.status(400).json({ errorMessage: "You can only have 5 copies of the same card in a deck" });
    }

    deck.cards.push(cardId);
    await deck.save();

    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
});

// GET /api/decks — public deck search with filters
router.get("/decks", async (req, res, next) => {
  try {
    const { archetype, name, sortByLikes } = req.query;

    const filters = {};
    if (archetype) filters.archetype = archetype;
    if (name) filters.name = { $regex: name, $options: "i" };

    let query = Deck.find(filters).populate("owner", "name");

    if (sortByLikes === "true") {
      query = query.sort({ likes: -1 });
    }

    const decks = await query;
    res.status(200).json(decks);
  } catch (error) {
    next(error);
  }
});

// GET /api/user/decks/:deckId — get a single deck with full card details
router.get("/user/decks/:deckId", verifyToken, async (req, res, next) => {
  try {
    const deck = await Deck.findOne({
      _id: req.params.deckId,
      owner: req.payload._id,
    });

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    // fetch full card details for each card id in the deck
    const cards = await Card.find({ id: { $in: deck.cards } });

    res.status(200).json({ ...deck.toObject(), cardDetails: cards });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/user/decks/:deckId/valid — toggle valid flag on deck
router.patch("/user/decks/:deckId/valid", verifyToken, async (req, res, next) => {
  try {
    const deck = await Deck.findOne({
      _id: req.params.deckId,
      owner: req.payload._id,
    });

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    deck.valid = !deck.valid;
    await deck.save();

    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
});


// POST /api/decks/:deckId/like — toggle like on a deck (1 like per user)
router.post("/decks/:deckId/like", verifyToken, async (req, res, next) => {
  try {
    const deck = await Deck.findById(req.params.deckId);

    if (!deck) {
      return res.status(404).json({ errorMessage: "Deck not found" });
    }

    const user = await User.findById(req.payload._id);

    const alreadyLiked = user.favouriteDeckCollection.includes(req.params.deckId);

    if (alreadyLiked) {
      // unlike
      await User.findByIdAndUpdate(req.payload._id, {
        $pull: { favouriteDeckCollection: req.params.deckId },
      });
      deck.likes -= 1;
    } else {
      // like
      await User.findByIdAndUpdate(req.payload._id, {
        $push: { favouriteDeckCollection: req.params.deckId },
      });
      deck.likes += 1;
    }

    await deck.save();

    res.status(200).json({ likes: deck.likes, liked: !alreadyLiked });
  } catch (error) {
    next(error);
  }
});
module.exports = router;