import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocumentDTO, getDocumentById } from '../../service/DocumentService';
import jsPDF from 'jspdf';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import DmsHeader from './DmsHeader';





const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentDTO | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        const response = await getDocumentById(Number(id));
        setDocument(response.data);
      }
    };
    fetchDocument();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(document?.title || '', 10, 20);
    doc.text(document?.content || '', 10, 30);
    doc.save('document.pdf');
  };

  const printDocument = () => {
    window.print();
  };

  if (!document) return <div>Loading...</div>;

  return (
    <Container>
      <DmsHeader/>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>{document.title}</Typography>
        <Box mb={2}>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: document.content }}></Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">Department ID: {document.departmentId}</Typography>
          <Typography variant="subtitle1">Status: {document.status}</Typography>
          <Typography variant="subtitle1">Created By: {document.createdBy?.username}</Typography>
          <Typography variant="subtitle1">Created Date: {document.createdDate}</Typography>
          <Typography variant="subtitle1">Updated By: {document.updatedBy?.username}</Typography>
          <Typography variant="subtitle1">Updated Date: {document.updatedDate}</Typography>
        </Box>
        <Box>
          <Button onClick={generatePDF} variant="contained">Generate PDF</Button>
          <Button onClick={printDocument} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Print</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DocumentDetails;
