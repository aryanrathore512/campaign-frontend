import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavbarOfCampaign from './NavbarOfCampaign';
import CampaignTable from './CampaignTable';
import React, { useEffect, useState } from 'react';

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
    <div>
      <NavbarOfCampaign />
      <CreateNewCampaign />
      <br />
      <CampaignTable name="Draft" campaigns={draftCampaigns} />
      <CampaignTable name="Initiate" campaigns={initiateCampaigns} />
    </div>
  );
}

function CreateNewCampaign() {
  return <button className="btn btn-primary button-create">Create New Campaign</button>;
}
