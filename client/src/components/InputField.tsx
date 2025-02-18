import { memo } from "react";
import clsx from "clsx";
import styles from "@/assets/styles/Form.module.scss";

interface FieldProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    type: string;
    name: string;
    value: string;
    message?: {
        [key: string]: string;
    };
}

export default memo(function InputField({
    onChange,
    label,
    type,
    name,
    value,
    message,
}: FieldProps) {
    return (
        <div className={styles["form__row"]}>
            <label htmlFor={name}>
                <span
                    className={clsx(styles["form__text"], {
                        [styles["form__text--active"]]: value.length > 0,
                    })}
                >
                    {label}
                </span>
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    className={clsx(styles["form__input"], {
                        [styles["form__input--active"]]: value.length > 0,
                    })}
                />
            </label>
            {message && message[name] !== "" && <p>{message[name]}</p>}
        </div>
    );
});
