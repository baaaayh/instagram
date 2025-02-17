import { useState, useReducer, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import LoginForm from "@/components/LoginForm";
import BigLogo from "@/components/BigLogo";
import styles from "@/assets/styles/Form.module.scss";

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
        <div className="form-page">
            <div className="form-page__inner">
                <div className="form-container">
                    <div className={styles["form"]}>
                        <div className={styles["form__inner"]}>
                            <BigLogo />
                            <LoginForm
                                userData={userData}
                                handleInputChange={handleInputChange}
                                handleSubmit={handleSubmit}
                            />
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
