import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/organisms/buttonComponent";
import BackButton from "../../components/designSystem/BackButton";
import useSoundManager from "../../hooks/core/useSoundManager";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";

const Offline = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();

  return (
    <PageContainer>
      <BackButton soundManager={soundManager} />
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
      </ButtonContainer>
    </PageContainer>
  );
};

export default Offline;
