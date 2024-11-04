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
  const [campaigns, setCampaigns] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
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
        setCampaigns(data.all_campaigns);
        setTotalCampaigns(data.total_campaigns);
      })
      .catch((error) => {
        console.error('Error fetching campaigns:', error);
        setError('Failed to load campaigns.');
      });
  };

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
          <Route
            path="/"
            element={
              <Home
                campaigns={campaigns}
                total={totalCampaigns}
                currentPage={currentPage}
                perPage={perPage}
                API_BASE_URL={API_BASE_URL}
                handlePageChange={handlePageChange}
              />
            }
          />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
        </Routes>
      </div>
    </div>
  );
}

function Home({ campaigns, total, currentPage, perPage, API_BASE_URL, handlePageChange }) {
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/create-campaign');
  };

  return (
    <div>
      <button className="btn btn-primary button-create" onClick={handleCreateCampaign}>
        Create New Campaign
      </button>
      <CampaignTable
        campaigns={campaigns}
        total={total}
        currentPage={currentPage}
        perPage={perPage}
        API_BASE_URL={API_BASE_URL}
        handlePageChange={handlePageChange}
      />
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
