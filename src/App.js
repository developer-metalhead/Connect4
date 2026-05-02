import "./App.css";
import AppRoutes from "./routes/index";
import { GlobalStyles } from "./components/organisms/boardStyles/index.style";
import { GlobalLayoutStyles } from "./components/designSystem/Layout.style";

function App() {
  return (
    <>
      {GlobalLayoutStyles}
      <style>{GlobalStyles}</style>
      <AppRoutes />
    </>
  );
}

export default App;
