import React, { useState } from 'react';
import CreateCampaign from './CreateCampaign';
import TemplateSelection from './TemplateSelection';
import ContactSelection from './ContactSelection'

export default function CampaignPage() {
  const [campaign, setCampaign] = useState({
    name: '',
    campaign_type: '',
    selectedTemplateIds: [],
  });
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {step === 1 && (
        <CreateCampaign
          campaign={campaign}
          setCampaign={setCampaign}
          handleNext={handleNext}
        />
      )}
      {step === 2 && (
        <TemplateSelection
          handleBack={handleBack}
          handleNext={handleNext}
          campaign={campaign}
        />
      )}
      {step === 3 && (
        <ContactSelection
          handleBack={handleBack}
          handleNext={handleNext}
          campaign={campaign}
        />
      )}
    </div>
  );
}
