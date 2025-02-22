import Close from "@/assets/images/icons/icon_close.svg?react";
import styles from "@/assets/styles/ModalContainer.module.scss";
export default function ModalContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles["modal"]}>
            <div className={styles["close-button"]}>
                <button type="button">
                    <span>
                        <Close />
                        닫기
                    </span>
                </button>
            </div>
            <div className={styles["modal__container"]}>
                <div className={styles["modal__inner"]}>{children}</div>
            </div>
        </div>
    );
}
