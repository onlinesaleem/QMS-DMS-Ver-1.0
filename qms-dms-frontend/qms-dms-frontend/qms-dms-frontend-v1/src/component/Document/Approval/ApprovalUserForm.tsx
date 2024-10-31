import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Container, Typography, Box, Grid, Card, CardContent, Modal, Pagination, CardActions, SelectChangeEvent } from '@mui/material';
import { findUserSummary } from '../../../service/UserService';
import { approvalUserList,  approvalUserMasterSetting } from '../../../service/DocumentService';


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

const APPROVER_TYPES = ["Doc_Reviewer", "Executive"];
const ITEMS_PER_PAGE = 5;

const ApprovalUserForm: React.FC = () => {
  const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
  const [approvalUsers, setApprovalUsers] = useState<ApprovalUser[]>([]);
  const [formData, setFormData] = useState<DocumentApprovalUser>({ userId: 0, approverType: '', active: true });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleActiveSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({ ...prevState, active: event.target.checked }));
  };

  const openEditModal = (user: ApprovalUser) => {
    setFormData({
      userId: user.userId,
      approverType: user.approverType,
      active: user.active,
    });
    setEditUserId(user.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isEditing && editUserId !== null) {
      // Update existing approval user
      await approvalUserMasterSetting({ ...formData, id: editUserId }); // Ensure your API supports this format
    } else {
      // Add a new approval user
      await approvalUserMasterSetting(formData);
    }
    
    setShowModal(false);
    setIsEditing(false);
    setEditUserId(null);
    setFormData({ userId: 0, approverType: '', active: true });
    
    const response = await approvalUserList(); // Refresh the user list
    setApprovalUsers(response.data);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const paginatedUsers = approvalUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={6} mb={4}>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: '#333' }}>Approval Users</Typography>
        <Button variant="contained" color="primary" onClick={() => { setShowModal(true); setIsEditing(false); }}>+ Add Approval User</Button>
      </Box>

      {/* Approval Users Grid */}
      <Grid container spacing={3}>
  {paginatedUsers.map((user) => (
    <Grid item xs={12} sm={6} md={4} key={user.id}>
      <Card elevation={2} sx={{ backgroundColor: user.active ? 'white' : '#f0f0f0' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{user.name}</Typography>
          <Typography variant="body2" color="textSecondary">Approver Type: {user.approverType}</Typography>
          <Typography variant="body2" color="textSecondary">Status: {user.active ? "Active" : "Inactive"}</Typography>
        </CardContent>
        <CardActions>
          <Button color="primary" onClick={() => openEditModal(user)}>Edit</Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(approvalUsers.length / ITEMS_PER_PAGE)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Add/Edit Approval User Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{ maxWidth: 400, margin: '50px auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" mb={2} style={{ fontWeight: 'bold', color: '#1976d2' }}>
            {isEditing ? "Edit Approval User" : "Add New Approval User"}
          </Typography>
          
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

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit">Save</Button>
              <Button variant="text" color="secondary" onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>Cancel</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default ApprovalUserForm;
