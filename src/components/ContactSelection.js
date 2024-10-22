import React, { useState, useEffect } from 'react';
import '../index.css';

export default function ContactSelection({ handleBack, handleNext, handleSaveAsDraft, campaign, selectedContactIds, loading, API_BASE_URL }) {
  const [contacts, setContacts] = useState([]);
  const [contactList, setContactList] = useState(selectedContactIds || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);
  const [filters, setFilters] = useState({ name: '', email: '', age: '', address: '' });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCurrentPage, setSelectedCurrentPage] = useState(1);
  const [selectedContactsPerPage] = useState(5);
  const [selectedContactsData, setSelectedContactsData] = useState([]);
  const [loadingSelected, setLoadingSelected] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [currentPage, filters]);

  useEffect(() => {
    setContactList(selectedContactIds || []);
  }, [selectedContactIds]);

  useEffect(() => {
    if (contactList.length > 0) {
      fetchSelectedContactsData();
    } else {
      setSelectedContactsData([]);
    }
  }, [contactList]);

  function fetchContacts() {
    const query = new URLSearchParams({
      page: currentPage,
      limit: limit,
      'q[name_cont]': filters.name,
      'q[email_cont]': filters.email,
      'q[age_eq]': filters.age,
      'q[address_cont]': filters.address,
    }).toString();

    fetch(`${API_BASE_URL}/contacts?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setContacts(data.contacts);
        setTotalContacts(data.total);
        const currentPageContactIds = data.contacts.map(contact => contact.id);
        const allCurrentSelected = currentPageContactIds.every(id => contactList.includes(id));
        setSelectAll(allCurrentSelected);
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
      });
  };

  function fetchSelectedContactsData() {
    setLoadingSelected(true);
    const query = new URLSearchParams({
      contact_ids: contactList.join(','),
    }).toString();

    fetch(`${API_BASE_URL}/contacts/selected_contacts?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setSelectedContactsData(data.contacts);
        setLoadingSelected(false);
      })
      .catch((error) => {
        console.error('Error fetching selected contacts:', error);
        setLoadingSelected(false);
      });
  };

  const handleCheckboxChange = (contactId) => {
    setContactList((prevContactList) => {
      if (prevContactList.includes(contactId)) {
        return prevContactList.filter((id) => id !== contactId);
      } else {
        return [...prevContactList, contactId];
      }
    });
  };

  function handleSelectAllChange() {
    const allContactIds = contacts.map((contact) => contact.id);
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      setContactList((prevContactList) => [...new Set([...prevContactList, ...allContactIds])]);
    } else {
      setContactList((prevContactList) => prevContactList.filter(id => !allContactIds.includes(id)));
    }
  };

  function handleSelectAllAcrossPages() {
    fetch(`${API_BASE_URL}/contacts?select_all=true`)
      .then((response) => response.json())
      .then((data) => {
        setContactList(data.all_contact_ids);
      })
      .catch((error) => console.error('Error selecting all contacts:', error));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectedPageChange = (newPage) => {
    if (newPage > 0 && newPage <= selectedContactsTotalPages) {
      setSelectedCurrentPage(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalContacts / limit);
  const selectedContactsTotalPages = Math.ceil(selectedContactsData.length / selectedContactsPerPage);

  const paginatedSelectedContacts = selectedContactsData.slice(
    (selectedCurrentPage - 1) * selectedContactsPerPage,
    selectedCurrentPage * selectedContactsPerPage
  );

  function handleNextWithSelectedContacts() {
    handleNext(contactList);
  };

  return (
    <div className='contact-selection-container'>
      <h3 className='contact-selection-title'>Selection of Contact</h3>

      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="age"
          placeholder="Filter by Age"
          value={filters.age}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="address"
          placeholder="Filter by Address"
          value={filters.address}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      {selectAll && (
        <a
          href="#"
          className="select-all-link"
          onClick={(e) => {
            e.preventDefault();
            handleSelectAllAcrossPages();
          }}
        >
          Select all contacts from all pages
        </a>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={contacts.length > 0 && selectAll}
                onChange={handleSelectAllChange}
              />
              Select All
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>
                <input
                  type="checkbox"
                  checked={contactList.includes(contact.id)}
                  onChange={() => handleCheckboxChange(contact.id)}
                />
              </td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.age}</td>
              <td>{contact.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous Page
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next Page
        </button>
      </div>

      {contactList.length > 0 && (
        <div>
          <h3>Selected Contacts</h3>
          {loadingSelected ? (
            <div>Loading selected contacts...</div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSelectedContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.age}</td>
                      <td>{contact.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  onClick={() => handleSelectedPageChange(selectedCurrentPage - 1)}
                  disabled={selectedCurrentPage === 1}
                  className="pagination-button"
                >
                  Previous Page
                </button>
                <span className="pagination-info">
                  Page {selectedCurrentPage} of {selectedContactsTotalPages}
                  (Showing {paginatedSelectedContacts.length} of {selectedContactsData.length} selected contacts)
                </span>
                <button
                  onClick={() => handleSelectedPageChange(selectedCurrentPage + 1)}
                  disabled={selectedCurrentPage === selectedContactsTotalPages}
                  className="pagination-button"
                >
                  Next Page
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="navigation-buttons">
        <button onClick={handleBack} className="navigation-button" disabled={loading}>
          Back
        </button>
        <button onClick={() => handleSaveAsDraft(contactList)} className="navigation-button" disabled={loading}>
          {loading ? 'Saving Draft...' : 'Save as Draft'}
        </button>
        <button onClick={handleNextWithSelectedContacts} className="navigation-button" disabled={loading}>
          {loading ? 'Loading...' : 'Next'}
        </button>
      </div>
    </div>
  );
}
