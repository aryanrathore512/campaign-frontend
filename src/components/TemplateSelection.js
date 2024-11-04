import React, { useState, useEffect, useRef } from 'react';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../index.css';

export default function TemplateSelection({ handleBack, handleNext, selectedTemplateIds, handleSaveAsDraft, loading, API_BASE_URL, errorMessage }) {
  const [templates, setTemplates] = useState([]);
  const [newTemplateForms, setNewTemplateForms] = useState([{ title: '', body: '' }]);
  const [selectedTemplates, setSelectedTemplates] = useState(selectedTemplateIds || []);
  const [editingTemplates, setEditingTemplates] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const quillRefs = useRef([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    setSelectedTemplates(selectedTemplateIds || []);
  }, [selectedTemplateIds]);

  function fetchTemplates() {
    fetch(`${API_BASE_URL}/templates`)
      .then((response) => response.json())
      .then((data) => setTemplates(data))
      .catch((error) => console.error('Error fetching templates:', error));
  }

  function handleSelectTemplate(templateId) {
    const isSelected = selectedTemplates.includes(templateId);
    if (!isSelected) {
      setSelectedTemplates((prevIds) => [...prevIds, templateId]);
    } else {
      setSelectedTemplates((prevIds) => prevIds.filter(id => id !== templateId));
    }
  }

  function handleEditTemplate(templateId) {
    const templateToEdit = templates.find((template) => template.id === templateId);
    if (templateToEdit && !editingTemplates.find((t) => t.id === templateId)) {
      setEditingTemplates((prev) => [...prev, { ...templateToEdit }]);
    }
  }

  function handleTemplateInputChange(templateId, field, value) {
    setEditingTemplates((prev) =>
      prev.map(template => template.id === templateId ? { ...template, [field]: value } : template)
    );
  }

  function handleSaveEditedTemplate(templateId) {
    const updatedTemplate = editingTemplates.find(template => template.id === templateId);

    fetch(`${API_BASE_URL}/templates/${templateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTemplate),
    })
      .then((response) => response.json())
      .then((updatedTemplate) => {
        setTemplates((prev) =>
          prev.map(template => template.id === updatedTemplate.id ? updatedTemplate : template)
        );
        setEditingTemplates((prev) =>
          prev.filter(template => template.id !== updatedTemplate.id)
        );
      })
      .catch((error) => console.error('Error updating template:', error));
  }

  function handleAddNewTemplateForm() {
    setNewTemplateForms((prev) => [...prev, { title: '', body: '' }]);
  }

  function handleNewTemplateInputChange(index, field, value) {
    setNewTemplateForms((prev) => prev.map((form, idx) => idx === index ? { ...form, [field]: value } : form));
    setValidationErrors(prevErrors => prevErrors.filter(error => error.index !== index));
  }

  function handleSaveNewTemplate(index) {
    const { title, body } = newTemplateForms[index];

    if (!title || !body) {
      setValidationErrors((prevErrors) => {
        const errorExists = prevErrors.find(error => error.index === index);
        if (!errorExists) {
          return [...prevErrors, { index, message: 'Both title and body are required.' }];
        }
        return prevErrors;
      });
      return;
    }

    const newTemplate = { title, body };

    fetch(`${API_BASE_URL}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTemplate),
    })
      .then((response) => response.json())
      .then((savedTemplate) => {
        setTemplates((prevTemplates) => [...prevTemplates, savedTemplate]);
        setNewTemplateForms((prevForms) => prevForms.filter((_, idx) => idx !== index));
        setValidationErrors(prevErrors => prevErrors.filter(error => error.index !== index));
      })
      .catch((error) => console.error('Error saving template:', error));
  }

  function handleDeleteNewTemplate(index) {
    setNewTemplateForms((prevForms) => prevForms.filter((_, idx) => idx !== index));
    setValidationErrors(prevErrors => prevErrors.filter(error => error.index !== index));
  }

  return (
    <div className="template-selection-container">
      <h2 className="template-selection-title">Template Selection</h2>

      <div className="template-dropdown-container">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-button">
          {dropdownOpen ? 'Hide Templates 👆' : 'Show Existing Templates 👇'}
        </button>
        {dropdownOpen && (
          <ul className="template-dropdown-list">
            {templates.map((template) => (
              <li key={template.id} className="template-list-item">
                <input
                  type="checkbox"
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => handleSelectTemplate(template.id)}
                  className="template-checkbox"
                />
                {template.title}
                <button onClick={() => handleEditTemplate(template.id)} className="edit-button">
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingTemplates.map((template) => (
        <div key={template.id} className="template-form-container">
          <h3 className="template-header">Edit Template - {template.title}</h3>
          <label className="template-selection-label">
            Template Name:
            <input
              type="text"
              value={template.title}
              onChange={(e) => handleTemplateInputChange(template.id, 'title', e.target.value)}
              className="template-selection-input"
            />
          </label>
          <label className="template-selection-label">
            Template Body:
            <Quill
              ref={(el) => (quillRefs.current[template.id] = el)}
              value={template.body}
              onChange={(value) => handleTemplateInputChange(template.id, 'body', value)}
              className="template-selection-quill"
            />
          </label>
          <br/>
          <button onClick={() => handleSaveEditedTemplate(template.id)} className="template-button-save">
            Edit Template
          </button>
        </div>
      ))}

      {newTemplateForms.map((form, index) => (
        <div key={index} className="template-form-container">
          <h3 className="template-header">New Template {index + 1}</h3>
          <label className="template-selection-label">
            Template Name: <span style={{ color: 'red' }}>*</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleNewTemplateInputChange(index, 'title', e.target.value)}
              className="template-selection-input"
            />
          </label>
          <label className="template-selection-label">
            Template Body: <span style={{ color: 'red' }}>*</span>
            <Quill
              ref={(el) => (quillRefs.current[index] = el)}
              value={form.body}
              onChange={(value) => handleNewTemplateInputChange(index, 'body', value)}
              className="template-selection-quill"
            />
          </label>
          <br/><br/>
          {validationErrors.find(error => error.index === index) && (
            <p className="error-message">{validationErrors.find(error => error.index === index).message}</p>
          )}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button onClick={() => handleSaveNewTemplate(index)} className="template-button-save">
            Save Template
          </button>
          <button style={{marginLeft: "6px"}} onClick={() => handleDeleteNewTemplate(index)} className="template-button-save">
            Delete Template
          </button>
        </div>
      ))}

      <button onClick={handleAddNewTemplateForm} className="template-button-add-new">
        Add New Template
      </button>

      <div className="template-selection-buttons">
        <button onClick={handleBack} className="template-button">Back</button>
        <button onClick={() => handleSaveAsDraft(selectedTemplates)} className="form-button draft-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button onClick={() => handleNext(selectedTemplates)} className="form-button">
          Next
        </button>
      </div>
    </div>
  );
}
