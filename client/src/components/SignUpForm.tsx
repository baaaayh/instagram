import { useCallback, useReducer } from "react";
import { memo } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import styles from "@/assets/styles/Form.module.scss";

const initialState = {
    id: "",
    password: "",
    userName: "",
    nickName: "",
};

const initialMessage = {
    id: "",
    password: "",
    nickName: "",
};

const initialCheckState = {
    id: false,
    password: false,
    userName: false,
    nickName: false,
};

async function checkData({ name, value }: { name: string; value: string }) {
    try {
        const response = await axios.post("/api/accounts/duplicate", {
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

function reducer(
    state: { id: string; password: string; userName: string; nickName: string },
    action: { name: string; value: string }
) {
    return { ...state, [action.name]: action.value };
}

function messageReducer(
    state: { id: string; password: string; nickName: string },
    action: { name: string; message: string }
) {
    return { ...state, [action.name]: action.message };
}

function checkStateReducer(
    state: { id: boolean; password: boolean; nickName: boolean },
    action: { name: string; checked: boolean }
) {
    return { ...state, [action.name]: action.checked };
}

export default memo(function SignUpForm() {
    const [userData, dispatchUserData] = useReducer(reducer, initialState);
    const [message, dispatchMessage] = useReducer(
        messageReducer,
        initialMessage
    );
    const [checkState, dispatchCheckState] = useReducer(
        checkStateReducer,
        initialCheckState
    );

    const duplicateCheck = useMutation({
        mutationFn: checkData,
        onSuccess: (data) => {
            if (!data.success) {
                dispatchMessage({ name: data.name, message: data.message });
            } else {
                dispatchMessage({ name: data.name, message: "" });
                dispatchCheckState({ name: data.name, checked: true });
            }
        },
        onError: (data) => {
            console.log(data);
        },
    });

    const validateId = useCallback(
        ({ name, value }: { name: string; value: string }) => {
            if (name === "id") {
                const regex =
                    /^(?:[a-zA-Z0-9]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
                const validated = regex.test(value);

                if (!validated && value.length > 0) {
                    dispatchMessage({
                        name: "id",
                        message: "Enter a valid email address.",
                    });
                }
                if (validated && value.length > 0) {
                    duplicateCheck.mutate({ name, value });
                }
            }
        },
        [duplicateCheck]
    );

    const validatePassword = useCallback(
        ({ name, value }: { name: string; value: string }) => {
            const regex =
                /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z0-9]).{6,}$/;
            const validated = regex.test(value);
            if (name === "password") {
                if (value.length <= 0) {
                    dispatchMessage({
                        name,
                        message: "",
                    });
                }
                if (!validated && value.length >= 6) {
                    dispatchMessage({
                        name,
                        message:
                            "이 비밀번호는 추측하기가 너무 쉽습니다. 새로운 비밀번호를 만드세요.",
                    });
                }
                if (validated && value.length >= 6) {
                    dispatchMessage({
                        name,
                        message: "",
                    });
                    dispatchCheckState({ name, checked: true });
                }
            }
        },
        []
    );

    const validateNickName = useCallback(
        ({ name, value }: { name: string; value: string }) => {
            if (name === "nickName" && value.length > 0) {
                duplicateCheck.mutate({
                    name,
                    value,
                });
            }
        },
        [duplicateCheck]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const dataName = e.target.name;
            const data = { name: e.target.name, value: e.target.value };
            dispatchUserData(data);

            if (dataName === "id") {
                validateId(data);
            }
            if (dataName === "nickName") {
                validateNickName(data);
            }
            if (dataName === "password") {
                validatePassword(data);
            }
            if (dataName === "userName" && e.target.value.length > 0) {
                dispatchCheckState({ name: "userName", checked: true });
            }
        },
        [validateId, validatePassword, validateNickName]
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (checkState.id && checkState.password && checkState.nickName) {
                const data = {
                    id: userData.id,
                    password: userData.password,
                    userName: userData.userName,
                    nickName: userData.nickName,
                };
                axios
                    .post("/api/accounts/signup", data)
                    .then((response) => {
                        console.log(response.data);
                        // if (response.data.success === true) {
                        //     window.location.href = "/login";
                        // } else {
                        //     alert(response.data.message);
                        // }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        [checkState.id, checkState.password, checkState.nickName, userData]
    );

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
                            휴대폰 번호 또는 이메일 주소
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
                    {message.id !== "" && <p>{message.id}</p>}
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
                    {message.password !== "" && <p>{message.password}</p>}
                </div>
                <div className={styles["form__row"]}>
                    <label htmlFor="userName">
                        <span
                            className={clsx(styles["form__text"], {
                                [styles["form__text--active"]]:
                                    userData.userName.length > 0,
                            })}
                        >
                            성명
                        </span>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            value={userData.userName}
                            onChange={handleInputChange}
                            className={clsx(styles["form__input"], {
                                [styles["form__input--active"]]:
                                    userData.userName.length > 0,
                            })}
                        />
                    </label>
                </div>
                <div className={styles["form__row"]}>
                    <label htmlFor="nickName">
                        <span
                            className={clsx(styles["form__text"], {
                                [styles["form__text--active"]]:
                                    userData.nickName.length > 0,
                            })}
                        >
                            사용자 이름
                        </span>
                        <input
                            type="text"
                            name="nickName"
                            id="nickName"
                            value={userData.nickName}
                            onChange={handleInputChange}
                            className={clsx(styles["form__input"], {
                                [styles["form__input--active"]]:
                                    userData.nickName.length > 0,
                            })}
                        />
                    </label>
                    {message.nickName !== "" && <p>{message.nickName}</p>}
                </div>
            </div>
            <div className={styles["form__button"]}>
                <button
                    type="submit"
                    className={clsx("btn btn-round btn-round--blue", {
                        ["active"]:
                            checkState.id &&
                            checkState.password &&
                            checkState.nickName,
                    })}
                >
                    <span>로그인</span>
                </button>
            </div>
        </form>
    );
});
