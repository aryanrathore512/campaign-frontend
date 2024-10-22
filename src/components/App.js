import '../App.css';
import CampaignTable from './CampaignTable';
import Sidebar from './Sidebar';
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

export default function App() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [draftCampaigns, setDraftCampaigns] = useState([]);
  const [initiateCampaigns, setInitiateCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async (status) => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaigns?status=${status}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        return [];
      }
    };

    const fetchAllCampaigns = async () => {
      const draft = await fetchCampaigns(false);
      const initiate = await fetchCampaigns(true);
      setDraftCampaigns(draft);
      setInitiateCampaigns(initiate);
    };

    fetchAllCampaigns();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home draftCampaigns={draftCampaigns} initiateCampaigns={initiateCampaigns} />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
        </Routes>
      </div>
    </div>
  );
}

function Home({ draftCampaigns, initiateCampaigns }) {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/create-campaign');
  };

  return (
    <div>
      <button className="btn btn-primary button-create" onClick={handleCreateCampaign}>
        Create New Campaign
      </button>
      <CampaignTable name="Draft" campaigns={draftCampaigns} />
      <CampaignTable name="Initiate" campaigns={initiateCampaigns} />
    </div>
  );
}

function CreateCampaignPage() {
  return (
    <div>
      <h1>Create a New Campaign</h1>
    </div>
  );
}
