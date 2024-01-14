import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { check, validationResult } from "express-validator";
import {User} from "../interfaces/user.inerface";

const router = express.Router();

const validateRegistration = [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('email').isEmail().withMessage('Invalid email address'),
];

// Register new user
router.post('/register', validateRegistration, async (req: Request, res: Response) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email } = req.body;

        // Check if the username or email is already taken
        db.get<User>('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (_err, row) => {
            if (_err) {
                return console.error(_err.message);
            }
            const existingUser = row;

            if (existingUser) {
                return res.status(400).json({ error: 'Username or email already taken' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            const result = await new Promise<{ lastID: number }>((resolve, reject) => {
                db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ lastID: this.lastID });
                    }
                });
            });

            res.json({ message: 'User registered successfully', value: {
                    userId: result.lastID
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const validateLogin = [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
];

// Login as an existing user
router.post('/login', validateLogin, async (req: Request, res: Response) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Check if the user exists
        db.get<User>('SELECT * FROM users WHERE username = ?', [username], async (_err, row: User) => {
            if (_err) {
                return console.error(_err.message);
            }
            const user = row;

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Check if the password is correct
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Create a JWT token for authentication
            const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
            const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });

            res.json({
                message: 'Login successful',
                value: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;