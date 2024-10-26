import React, { useState } from 'react';
import '../index.css';

export default function CreateCampaign({ campaign, setCampaign, handleNext, handleSaveAsDraft, loading, errorMessage }) {
  const { name, campaign_type } = campaign;
  const campaignTypes = ['Email', 'SMS', 'Social Media'];

  const [showErrors, setShowErrors] = useState(false);
  console.log(errorMessage);
  function handleSave() {
    setShowErrors(true); // Show errors when Next is clicked

    // Check if the name and campaign type are valid
    if (!name || !campaign_type) {
      return; // Prevent proceeding if validation fails
    }

    handleNext(); // Proceed to the next step
  }

  const isNameValid = name.trim() !== '';
  const isTypeValid = campaign_type !== '';

  return (
    <div className="create-campaign-container">
      <div className="create-campaign-box">
        <h2 className="create-campaign-title">Create Campaign</h2>
        <div className="create-campaign-form">
          <div className="form-group">
            <label className="form-label">
              Campaign Name: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              placeholder="Enter Campaign Name"
              className="form-input"
              required
            />
            {showErrors && !isNameValid && <div className="error-message">Campaign Name is required.</div>}
          </div>
          <div className="form-group">
            <label className="form-label">
              Campaign Type: <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              value={campaign_type}
              onChange={(e) => setCampaign({ ...campaign, campaign_type: e.target.value })}
              className="form-select"
            >
              <option value="">Select Type</option>
              {campaignTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {showErrors && !isTypeValid && <div className="error-message">Campaign Type is required.</div>}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="form-button-container">
            <button
              onClick={handleSaveAsDraft}
              className="form-button draft-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={handleSave}
              className="form-button"
              disabled={loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
