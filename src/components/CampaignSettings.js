import React, { useState } from 'react';
import '../index.css';

export default function CampaignSettings({ handleBack, handleNext, handleSaveAsDraft, campaign, setCampaign, loading, errorMessage }) {
  const [emailLimit, setEmailLimit] = useState(campaign.email_limit || '');
  const [startTime, setStartTime] = useState(campaign.start_time || '');
  const [endTime, setEndTime] = useState(campaign.end_time || '');
  const [campaignRunTime, setCampaignRunTime] = useState(campaign.campaign_run_time || '');
  const [batchContact, setBatchContact] = useState(campaign.batch_contact || '');
  const [errors, setErrors] = useState({});
  const [showFrontEndErrors, setShowFrontEndErrors] = useState(false);

  function validateFields() {
    const newErrors = {};

    if (!emailLimit) {
      newErrors.emailLimit = 'Please put data in Email Limit.';
    } else if (emailLimit < 0) {
      newErrors.emailLimit = 'Email Limit must be a positive number.';
    }

    if (!startTime) {
      newErrors.startTime = 'Please put data in Start Time.';
    }
    if (!endTime) {
      newErrors.endTime = 'Please put data in End Time.';
    } else if (startTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.endTime = 'Start time must be before End time.';
    }

    if (!campaignRunTime) {
      newErrors.campaignRunTime = 'Please put data in Campaign Run Time.';
    } else if (campaignRunTime <= 0) {
      newErrors.campaignRunTime = 'Campaign Run Time must be a positive number.';
    }

    if (!batchContact) {
      newErrors.batchContact = 'Please put data in Batch Contact.';
    } else if (batchContact <= 0) {
      newErrors.batchContact = 'Batch Contact must be a positive number.';
    }

    return newErrors;
  }

  function handleSaveSettings() {
    setErrors({});
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return null;
    }

    const settings = {
      email_limit: emailLimit,
      start_time: startTime,
      end_time: endTime,
      campaign_run_time: campaignRunTime,
      batch_contact: batchContact,
    };

    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      ...settings,
    }));

    return settings;
  }

  function handleNextClick() {
    setShowFrontEndErrors(true);
    const settings = handleSaveSettings();
    if (settings) {
      handleNext();
    }
  }

  function handleSaveDraftClick() {
    const settings = handleSaveSettings();
    if (settings) {
      handleSaveAsDraft({ ...campaign, ...settings })
        .catch((err) => {
          setErrors({ backend: err.message });
        });
    }
  }

  return (
    <div className="campaign-settings-container">
      <h2 className="campaign-settings-title">Campaign Settings</h2>

      {showFrontEndErrors && Object.keys(errors).length > 0 && (
        <div className="error-message">Please fix the errors above.</div>
      )}
      {errors.backend && <div className="error-message">{errors.backend}</div>}

      <div className="campaign-settings-field">
        <label className="campaign-settings-label">Email Limit: <span style={{ color: 'red' }}>*</span> </label>
        <input
          type="number"
          value={emailLimit}
          onChange={(e) => setEmailLimit(e.target.value)}
          className="campaign-settings-input"
        />
        {showFrontEndErrors && errors.emailLimit && <div className="error-message">{errors.emailLimit}</div>}
      </div>

      <div className="campaign-settings-field">
        <label className="campaign-settings-label">Start Time: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="campaign-settings-input"
        />
        {showFrontEndErrors && errors.startTime && <div className="error-message">{errors.startTime}</div>}
      </div>

      <div className="campaign-settings-field">
        <label className="campaign-settings-label">End Time: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="campaign-settings-input"
        />
        {showFrontEndErrors && errors.endTime && <div className="error-message">{errors.endTime}</div>}
      </div>

      <div className="campaign-settings-field">
        <label className="campaign-settings-label">Run Campaign Every X Hours: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          value={campaignRunTime}
          onChange={(e) => setCampaignRunTime(e.target.value)}
          className="campaign-settings-input"
        />
        {showFrontEndErrors && errors.campaignRunTime && <div className="error-message">{errors.campaignRunTime}</div>}
      </div>

      <div className="campaign-settings-field">
        <label className="campaign-settings-label">Batch Contact: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          value={batchContact}
          onChange={(e) => setBatchContact(e.target.value)}
          className="campaign-settings-input"
        />
        {showFrontEndErrors && errors.batchContact && <div className="error-message">{errors.batchContact}</div>}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="campaign-settings-buttons">
        <button onClick={handleBack} className="campaign-settings-button" disabled={loading}>
          Back
        </button>
        <button
          onClick={handleSaveDraftClick}
          className="campaign-settings-button"
          disabled={loading}
        >
          {loading ? 'Saving Draft...' : 'Save as Draft'}
        </button>
        <button
          onClick={handleNextClick}
          className="campaign-settings-button"
          disabled={loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
