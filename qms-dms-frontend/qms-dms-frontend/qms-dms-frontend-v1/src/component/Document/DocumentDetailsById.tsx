import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDocumentDetailsById } from '../../service/DocumentService';
import { LinearProgress, Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!documentDetails) return <div>No Document Found</div>;

  // Calculate approval progress
  const approvedLevels = documentDetails.approvalLevels.filter(level => level.status.toLowerCase() === 'approved').length;
  const totalLevels = documentDetails.approvalLevels.length;
  const approvalProgress = totalLevels > 0 ? (approvedLevels / totalLevels) * 100 : 0;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Document Details</Typography>

      {/* Document Information */}
      <Box mb={3}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5">{documentDetails.title}</Typography>
          <Typography><strong>Status:</strong> {documentDetails.status}</Typography>
          <Typography><strong>Created By:</strong> {documentDetails.createdBy}</Typography>
          <Typography><strong>Created Date:</strong> {new Date(documentDetails.createdDate).toLocaleDateString()}</Typography>
          <Typography><strong>Department:</strong> {documentDetails.department}</Typography>
          <Typography><strong>Document Type:</strong> {documentDetails.documentType}</Typography>
        </Paper>
      </Box>

      {/* Approval Progress */}
      <Box mb={3}>
        <Typography variant="h6">Approval Progress</Typography>
        <LinearProgress variant="determinate" value={approvalProgress} />
        <Typography>{`Approved: ${approvedLevels} / ${totalLevels} (${approvalProgress.toFixed(2)}%)`}</Typography>
      </Box>

      {/* Approval Levels */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>Approval Levels</Typography>
        <Table component={Paper} elevation={3}>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell>Approver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Comments</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Workflow History */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>Workflow History</Typography>
        <Table component={Paper} elevation={3}>
          <TableHead>
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
