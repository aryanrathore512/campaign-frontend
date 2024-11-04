import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './components/App';
import NavbarOfCampaign from './components/NavbarOfCampaign';
import CampaignPage from './components/CampaignPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <Router>
      <NavbarOfCampaign />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-campaign" element={<CampaignPage />} />
      </Routes>
    </Router>
  </div>
);