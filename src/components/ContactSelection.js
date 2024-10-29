import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../index.css';

export default function ContactSelection({ handleBack, handleNext, handleSaveAsDraft, campaign, selectedContactIds, loading, API_BASE_URL, errorMessage }) {
  const [contacts, setContacts] = useState([]);
  const [contactList, setContactList] = useState(selectedContactIds || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);
  const [filters, setFilters] = useState({ name: '', email: '', age: '', address: '' });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedContactsData, setSelectedContactsData] = useState([]);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const gridRef = useRef(null);

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    { field: 'name', headerName: 'Name', filter: true },
    { field: 'email', headerName: 'Email', filter: true },
    { field: 'age', headerName: 'Age', filter: true },
    { field: 'address', headerName: 'Address', filter: true }
  ];

  const selectedColumnDefs = [
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'age', headerName: 'Age' },
    { field: 'address', headerName: 'Address' }
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

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

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      const nodes = gridRef.current.api.getRenderedNodes();
      nodes.forEach(node => {
        if (contactList.includes(node.data.id)) {
          node.setSelected(true);
        }
      });

      const currentPageContactIds = contacts.map(contact => contact.id);
      const allCurrentSelected = currentPageContactIds.every(id => contactList.includes(id));
      setSelectAll(allCurrentSelected);
    }
  }, [contacts, contactList]);

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
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setContacts(data.contacts);
        setTotalContacts(data.total);
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
      });
  }

  function fetchSelectedContactsData() {
    setLoadingSelected(true);
    const query = new URLSearchParams({
      contact_ids: contactList.join(','),
    }).toString();

    fetch(`${API_BASE_URL}/contacts/selected_contacts?${query}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
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
  }

  const onSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows();
    const selectedIds = selectedRows.map(row => row.id);
    const currentPageContactIds = contacts.map(contact => contact.id);
    const unchangedSelections = contactList.filter(id => !currentPageContactIds.includes(id));
    const newSelections = selectedIds.filter(id => currentPageContactIds.includes(id));
    setContactList([...unchangedSelections, ...newSelections]);
    setSelectAll(selectedRows.length === contacts.length);
  };

  const onGridReady = (params) => {
    const nodes = params.api.getRenderedNodes();
    nodes.forEach(node => {
      if (contactList.includes(node.data.id)) {
        node.setSelected(true);
      }
    });
  };

  function handleSelectAllAcrossPages() {
    fetch(`${API_BASE_URL}/contacts?select_all=true`)
      .then((response) => response.json())
      .then((data) => {
        setContactList(data.all_contact_ids);
      })
      .catch((error) => console.error('Error selecting all contacts:', error));
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalContacts / limit)) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const onFilterChanged = (params) => {
    const filterModel = params.api.getFilterModel();
    setFilters({
      name: filterModel.name?.filter || '',
      email: filterModel.email?.filter || '',
      age: filterModel.age?.filter || '',
      address: filterModel.address?.filter || '',
    });
    setCurrentPage(1);
  };

  function handleNextWithSelectedContacts() {
    handleNext(contactList);
  }

  return (
    <div className="contact-selection-container">
      <h3 className="contact-selection-title">Selection of Contact</h3>

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

      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={contacts}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
          pagination={true}
          paginationPageSize={limit}
          suppressPaginationPanel={true}
        />
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous Page
        </button>
        <span className="pagination-info">
          Page {currentPage} of {Math.ceil(totalContacts / limit)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalContacts / limit)}
          className="pagination-button"
        >
          Next Page
        </button>
      </div>

      {contactList.length > 0 && (
        <div>
          <h3>Selected Contacts ({contactList.length})</h3>
          {loadingSelected ? (
            <div>Loading selected contacts...</div>
          ) : (
            <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
              <AgGridReact
                columnDefs={selectedColumnDefs}
                rowData={selectedContactsData}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={5}
              />
            </div>
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