import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import CreateCampaign from './CreateCampaign';
import TemplateSelection from './TemplateSelection';
import ContactSelection from './ContactSelection';
import CampaignSettings from './CampaignSettings';
import CampaignSummary from './CampaignSummary';

export default function CampaignPage() {
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
        />
      )}
      {step === 2 && (
        <TemplateSelection
          handleBack={handleBack}
          handleNext={(selectedTemplateIds) => handleNext(selectedTemplateIds, 'templates')}
          campaign={campaign}
          selectedTemplateIds={campaign.selectedTemplateIds}
        />
      )}
      {step === 3 && (
        <ContactSelection
          handleBack={handleBack}
          handleNext={(selectedContactIds) => handleNext(selectedContactIds, 'contacts')}
          campaign={campaign}
          selectedContactIds={campaign.selectedContactIds}
        />
      )}
      {step === 4 && (
        <CampaignSettings
          handleBack={handleBack}
          handleNext={() => handleNext([], 'settings')}
          campaign={campaign}
          setCampaign={setCampaign}
        />
      )}
      {step === 5 && (
        <CampaignSummary
          campaign={campaign}
          handleBack={handleBack}
          setCampaign={setCampaign}
          handleNext={() => handleNext([], 'summary')}
        />
      )}
    </div>
  );
}
