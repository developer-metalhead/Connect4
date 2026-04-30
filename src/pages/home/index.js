import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>🎮 Connect 4</h1>
      <p>Choose Game Mode</p>
      {/* 
      <div>
        <button onClick={() => navigate("/play-offline")}>Play Offline</button>

        <button onClick={() => navigate("/play-online")}>Play Online</button>
      </div> */}
    </div>
  );
}

export default Home;
