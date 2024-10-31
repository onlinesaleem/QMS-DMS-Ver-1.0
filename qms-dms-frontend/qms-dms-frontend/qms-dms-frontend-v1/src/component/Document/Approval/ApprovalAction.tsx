import React, { useEffect, useState } from 'react';
import {  Button, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Container, Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SelectChangeEvent } from '@mui/material';
import { findUserSummary } from '../../../service/UserService';
import { approvalUserList, approvalUserMasterSetting } from '../../../service/DocumentService';



interface DocumentApprovalUser {
  userId: number;
  approverType: string;
  active: boolean;
}

interface UserSummary {
  id: number;
  name: string;
  email: string;
  empNumber: number;
  departmentId: number;
}

interface ApprovalUser {
  id: number;
  userId: number;
  name: string;
  approverType: string;
  active: boolean;
}

const APPROVER_TYPES = ["Doc_Reviewer", "Doc_Executive"];

const ApprovalUserForm: React.FC = () => {
  const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
  const [approvalUsers, setApprovalUsers] = useState<ApprovalUser[]>([]);
  const [formData, setFormData] = useState<DocumentApprovalUser>({ userId: 0, approverType: '', active: true });
  const [showForm, setShowForm] = useState(false);

  // Fetch users and approval list on component mount
  useEffect(() => {
    const fetchUserSummary = async () => {
      const response = await findUserSummary();
      setUserSummary(response.data);
    };

    const fetchApprovalUsers = async () => {
      const response = await approvalUserList();
      setApprovalUsers(response.data);
    };

    fetchUserSummary();
    fetchApprovalUsers();
  }, []);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleActiveSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({ ...prevState, active: event.target.checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await approvalUserMasterSetting(formData);
    setShowForm(false);  // Hide the form after submission
    setFormData({ userId: 0, approverType: '', active: true });
    const response = await approvalUserList(); // Refresh approval user list after adding
    setApprovalUsers(response.data);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Approval User Settings</Typography>

      <Grid container spacing={3}>
        {/* Approval User List Section */}
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Approval Users</Typography>
            <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>+ Add Approval User</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Approver Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvalUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.approverType}</TableCell>
                    <TableCell>{user.active ? "Active" : "Inactive"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Add Approval User Form Section */}
        {showForm && (
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Add New Approval User</Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select User</InputLabel>
                <Select
                  name="userId"
                  value={formData.userId.toString()}
                  onChange={handleChange}
                >
                  {userSummary.map(user => (
                    <MenuItem key={user.id} value={user.id}>{user.name} ({user.empNumber})</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Approver Type</InputLabel>
                <Select
                  name="approverType"
                  value={formData.approverType}
                  onChange={handleChange}
                >
                  {APPROVER_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={<Switch checked={formData.active} onChange={handleActiveSwitch} name="active" color="primary" />}
                label="Active"
              />

              <Box mt={3}>
                <Button variant="contained" color="primary" type="submit">Save</Button>
                <Button variant="text" color="secondary" onClick={() => setShowForm(false)} style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ApprovalUserForm;
