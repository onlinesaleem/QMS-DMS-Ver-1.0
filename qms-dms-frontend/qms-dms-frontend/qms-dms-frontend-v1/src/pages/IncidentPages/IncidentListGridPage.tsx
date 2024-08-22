import { useEffect, useState } from "react";
import { isAdminUser, isQualityUser } from "../../service/AuthService";
import { getAllIncidents } from "../../service/IncidentService";
import DataTable from "../../component/DataTable/DataTable";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { Button, Paper, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[3],
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  textAlign: 'center',
  color: theme.palette.primary.main,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function IncidentListGridPage() {
  const [incidents, setIncident] = useState([]);
  const apiRef = useGridApiRef();
  const [trigger] = useState(1);
  const [incId, setIncId] = useState("");
  const [_assignId, setAssignId] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const columnst: GridColDef[] = [
    { field: "incNum", headerName: "Incident#", width: 150 },
    { field: "incDate", headerName: "Date", width: 150 },
    {
      field: "View",
      headerName: "View",
      renderCell: (params) => {
        const handleViewClick = () => {
          navigate(`/incidentById/${params.row.id}`);
        };
    
        return (
          <DescriptionIcon onClick={handleViewClick} style={{ color: 'blue', cursor: 'pointer' }}>
            View
          </DescriptionIcon>
        );
      },
    },
    { field: "detailsOfIncident", headerName: "Details", width: 150,valueGetter: (incidents: any) => incidents.row.detailsOfIncident, },
    { field: "locationName", headerName: "Location", width: 150,valueGetter: (incidents: any) => incidents.row.inclocation.locationName },
    { field: "severType", headerName: "Severity", width: 150,valueGetter: (incidents: any) => incidents.row.incseverity.severType },
    { field: "engName", headerName: "Status", width: 150, valueGetter: (incidents: any) => incidents.row.incStatus.engName },
    { field: "reportedBy", headerName: "Reported By", width: 150, valueGetter: (incidents: any) => incidents.row.reportedBy },
    {
      field: "isAssigned",
      headerName: "Is Assigned",
      valueGetter: ({ row }) => (row.tassigned ? "Yes" : "No"),
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        if (params.row.statusId === 1) {
          return (
            <ActionButton
              variant="contained"
              onClick={() => taskAssigned(params.row.id, params.row.tassigned)}
            >
              Action
            </ActionButton>
          );
        }
        return <Typography color="blue">{params.row.incStatus.engName}</Typography>;
      },
      width: 150,
    },
  ];

  function taskAssigned(id: any, tassigned: any) {
    setIncId(id);
    setAssignId(tassigned);
    if (tassigned) {
      setOpen(true);
    } else {
      navigate(`/assign/${id}`);
    }
  }

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleProceed = () => {
    setOpen(false);
    navigate(`/assign/${incId}`);
  };

  useEffect(() => {
    listIncidents();
  }, []);

  function listIncidents() {
    if (isAdminUser() || isQualityUser()) {
      getAllIncidents()
        .then((response) => {
          setIncident(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    <StyledPaper>
      <HeaderTypography variant="h4">List of Incident </HeaderTypography>
      <DataTable
        rows1={incidents}
        columns1={columnst}
        apiRef={apiRef}
        trigger={trigger}
        sx={{ marginTop: "10px" }}
        loading={undefined}
        columns={[]}
        rows={[]}
      />
      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Task Already Assigned</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This task is already assigned. Do you want to add more tasks for another user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleProceed} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
}
