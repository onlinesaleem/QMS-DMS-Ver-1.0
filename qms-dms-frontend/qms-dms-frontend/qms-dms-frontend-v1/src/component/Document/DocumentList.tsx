import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentDTO, getDocuments } from '../../service/DocumentService';
import { Container, Typography, List, ListItem, ListItemText, Button, Box, TextField, Pagination } from '@mui/material';
import jsPDF from 'jspdf';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const documentsPerPage = 5;
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
    const result = documents.filter(document => document.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredDocuments(result);
    setPage(1); // Reset to the first page when search query changes
  }, [searchQuery, documents]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleGeneratePDF = (document: DocumentDTO) => {
    const doc = new jsPDF();
    doc.text(document.title, 10, 20);
    doc.text(document.content, 10, 30);
    doc.save('document.pdf');
  };

  const indexOfLastDocument = page * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Documents</Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
      />
      <List>
        {currentDocuments.map((document, index) => (
          <ListItem key={document.id} divider>
            <ListItemText
              primary={<Link to={`/documents/${document.id}`}>{indexOfFirstDocument + index + 1}. {document.title}</Link>}
              secondary={`Status: ${document.status}`}
            />
            <Box>
              <Button onClick={() => navigate(`/documents/${document.id}/edit`)} variant="outlined" color="primary">Edit</Button>
              <Button onClick={() => handleGeneratePDF(document)} variant="outlined">Generate PDF</Button>
            </Box>
          </ListItem>
        ))}
      </List>
      <Box mt={2}>
        <Pagination
          count={Math.ceil(filteredDocuments.length / documentsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Box mt={2}>
        <Button component={Link} to="/documents/new" variant="contained" color="primary">Create New Document</Button>
      </Box>
    </Container>
  );
};

export default DocumentList;
