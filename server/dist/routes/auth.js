"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const validateRegistration = [
    (0, express_validator_1.check)('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Invalid email address'),
];
// Register new user
router.post('/register', validateRegistration, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password, email } = req.body;
        // Check if the username or email is already taken
        db_1.default.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (_err, row) => __awaiter(void 0, void 0, void 0, function* () {
            if (_err) {
                return console.error(_err.message);
            }
            const existingUser = row;
            if (existingUser) {
                return res.status(400).json({ error: 'Username or email already taken' });
            }
            // Hash the password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Insert the new user into the database
            const result = yield new Promise((resolve, reject) => {
                db_1.default.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({ lastID: this.lastID });
                    }
                });
            });
            res.json({ message: 'User registered successfully', value: {
                    userId: result.lastID
                }
            });
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
const validateLogin = [
    (0, express_validator_1.check)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required'),
];
// Login as an existing user
router.post('/login', validateLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        // Check if the user exists
        db_1.default.get('SELECT * FROM users WHERE username = ?', [username], (_err, row) => __awaiter(void 0, void 0, void 0, function* () {
            if (_err) {
                return console.error(_err.message);
            }
            const user = row;
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            // Check if the password is correct
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            // Create a JWT token for authentication
            const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
            const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });
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
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
