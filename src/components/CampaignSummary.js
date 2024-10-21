import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function CampaignSummary({ campaign, handleBack, handleSaveAsDraft, handleSaveCampaign, loading, API_BASE_URL }) {
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/contacts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setContacts(data.contacts);
        setTotalContacts(data.total);
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
        setError('Failed to load contacts.');
      });
  }, []);

  const selectedContacts = campaign.selectedContactIds.length || 0;
  const progress = totalContacts ? (selectedContacts / totalContacts) * 100 : 0;

  return (
    <div className="summary-container">
      <h2 className="summary-title">Campaign Summary</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="summary-grid">
        <div className="summary-box">
          <h3>Campaign Type</h3>
          <p><strong>Selected Campaign:</strong> {campaign.campaign_type}</p>
        </div>

        <div className="summary-box">
          <h3>Selected Contacts</h3>
          <ul>
            {selectedContacts > 0 ? (
              campaign.selectedContactIds.map((contactId) => {
                const contact = contacts.find((contact) => contact.id === contactId);
              })
            ) : (
              <p>No contacts selected.</p>
            )}
          </ul>
          <div className="progress-bar-container-summary">
            <div
              className="progress-bar-summary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>
            {selectedContacts} of {totalContacts} contacts selected
          </p>
        </div>

        <div className="summary-box">
          <h3>Selected Templates</h3>
          <ul>
            {campaign.selectedTemplateIds.length > 0 ? (
              campaign.selectedTemplateIds.map((templateId) => (
                <li key={templateId}>Template ID: {templateId}</li>
              ))
            ) : (
              <p>No templates selected.</p>
            )}
          </ul>
        </div>

        <div className="summary-box">
          <h3>Settings</h3>
          <p><strong>Email Limit:</strong> {campaign.email_limit}</p>
          <p><strong>Start Time:</strong> {campaign.start_time}</p>
          <p><strong>End Time:</strong> {campaign.end_time}</p>
          <p><strong>Campaign Run Time:</strong> {campaign.campaign_run_time}</p>
        </div>
      </div>

      <div className="summary-buttons">
        <button className="summary-button" onClick={handleBack} disabled={loading}>
          Back
        </button>
        <button className="form-button draft-button" onClick={handleSaveAsDraft} disabled={loading}>
          {loading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button className="summary-button" onClick={handleSaveCampaign} disabled={loading}>
          {loading ? 'Creating...' : 'Confirm & Finish'}
        </button>
      </div>
    </div>
  );
}
