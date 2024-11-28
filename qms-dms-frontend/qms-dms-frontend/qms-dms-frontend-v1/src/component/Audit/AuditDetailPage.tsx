import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Card, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAuditDetails } from '../../service/AuditService'; // Service to fetch audit details, responses, and attachments

const AuditDetailPage: React.FC = () => {
  const { auditId } = useParams<{ auditId: string }>(); // Extract auditId from URL
  const navigate = useNavigate(); // Hook to navigate between pages

  const [auditDetail, setAuditDetail] = useState<any>(null); // State for storing audit details
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetching data
  const [error, setError] = useState<string | null>(null); // Error state
  const [isResponseSubmitted, setIsResponseSubmitted] = useState<boolean>(false); // Check if response has been submitted

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const details = await fetchAuditDetails(Number(auditId)); // Fetch audit details
        setAuditDetail(details); // Store the fetched data in the state
        // Check if any response has been submitted
        setIsResponseSubmitted(details.responses?.length > 0);
      } catch (err) {
        setError('Failed to load audit details');
      } finally {
        setLoading(false);
      }
    };

    if (auditId) {
      fetchDetails(); // Fetch details when auditId is available
    }
  }, [auditId]);

  // Handle adding a new audit response
  const handleAddResponse = () => {
    navigate(`/audits/${auditId}/responses`); // Navigate to the response form
  };

  // Handle page navigation back to the audit list
  const handleGoBack = () => {
    navigate('/audits'); // Navigate back to the audits list page
  };

  // If loading, show the loading spinner
  if (loading) return <CircularProgress />;

  // If error, display error message
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: 'auto' }}>
      {/* Audit Details */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>{auditDetail?.title}</Typography>
          <Typography variant="body1" paragraph>{auditDetail?.description}</Typography>
          <Typography variant="body2" color="textSecondary">
            Assigned Date: {new Date(auditDetail?.assignedDate).toLocaleDateString()}<br />
            Due Date: {new Date(auditDetail?.dueDate).toLocaleDateString()}<br />
            Status: <span style={{ color: auditDetail?.status === 'Completed' ? 'green' : 'orange' }}>
              {auditDetail?.status.engName || 'In Progress'}
            </span>
          </Typography>
        </CardContent>
      </Card>

      {/* Created By and Responded By */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Audit Information</Typography>
          <Typography variant="body2">Created By: {auditDetail?.createdBy}</Typography>
          <Typography variant="body2">Responded By: {auditDetail?.respondedBy || 'N/A'}</Typography>
        </CardContent>
      </Card>

      {/* Response Section */}
      <Typography variant="h6" sx={{ marginTop: 3 }}>Audit Responses</Typography>
      {auditDetail?.responses && auditDetail.responses.length > 0 ? (
        <List>
          {auditDetail.responses.map((response: any) => (
            <ListItem key={response.id}>
              <ListItemText
                primary={`Response: ${response.response}`}
                secondary={`Submitted on: ${new Date(response.responseDate).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No responses yet.</Typography>
      )}

      {/* Attachments Section */}
      <Typography variant="h6" sx={{ marginTop: 3 }}>Attachments</Typography>
      {auditDetail?.attachments && auditDetail.attachments.length > 0 ? (
        <List>
          {auditDetail.attachments.map((attachment: any) => (
            <ListItem key={attachment.id}>
              <ListItemText
                primary={
                  <a href={`/api/files/${attachment.fileName}`} target="_blank" rel="noopener noreferrer">
                    {attachment.fileName}
                  </a>
                }
                secondary={`Uploaded on: ${new Date(attachment.uploadDate).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No attachments available.</Typography>
      )}

      {/* Add Response Button */}
      {isResponseSubmitted ? (
        <Typography variant="body1" color="textSecondary">Response has already been submitted.</Typography>
      ) : (
        <Button variant="contained" color="primary" onClick={handleAddResponse} sx={{ marginTop: 2 }}>
          Add Response
        </Button>
      )}

      {/* Go Back Button */}
      <Button variant="outlined" color="secondary" onClick={handleGoBack} sx={{ marginTop: 2 }}>
        Go Back
      </Button>
    </Box>
  );
};

export default AuditDetailPage;
