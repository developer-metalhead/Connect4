import "./App.css";
import AppRoutes from "./routes/index";
import { GlobalStyles } from "./components/boardStyles/index.style";

function App() {
  return (
    <>
      <style>{GlobalStyles}</style>
      <AppRoutes />
    </>
  );
}

export default App;
