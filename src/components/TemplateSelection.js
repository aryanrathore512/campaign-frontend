import React, { useState, useEffect, useRef } from 'react';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../index.css';

export default function TemplateSelection({ handleBack, handleNext, selectedTemplateIds, handleSaveAsDraft, loading, API_BASE_URL }) {
  const [templates, setTemplates] = useState([]);
  const [templateFormList, setTemplateFormList] = useState([{ title: '', body: '' }]);
  const [selectedTemplates, setSelectedTemplates] = useState(selectedTemplateIds || []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplateAdded, setNewTemplateAdded] = useState(false);

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
      .then((data) => {
        setTemplates(data);
      })
      .catch((error) => {
        console.error('Error fetching templates:', error);
      });
  };

  function handleSaveTemplate(index) {
    const { title, body } = templateFormList[index];

    if (!title || !body) {
      alert('Please fill in both the template name and body');
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
        setTemplateFormList((prevList) => prevList.map((form, idx) => (idx === index ? { title: '', body: '' } : form)));
        setTemplates((prevTemplates) => [...prevTemplates, savedTemplate]);
        setSelectedTemplates((prevIds) => [...prevIds, savedTemplate.id]);
      })
      .catch((error) => {
        console.error('Error saving template:', error);
      });
  };

  function handleEditTemplate(template) {
    setEditingTemplate(template);
    setTemplateFormList([{ title: template.title, body: template.body }]);
  };

  function handleSaveEditedTemplate() {
    if (!editingTemplate) return;

    const updatedTemplate = {
      title: templateFormList[0].title,
      body: templateFormList[0].body,
    };

    fetch(`${API_BASE_URL}/templates/${editingTemplate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTemplate),
    })
      .then((response) => response.json())
      .then((updatedTemplate) => {
        setTemplates((prevTemplates) =>
          prevTemplates.map((template) =>
            template.id === updatedTemplate.id ? updatedTemplate : template
          )
        );
        setEditingTemplate(null);
        setTemplateFormList([{ title: '', body: '' }]);
      })
      .catch((error) => {
        console.error('Error updating template:', error);
      });
  };

  function handleSelectTemplate(templateId) {
    setSelectedTemplates((prevIds) =>
      prevIds.includes(templateId) ? prevIds.filter((id) => id !== templateId) : [...prevIds, templateId]
    );
  };

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  };

  function addNewTemplateForm() {
    setTemplateFormList((prevList) => [...prevList, { title: '', body: '' }]);
    setNewTemplateAdded(true);
  };

  function handleTemplateInputChange(index, field, value) {
    setTemplateFormList((prevList) => prevList.map((form, idx) => (idx === index ? { ...form, [field]: value } : form)));
  };

  function insertPlaceholder(index, placeholder) {
    const quillEditor = quillRefs.current[index];
    const range = quillEditor.getEditor().getSelection();
    if (range) {
      quillEditor.getEditor().clipboard.dangerouslyPasteHTML(range.index, `{{${placeholder}}}`);
    }
  }

  function deleteTemplateForm(index) {
    setTemplateFormList((prevList) => prevList.filter((_, idx) => idx !== index));
    if (templateFormList.length === 1) {
      setNewTemplateAdded(false);
    }
  }

  return (
    <div className="template-selection-container">
      <h2 className="template-selection-title">Template Selection</h2>

      <div className="template-dropdown-container">
        <button onClick={toggleDropdown} className="dropdown-button">
          {dropdownOpen ? 'Hide Templates 👆' : 'Show Existing Templates 👇'}
        </button>
        {dropdownOpen && (
          <ul className="template-dropdown-list">
            {templates.length > 0 ? (
              templates.map((template) => (
                <li key={template.id} className="template-list-item">
                  <input
                    type="checkbox"
                    checked={selectedTemplates.includes(template.id)}
                    onChange={() => handleSelectTemplate(template.id)}
                    className="template-checkbox"
                  />
                  {template.title}
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                </li>
              ))
            ) : (
              <p>No templates available</p>
            )}
          </ul>
        )}
      </div>

      {templateFormList.map((form, index) => (
        <div key={index} className="template-form-container">
          <h3 className="new-template-header">New Template</h3>
          <label className="template-selection-label">
            Template Name:
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTemplateInputChange(index, 'title', e.target.value)}
              className="template-selection-input"
            />
          </label>
          <br />
          <label className="template-selection-label">
            Template Body:
            <div className="template-placeholder-options">
              <button onClick={() => insertPlaceholder(index, 'name')} className="template-button-save">
                Name
              </button>
              <button onClick={() => insertPlaceholder(index, 'address')} className="template-button-save" style={{marginLeft: "10px"}}>
                Address
              </button>
            </div>
            <Quill
              ref={(el) => (quillRefs.current[index] = el)}
              value={form.body}
              onChange={(value) => handleTemplateInputChange(index, 'body', value)}
              className="template-selection-quill"
            />
          </label>
          <br />
          {newTemplateAdded && (
            <button className="template-button-save" style={{marginRight: "10px"}} onClick={() => deleteTemplateForm(index)}>
              🗑 Delete
            </button>
          )}
          {editingTemplate ? (
            <button className="template-button-save" onClick={handleSaveEditedTemplate}>
              Save Changes
            </button>
          ) : (
            <button className="template-button-save" onClick={() => handleSaveTemplate(index)}>
              Save Template
            </button>
          )}
        </div>
      ))}

      {!editingTemplate && (
        <button className="template-button-add-new" onClick={addNewTemplateForm}>
          Add New Template
        </button>
      )}

      <div className="template-selection-buttons">
        <button onClick={handleBack} className="template-button">Back</button>
        <button
          onClick={() => handleSaveAsDraft(selectedTemplates) }
          className="form-button draft-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          onClick={() => handleNext(selectedTemplates)}
          className="form-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
