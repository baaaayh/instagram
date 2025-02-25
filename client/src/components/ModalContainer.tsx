import clsx from "clsx";
import Close from "@/assets/images/icons/icon_close.svg?react";
import styles from "@/assets/styles/ModalContainer.module.scss";
export default function ModalContainer({
    children,
    isOpen,
    closeModal,
}: {
    children: React.ReactNode;
    isOpen: boolean;
    closeModal: () => void;
}) {
    return (
        <div
            className={clsx(styles["modal"], {
                [styles["modal--open"]]: isOpen,
            })}
        >
            <div className={styles["close-button"]}>
                <button type="button" onClick={closeModal}>
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
