import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx"
import Timbangan from "./components/Timbangan.jsx"

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Timbangan />} />
          <Route path="/bin" element={<Home />} />
        </Routes>
      
    </div>
  );
}

export default App;
