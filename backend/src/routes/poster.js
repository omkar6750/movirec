import dotenv from "dotenv";
import { Router } from "express";
import axios from "axios";

dotenv.config();

const OMDB_API_KEY_real = process.env.OMDB_API_KEY;
const router = Router()
router.get('/:imdbId', async (req, res) => {
        const { imdbId } = req.params;

        if (!imdbId) {
                return res.status(400).send("Missing IMDb ID");
        }

        try {

                const formattedId = `tt${imdbId}`;

                const omdbUrl = `http://www.omdbapi.com/?i=${formattedId}&apikey=${OMDB_API_KEY_real}`;
                const response = await axios.get(omdbUrl);
                const data = response.data;

                if (data.Poster && data.Poster !== "N/A") {

                        return res.redirect(data.Poster);
                } else {
                        return res.redirect(`${process.env.FRONTEND_URL}/placeholder.jpg`);
                }

        } catch (error) {
                console.error("OMDb Error:", error.message);
                return res.redirect(`${process.env.FRONTEND_URL}/placeholder.jpg`);
        }
});

export default router;

