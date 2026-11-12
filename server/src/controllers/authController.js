import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { signToken } from "../config/auth.js";

export async function login(req, res) {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ username: user.username, fullName: user.full_name });
    res.json({ token, user: { username: user.username, fullName: user.full_namev } });
}

export async function me(req, res) {
    res.json({ user: req.user });
}

export async function listUsers(req, res) {
    res.json({ users: await User.all() });
}

