import { Paper, Tooltip, Typography, Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import DataTable from "../../component/DataTable/DataTable";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { incidentResponseView } from "../../service/TaskService";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";

export default function IncidentFinalReportGridPage() {
  const [taskResponse, setTaskResponse] = useState([]);
  const apiRef = useGridApiRef();
  const [trigger] = useState(1);
  const navigate = useNavigate();
  const [incid, setIncid] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [page] = useState(0);
  const [rowperpage] = useState(5);

  function qualityResponse(id: number) {
    navigate(`/quality-response/${id}`);
  }

  function ovrReport(id: number) {
    navigate(`/incidentById/${id}`);
  }

  const columnst: GridColDef[] = [
    {
      field: "Incident#",
      headerName: "Incident #",
      width: 150,
      valueGetter: (taskResponse: any) => taskResponse.row.task.incident.incNum,
    },
    {
      field: "incDate",
      headerName: "Incident Date",
      width: 150,
      valueGetter: (taskResponse: any) => taskResponse.row.task.incident.incDate,
    },
    {
      field: "incTime",
      headerName: "Incident Time",
      width: 150,
      valueGetter: (taskResponse: any) => taskResponse.row.task.incident.incTime,
    },
    {
      field: "taskNumber",
      headerName: "Task #",
      width: 150,
      valueGetter: (taskResponse: any) => taskResponse.row.task.taskNumber,
    },
    {
      field: "createdOn",
      headerName: "Task Created On",
      width: 150,
      valueGetter: (taskResponse: any) => taskResponse.row.task.createdOn,
    },
    {
      field: "engName",
      headerName: "Task Status",
      width: 150,
      valueGetter: (taskResponse: any) => taskResponse.row.taskStatus.engName,
    },
    {
      field: "Details",
      headerName: "Details",
      renderCell: (params) => {
        if ([1, 2, 3].includes(params.row.task.incident.statusId)) {
          const id = params.row.task.incident.id;
          return (
            <Tooltip title="OVR Report" arrow>
              <IconButton onClick={() => ovrReport(id)}>
                <AssessmentIcon fontSize="medium" sx={{ color: "blue" }} />
              </IconButton>
            </Tooltip>
          );
        }
        return null;
      },
    },
    {
      field: "id",
      headerName: "OVR Status",
      renderCell: (params) => {
        if (params.row.task.incident.statusId === 3) {
          return <Typography>Closed</Typography>;
        } else {
          setIncid(params.row.task.incident.id);
          return (
            <PendingTwoToneIcon
              fontSize="large"
              sx={{ color: "blue" }}
              onClick={() => qualityResponse(incid)}
            />
          );
        }
      },
    },
  ];

  useEffect(() => {
    viewIncidentResponse();
  }, [page, pageSize, rowperpage]);

  function viewIncidentResponse() {
    incidentResponseView(`${page}`, `${pageSize}`)
      .then((response) => {
        setTaskResponse(response.data.content);
        setPageSize(response.data.totalElements);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Paper sx={{ marginTop: "10%", padding: "2%", backgroundColor: "#f5f5f5" }}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          Incident List
        </Typography>
      </Box>
      <DataTable
        rows1={taskResponse}
        columns1={columnst}
        apiRef={apiRef}
        trigger={trigger}
        sx={{ marginTop: "10px" }}
        loading={undefined}
        columns={[]}
        rows={[]}
      />
    </Paper>
  );
}
