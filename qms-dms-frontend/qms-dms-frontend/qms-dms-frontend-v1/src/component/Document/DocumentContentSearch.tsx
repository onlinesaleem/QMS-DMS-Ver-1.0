import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DocumentDTO, getDocuments } from '../../service/DocumentService';

const DocumentContentSearch: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [selectedDocument, setSelectedDocument] = useState<DocumentDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await getDocuments();
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    const result = documents.map((doc) => {
      const matches = doc.attachments
        ?.flatMap((att) =>
          (att.contentText?.match(new RegExp(contentSearchQuery, 'gi')) || []).map(
            (match, index) => ({
              match,
              index,
            })
          )
        )
        .filter((match) => !!match) || [];

      return { ...doc, matchCount: matches.length };
    });

    setFilteredDocuments(
      result.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (contentSearchQuery ? doc.matchCount > 0 : true)
      )
    );
  }, [searchQuery, contentSearchQuery, documents]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleContentSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentSearchQuery(event.target.value);
  };

  const handleOpenModal = (document: DocumentDTO) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
    setCurrentMatchIndex(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
    setCurrentMatchIndex(0);
  };

  const renderContentWithSnippets = () => {
    const contentText = selectedDocument?.attachments?.[0]?.contentText || '';
    const query = contentSearchQuery.toLowerCase();
    const snippets = [];
    let position = contentText.toLowerCase().indexOf(query);

    while (position !== -1) {
      const snippetStart = Math.max(position - 30, 0);
      const snippetEnd = Math.min(position + query.length + 30, contentText.length);
      const snippet = contentText.slice(snippetStart, snippetEnd);

      snippets.push({
        before: contentText.slice(snippetStart, position),
        match: contentText.slice(position, position + query.length),
        after: contentText.slice(position + query.length, snippetEnd),
      });

      position = contentText.toLowerCase().indexOf(query, position + query.length);
    }

    return (
      <Box>
        
        <Typography variant="h6" style={{ marginBottom: '10px' }}>
          {snippets.length} Matches Found
        </Typography>
        {snippets.map((s, idx) => (
          <Box
            key={idx}
            sx={{
              padding: '8px',
              marginBottom: '15px',
              backgroundColor: idx === currentMatchIndex ? '#e3f2fd' : 'transparent',
              borderRadius: '4px',
            }}
          >
            <Typography variant="body2">
              {s.before}
              <span style={{ backgroundColor: 'yellow', fontWeight: 'bold', padding: '0 2px' }}>
                {s.match}
              </span>
              {s.after}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 70 },
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column">
          <Link to={`/documents/${params.row.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
            {params.value}
          </Link>
          {params.row.matchCount > 0 && (
            <Typography variant="caption" color="textSecondary">
              {params.row.matchCount} match{params.row.matchCount > 1 ? 'es' : ''} found
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'Result',
      headerName: 'Result',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleOpenModal(params.row)}
          size="small"
        >
          View Snippets
        </Button>
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
 
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Document Content Search
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search by title"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <TextField
          label="Search by content"
          variant="outlined"
          fullWidth
          value={contentSearchQuery}
          onChange={handleContentSearchChange}
        />
      </Box>

      <DataGrid
        rows={filteredDocuments}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          '& .MuiDataGrid-row:hover': { backgroundColor: '#e3f2fd' },
          '& .MuiDataGrid-columnHeader': { backgroundColor: '#1976d2', color: '#fff' },
        }}
      />

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>
          {selectedDocument?.title}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {contentSearchQuery ? renderContentWithSnippets() : 'No content search query entered.'}
        </DialogContent>
        {filteredDocuments.length > 1 && (
          <Box display="flex" justifyContent="space-between" p={2}>
            <Button onClick={() => setCurrentMatchIndex((i) => (i - 1 + filteredDocuments.length) % filteredDocuments.length)} variant="outlined" size="small">Previous Match</Button>
            <Typography variant="caption" color="textSecondary">
              Match {currentMatchIndex + 1} of {filteredDocuments.length}
            </Typography>
            <Button onClick={() => setCurrentMatchIndex((i) => (i + 1) % filteredDocuments.length)} variant="outlined" size="small">Next Match</Button>
          </Box>
        )}
      </Dialog>
    </Container>
  );
};

export default DocumentContentSearch;
