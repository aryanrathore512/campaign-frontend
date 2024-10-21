import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import CreateCampaign from './CreateCampaign';
import TemplateSelection from './TemplateSelection';
import ContactSelection from './ContactSelection';
import CampaignSettings from './CampaignSettings';
import CampaignSummary from './CampaignSummary';
import { useNavigate } from 'react-router-dom';


export default function CampaignPage() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [campaign, setCampaign] = useState({
    name: '',
    campaign_type: '',
    selectedTemplateIds: [],
    selectedContactIds: [],
    email_limit: '',
    start_time: '',
    end_time: '',
    campaign_run_time: '',
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveAsDraft = (selectedIds, type) => {
    if (clicked) return;

    const updatedCampaign = {
      ...campaign,
      ...(type === 'templates' && { selectedTemplateIds: selectedIds || [] }),
      ...(type === 'contacts' && { selectedContactIds: selectedIds || [] }),
      status: false,
    };

  setClicked(true);
  setLoading(true);

    fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaign: updatedCampaign }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save draft');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Draft saved successfully!');
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error saving draft:', error);
      })
      .finally(() => {
        setLoading(false);
        setClicked(false);
      });
  };

  const handleSaveCampaign = () => {
    if (clicked) return;
    setClicked(true);
    setLoading(true);

    fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaign: { ...campaign, status: true } }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save draft');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Campaign saved successfully!');
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error saving draft:', error);
      })
      .finally(() => {
        setLoading(false);
        setClicked(false);
      });
  };

  const handleNext = (selectedIds, type) => {
    if (type === 'templates') {
      setCampaign((prevCampaign) => ({
        ...prevCampaign,
        selectedTemplateIds: selectedIds || [],
      }));
    } else if (type === 'contacts') {
      setCampaign((prevCampaign) => ({
        ...prevCampaign,
        selectedContactIds: selectedIds || [],
      }));
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleStepClick = (clickedStep) => {
    if (clickedStep >= 1 && clickedStep <= 5) {
      setStep(clickedStep);
    }
  };

  return (
    <div>
      <StepIndicator currentStep={step} handleStepClick={handleStepClick} />
      {step === 1 && (
        <CreateCampaign
          campaign={campaign}
          setCampaign={setCampaign}
          handleNext={() => handleNext([], 'campaign')}
          handleSaveAsDraft={handleSaveAsDraft}
          loading={loading}
        />
      )}
      {step === 2 && (
        <TemplateSelection
          handleBack={handleBack}
          handleNext={(selectedTemplateIds) => handleNext(selectedTemplateIds, 'templates')}
          campaign={campaign}
          selectedTemplateIds={campaign.selectedTemplateIds}
          handleSaveAsDraft={(selectedTemplateIds) => handleSaveAsDraft(selectedTemplateIds, 'templates')}
          loading={loading}
          API_BASE_URL={API_BASE_URL}
        />
      )}
      {step === 3 && (
        <ContactSelection
          handleBack={handleBack}
          handleNext={(selectedContactIds) => handleNext(selectedContactIds, 'contacts')}
          campaign={campaign}
          selectedContactIds={campaign.selectedContactIds}
          handleSaveAsDraft={(selectedTemplateIds) => handleSaveAsDraft(selectedTemplateIds, 'contacts')}
          loading={loading}
          API_BASE_URL={API_BASE_URL}
        />
      )}
      {step === 4 && (
        <CampaignSettings
          handleBack={handleBack}
          handleNext={() => handleNext([], 'settings')}
          campaign={campaign}
          setCampaign={setCampaign}
          handleSaveAsDraft={handleSaveAsDraft}
          loading={loading}
        />
      )}
      {step === 5 && (
        <CampaignSummary
          campaign={campaign}
          handleBack={handleBack}
          setCampaign={setCampaign}
          handleSaveAsDraft={() => handleSaveAsDraft([], 'settings')}
          loading={loading}
          handleSaveCampaign={handleSaveCampaign}
          API_BASE_URL={API_BASE_URL}
        />
      )}
    </div>
  );
}
