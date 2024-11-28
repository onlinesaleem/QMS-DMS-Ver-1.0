import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { fetchAudits } from '../../service/AuditService';
import { findUserSummary } from '../../service/UserService';
import { AuditDto } from '../../types/AuditTypes';

const AuditList: React.FC = () => {
  const [audits, setAudits] = useState<AuditDto[]>([]); // Use AuditDto here
  const [filteredAudits, setFilteredAudits] = useState<AuditDto[]>([]); // Use AuditDto here
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const auditsData = await fetchAudits();
        const usersData = await findUserSummary();
        
        setUsers(usersData.data);

        // Enrich audits with assigned user names
        const enrichedAudits = auditsData.map((audit) => ({
          ...audit,
          assignedUserName: usersData.data.find((user) => user.id === audit.assignedToId)?.name || 'N/A',
        }));

        setAudits(enrichedAudits);
        setFilteredAudits(enrichedAudits);
      } catch (err) {
        setError('Failed to load audits');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Audit Management
      </Typography>

      {loading && <Typography>Loading audits...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Audit Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Assigned Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAudits.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell>{audit.id}</TableCell>
                <TableCell>{audit.title}</TableCell>
                <TableCell>{audit.assignedDate}</TableCell>
                <TableCell>{audit.dueDate}</TableCell>
                <TableCell>{audit.status?.engName || 'N/A'}</TableCell>
                <TableCell>{audit.assignedUser}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" color="primary">
                    View
                  </Button>
                  <Button variant="outlined" size="small" color="secondary" sx={{ ml: 1 }}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditList;
