const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../db.js");

dotenv.config();

const router = express.Router();

router.post("/api/token/refresh", async function (req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res
            .status(401)
            .json({ success: false, error: "리프레시 토큰이 필요합니다." });

    try {
        const user = await pool.query(
            `SELECT * FROM users WHERE refresh_token = $1`,
            [refreshToken]
        );

        if (user.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: "유효하지 않은 리프레시 토큰입니다.",
            });
        }

        const dbUser = user.rows[0];

        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            function (error, decode) {
                if (error)
                    return res.status(403).json({
                        success: false,
                        error: "유효하지 않은 리프레시 토큰입니다.",
                    });

                const newAccessToken = jwt.sign(
                    { id: dbUser.id },
                    process.env.JWT_TOKEN,
                    {
                        expiresIn: "1h",
                    }
                );

                res.json({ accessToken: newAccessToken });
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "토큰 갱신 중 오류가 발생했습니다.",
        });
    }
});

export default router;
