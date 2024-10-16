import React, { useState, useEffect } from 'react';

export default function TemplateSelection({ handleBack, handleNext }) {
  const [templates, setTemplates] = useState([]);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    fetch(`http://localhost:3000/api/templates`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save template');
        }
        return response.json();
      })
      .then((savedTemplate) => {
        setTemplateTitle('');
        setTemplateBody('');
      })
      .catch((error) => {
        console.error('Error saving template:', error);
      });
  };

  function handleNextWithSelectedTemplates() {
    handleNext(selectedTemplateIds);
  };

  function handleSelectTemplate(templateId){
    if (!selectedTemplateIds.includes(templateId)) {
      setSelectedTemplateIds((prevIds) => [...prevIds, templateId]);
    }
  };

  return (
    <div>
      <h2>Template Selection</h2>
      <label>
        Template Name:
        <input
          type="text"
          value={templateTitle}
          onChange={(e) => setTemplateTitle(e.target.value)}
        />
      </label>
      <br />
      <label>
        Template Body:
        <textarea
          value={templateBody}
          onChange={(e) => setTemplateBody(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleBack}>Back</button>
      <button onClick={handleSaveTemplate}>Save Template</button>
      <button onClick={handleNextWithSelectedTemplates}>Next</button>


      <h3>Available Templates</h3>
      <ul>
        {templates.length > 0 ? templates.map((template) => (
          <li key={template.id}>
            <input
              type="checkbox"
              checked={selectedTemplateIds.includes(template.id)}
              onChange={() => handleSelectTemplate(template.id)}
            />
            {template.title}
          </li>
        )): ""}
      </ul>
    </div>
  );
}
