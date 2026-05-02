import "./App.css";
import AppRoutes from "./routes/index";
import { GlobalStyles } from "./components/organisms/boardStyles/index.style";
import { GlobalLayoutStyles } from "./components/designSystem/Layout.style";

import { SoundProvider } from "./hooks/core/SoundContext";

function App() {
  return (
    <SoundProvider>
      {GlobalLayoutStyles}
      <style>{GlobalStyles}</style>
      <AppRoutes />
    </SoundProvider>
  );
}

export default App;
