import React, { useState, useEffect } from 'react';
import '../index.css';

export default function ContactSelection({ handleBack, handleNext, campaign, selectedContactIds }) {
  const [contacts, setContacts] = useState([]);
  const [contactList, setContactList] = useState(selectedContactIds || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);
  const [filters, setFilters] = useState({ name: '', email: '', age: '', address: '' });

  useEffect(() => {
    fetchContacts();
  }, [currentPage, filters]);

  useEffect(() => {
    setContactList(selectedContactIds || []);
  }, [selectedContactIds]);

  function fetchContacts() {
    const query = new URLSearchParams({
      page: currentPage,
      limit: limit,
      'q[name_cont]': filters.name,
      'q[email_cont]': filters.email,
      'q[age_eq]': filters.age,
      'q[address_cont]': filters.address,
    }).toString();

    fetch(`http://localhost:3000/api/contacts?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setContacts(data.contacts);
        setTotalContacts(data.total);
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
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
    setContactList((prevContactList) => {
      if (allContactIds.every((id) => prevContactList.includes(id))) {
        return prevContactList.filter((id) => !allContactIds.includes(id));
      } else {
        return [...new Set([...prevContactList, ...allContactIds])];
      }
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const totalPages = Math.ceil(totalContacts / limit);

  function handleNextWithSelectedContacts() {
    handleNext(contactList);
  };

  const selectedContacts = contacts.filter(contact => contactList.includes(contact.id));
  const unselectedContacts = contacts.filter(contact => !contactList.includes(contact.id));
  const combinedContacts = [...selectedContacts, ...unselectedContacts];

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

      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={contacts.length > 0 && contacts.every(contact => contactList.includes(contact.id))}
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
          {combinedContacts.map((contact) => (
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
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next Page
        </button>
      </div>

      <div className="navigation-buttons">
        <button onClick={handleBack} className="navigation-button">
          Back
        </button>
        <button onClick={handleNextWithSelectedContacts} className="navigation-button">
          Next
        </button>
      </div>
    </div>
  );
}
