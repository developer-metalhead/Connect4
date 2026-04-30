/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/buttonComponent";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";

const PlayCPU = () => {
  const navigate = useNavigate();
  return (
    <PageContainer>
      Under Construction
      <ButtonContainer>
        <CustomButton onClick={() => navigate("/play-offline")}>
          Back
        </CustomButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default PlayCPU;
