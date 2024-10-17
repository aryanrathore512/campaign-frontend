import React from 'react';
import '../CampaignTable.css';

export default function CampaignTable({ name, campaigns }) {
  return (
    <div className='campaign-table'>
      <h3>{name} Campaign List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{campaign.campaign_type}</td>
              <td>{campaign.status ? "Active" : "Inactive"}</td>
              <td>
                <i className="fas fa-eye" title="View Campaign"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
