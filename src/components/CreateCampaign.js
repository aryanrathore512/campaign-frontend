import React from 'react';

export default function CreateCampaign({ campaign, setCampaign, handleNext }) {
  const { name, campaign_type } = campaign;

  const campaignTypes = ['Email', 'SMS', 'Social Media'];

  const handleSave = () => {
    if (!name || !campaign_type) {
      alert('Please fill in both the campaign name and type');
      return;
    }
    handleNext();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Create Campaign</h2>

        <div className="border border-gray-300 rounded-lg p-6 shadow-md bg-white mx-4 md:mx-60 mt-16 md:mt-32 pt-10 pb-4 pl-6 md:pl-20">
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Campaign Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              placeholder="Enter Campaign Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Campaign Type: </label>
            <select
              value={campaign_type}
              onChange={(e) => setCampaign({ ...campaign, campaign_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {campaignTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
