import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';
import ConfidentialitePage from './pages/ConfidentialitePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
      <Route path="/confidentialite" element={<ConfidentialitePage />} />
    </Routes>
  );
}

export default App;
