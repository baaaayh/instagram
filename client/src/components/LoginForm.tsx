import { memo } from "react";
import clsx from "clsx";
import styles from "@/assets/styles/Form.module.scss";

export default memo(function LoginForm({
    userData,
    handleInputChange,
    handleSubmit,
}: {
    userData: { id: string; password: string };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}) {
    return (
        <form onSubmit={handleSubmit}>
            <div className={styles["form__field"]}>
                <div className={styles["form__row"]}>
                    <label htmlFor="userId">
                        <span
                            className={clsx(styles["form__text"], {
                                [styles["form__text--active"]]:
                                    userData.id.length > 0,
                            })}
                        >
                            전화번호, 사용자 이름 또는 이메일
                        </span>
                        <input
                            type="text"
                            name="id"
                            id="userId"
                            value={userData.id}
                            onChange={handleInputChange}
                            className={clsx(styles["form__input"], {
                                [styles["form__input--active"]]:
                                    userData.id.length > 0,
                            })}
                        />
                    </label>
                </div>
                <div className={styles["form__row"]}>
                    <label htmlFor="userPassword">
                        <span
                            className={clsx(styles["form__text"], {
                                [styles["form__text--active"]]:
                                    userData.password.length > 0,
                            })}
                        >
                            비밀번호
                        </span>
                        <input
                            type="password"
                            name="password"
                            id="userPassword"
                            value={userData.password}
                            onChange={handleInputChange}
                            className={clsx(styles["form__input"], {
                                [styles["form__input--active"]]:
                                    userData.password.length > 0,
                            })}
                        />
                    </label>
                </div>
            </div>
            <div className={styles["form__button"]}>
                <button
                    type="submit"
                    className={clsx("btn btn-round btn-round--blue", {
                        ["active"]:
                            userData.password.length >= 6 &&
                            userData.id.length > 0,
                    })}
                >
                    <span>로그인</span>
                </button>
            </div>
        </form>
    );
});
