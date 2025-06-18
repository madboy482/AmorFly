// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import PodDashboard from "./pages/PodDashboard";
import ConnectionView from "./pages/ConnectionView";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/pod" element={<PodDashboard />} />
        <Route path="/connect" element={<ConnectionView />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
