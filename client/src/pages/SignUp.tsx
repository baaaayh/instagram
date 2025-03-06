import { memo } from "react";
import { Link } from "react-router-dom";
import BigLogo from "@/components/BigLogo";
import SignUpForm from "@/components/SignUpForm";
import styles from "@/assets/styles/Form.module.scss";

export default memo(function SignUp() {
    return (
        <div className="form-page">
            <div className="form-page__inner">
                <div className="form-container">
                    <div className={styles["form"]}>
                        <div className={styles["form__inner"]}>
                            <BigLogo />
                            <div className={styles["form__hr"]}>
                                <span>또는</span>
                            </div>
                            <SignUpForm />
                            <div
                                className={`${styles["form__link"]} ${styles["form__link--mt15"]}`}
                            >
                                <p>
                                    저희 서비스를 이용하는 사람이 회원님의
                                    연락처 정보를 Instagram에 업로드했을 수도
                                    있습니다.
                                    <Link to="/accounts/password/reset">
                                        더 알아보기
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles["form"]}>
                        계정이 있으신가요?
                        <Link to="/accounts/login">로그인</Link>
                    </div>
                </div>
            </div>
        </div>
    );
});
