import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Box,
  IconButton,
  Pagination,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import { useNavigate } from "react-router-dom";
import { incidentResponseView } from "../../service/TaskService";
import IncidentReportById from "./IncidentReportById";

export default function IncidentCardViewPage() {
  const [taskResponse, setTaskResponse] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ taskStatus: "", ovrStatus: "", date: "", taskNumber: "" });
  const navigate = useNavigate();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1); // Reset to page 1 whenever filters change
  };

  const fetchIncidentData = () => {
    incidentResponseView(`${page - 1}`, `${pageSize}`, filters)
      .then((response) => {
        setTaskResponse(response.data.content);
        setTotalPages(Math.ceil(response.data.totalElements / pageSize));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchIncidentData();
  }, [page, filters]);

  const viewQualityResponse = (id: number, ovrStatus: string, taskStatus: string) => {
    if (ovrStatus === "Open" && taskStatus === "Closed") {
      navigate(`/quality-response/${id}`);
    }
  };

  return (
    <Box sx={{ padding: "2%" }} mt={6} mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Incident List - Card View
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => navigate("/incident-response")}>
          Switch to DataGrid View
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2}>
        <FormControl fullWidth>
          <InputLabel>Task Status</InputLabel>
          <Select name="taskStatus" value={filters.taskStatus} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>OVR Status</InputLabel>
          <Select name="ovrStatus" value={filters.ovrStatus} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Task Number"
          name="taskNumber"
          value={filters.taskNumber}
          onChange={handleFilterChange}
          fullWidth
        />
      </Box>

      {/* Card Layout */}
      <Grid container spacing={3}>
        {taskResponse.map((incident: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Incident #{incident.task.incident.incNum}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Date:</strong> {incident.task.incident.incDate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Time:</strong> {incident.task.incident.incTime}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Task #:</strong> {incident.task.taskNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Task Created On:</strong> {incident.task.createdOn}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: incident.taskStatus.engName === "Closed" ? "green" : "orange",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Task Status:</strong> {incident.taskStatus.engName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: incident.task.incident.incStatus.engName === "Closed" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  <strong>OVR Status:</strong> {incident.task.incident.incStatus.engName}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="View OVR Report" arrow>
                  <IconButton onClick={() =>
                     navigate(`/incidentResponseReport/${incident.task.incident.id}`)}>
                     
                    <AssessmentIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Quality Response" arrow>
                  <IconButton
                    onClick={() => viewQualityResponse(incident.task.incident.id, incident.task.incident.incStatus.engName, incident.taskStatus.engName)}
                    disabled={!(incident.task.incident.incStatus.engName === "Open" && incident.taskStatus.engName === "Closed")}
                  >
                    <PendingTwoToneIcon sx={{ color: "orange" }} />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Control */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
