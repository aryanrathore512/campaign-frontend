import React, { useState, useEffect } from 'react';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../index.css';

export default function TemplateSelection({ handleBack, handleNext, campaign, selectedTemplateIds, handleSaveDraft }) {
  const [templates, setTemplates] = useState([]);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState(selectedTemplateIds || []);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    setSelectedTemplates(selectedTemplateIds || []);
  }, [selectedTemplateIds]);

  function fetchTemplates() {
    fetch(`http://localhost:3000/api/templates`)
      .then((response) => response.json())
      .then((data) => {
        setTemplates(data);
      })
      .catch((error) => {
        console.error('Error fetching templates:', error);
      });
  };

  function handleSaveTemplate() {
    if (!templateTitle || !templateBody) {
      alert('Please fill in both the template name and body');
      return;
    }

    const newTemplate = {
      title: templateTitle,
      body: templateBody,
    };

    fetch(`http://localhost:3000/api/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTemplate),
    })
      .then((response) => response.json())
      .then((savedTemplate) => {
        setTemplateTitle('');
        setTemplateBody('');
        setTemplates((prevTemplates) => [...prevTemplates, savedTemplate]);
        setSelectedTemplates((prevIds) => [...prevIds, savedTemplate.id]);
      })
      .catch((error) => {
        console.error('Error saving template:', error);
      });
  };

  function handleNextWithSelectedTemplates() {
    handleNext(selectedTemplates);
  };

  function handleSelectTemplate(templateId) {
    setSelectedTemplates((prevIds) =>
      prevIds.includes(templateId)
        ? prevIds.filter((id) => id !== templateId)
        : [...prevIds, templateId]
    );
  };

  return (
    <div className="template-selection-container">
      <h2 className="template-selection-title">Template Selection</h2>
      <label className="template-selection-label">
        Template Name:
        <input
          type="text"
          value={templateTitle}
          onChange={(e) => setTemplateTitle(e.target.value)}
          className="template-selection-input"
        />
      </label>
      <br />
      <label className="template-selection-label">
        Template Body:
        <Quill
          value={templateBody}
          onChange={setTemplateBody}
          className="template-selection-quill"
        />
      </label>
      <br />
      <br />
      <button
        className="template-button-add"
        onClick={handleSaveTemplate}
      >
        Add New Template
      </button>
      <div className="template-selection-buttons">
        <button onClick={handleBack} className="template-button">Back</button>
        <button onClick={handleNextWithSelectedTemplates} className="template-button">Next</button>
      </div>

      <h3 className="template-selection-subtitle">Available Templates</h3>
      <ul className="template-list">
        {templates.length > 0 ? templates.map((template) => (
          <li key={template.id} className="template-list-item">
            <input
              type="checkbox"
              checked={selectedTemplates.includes(template.id)}
              onChange={() => handleSelectTemplate(template.id)}
              className="template-checkbox"
            />
            {template.title}
          </li>
        )) : <p>No templates available</p>}
      </ul>
    </div>
  );
}
