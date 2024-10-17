import React, { useState, useEffect } from 'react';
import '../index.css';

export default function CampaignSettings({ handleBack, handleNext, campaign, setCampaign }) {
  const [emailLimit, setEmailLimit] = useState(campaign.email_limit || '');
  const [startTime, setStartTime] = useState(campaign.start_time || '');
  const [endTime, setEndTime] = useState(campaign.end_time || '');
  const [campaignRunTime, setCampaignRunTime] = useState(campaign.campaign_run_time || '');
  const [error, setError] = useState('');

  function handleSaveSettings() {
    setError('');
    if (!emailLimit || emailLimit < 0) {
      setError('Email limit must be a positive number.');
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError('Start time must be before end time.');
      return;
    }
    if (!campaignRunTime || campaignRunTime <= 0) {
      setError('Campaign run time must be a positive number.');
      return;
    }

    const settings = {
      email_limit: emailLimit,
      start_time: startTime,
      end_time: endTime,
      campaign_run_time: campaignRunTime,
    };

    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      ...settings,
    }));
  };

  return (
    <div className="campaign-settings-container">
      <h2 className="campaign-settings-title">Campaign Settings</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="campaign-settings-field">
        <label className="campaign-settings-label">Email Limit: </label>
        <input
          type="number"
          value={emailLimit}
          onChange={(e) => setEmailLimit(e.target.value)}
          className="campaign-settings-input"
        />
      </div>
      <div className="campaign-settings-field">
        <label className="campaign-settings-label">Start Time: </label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="campaign-settings-input"
        />
      </div>
      <div className="campaign-settings-field">
        <label className="campaign-settings-label">End Time: </label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="campaign-settings-input"
        />
      </div>
      <div className="campaign-settings-field">
        <label className="campaign-settings-label">Run Campaign Every X Hours: </label>
        <input
          type="number"
          value={campaignRunTime}
          onChange={(e) => setCampaignRunTime(e.target.value)}
          className="campaign-settings-input"
        />
      </div>
      <div className="campaign-settings-buttons">
        <button onClick={handleBack} className="campaign-settings-button">Back</button>
        <button onClick={() => { handleSaveSettings(); handleNext(); }} className="campaign-settings-button">Next</button>
      </div>
    </div>
  );
}
