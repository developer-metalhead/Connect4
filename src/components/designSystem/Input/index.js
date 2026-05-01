import React from "react";
import {
  InputGroup,
  Label,
  InputWrapper,
  StyledInput,
  HelperText,
  InputIcon,
} from "./Input.style";

/**
 * Modern Premium Input Component
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.helperText - Optional description or error message
 * @param {boolean} props.error - Whether the field is in an error state
 * @param {React.ReactNode} props.icon - Optional icon for the start of the field
 */
const Input = ({ 
  label, 
  helperText, 
  error, 
  icon: Icon,
  className,
  ...props 
}) => {
  return (
    <InputGroup className={className}>
      {label && <Label>{label}</Label>}
      
      <InputWrapper>
        {Icon && (
          <InputIcon>
            {Icon}
          </InputIcon>
        )}
        <StyledInput 
          hasIcon={!!Icon}
          {...props}
        />
      </InputWrapper>
      
      {helperText && (
        <HelperText error={error}>
          {helperText}
        </HelperText>
      )}
    </InputGroup>
  );
};

export default Input;
