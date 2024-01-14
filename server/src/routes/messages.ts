import express from "express";
import db from '../db';

const router = express.Router();

router.get('/all', async (req, res) => {
    const query = `
    SELECT messages.id, messages.text, messages.time, users.username AS author
    FROM messages
    INNER JOIN users ON messages.author = users.id
  `;

    db.all(query, (err, messages) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ messages });
    });
})

export default router;