import React from "react";
import ReactDOM from "react-dom";
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "./Modal.style";

/**
 * Modern Generic Modal Component
 * Uses React Portal to render at the top level
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = "500px" 
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalBackdrop onClick={onClose}>
      <ModalContainer 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              fontSize: '20px',
              opacity: 0.5
            }}
          >
            ✕
          </button>
        </ModalHeader>
        
        <ModalBody>
          {children}
        </ModalBody>
        
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalBackdrop>,
    document.body
  );
};

export default Modal;
