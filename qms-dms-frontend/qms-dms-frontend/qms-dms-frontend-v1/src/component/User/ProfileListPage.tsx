import { GridCellParams, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userListAPI } from '../../service/UserService';
import { Button, Paper, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DataTable from '../DataTable/DataTable';

const ProfileListPage = () => {
  const [userList, setUserList] = useState([]);
  const apiRef = useGridApiRef();
  const [trigger] = useState(1);
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(5);
  const [page] = useState(0);
  const [rowperpage] = useState(5);

  useEffect(() => {
    fetchUserList();
  }, [page, pageSize, rowperpage]);

  const fetchUserList = () => {
    userListAPI(`${page}`, `${pageSize}`)
      .then((response) => {
        setUserList(response.data.content);
        setPageSize(response.data.totalElements);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editProgress = (userId) => {
    navigate(`/profile-update/${userId}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'empNumber',
      headerName: 'Employee Number',
      width: 150,
      valueGetter: (params) => params.row.empNumber,
    },
    {
      field: 'name',
      headerName: 'Full Name',
      width: 150,
      valueGetter: (params) => params.row.name,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      valueGetter: (params) => params.row.email,
    },
    {
      field: 'departName',
      headerName: 'Department',
      width: 150,
      valueGetter: (params) => params.row.department?.departName || '',
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      valueGetter: (params) => params.row.username,
    },
    {
      field: 'userRoles',
      headerName: 'Roles',
      width: 150,
      valueGetter: (params) => params.row.roles.map((role) => role.name).join(', '),
    },
    {
      field: 'id',
      headerName: 'Edit',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <IconButton color="primary" onClick={() => editProgress(params.row.id)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Paper
      sx={{
        marginTop: '10%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          component={Link}
          to="/user-register"
          variant="contained"
          color="primary"
          sx={{ marginBottom: '10px' }}
        >
          Add User
        </Button>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          User List
        </Typography>
      </Box>
      <DataTable
        rows1={userList}
        columns1={columns}
        apiRef={apiRef}
        trigger={trigger}
        sx={{ width: '100%' }}
        loading={undefined}
        columns={[]}
        rows={[]}
      />
    </Paper>
  );
};

export default ProfileListPage;
