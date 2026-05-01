import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/organisms/buttonComponent";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";

const Offline = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderContainer>Connect 4</HeaderContainer>
      <BodyContainer>Choose Game Mode</BodyContainer>

      <ButtonContainer>
        <CustomButton onClick={() => navigate("/legacy/play-offline/2p")}>
          Play VS 2nd Player
        </CustomButton>
        <CustomButton onClick={() => navigate("/legacy/play-offline/cpu")}>
          Play VS CPU
        </CustomButton>
        <CustomButton onClick={() => navigate("/legacy/play-fun")}>
          Fun Mode
        </CustomButton>
        <CustomButton onClick={() => navigate("/legacy")}>Back to Home</CustomButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default Offline;
