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
        const data = response.data;
        data.documentVersion = data.documentVersions; // Map backend response
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
          
         
          <Typography variant="subtitle1">Status: {document.approvalStatus}</Typography>
          <Typography variant="subtitle1">Created By: {document.createdBy?.name}</Typography>
          <Typography variant="subtitle1">Created Date: {document.createdDate}</Typography>
          <Typography variant="subtitle1">Effective Date: {document.effectiveDate}</Typography>
          <Typography variant="subtitle1">Issue Date: {document.issueDate}</Typography>
          <Typography variant="subtitle1">Review Date: {document.reviewDate}</Typography>
          <Typography variant="subtitle1">Type of Documents: {document.documentType.documentType}</Typography>
          <Typography variant="subtitle1">
    Department Name: {document.documentDepartment.departName}
</Typography>
          <Typography variant="subtitle1">Updated By: {document.updatedBy?.name}</Typography>
          <Typography variant="subtitle1">Updated Date: {document.updatedDate}</Typography>
        </Box>
        <Box mb={2}>
  <Typography variant="h6">Attachments:</Typography>
  {document.attachments.map((attachment, index) => {
    const fileUrl = fileUrls[`${document.id}-${attachment.fileName}`];
    const fileType = attachment.fileName.split('.').pop(); // Get the file extension

    return (
      <div key={index} style={{ marginBottom: '15px' }}>
        {/* Display a button to view the file */}
       

      

        {/* Display version details if available */}
        {attachment.documentVersion ? (
          <div style={{ marginTop: '10px' }}>
            <Typography>Revision Number: {attachment.documentVersion.revisionNumber}</Typography>
            <Typography>Updatedon:  {document.updatedDate}</Typography>
            <Typography>Change Summary: {attachment.documentVersion.changeSummary || 'No summary provided'}</Typography>
          </div>
        ) : (
          <Typography>No version details available</Typography>
        )}
 <Button onClick={() => handleViewFile(document.id, attachment.fileName)}>
          View {attachment.fileName}
        </Button>
        {/* Render the file based on its type */}
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
