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
  const [totalDraft, setTotalDraft] = useState(0);
  const [totalInitiate, setTotalInitiate] = useState(0);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchCampaigns = (page = 1) => {
    fetch(`${API_BASE_URL}/campaigns?page=${page}&per_page=${perPage}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setDraftCampaigns(data.draft_campaigns);
        setInitiateCampaigns(data.initiate_campaigns);
        setTotalDraft(data.total_draft_campaigns);
        setTotalInitiate(data.total_initiate_campaigns);
      })
      .catch((error) => {
        console.error('Error fetching campaigns:', error);
        setError('Failed to load campaigns.');
      });
  };
  console.log(draftCampaigns);
  useEffect(() => {
    fetchCampaigns(currentPage);
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home draftCampaigns={draftCampaigns} initiateCampaigns={initiateCampaigns}
                totalDraft={totalDraft} totalInitiate={totalInitiate}
                currentPage={currentPage} handlePageChange={handlePageChange} />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
        </Routes>
      </div>
    </div>
  );
}

function Home({ draftCampaigns, initiateCampaigns, totalDraft, totalInitiate, currentPage, handlePageChange }) {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/create-campaign');
  };

  return (
    <div>
      <button className="btn btn-primary button-create" onClick={handleCreateCampaign}>
        Create New Campaign
      </button>
      <CampaignTable name="Draft" campaigns={draftCampaigns} total={totalDraft} currentPage={currentPage} handlePageChange={handlePageChange} />
      <CampaignTable name="Initiate" campaigns={initiateCampaigns} total={totalInitiate} currentPage={currentPage} handlePageChange={handlePageChange} />
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
