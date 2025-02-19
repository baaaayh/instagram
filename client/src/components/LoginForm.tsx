import { useReducer, useCallback, memo } from "react";
import { useMutation } from "@tanstack/react-query";
import InputField from "@/components/InputField";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import axiosInstance from "@/api/axiosInstance";
import clsx from "clsx";
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
            const response = await axiosInstance.post("/accounts/login", {
                params: { id, password },
            });
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

export default memo(function LoginForm({
    setText,
}: {
    setText: (text: string) => void;
}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { setTokenState } = useAuthStore();

    const mutation = useMutation({
        mutationFn: submitLoginData,
        onSuccess: (data) => {
            if (data.success === true) {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                setTokenState(!!data.accessToken, !!data.refreshToken);
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
            mutation.mutate(state);
        },
        [state, mutation]
    );

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles["form__field"]}>
                <InputField
                    label="휴대폰 번호 또는 이메일 주소"
                    type="text"
                    name="id"
                    value={state.id}
                    onChange={handleInputChange}
                />
                <InputField
                    label="비밀번호"
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={handleInputChange}
                />
            </div>
            <div className={styles["form__button"]}>
                <button
                    type="submit"
                    className={clsx("btn btn-round btn-round--blue", {
                        ["active"]:
                            state.password.length >= 6 && state.id.length > 0,
                    })}
                >
                    <span>로그인</span>
                </button>
            </div>
        </form>
    );
});
