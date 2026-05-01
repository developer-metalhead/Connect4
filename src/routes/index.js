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

const AppRoutes = () => {
  return (
    <Routes>
      {/* V1 Routes (Legacy) */}
      <Route path="/" element={<Home />} />
      <Route path="/play-offline" element={<Offline />} />
      <Route path="/play-online" element={<Online />} />
      <Route path="/play-offline/2p" element={<Player />} />
      <Route path="/play-offline/cpu" element={<PlayCPU />} />
      <Route path="/play-fun" element={<FunMode />} />

      {/* V2 Routes (New UI) */}
      <Route path="/v2" element={<HomeV2 />} />
      <Route path="/v2/play-offline" element={<OfflineV2 />} />
      <Route path="/v2/play-online" element={<OnlineV2 />} />
      <Route path="/v2/play-offline/2p" element={<PlayerV2 />} />
      <Route path="/v2/play-offline/cpu" element={<PlayCPUV2 />} />
      <Route path="/v2/play-fun" element={<FunModeV2 />} />
    </Routes>
  );
};

export default AppRoutes;
