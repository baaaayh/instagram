const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../db.js");

dotenv.config();

async function refreshToken(req, res) {
    const refreshToken = req.headers["x-refresh-token"].split(" ")[1];

    if (!refreshToken) {
        return res
            .status(401)
            .json({ success: false, error: "리프레시 토큰이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
            decoded.id,
        ]);

        const user = result.rows;

        if (user.length === 0) {
            return res.status(403).json({
                success: false,
                error: "유효하지 않은 리프레시 토큰입니다.",
            });
        }

        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (error, decoded) => {
                if (error) {
                    return res.status(403).json({
                        success: false,
                        error: "유효하지 않은 리프레시 토큰입니다.",
                    });
                }

                const newAccessToken = jwt.sign(
                    { id: decoded.id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );

                res.status(200).json({
                    success: true,
                    accessToken: newAccessToken,
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "토큰 갱신 중 오류가 발생했습니다.",
        });
    }
}

module.exports = refreshToken;
