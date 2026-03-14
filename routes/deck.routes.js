const router = require("expres").Router();
const Deck = require("../models/Deck.model");

// deck creation 

// GET /user/decks(home page )
router.get("/user/decks",  async (req, res,) =>{
    
//console.log(req.body);
const { name, archetype , likes}   = req.body;


})

// deck validation 

//deck deletion



/* 

GET /user/decks
POST /user/decks (create deck)
PATCH /user/decks/:deckId/name (rename)
DELETE /user/decks/:deckId (delete deck)
POST /user/decks/:deckId/favourite
PATCH /user/decks/:deckid/archetype



*/