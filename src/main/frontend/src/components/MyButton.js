import React, { useState } from 'react';
import Modal from 'react-modal';

function MyButton(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button className={"link-btn"} onClick={handleClick}>ADD PRODUCT</button>
            <div className={"modal"}>
                <div className={"modal-content"}>
                    <Modal  isOpen={isModalOpen} onRequestClose={handleCloseModal}>
                        {props.formComponent && (
                            <props.formComponent onClose={handleCloseModal} />
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default MyButton;