import React from 'react';
import '../index.css';

const steps = [
  'Create Campaign',
  'Selection of Template',
  'Selection of Contacts',
  'Setting of Campaign',
  'Summary',
];

export default function StepIndicator({ currentStep }) {
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="step-indicator-container">
      <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
      <div className="step-indicator">
        {steps.map((step, index) => {
          const isActive = currentStep >= index + 1;
          return (
            <div key={index} className={`step ${isActive ? 'active' : ''}`}>
              <div className={`step-circle ${isActive ? 'active-circle' : ''}`}>
                {index + 1}
              </div>
              <div className="step-label">{step}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

