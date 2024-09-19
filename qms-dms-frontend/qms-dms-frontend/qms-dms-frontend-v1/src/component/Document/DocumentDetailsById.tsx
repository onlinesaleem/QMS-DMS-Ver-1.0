import React, { useEffect, useState, MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getDocumentDetailsById } from '../../service/DocumentService';
import { LinearProgress, Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Snackbar, Alert } from '@mui/material';
import { resetRejectDocument } from '../../service/ApprovalService';

// Define types for DTOs
interface DocumentApprovalLevelDto {
  level: number;
  approver: UserDto;
  status: string;
  timestamp: string;
  comments: string;
}

interface DocumentApprovalWorkFlowDto {
  action: string;
  user: UserDto;
  timestamp: string;
  comments: string;
}

interface DocumentDetailsDto {
  id: number;
  title: string;
  status: string;
  createdBy: string;
  createdDate: string;
  department: string;
  documentType: string;
  approvalLevels: DocumentApprovalLevelDto[];
  workflowHistory: DocumentApprovalWorkFlowDto[];
  user: UserDto;
}

interface UserDto {
  name: string;
  email: string;
  departmentId: number;
  departmentName: string;
  empNumber: number;
}

const DocumentDetailsById: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [documentDetails, setDocumentDetails] = useState<DocumentDetailsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await getDocumentDetailsById(Number(documentId));
        setDocumentDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load document details');
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [documentId]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const resetAction = async (event: MouseEvent<HTMLButtonElement>, level: number) => {
    event.preventDefault();

    try {
      await resetRejectDocument(Number(documentId), `Resetting level ${level} due to rejection`);
      setSnackbarOpen(true);

      // Immediately update the status in the UI
      setDocumentDetails((prevDetails) => {
        if (!prevDetails) return null;

        const updatedApprovalLevels = prevDetails.approvalLevels.map((lvl) =>
          lvl.level === level ? { ...lvl, status: 'PENDING', comments: null } : lvl
        );

        return { ...prevDetails, approvalLevels: updatedApprovalLevels, status: 'UNDER_REVIEW' };
      });
    } catch (error) {
      console.error('Error resetting document', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!documentDetails) return <div>No Document Found</div>;

  // Calculate approval progress
  const approvedLevels = documentDetails.approvalLevels.filter(level => level.status.toLowerCase() === 'approved').length;
  const totalLevels = documentDetails.approvalLevels.length;
  const approvalProgress = totalLevels > 0 ? (approvedLevels / totalLevels) * 100 : 0;

  return (
    <div>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Document reset successfully!
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom style={{ color: '#2e7d32', fontWeight: 'bold' }}>
        Document Details
      </Typography>

      {/* Document Information */}
      <Box mb={3}>
        <Paper elevation={4} style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h5" style={{ marginBottom: '10px', color: '#3f51b5' }}>{documentDetails.title}</Typography>
          <Typography><strong>Status:</strong> {documentDetails.status}</Typography>
          <Typography><strong>Created By:</strong> {documentDetails.createdBy}</Typography>
          <Typography><strong>Created Date:</strong> {new Date(documentDetails.createdDate).toLocaleDateString()}</Typography>
          <Typography><strong>Department:</strong> {documentDetails.department}</Typography>
          <Typography><strong>Document Type:</strong> {documentDetails.documentType}</Typography>
        </Paper>
      </Box>

      {/* Approval Progress */}
      <Box mb={3}>
        <Typography variant="h6" style={{ marginBottom: '10px' }}>Approval Progress</Typography>
        <LinearProgress variant="determinate" value={approvalProgress} style={{ height: '8px', borderRadius: '5px', backgroundColor: '#e0e0e0' }} />
        <Typography style={{ marginTop: '10px' }}>{`Approved: ${approvedLevels} / ${totalLevels} (${approvalProgress.toFixed(2)}%)`}</Typography>
      </Box>

      {/* Approval Levels */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>Approval Levels</Typography>
        <Table component={Paper} elevation={3} style={{ backgroundColor: '#fafafa' }}>
          <TableHead style={{ backgroundColor: '#2196f3', color: '#fff' }}>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell>Approver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentDetails.approvalLevels.map((level, index) => (
              <TableRow key={index}>
                <TableCell>{level.level}</TableCell>
                <TableCell>{level.approver.name}</TableCell>
                <TableCell>{level.status}</TableCell>
                <TableCell>{new Date(level.timestamp).toLocaleString()}</TableCell>
                <TableCell>{level.comments || 'N/A'}</TableCell>
                <TableCell>
                  {level.status.toLowerCase() === 'rejected' && (
                    <Button variant="contained" color="secondary" onClick={(e) => resetAction(e, level.level)}>
                      Resubmit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Workflow History */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>Workflow History</Typography>
        <Table component={Paper} elevation={3} style={{ backgroundColor: '#fafafa' }}>
          <TableHead style={{ backgroundColor: '#4caf50', color: '#fff' }}>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentDetails.workflowHistory.map((workflow, index) => (
              <TableRow key={index}>
                <TableCell>{workflow.action}</TableCell>
                <TableCell>{workflow.user.name}</TableCell>
                <TableCell>{new Date(workflow.timestamp).toLocaleString()}</TableCell>
                <TableCell>{workflow.comments || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
};

export default DocumentDetailsById;
