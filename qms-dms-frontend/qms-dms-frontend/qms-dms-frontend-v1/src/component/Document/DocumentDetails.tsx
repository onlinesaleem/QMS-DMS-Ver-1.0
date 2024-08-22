import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocumentDTO, getDocumentById, getFileBlob } from '../../service/DocumentService';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import DmsHeader from './DmsHeader';

const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentDTO | null>(null);
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDocument = async () => {
      if (id) {
        const response = await getDocumentById(Number(id));
        console.log('Fetched Document:', response.data);
        setDocument(response.data);
      }
    };
    fetchDocument();
  }, [id]);

  const handleViewFile = async (documentId: number, fileName: string) => {
    try {
      const fileBlob = await getFileBlob(documentId, fileName);
      const fileUrl = URL.createObjectURL(fileBlob);
      setFileUrls((prevUrls) => ({
        ...prevUrls,
        [`${documentId}-${fileName}`]: fileUrl,
      }));
    } catch (error) {
      console.error("Failed to fetch the file:", error);
    }
  };

  if (!document) return <div>Loading...</div>;

  return (
    <Container>
      <DmsHeader />
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        
        <Typography variant="h4" gutterBottom>{document.title}</Typography>
        <Box mb={2}>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: document.content }}></Typography>
        </Box>
        <Box mb={2}>
          
         
          <Typography variant="subtitle1">Status: {document.status}</Typography>
          <Typography variant="subtitle1">Created By: {document.createdBy?.username}</Typography>
          <Typography variant="subtitle1">Created Date: {document.createdDate}</Typography>
          <Typography variant="subtitle1">
    Department Name: {document.documentDepartment.departName}
</Typography>
          <Typography variant="subtitle1">Updated By: {document.updatedBy?.username}</Typography>
          <Typography variant="subtitle1">Updated Date: {document.updatedDate}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Attachments:</Typography>
          {document.attachments.map((attachment, index) => {
            const fileUrl = fileUrls[`${document.id}-${attachment.fileName}`];
            const fileType = attachment.fileName.split('.').pop(); // Get the file extension

            return (
              <div key={index}>
                <Button onClick={() => handleViewFile(document.id, attachment.fileName)}>
                  View {attachment.fileName}
                </Button>
                {fileUrl && (
                  fileType === 'pdf' ? (
                    <iframe 
                      src={fileUrl} 
                      style={{ width: '100%', height: '500px', marginTop: '10px' }} 
                      title={attachment.fileName} 
                    />
                  ) : (
                    <img 
                      src={fileUrl} 
                      alt={attachment.fileName} 
                      style={{ maxWidth: '100%', marginTop: '10px' }} 
                    />
                  )
                )}
              </div>
            );
          })}
        </Box>
        <Box>
          <Button variant="contained">Generate PDF</Button>
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Print</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DocumentDetails;
