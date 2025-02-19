const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const pool = require("../db.js");
dotenv.config();

function generateAccessToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

function getnerateRefreshToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}

async function login(req, res) {
    const { id, password } = req.body.params;

    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
            id,
        ]);

        const user = result.rows[0];

        const validated = await bcrypt.compare(password, user.hashed_password);

        if (!validated) {
            return res
                .status(400)
                .json({ error: "잘못된 비밀번호입니다. 다시 확인하세요." });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = getnerateRefreshToken(user);

        await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
            refreshToken,
            user.id,
        ]);

        res.json({
            success: true,
            message: "정상적으로 로그인되었습니다.",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ error: "로그인 중 오류가 발생했습니다." });
    }
}

module.exports = login;
