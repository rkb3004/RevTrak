"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields required' });
    }
    try {
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const result = await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role', [name, email, hashed, role]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
