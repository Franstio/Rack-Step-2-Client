import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx"

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      
    </div>
  );
}

export default App;
