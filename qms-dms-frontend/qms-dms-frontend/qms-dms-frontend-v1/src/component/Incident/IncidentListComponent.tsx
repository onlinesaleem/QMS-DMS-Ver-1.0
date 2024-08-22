import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, IconButton, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import { fetchIncidentByReportedUser } from "../../service/IncidentService";
import { isAdminUser, isQualityUser } from "../../service/AuthService";

const IncidentListComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [incidentDatasByUser, setIncidentDatasByUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    incidentByUser();
  }, [page, rowsPerPage]);

  const incidentByUser = () => {
    if (!(isAdminUser() || isQualityUser())) {
      fetchIncidentByReportedUser(page, rowsPerPage)
        .then((response) => {
          setIncidentDatasByUser(response.data.content);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleMoreDetails = (id: any) => {
    navigate(`/incidentById/${id}`);
  };

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ marginTop: "10%" }}>
      <Box textAlign="center" bgcolor="primary.main" color="white" p={2}>
        <Typography variant="h6">Incident List</Typography>
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Incident #</TableCell>
              <TableCell>Incident Date</TableCell>
              <TableCell>Incident Details</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidentDatasByUser.map((incObj: any) => (
              <TableRow key={incObj.id}>
                <TableCell>{incObj.incNum}</TableCell>
                <TableCell>{incObj.incDate} {incObj.incTime}</TableCell>
                <TableCell>{incObj.detailsOfIncident}</TableCell>
                <TableCell>{incObj.inclocation.locationName}</TableCell>
                <TableCell>{incObj.incseverity.severType}</TableCell>
                <TableCell>{incObj.incEventCategory.eventCategoryName}</TableCell>
                <TableCell>{incObj.incStatus.engName}</TableCell>
                <TableCell>{incObj.reportedBy}</TableCell>
                <TableCell>
                  <Tooltip title="Details of the incident" arrow>
                    <IconButton onClick={() => handleMoreDetails(incObj.id)}>
                      <ExpandCircleDownOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={200} // Update with the total number of incidents
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default IncidentListComponent;
