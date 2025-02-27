import { memo } from "react";
import ModalContainer from "@/components/ModalContainer";
import { useModalStore } from "@/store/modalStore";
import styles from "@/assets/styles/AccountModal.module.scss";

export default memo(function UserModal() {
    const { isOpenAccountModal, setCloseAccountModal } = useModalStore();

    return (
        <ModalContainer
            isOpen={isOpenAccountModal}
            isCloseButton={false}
            closeModal={setCloseAccountModal}
        >
            <div className={styles["account-modal"]}>
                <div className={styles["account-modal__inner"]}>
                    <ul>
                        <li
                            className={`${styles["account-modal__item"]} ${styles["account-modal__item--red"]}`}
                        >
                            <button type="button">
                                <span>차단</span>
                            </button>
                        </li>
                        <li className={`${styles["account-modal__item"]}`}>
                            <button
                                type="button"
                                onClick={setCloseAccountModal}
                            >
                                <span>취소</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </ModalContainer>
    );
});
