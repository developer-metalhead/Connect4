import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/index";
// import PlayOffline from "../pages/PlayOffline";
// import PlayOnline from "../pages/PlayOnline";
// import Game2P from "../pages/Game2P";
// import GameCPU from "../pages/GameCPU";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/play-offline" element={<PlayOffline />} />
      <Route path="/play-online" element={<PlayOnline />} />
      <Route path="/play-offline/2p" element={<Game2P />} />
      <Route path="/play-offline/cpu" element={<GameCPU />} /> */}
    </Routes>
  );
};

export default AppRoutes;
