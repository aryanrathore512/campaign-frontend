import React from 'react';
import '../index.css';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function CampaignTable({ name, campaigns, total, currentPage, handlePageChange }) {

  const columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Type', field: 'campaign_type', sortable: true, filter: true },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      valueGetter: params => params.data.status ? "Active" : "Inactive"
    },
    {
      headerName: 'Action',
      cellRenderer: (params) => (
        <i className="fas fa-eye" title="View Campaign" onClick={() => handleViewCampaign(params.data.id)}></i>
      )
    }
  ];

  const handleViewCampaign = (id) => {
    console.log('View campaign with ID:', id);
  };

  const totalPages = Math.ceil(total / 10);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className='contact-selection-container'>
      <h3>{name} Campaign List</h3>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={Array.isArray(campaigns) ? campaigns : []}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
