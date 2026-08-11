import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from '@/components/layout/AppLayout';
import BusinessPage from '@/pages/BusinessPage';
import DashboardPage from '@/pages/DashboardPage';
import RepliesPage from '@/pages/RepliesPage';
import ReviewsPage from '@/pages/ReviewsPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/replies" element={<RepliesPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
