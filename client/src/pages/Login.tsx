import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import BigLogo from "@/components/BigLogo";
import styles from "@/assets/styles/Form.module.scss";

export default function Login() {
    const [text, setText] = useState("");

    return (
        <div className="form-page">
            <div className="form-page__inner">
                <div className="form-container">
                    <div className={styles["form"]}>
                        <div className={styles["form__inner"]}>
                            <BigLogo />
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: "10px",
                                    color: "red",
                                }}
                            >
                                user / asdf11!!
                            </div>
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: "10px",
                                    color: "red",
                                }}
                            >
                                user1 / asdf11!!
                            </div>
                            <LoginForm setText={setText} />
                            <div className={styles["form__hr"]}>
                                <span>또는</span>
                            </div>
                            <div className={styles["form__red"]}>{text}</div>
                            <div className={styles["form__link"]}>
                                <Link to="/accounts/password/reset">
                                    비밀번호를 잊으셨나요?
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={styles["form"]}>
                        계정이 없으신가요?
                        <Link to="/accounts/signup">가입하기</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
