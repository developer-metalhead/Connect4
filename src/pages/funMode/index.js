/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";

const FunMode = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderContainer>Connect 4</HeaderContainer>
      <BodyContainer>Fun Mode</BodyContainer>
    </PageContainer>
  );
};

export default FunMode;
