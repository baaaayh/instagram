require("dotenv").config(); // dotenv 호출은 한 번이면 충분합니다.
const { Pool } = require("pg");

// Vercel 및 클라우드 DB 환경을 위한 설정
const pool = new Pool({
  // 개별 항목(host, user 등) 대신 연결 문자열 하나로 관리하는 것이 훨씬 편합니다.
  connectionString: process.env.DATABASE_URL,

  // 중요: Supabase나 Neon 같은 클라우드 DB는 보안상 SSL 연결이 필수입니다.
  ssl: {
    rejectUnauthorized: false, // 자체 서명된 인증서 허용 (서버리스 환경 필수 설정)
  },
});

// 연결 테스트 및 로깅
pool
  .connect()
  .then(() => {
    console.log("PostgreSQL (Supabase) connected via Connection String!");
  })
  .catch((error) => {
    console.error("PostgreSQL connection error: ", error.message);
  });

module.exports = pool;
