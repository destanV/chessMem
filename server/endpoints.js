const express = require("express");
const { Pool }  = require("pg");
const router = express.Router();

//pgsql settings
const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});
//test
router.get("/", (req,res)=>{
    res.json({message: "testing chessMem API"});
});

router.get("/positions/random", async(req,res) => {
    try{
        const { difficulty } = req.query;
        const diffMap = {
            "0": "easy",
            "1": "hard"
        };
        const dbDifficulty = diffMap[difficulty] || "easy";

        const query = "SELECT fen FROM chess_puzzles WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 1";
        const result = await pool.query(query, [dbDifficulty]);
        if(result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).json({error: "No data"});
        }

    }
    catch(error){
            console.error("Query error",error);
            res.status(500).json({error: error.message});
    }
}
);
module.exports = router;
