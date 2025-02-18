const jwt = require("jsonwebtoken");

function authenticateToken(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res
            .status(401)
            .json({ success: false, error: "인증 토큰이 필요합니다." });

    jwt.verify(token, process.env.JWT_SECRET, function (error, user) {
        if (error) {
            return res
                .status(403)
                .json({ success: false, error: "유효하지 않은 토큰입니다." });
        }

        req.user = user;
        next();
    });
}

export default authenticateToken;
