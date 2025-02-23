const express = require("express");
const pool = require("./db.js");
const app = express();
const bcrypt = require("bcryptjs");
const login = require("./auth/auth.js");
const cors = require("cors");
const multer = require("multer");
const refreshToken = require("./auth/refresh.js");
const path = require("node:path");
const fs = require("fs");

app.use(
    cors({
        origin: "http://localhost:5174",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(
            "../client/public/feeds/images",
            req.body.userId,
            req.body.feedId
        );
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, dir);
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

app.get("/", function (req, res) {
    res.send("Welcome!");
});

app.post("/api/accounts/login", login);

app.post("/api/token/refresh", refreshToken);

app.post("/api/accounts/signup", async function (req, res) {
    const { id, password, username, nickname } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (id, hashed_password, username, nickname) VALUES ($1, $2, $3, $4) RETURNING id, username, nickname",
            [id, hashedPassword, username, nickname]
        );

        res.status(201).json({
            success: true,
            id: newUser.rows[0].id,
            username: newUser.rows[0].username,
            nickname: newUser.rows[0].nickname,
        });
    } catch (error) {
        res.status(500).json({
            message: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
        });
        console.log(error);
    }
});

app.post("/api/accounts/validate", async function (req, res) {
    const { name, value } = req.body.params;
    if (name === "id" || name === "nickname") {
        let message;
        let item;

        if (name === "id") {
            message = "다른 계정에서 동일한 이메일 주소를 사용 중입니다.";
            item = name.toLowerCase();
        }
        if (name === "nickname") {
            message = "이 사용자 이름은 이미 다른 사람이 사용하고 있습니다.";
            item = name.toLowerCase();
        }

        const query = `SELECT * FROM users WHERE ${item} = $1`;

        pool.query(query, [value]).then((result) => {
            if (result.rows.length > 0) {
                res.status(201).json({
                    success: false,
                    name: name,
                    message,
                });
            } else {
                res.status(201).json({
                    success: true,
                    name: name,
                    message: "중복 없음.",
                });
            }
        });
    }
});

app.post("/api/feed/post", upload.array("files"), async function (req, res) {
    try {
        const { userId, feedId, text } = req.body;

        await pool.query(
            "INSERT INTO feeds (id, user_id, content) VALUES ($1, $2, $3)",
            [feedId, userId, text]
        );

        const filePromises = req.files.map(async (file) => {
            const fileName = file.originalname;

            let filePath = file.path
                .replace(/\\/g, "/") // 윈도우 경로 구분자를 '/'로 변환
                .replace(/^.*\/client\/public\//, ""); // '../client/public/' 부분 제거

            await pool.query(
                "INSERT INTO feedImages (id, user_id, feed_id, file_name, file_path) VALUES ($1, $2, $3, $4, $5)",
                [`${feedId}-${fileName}`, userId, feedId, fileName, filePath]
            );
        });

        await Promise.all(filePromises);

        res.json({ success: true, message: "게시물이 업로드되었습니다." });
    } catch (error) {
        console.error("Error saving feed:", error);
        res.status(500).json({
            success: false,
            message: "게시물 업로드 중 오류가 발생했습니다.",
        });
    }
});

app.get("/api/feed/get", async function (req, res) {
    const { userId } = req.query;
    try {
        const result = await pool.query(
            `SELECT 
                f.id AS feed_id,
                f.user_id AS author_id,
                u.username AS author_name,
                f.content,
                f.created_at AS feed_created_at,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'file_path', fi.file_path,
                            'file_name', fi.file_name
                        )
                    ) FILTER (WHERE fi.file_path IS NOT NULL),
                    '[]'
                ) AS images
            FROM feeds f
            JOIN follows fo ON fo.following_id = f.user_id
            JOIN users u ON u.id = f.user_id 
            LEFT JOIN feedImages fi ON fi.feed_id = f.id
            WHERE fo.follower_id = $1
            GROUP BY f.id, f.user_id, u.username, f.content, f.created_at
            ORDER BY f.created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            feedInfo: result.rows,
        });
    } catch (error) {
        console.log(error);
    }
});

app.post("/api/follow/post", async function (req, res) {
    const { followerId, followingId } = req.body;
    try {
        const existingFollow = await pool.query(
            "SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2",
            [followerId, followingId]
        );

        if (existingFollow.rowCount > 0) {
            return { success: false, message: "이미 팔로우 중입니다." };
        }

        await pool.query(
            "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
            [followerId, followingId]
        );

        return { success: true, message: "팔로우 성공" };
    } catch (error) {
        console.error("팔로우 오류:", error);
        return { success: false, message: "팔로우 중 오류가 발생했습니다." };
    }
});

app.listen(5000, function () {
    console.log("server is running...");
});
