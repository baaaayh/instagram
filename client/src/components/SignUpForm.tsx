import { useCallback, useReducer, memo } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "@/components/InputField";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import styles from "@/assets/styles/Form.module.scss";

const initialState = {
    inputValues: {
        id: "",
        password: "",
        username: "",
        nickname: "",
    },
    messages: {
        id: "",
        password: "",
        nickname: "",
    },
    checkStates: {
        id: false,
        password: false,
        username: false,
        nickname: false,
    },
};

async function checkData({ name, value }: { name: string; value: string }) {
    try {
        const response = await axios.post("/api/accounts/validate", {
            params: { name, value },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "An error occurred");
        } else {
            throw new Error("An error occurred");
        }
    }
}

type State = typeof initialState;
type Action =
    | { type: "SET_VALUE"; name: string; value: string }
    | { type: "SET_MESSAGE"; name: string; message: string }
    | { type: "SET_CHECKED_STATE"; name: string; checked: boolean };

function reducer(state: State, action: Action) {
    switch (action.type) {
        case "SET_VALUE":
            return {
                ...state,
                inputValues: {
                    ...state.inputValues,
                    [action.name]: action.value,
                },
            };
        case "SET_MESSAGE":
            return {
                ...state,
                messages: { ...state.messages, [action.name]: action.message },
            };
        case "SET_CHECKED_STATE":
            return {
                ...state,
                checkStates: {
                    ...state.checkStates,
                    [action.name]: action.checked,
                },
            };
        default:
            return state;
    }
}

export default memo(function SignUpForm() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();

    const duplicateCheck = useMutation({
        mutationFn: checkData,
        onSuccess: (data) => {
            dispatch({
                type: "SET_MESSAGE",
                name: data.name,
                message: data.success ? "" : data.message,
            });
            dispatch({
                type: "SET_CHECKED_STATE",
                name: data.name,
                checked: true,
            });
        },
        onError: (data) => {
            console.log(data);
        },
    });

    const validators = useCallback(
        ({ name, value }: { name: string; value: string }) => {
            let regex, message;
            switch (name) {
                case "id":
                    regex =
                        /^(?:[a-zA-Z0-9]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
                    message = "Enter a valid email address.";
                    break;
                case "password":
                    regex =
                        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
                    message =
                        "이 비밀번호는 추측하기가 너무 쉽습니다. 새로운 비밀번호를 만드세요.";
                    break;
            }

            const validated =
                name === "nickname" || (regex && regex.test(value));
            const validationMessage =
                validated || value.length <= 0 ? "" : message;

            dispatch({
                type: "SET_MESSAGE",
                name,
                message: validationMessage || "",
            });

            if (validated || value.length <= 0) {
                dispatch({ type: "SET_CHECKED_STATE", name, checked: true });
                if (name === "id" || name === "nickname") {
                    duplicateCheck.mutate({ name, value });
                }
            }
        },
        [duplicateCheck]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;

            dispatch({ type: "SET_VALUE", name, value });

            if (name === "username" && value.length > 0) {
                dispatch({
                    type: "SET_CHECKED_STATE",
                    name: "username",
                    checked: true,
                });
            } else {
                validators({ name, value });
            }
        },
        [validators]
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (Object.values(state.checkStates).every(Boolean)) {
                const data = state.inputValues;
                axios
                    .post("/api/accounts/signup", data, {
                        withCredentials: true,
                    })
                    .then((response) => {
                        if (response.data.success === true) {
                            alert("회원가입에 성공했습니다.");
                            navigate("/accounts/login");
                        } else {
                            alert(response.data.message);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        [navigate, state]
    );

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles["form__field"]}>
                <InputField
                    label="휴대폰 번호 또는 이메일 주소"
                    type="text"
                    name="id"
                    value={state.inputValues.id}
                    message={state.messages}
                    onChange={handleInputChange}
                />
                <InputField
                    label="비밀번호"
                    type="password"
                    name="password"
                    value={state.inputValues.password}
                    message={state.messages}
                    onChange={handleInputChange}
                />
                <InputField
                    label="성명"
                    type="text"
                    name="username"
                    value={state.inputValues.username}
                    message={state.messages}
                    onChange={handleInputChange}
                />
                <InputField
                    label="사용자 이름"
                    type="text"
                    name="nickname"
                    value={state.inputValues.nickname}
                    message={state.messages}
                    onChange={handleInputChange}
                />
            </div>
            <div className={styles["form__button"]}>
                <button
                    type="submit"
                    className={clsx("btn btn-round btn-round--blue", {
                        ["active"]:
                            state.checkStates.id &&
                            state.checkStates.password &&
                            state.checkStates.nickname,
                    })}
                >
                    <span>회원가입</span>
                </button>
            </div>
        </form>
    );
});
