import React from 'react';
import '../index.css';

export default function CreateCampaign({ campaign, setCampaign, handleNext, handleSaveAsDraft, loading }) {
  const { name, campaign_type } = campaign;

  const campaignTypes = ['Email', 'SMS', 'Social Media'];

  function handleSave () {
    if (!name || !campaign_type) {
      alert('Please fill in both the campaign name and type');
      return;
    }
    handleNext();
  };

  return (
    <div className="create-campaign-container">
      <div className="create-campaign-box">
        <h2 className="create-campaign-title">Create Campaign</h2>

        <div className="create-campaign-form">
          <div className="form-group">
            <label className="form-label">Campaign Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              placeholder="Enter Campaign Name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Campaign Type: </label>
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
          </div>

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
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
