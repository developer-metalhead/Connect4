import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/index";
import Offline from "../pages/offline/index";
import Online from "../pages/online/index";
import Player from "../pages/offline/vs2P/index";
import PlayCPU from "../pages/offline/vsCPU";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play-offline" element={<Offline />} />
      <Route path="/play-online" element={<Online />} />
      <Route path="/play-offline/2p" element={<Player />} />
      <Route path="/play-offline/cpu" element={<PlayCPU />} />
    </Routes>
  );
};

export default AppRoutes;
