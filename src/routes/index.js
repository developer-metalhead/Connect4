import { Routes, Route } from "react-router-dom";

// V1 Pages
import Home from "../pages/home/index";
import Offline from "../pages/offline/index";
import Online from "../pages/online/index";
import Player from "../pages/offline/vs2P/index";
import PlayCPU from "../pages/offline/vsCPU";
import FunMode from "../pages/funMode";

// V2 Pages
import HomeV2 from "../pagesV2/home/index";
import OfflineV2 from "../pagesV2/offline/index";
import OnlineV2 from "../pagesV2/online/index";
import PlayerV2 from "../pagesV2/offline/vs2P/index";
import PlayCPUV2 from "../pagesV2/offline/vsCPU";
import FunModeV2 from "../pagesV2/funMode";

// Common Components
import LandingPage from "../pagesV2/LandingPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Selection Screen */}
      <Route path="/" element={<LandingPage />} />

      {/* V2 Routes (New Primary UI - No prefix) */}
      <Route path="/home" element={<HomeV2 />} />
      <Route path="/play-offline" element={<OfflineV2 />} />
      <Route path="/play-online" element={<OnlineV2 />} />
      <Route path="/play-offline/2p" element={<PlayerV2 />} />
      <Route path="/play-offline/cpu" element={<PlayCPUV2 />} />
      <Route path="/play-fun" element={<FunModeV2 />} />

      {/* V1 Routes (Legacy - /legacy prefix) */}
      <Route path="/legacy" element={<Home />} />
      <Route path="/legacy/play-offline" element={<Offline />} />
      <Route path="/legacy/play-online" element={<Online />} />
      <Route path="/legacy/play-offline/2p" element={<Player />} />
      <Route path="/legacy/play-offline/cpu" element={<PlayCPU />} />
      <Route path="/legacy/play-fun" element={<FunMode />} />
    </Routes>
  );
};

export default AppRoutes;
