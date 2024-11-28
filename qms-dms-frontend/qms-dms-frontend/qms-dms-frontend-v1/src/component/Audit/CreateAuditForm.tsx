import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper, SelectChangeEvent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { createAuditWithAttachment, fetchAuditById, fetchAuditTypes, getAuditAttachments, updateAudit } from '../../service/AuditService';
import { fetchStatus } from '../../service/TaskService';
import { findUserSummary } from '../../service/UserService';

interface Status {
  id: number;
  engName: string;
}

interface User {
  id: number;
  name: string;
}

interface AuditType {
  id: number;
  auditName: string;
}

const CreateAuditForm: React.FC = () => {
  const { auditId } = useParams<{ auditId: string }>();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<any>({
    title: '',
    assignedDate: '',
    dueDate: '',
    statusId: 0,
    assignedToId: 0,
    description: '',
    auditTypeId: 0,
  });
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditTypes, setAuditTypes] = useState<AuditType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const statusesData = await fetchStatus();
        const usersData = await findUserSummary();
        const auditTypesData = await fetchAuditTypes();
        setStatuses(statusesData.data);
        setUsers(usersData.data);
        setAuditTypes(auditTypesData.data || []);
      } catch (err) {
        setError('Failed to load dropdown data');
      }
    };

    loadDropdownData();

    // Fetch the audit details if in edit mode
    if (auditId) {
      const fetchAudit = async () => {
        try {
          const response = await fetchAuditById(Number(auditId));
          setAudit(response.data);
          setAttachments(await getAuditAttachments(Number(auditId)));
        } catch (error) {
          console.error('Error fetching audit:', error);
          setError('Failed to fetch audit details');
        }
      };
      fetchAudit();
    }
  }, [auditId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setAudit((prev) => ({
      ...prev,
      [name as string]: name === 'assignedToId' || name === 'statusId' || name === 'auditTypeId' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleStatusChange = (e: SelectChangeEvent<number>) => {
    setAudit({ ...audit, statusId: Number(e.target.value) });
  };

  const handleUserIdChange = (e: SelectChangeEvent<number>) => {
    setAudit({ ...audit, assignedToId: Number(e.target.value) });
  };

  const handleAuditTypeChange = (e: SelectChangeEvent<number>) => {
    setAudit({ ...audit, auditTypeId: Number(e.target.value) });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!audit.title || !audit.assignedDate || !audit.dueDate || !audit.auditTypeId) {
      alert('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', audit.title);
      formData.append('assignedDate', audit.assignedDate);
      formData.append('dueDate', audit.dueDate);
      formData.append('description', audit.description);
      formData.append('statusId', String(audit.statusId));
      formData.append('assignedToId', String(audit.assignedToId));
      formData.append('auditTypeId', String(audit.auditTypeId));

      if (file) {
        formData.append('file', file);
      }

      if (auditId) {
        // Update the existing audit
        await updateAudit(Number(auditId), formData);
        alert('Audit updated successfully');
      } else {
        // Create a new audit
        await createAuditWithAttachment(formData);
        alert('Audit created successfully');
      }

      navigate('/audits'); // Navigate to the list of audits after successful create/update
    } catch (err) {
      setError('Failed to create or update the audit');
    } finally {
      setLoading(false);
    }




  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          {auditId ? 'Edit Audit' : 'Create New Audit'}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={audit.title}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Assigned Date"
            name="assignedDate"
            type="date"
            value={audit.assignedDate}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={audit.dueDate}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Audit Type</InputLabel>
            <Select
              value={audit.auditTypeId}
              onChange={handleAuditTypeChange}
            
              name="auditTypeId"
              displayEmpty
              fullWidth
            >
              <MenuItem value={0} disabled>Select Audit Type</MenuItem>
              {auditTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.auditName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={audit.statusId}
              onChange={handleStatusChange}
              name="statusId"
              fullWidth
            >
              <MenuItem value={0} disabled>Select Status</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.engName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={audit.assignedToId}
              onChange={handleChange}
              name="assignedToId"
              fullWidth
            >
              <MenuItem value={0} disabled>Select User</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            name="description"
            value={audit.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <Box margin="normal">
            <Typography variant="body1" gutterBottom>
              Attach a File:
            </Typography>
            <input type="file" onChange={handleFileChange} accept="application/pdf" />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loading ? 'Saving...' : auditId ? 'Update Audit' : 'Create Audit'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateAuditForm;
