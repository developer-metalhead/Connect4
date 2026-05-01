import React from "react";
import Modal from "../Modal";
import Button from "../Button";
import { styled } from "@mui/material/styles";
import { tokens } from "../tokens";

const Message = styled("p")({
  color: tokens.colors.textMuted,
  fontSize: "16px",
  lineHeight: 1.6,
  textAlign: "center",
  margin: "0 0 24px 0",
});

const ConfirmationModal = ({ 
  isOpen, 
  onAccept, 
  onDecline, 
  onClose,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  acceptLabel = "Yes",
  declineLabel = "No"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="400px"
      footer={
        <>
          <Button variant="outline" onClick={onDecline}>
            {declineLabel}
          </Button>
          <Button variant="danger" onClick={onAccept}>
            {acceptLabel}
          </Button>
        </>
      }
    >
      <Message>{message}</Message>
    </Modal>
  );
};

export default ConfirmationModal;
