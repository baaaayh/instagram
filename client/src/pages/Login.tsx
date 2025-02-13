import { useState, useReducer, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Footer from "@/components/Footer";
import styles from "@/assets/styles/Login.module.scss";

const initialState = {
    id: "",
    password: "",
};

function validateLoginData({ id, password }: { id: string; password: string }) {
    if (id !== "" && password !== "") {
        if (password.length < 6) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

async function submitLoginData({
    id,
    password,
}: {
    id: string;
    password: string;
}) {
    try {
        const validated = validateLoginData({ id, password });

        if (validated) {
            const response = await axios.post("/api/login", { id, password });
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "An error occurred");
        } else {
            throw new Error("An error occurred");
        }
    }
}

function reducer(
    state: { id: string; password: string },
    action: { name: string; value: string }
) {
    return { ...state, [action.name]: action.value };
}

export default function Login() {
    const [userData, dispatch] = useReducer(reducer, initialState);
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: submitLoginData,
        onSuccess: (data) => {
            if (data.success === true) {
                navigate("/");
            } else {
                setText(data.message);
            }
        },
        onError: (data) => {
            console.log(data);
        },
    });

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({ name: e.target.name, value: e.target.value });
        },
        []
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            mutation.mutate(userData);
        },
        [userData, mutation]
    );

    return (
        <div className={styles["login-page"]}>
            <div className={styles["login-page__inner"]}>
                <div className={styles["login-container"]}>
                    <div className={styles["login"]}>
                        <div className={styles["login__inner"]}>
                            <h1>
                                <span>LOGO</span>
                                인스타그램
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <div className={styles["login__field"]}>
                                    <div className={styles["login__row"]}>
                                        <label htmlFor="userId">
                                            <span
                                                className={clsx(
                                                    styles["login__text"],
                                                    {
                                                        [styles[
                                                            "login__text--active"
                                                        ]]:
                                                            userData.id.length >
                                                            0,
                                                    }
                                                )}
                                            >
                                                전화번호, 사용자 이름 또는
                                                이메일
                                            </span>
                                            <input
                                                type="text"
                                                name="id"
                                                id="userId"
                                                value={userData.id}
                                                onChange={handleInputChange}
                                                className={clsx(
                                                    styles["login__input"],
                                                    {
                                                        [styles[
                                                            "login__input--active"
                                                        ]]:
                                                            userData.id.length >
                                                            0,
                                                    }
                                                )}
                                            />
                                        </label>
                                    </div>
                                    <div className={styles["login__row"]}>
                                        <label htmlFor="userPassword">
                                            <span
                                                className={clsx(
                                                    styles["login__text"],
                                                    {
                                                        [styles[
                                                            "login__text--active"
                                                        ]]:
                                                            userData.password
                                                                .length > 0,
                                                    }
                                                )}
                                            >
                                                비밀번호
                                            </span>
                                            <input
                                                type="password"
                                                name="password"
                                                id="userPassword"
                                                value={userData.password}
                                                onChange={handleInputChange}
                                                className={clsx(
                                                    styles["login__input"],
                                                    {
                                                        [styles[
                                                            "login__input--active"
                                                        ]]:
                                                            userData.password
                                                                .length > 0,
                                                    }
                                                )}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className={styles["login__button"]}>
                                    <button
                                        type="submit"
                                        className={clsx(
                                            "btn btn-round btn-round--blue",
                                            {
                                                ["active"]:
                                                    userData.password.length >=
                                                    6,
                                            }
                                        )}
                                    >
                                        <span>로그인</span>
                                    </button>
                                </div>
                            </form>
                            <div className={styles["login__hr"]}>
                                <span>또는</span>
                            </div>
                            <div className={styles["login__red"]}>{text}</div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
