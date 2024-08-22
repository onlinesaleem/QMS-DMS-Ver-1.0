import { useEffect, useState } from "react";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams, useGridApiRef } from "@mui/x-data-grid";
import { GeneralTaskListApi } from "../../service/TaskService";
import { getUserPermissionApi } from "../../service/UserModulePermissionService";
import { findUserIdByUsernameAPI } from "../../service/UserService";
import { useNavigate } from "react-router-dom";
import DataTable from "../../component/DataTable/DataTable";
import Charts from "../../Chart/Charts";
import KanbanBoard from "../../component/KanbanBoard/KanbanBoard";

const GeneralTaskListPage: React.FC = () => {
  const [fetchTask, setFetchTask] = useState([] as any[]);
  const [userPermissionModule, setUserPermissionModule] = useState([]);
  const [_loggedUserId, setLoggedUserId] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState("board"); // Default to board view
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const [trigger] = useState(1);

  useEffect(() => {
    getModulePermission();
    getGeneralTasks(page, pageSize);
  }, [page, pageSize]);

  const getModulePermission = () => {
    findUserIdByUsernameAPI()
      .then((response) => {
        const userId = response.data;
        if (!userId) {
          throw new Error("User ID is invalid");
        }
        setLoggedUserId(userId);
        return getUserPermissionApi(userId);
      })
      .then((response) => {
        setUserPermissionModule(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getGeneralTasks = (page: number, pageSize: number) => {
    GeneralTaskListApi(page, pageSize)
      .then((response) => {
        setFetchTask(response.data.content);
        setPageSize(response.data.totalElements);
        setPage(0);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const addTask = () => {
    navigate('/task-assign/general');
  };

  const columns: GridColDef[] = [
    {
      field: "taskNumber",
      headerName: "Task#",
      width: 150,
      valueGetter: (params: GridRenderCellParams<any>) => params.row.task.taskNumber,
    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 150,
      valueGetter: (params: GridRenderCellParams<any>) => params.row.task.createdOn,
    },
    {
      field: "taskNote",
      headerName: "Task Notes",
      width: 200,
      valueGetter: (params: GridRenderCellParams<any>) => params.row.task.taskNote,
    },
    {
      field: "createdUser",
      headerName: "Created By",
      width: 150,
      valueGetter: (params: GridRenderCellParams<any>) => params.row.task.createdUser.name,
    },
    {
      field: "dueDate",
      headerName: "Due On",
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        const dueDate = new Date(params.value);
        const today = new Date();
        const isPastDue = dueDate < today;
        const isOpenOrOnProgress = params.row.statusId === 1 || params.row.statusId === 2;

        return (
          <Typography color={isPastDue && isOpenOrOnProgress ? "red" : "inherit"}>
            {params.value}
          </Typography>
        );
      },
      valueGetter: (params: GridRenderCellParams<any>) => params.row.task.dueDate,
    },
    {
      field: "taskType",
      headerName: "Task Type",
      width: 150,
      valueGetter: (params: GridRenderCellParams<any>) => params.row.task.typeOfTask.engName,
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      width: 150,
      valueGetter: (params: GridRenderCellParams<any>) => params.row.task.assignedUser.name,
    },
    {
      field: "taskStatus",
      headerName: "Status",
      width: 150,
      valueGetter: (params: GridRenderCellParams<any>) => params.row.taskStatus.engName,
    },
    {
      field: "OwnerNotes",
      headerName: "Response",
      width: 150,
      renderCell: (params) => {
        const statusId = params.row.statusId;
        let text = "*** No response ***";

        if (statusId === 2) {
          text = params.row.inProgressNotes || text;
        } else if (statusId === 3) {
          text = params.row.responseText || text;
        }

        return (
          <Tooltip title={<Typography>{text}</Typography>} arrow>
            <span>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "daysPastDue",
      headerName: "Days Past Due",
      width: 150,
      valueGetter: (params) => {
        const dueDate = new Date(params.row.task.dueDate);
        const today = new Date();
        const diffInMs = today.getTime() - dueDate.getTime();
        const daysPastDue = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        return daysPastDue > 0 ? daysPastDue : "N/A";
      },
    },
  ];

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "board" : "grid");
  };

  return (
    <Box sx={{ marginTop: "5%", padding: 2 }}>
      <Typography variant="h6" sx={{ alignItems: "center" }}>Task Dashboard</Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {userPermissionModule.some((userModuleAccess: any) => userModuleAccess.id === 1) && (
            <Button variant="contained" color="primary" onClick={addTask} sx={{ marginRight: "auto" }}>
              Add Task
            </Button>
          )}
          <Button variant="contained" color="secondary" onClick={toggleViewMode}>
            {viewMode === "grid" ? "Show Board" : "Show Grid"}
          </Button>
        </Box>
        <Charts fetchTask={fetchTask} />
        {viewMode === "grid" ? (
          <Box mt={2}>
            <DataTable
              rows1={fetchTask}
              columns1={columns}
              apiRef={apiRef}
              trigger={trigger}
              sx={{ marginTop: "10px" }}
              loading={isLoading} rows={[]} columns={[]}            />
          </Box>
        ) : (
          <Box mt={2}>
            <KanbanBoard tasks={fetchTask} />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GeneralTaskListPage;
