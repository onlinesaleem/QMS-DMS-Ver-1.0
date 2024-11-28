

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { DocumentDTO, getDocuments } from '../../service/DocumentService';
import { Box, Button, Container, TextField, Typography, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import jsPDF from 'jspdf';

const DocumentDataGrid: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await getDocuments();
      setDocuments(response.data);
      setFilteredDocuments(response.data); // Initially, all documents are shown
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    // Apply combined filters: search, department, and document type
    const result = documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (departmentFilter ? doc.documentDepartment.departName === departmentFilter : true) &&
      (documentTypeFilter ? doc.documentType.documentType === documentTypeFilter : true)
    );
    setFilteredDocuments(result);
  }, [searchQuery, departmentFilter, documentTypeFilter, documents]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentFilterChange = (event: SelectChangeEvent<string>) => {
    setDepartmentFilter(event.target.value as string);
  };

  const handleDocumentTypeFilterChange = (event: SelectChangeEvent<string>) => {
    setDocumentTypeFilter(event.target.value as string);
  };

  const handleGeneratePDF = (document: DocumentDTO) => {
    const doc = new jsPDF();
    doc.text(document.title, 10, 20);
    doc.text(document.content, 10, 30);
    doc.save('document.pdf');
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 70 },
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      renderCell: (params) => (
        <Link to={`/documents/${params.row.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
          {params.value}
        </Link>
      ),
    },
    { field: 'effectiveDate', headerName: 'Effective Date', width: 150 },
    { field: 'issueDate', headerName: 'Issue Date', width: 150 },
    { field: 'reviewDate', headerName: 'Review Date', width: 150 },
    {
      field: 'departName',
      headerName: 'Department',
      width: 150,
      valueGetter: (params) => params.row.documentDepartment.departName,
    },
    {
      field: 'documentType',
      headerName: 'Document Type',
      width: 150,
      valueGetter: (params) => params.row.documentType.documentType,
    },
    { field: 'approvalStatus', headerName: 'Status', width: 150,
      renderCell:(params)=>(
        <Link to={`/documents/${params.row.id}/details`} style={{textDecoration:'none',color:'#1976d2'}}>
        {params.row.approvalStatus}
        </Link>
      )
      

     },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/documents/${params.row.id}/edit`)}
            style={{ marginRight: '10px' }}
          >
            Edit
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleGeneratePDF(params.row)}>
            PDF
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Document Management
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search by title"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
        style={{ marginBottom: '20px' }}
      />

      {/* Department Filter */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="department-label">Filter by Department</InputLabel>
        <Select
          labelId="department-label"
          value={departmentFilter}
          onChange={handleDepartmentFilterChange}
        >
          <MenuItem value="">All Departments</MenuItem>
          {/* Example department values */}
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
        </Select>
      </FormControl>

      {/* Document Type Filter */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="documentType-label">Filter by Document Type</InputLabel>
        <Select
          labelId="documentType-label"
          value={documentTypeFilter}
          onChange={handleDocumentTypeFilterChange}
        >
          <MenuItem value="">All Document Types</MenuItem>
          {/* Example document type values */}
          <MenuItem value="Policy">Policy</MenuItem>
          <MenuItem value="Procedure">Procedure</MenuItem>
          <MenuItem value="Report">Report</MenuItem>
        </Select>
      </FormControl>

      {/* Data Grid */}
      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
    rows={filteredDocuments}
    columns={columns}
    paginationModel={paginationModel}
    onPaginationModelChange={setPaginationModel}
    pageSizeOptions={[5, 10, 20]}
    disableRowSelectionOnClick
    pagination
    sx={{
      '& .MuiDataGrid-row:hover': {
        backgroundColor: '#e3f2fd',
      },
      '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#1976d2',
        color: '#fff',
      },
      '& .MuiDataGrid-footerContainer': {
        justifyContent: 'flex-start',
      },
    }}
  />
      </Box>

      {/* Create New Document Button */}
      <Box mt={2}>
        <Button
          component={Link}
          to="/documents/new"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Create New Document
        </Button>
      </Box>
    </Container>
  );
};

export default DocumentDataGrid;