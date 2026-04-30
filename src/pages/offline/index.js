import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/buttonComponent";

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
        <CustomButton onClick={() => navigate("/play-offline/2p")}>
          Play VS 2nd Player
        </CustomButton>
        <CustomButton onClick={() => navigate("/play-offline/cpu")}>
          Play VS CPU
        </CustomButton>
        <CustomButton onClick={() => navigate("/")}>Main Menu</CustomButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default Offline;
