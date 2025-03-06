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
            req.body.userNickName,
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
        const { userNickName, feedId, textAreaValue } = req.body;

        await pool.query(
            "INSERT INTO feeds (id, user_nickname, content) VALUES ($1, $2, $3)",
            [feedId, userNickName, textAreaValue]
        );

        const filePromises = req.files.map(async (file) => {
            const fileName = file.originalname;

            let filePath = file.path
                .replace(/\\/g, "/") // 윈도우 경로 구분자를 '/'로 변환
                .replace(/^.*\/client\/public\//, ""); // '../client/public/' 부분 제거

            await pool.query(
                "INSERT INTO feedImages (id, user_nickname, feed_id, file_name, file_path) VALUES ($1, $2, $3, $4, $5)",
                [
                    `${feedId}-${fileName}`,
                    userNickName,
                    feedId,
                    fileName,
                    filePath,
                ]
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
    const { userNickName } = req.query;

    try {
        const result = await pool.query(
            `SELECT 
                f.id AS feed_id,
                f.user_nickname AS user_nickname,
                u.username AS user_name,
                u.nickname AS nickname,
                u.profile_image,
                f.content,
                f.created_at AS feed_created_at,
                EXTRACT(EPOCH FROM (NOW() - f.created_at)) AS time_diff_seconds,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'file_path', fi.file_path,
                            'file_name', fi.file_name
                        ) ORDER BY fi.created_at ASC  -- 최신 업로드된 이미지가 먼저 오도록 정렬
                    ) FILTER (WHERE fi.file_path IS NOT NULL),
                    '[]'
                ) AS images,
                -- 댓글 정보를 서브쿼리로 분리
                (
                    SELECT COALESCE(JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'comment_id', c.id,
                            'user_nickname', c.user_nickname,
                            'parent_comment_id', c.parent_comment_id,
                            'comment', c.content,
                            'created_at', c.created_at,
                            'user_name', cu.username
                        )
                        ORDER BY c.created_at ASC
                    ), '[]')
                    FROM comments c
                    LEFT JOIN users cu ON cu.nickname = c.user_nickname
                    WHERE c.feed_id = f.id
                ) AS comments,
                CASE 
                    WHEN l.user_nickname IS NOT NULL THEN true 
                    ELSE false 
                END AS is_liked,
                COUNT(DISTINCT lt.user_nickname) AS like_count
            FROM feeds f
            JOIN follows fo ON fo.following_nickname = f.user_nickname
            JOIN users u ON u.nickname = f.user_nickname
            LEFT JOIN feedImages fi ON fi.feed_id = f.id
            LEFT JOIN likes l ON l.feed_id = f.id AND l.user_nickname = $1
            LEFT JOIN likes lt ON lt.feed_id = f.id
            WHERE fo.follower_nickname = $1
            GROUP BY f.id, f.user_nickname, u.username, u.nickname, u.profile_image, f.content, f.created_at, l.user_nickname
            ORDER BY f.created_at DESC;`,
            [userNickName]
        );

        res.json({
            success: true,
            feedInfo: result.rows,
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/feed/:id", async function (req, res) {
    const { id } = req.params;
    const { userNickName } = req.query;
    try {
        const result = await pool.query(
            `SELECT 
                f.id AS feed_id,
                f.user_nickname AS user_nickname,
                u.username AS user_name,
                u.nickname AS nickname,
                u.profile_image,
                f.content,
                f.created_at AS feed_created_at,
                EXTRACT(EPOCH FROM (NOW() - f.created_at)) AS time_diff_seconds,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'file_path', fi.file_path,
                            'file_name', fi.file_name
                        )
                        ORDER BY fi.created_at ASC -- 최신 이미지가 먼저 오도록 정렬
                    ) FILTER (WHERE fi.file_path IS NOT NULL),
                    '[]'
                ) AS images
                ,
                -- 댓글 정보
                (
                    SELECT COALESCE(JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'comment_id', c.id,
                            'user_nickname', c.user_nickname,
                            'parent_comment_id', c.parent_comment_id,
                            'comment', c.content,
                            'created_at', c.created_at,
                            'user_name', cu.username,
                            'user_id', cu.id,
                            'user_nickname', cu.nickname,
                            'profile_image', cu.profile_image,
                            'intro', cu.intro
                        )
                        ORDER BY c.created_at DESC  -- 최신 댓글이 위로 오도록 정렬
                    ), '[]')
                    FROM comments c
                    LEFT JOIN users cu ON cu.nickname = c.user_nickname
                    WHERE c.feed_id = f.id
                ) AS comments,
                -- 좋아요 여부 체크
                COUNT(l.user_nickname) > 0 AS is_liked,
                COUNT(DISTINCT lt.user_nickname) AS like_count
            FROM feeds f
            JOIN users u ON u.nickname = f.user_nickname
            LEFT JOIN feedImages fi ON fi.feed_id = f.id
            LEFT JOIN likes l ON l.feed_id = f.id AND l.user_nickname = $2
            LEFT JOIN likes lt ON lt.feed_id = f.id
            WHERE f.id = $1
            GROUP BY f.id, f.user_nickname, u.username, u.nickname, u.profile_image, f.content, f.created_at;`,
            [id, userNickName]
        );

        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "피드를 찾을 수 없습니다." });
        }

        res.json({
            success: true,
            feedInfo: result.rows[0],
        });
    } catch (error) {
        console.error("피드 조회 오류:", error);
        res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
});

app.post("/api/comment/post", upload.none(), async function (req, res) {
    const { feed_id, user_nickname, parent_comment_id, comment } = req.body;

    try {
        const parentCommentId = parent_comment_id ? parent_comment_id : null;
        const id = `${feed_id}-${user_nickname}-${Date.now()}`;
        await pool.query(
            "INSERT INTO comments (id, feed_id, user_nickname, parent_comment_id, content) VALUES ($1, $2, $3, $4, $5)",
            [id, feed_id, user_nickname, parentCommentId, comment]
        );

        res.json({ success: true, message: "댓글 업로드 성공" });
    } catch (error) {
        console.log(error);
    }
});

app.post("/api/follow/post", async function (req, res) {
    const { isFollow, userNickName, nickName } = req.body.params;

    try {
        const existingFollow = await pool.query(
            "SELECT 1 FROM follows WHERE follower_nickname = $1 AND following_nickname = $2",
            [userNickName, nickName]
        );

        if (existingFollow.rowCount > 0) {
            return res.json({
                success: false,
                message: "이미 팔로우 중입니다.",
            });
        }

        await pool.query(
            "INSERT INTO follows (follower_nickname, following_nickname) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userNickName, nickName]
        );

        res.json({ success: true, message: "팔로우 성공", isFollow });
    } catch (error) {
        console.error("팔로우 오류:", error);
        res.status(500).json({
            success: false,
            message: "팔로우 중 오류가 발생했습니다.",
        });
    }
});

app.post("/api/follow/delete", async function (req, res) {
    const { isFollow, userNickName, nickName } = req.body.params;

    try {
        await pool.query(
            "DELETE FROM follows WHERE follower_nickname = $1 AND following_nickname = $2",
            [userNickName, nickName]
        );
        res.json({ success: true, message: "팔로우 취소 성공", isFollow });
    } catch (error) {
        console.error("팔로우 오류:", error);
    }
});

app.post("/api/feed/like", async function (req, res) {
    const { feedId, userNickName } = req.body.params;

    try {
        // 좋아요 추가
        await pool.query(
            "INSERT INTO likes (user_nickname, feed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userNickName, feedId]
        );

        // 현재 좋아요 상태 확인
        const isLikedResult = await pool.query(
            "SELECT COUNT(*) > 0 AS is_liked FROM likes WHERE user_nickname = $1 AND feed_id = $2",
            [userNickName, feedId]
        );

        const isLiked = isLikedResult.rows[0].is_liked;

        // 좋아요 수 카운트
        const likeCountResult = await pool.query(
            "SELECT COUNT(*) AS like_count FROM likes WHERE feed_id = $1",
            [feedId]
        );

        const likeCount = parseInt(likeCountResult.rows[0].like_count, 10);

        res.json({
            success: true,
            is_liked: isLiked,
            like_count: likeCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
});

app.post("/api/feed/unlike", async function (req, res) {
    const { feedId, userNickName } = req.body.params;

    try {
        // 좋아요 삭제
        await pool.query(
            "DELETE FROM likes WHERE user_nickname = $1 AND feed_id = $2",
            [userNickName, feedId]
        );

        // 현재 좋아요 상태 확인
        const isLikedResult = await pool.query(
            "SELECT COUNT(*) > 0 AS is_liked FROM likes WHERE user_nickname = $1 AND feed_id = $2",
            [userNickName, feedId]
        );

        const isLiked = isLikedResult.rows[0].is_liked;

        // 좋아요 수 카운트
        const likeCountResult = await pool.query(
            "SELECT COUNT(*) AS like_count FROM likes WHERE feed_id = $1",
            [feedId]
        );

        const likeCount = parseInt(likeCountResult.rows[0].like_count, 10);

        res.json({
            success: true,
            is_liked: isLiked,
            like_count: likeCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
});

app.post("/api/user", async function (req, res) {
    const { nickName, userNickName } = req.body.params;

    try {
        const result = await pool.query(
            `SELECT 
                u.nickname, 
                u.profile_image, 
                u.intro, 
                f.id AS feed_id,
                f.content,
                f.created_at,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'file_path', fi.file_path,
                            'file_name', fi.file_name
                        )
                        ORDER BY fi.created_at ASC  -- 이미지 업로드 순서대로 정렬 (최초 입력이 처음으로)
                    ) FILTER (WHERE fi.file_path IS NOT NULL),
                    '[]'
                ) AS images,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM follows 
                        WHERE follows.follower_nickname = $2 AND follows.following_nickname = u.nickname
                    ) THEN true
                    ELSE false
                END AS is_following,
                (SELECT COUNT(*) 
                 FROM follows f2 
                 WHERE f2.following_nickname = u.nickname) AS follower_count,
                (SELECT COUNT(*) 
                 FROM follows f3 
                 WHERE f3.follower_nickname = u.nickname) AS following_count,
                -- 댓글 관련 추가
                COALESCE(
                    JSONB_AGG(
                        JSONB_BUILD_OBJECT(
                            'comment_id', c.id,
                            'user_nickname', c.user_nickname,
                            'parent_comment_id', c.parent_comment_id,
                            'comment', c.content,
                            'created_at', c.created_at,
                            'user_name', cu.username
                        )
                    ) FILTER (WHERE c.id IS NOT NULL),
                    '[]'
                ) AS comments
            FROM users u
            LEFT JOIN feeds f ON u.nickname = f.user_nickname
            LEFT JOIN feedImages fi ON f.id = fi.feed_id
            LEFT JOIN comments c ON f.id = c.feed_id -- 댓글 정보 조인
            LEFT JOIN users cu ON cu.nickname = c.user_nickname -- 댓글 작성자 정보 조인
            WHERE u.nickname = $1
            GROUP BY u.nickname, u.profile_image, u.intro, f.id, f.content, f.created_at
            ORDER BY f.created_at DESC;`,
            [nickName, userNickName]
        );

        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const user = {
            id: result.rows[0].user_id,
            username: result.rows[0].username,
            nickname: result.rows[0].nickname,
            profile_image: result.rows[0].profile_image,
            is_following: result.rows[0].is_following,
            feeds: result.rows
                .filter((row) => row.feed_id !== null)
                .map((row) => ({
                    feed_id: row.feed_id,
                    content: row.content,
                    created_at: row.created_at,
                    images: row.images,
                    comments: row.comments,
                })),
            followers: Number(result.rows[0].follower_count),
            followings: Number(result.rows[0].following_count),
            intro: result.rows[0].intro,
        };

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

app.get("/api/user/recommend", async function (req, res) {
    const userNickName = req.query.userNickName;

    try {
        const result = await pool.query(
            `SELECT 
                u.id, 
                u.username, 
                u.nickname, 
                u.profile_image, 
                u.intro,
                CASE 
                    WHEN f.following_nickname IS NOT NULL THEN true 
                    ELSE false 
                END AS is_following
            FROM users u
            LEFT JOIN follows f 
                ON f.following_nickname = u.nickname 
                AND f.follower_nickname = $1
            WHERE u.nickname <> $1  -- 본인 제외
            ORDER BY u.id  -- 순서 유지
            LIMIT 5`,
            [userNickName]
        );

        res.json({
            success: true,
            users: result.rows,
        });
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({
            success: false,
            message: "서버 오류가 발생했습니다.",
        });
    }
});

app.post("/api/search", async function (req, res) {
    const { searchValue } = req.body.params;

    try {
        const query = `
            SELECT username, nickname, profile_image, intro FROM users
            WHERE nickname ILIKE $1
            ORDER BY nickname ASC;
        `;

        const values = [`%${searchValue}%`];

        const result = await pool.query(query, values);
        const data = result.rows;

        res.json({
            success: true,
            searchData: data,
        });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/explore", async function (req, res) {
    const { userNickName } = req.query.userNickName;
    try {
        const feedQuery = `
            SELECT 
                f.id AS feed_id,
                f.content,
                u.nickname,
                u.profile_image,
                u.intro,
                -- 팔로워 수 계산
                (SELECT COUNT(*) FROM follows WHERE following_nickname = u.nickname) AS followers,
                -- 팔로잉 수 계산
                (SELECT COUNT(*) FROM follows WHERE follower_nickname = u.nickname) AS followings,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'file_path', fi.file_path,
                            'file_name', fi.file_name
                        ) ORDER BY fi.created_at ASC  -- 최신 업로드된 이미지가 먼저 오도록 정렬
                    ) FILTER (WHERE fi.file_path IS NOT NULL),
                    '[]'
                ) AS images,
                -- 팔로우 여부 확인
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM follows 
                        WHERE follower_nickname = $1 AND following_nickname = u.nickname
                    ) THEN true
                    ELSE false
                END AS is_following
            FROM feeds f
            JOIN users u ON f.user_nickname = u.nickname
            LEFT JOIN feedImages fi ON f.id = fi.feed_id  -- 피드와 관련된 이미지 정보 조인
            GROUP BY f.id, u.nickname, u.profile_image, u.intro
            ORDER BY RANDOM()
            LIMIT 12;
        `;

        const result = await pool.query(feedQuery, [userNickName]); // 사용자 닉네임을 쿼리에 전달합니다.

        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "No feeds found" });
        }

        const feeds = result.rows.map((feed) => ({
            feed_id: feed.feed_id,
            text: feed.content,
            user: {
                nickname: feed.nickname,
                profile_image: feed.profile_image,
                intro: feed.intro,
                followers: feed.followers, // 팔로워 수
                followings: feed.followings, // 팔로잉 수
            },
            images: feed.images, // 피드의 이미지 배열
            is_following: feed.is_following, // 팔로우 여부
        }));

        res.json({
            success: true,
            feeds, // 랜덤으로 가져온 피드와 그 사용자 정보 반환
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

app.listen(5000, function () {
    console.log("server is running...");
});
