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
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/campaigns`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCampaigns(data);
      })
      .catch((error) => {
        console.error('Error fetching campaigns:', error);
      });
  }, []);

  const draftCampaigns = campaigns.filter((campaign) => campaign.status === false);
  const initiateCampaigns = campaigns.filter((campaign) => campaign.status === true);

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
