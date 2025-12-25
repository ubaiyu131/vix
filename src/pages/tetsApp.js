import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Airtime from "./pages/Airtime";
import Data from "./pages/Data";
import Cable from "./pages/Cable";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Dashboard />} />
 
        {/* Other pages */}
        <Route path="/airtime" element={<Airtime />} />
        <Route path="/data" element={<Data />} />
        <Route path="/cable" element={<Cable />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}
export default App;
