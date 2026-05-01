import React from 'react';
import { styled } from '@mui/material/styles';
import CustomButton from '../buttonComponent';

const ModalOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '20px',
});

const ModalContainer = styled('div')({
  backgroundColor: '#1a1a1a',
  borderRadius: '16px',
  padding: '32px',
  maxWidth: '500px',
  width: '100%',
  border: '2px solid #ff6b35',
  boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)',
  textAlign: 'center',
});

const ModalTitle = styled('h2')({
  color: '#fff',
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '16px',
  background: 'linear-gradient(45deg, #ff6b35, #ffa500)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const ModalMessage = styled('p')({
  color: '#ccc',
  fontSize: '18px',
  marginBottom: '32px',
  lineHeight: '1.5',
});

const ButtonContainer = styled('div')({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
});

const FunConfirmationModal = ({ isOpen, onAccept, onDecline, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContainer>
        <ModalTitle>I suck and want to give up</ModalTitle>
        <ModalMessage>
          Do you want to be such a sore loser? 
      
        </ModalMessage>
        <ButtonContainer>
          <CustomButton 
            onClick={onAccept}
            style={{
              backgroundColor: '#4caf50',
              minWidth: '120px',
            }}
          >
            Yes, I am retarded !
          </CustomButton>
          <CustomButton 
            onClick={onDecline}
            style={{
              backgroundColor: '#666',
              minWidth: '120px',
            }}
          >
            No, bring the pain !
          </CustomButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default FunConfirmationModal;