import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isAdminUser, isManagerUser, isQualityUser } from "../../service/AuthService";
import { fetchAllTask, taskByUser } from "../../service/TaskService";
import DataTable from "../../component/DataTable/DataTable";
import { useGridApiRef } from "@mui/x-data-grid";
import { findUserIdByUsernameAPI } from "../../service/UserService";
import { getUserPermissionApi } from "../../service/UserModulePermissionService";
import KanbanBoard from "../../component/KanbanBoard/KanbanBoard";

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [fetchTask, setFetchTask] = useState([]);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const navigate = useNavigate();
  const [_totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [_userPermissionModule, setUserPermissionModule] = useState([]);
  const [loggedUserId, setLoggedUserId] = useState('');
  const apiRef = useGridApiRef();
  const [trigger] = useState(1);

  const columns = [
    {
      field: "task",
      headerName: "Task#",
      width: 150,
      renderCell: (params: any) => {
        return <>{params.value.taskNumber}</>;
      },
    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 150,
      valueGetter: (fetchTask: any) => fetchTask.row.task.createdOn,
    },
    {
      field: "taskNote",
      headerName: "Task Notes",
      width: 150,
      valueGetter: (fetchTask: any) => fetchTask.row.task.taskNote,
    },
    {
      field: "createdUser",
      headerName: "Created By",
      width: 150,
      valueGetter: (fetchTask: any) => fetchTask.row.task.createdUser.name,
    },
    {
      field: "dueDate",
      headerName: "Due On",
      width: 150,
      valueGetter: (fetchTask: any) => fetchTask.row.task.dueDate,
    },
    {
      field: "taskType",
      headerName: "Task Type",
      width: 150,
      valueGetter: (fetchTask: any) => fetchTask.row.task.typeOfTask.engName,
    },
    {
      field: "taskStatus",
      headerName: "Status",
      width: 150,
      valueGetter: (fetchTask: any) => fetchTask.row.taskStatus.engName,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (cellValues: any) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => taskResponse(cellValues.row.task.id)}
        >
          Response
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getUserTasks();
    getAllTasks();
    getModulePermission();
  }, [page, pageSize, rowsPerPage]);

  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getUserTasks = () => {
    taskByUser(`${page}`, `${rowsPerPage}`)
      .then((response) => {
        setTasks(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setPageSize(response.data.totalElements);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getModulePermission = () => {
    findUserIdByUsernameAPI()
      .then((response) => {
        setLoggedUserId(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    getUserPermissionApi(loggedUserId)
      .then((response) => {
        setUserPermissionModule(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllTasks = () => {
    fetchAllTask(`${page}`, `${pageSize}`)
      .then((response) => {
        setFetchTask(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const taskResponse = (id: any) => {
    navigate(`/task-response/${id}`);
  };

  return (
    <Box sx={{ marginTop: "5%", padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Box textAlign="center" bgcolor="primary.main" color="white" p={2} borderRadius={1}>
          <Typography variant="h6">Task List</Typography>
        </Box>

        <Button sx={{marginTop:2}} variant="contained" onClick={() => setViewMode(viewMode === 'list' ? 'board' : 'list')}>
          {viewMode === 'list' ? 'Switch to Board View' : 'Switch to List View'}
        </Button>
  
        {viewMode === 'list' ? (
          isManagerUser() ? (
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Task #</TableCell>
                    <TableCell>Created On</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Task Notes</TableCell>
                    <TableCell>Due On</TableCell>
                    <TableCell>Task Type</TableCell>
                    <TableCell>Progress Notes</TableCell>
                    <TableCell>Action Notes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((taskObj: any) => (
                    <TableRow key={taskObj.task.id}>
                      <TableCell>{taskObj.task.taskNumber}</TableCell>
                      <TableCell>{taskObj.task.createdOn}</TableCell>
                      <TableCell>{taskObj.task.createdUser.username}</TableCell>
                      <TableCell>{taskObj.task.taskNote}</TableCell>
                      <TableCell>{taskObj.task.dueDate}</TableCell>
                      <TableCell>{taskObj.task.typeOfTask.engName}</TableCell>
                      <TableCell>
                        <Tooltip title={<Typography>{taskObj.inProgressNotes || 'No progress notes'}</Typography>} arrow>
                          <span>
                            {taskObj.inProgressNotes
                              ? taskObj.inProgressNotes.length > 20
                                ? `${taskObj.inProgressNotes.substring(0, 20)}...`
                                : taskObj.inProgressNotes
                              : 'No progress notes'}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={<Typography>{taskObj.responseText || 'No response from owner'}</Typography>} arrow>
                          <span>
                            {taskObj.responseText
                              ? taskObj.responseText.length > 20
                                ? `${taskObj.responseText.substring(0, 20)}...`
                                : taskObj.responseText
                              : 'No response from owner'}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{taskObj.taskStatus.engName}</TableCell>
                      <TableCell>
                        {taskObj.taskStatus.id === 3 ? (
                          <Typography>Completed</Typography>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => taskResponse(taskObj.task.id)}
                          >
                            Response
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            (isAdminUser() || isQualityUser()) && (
              <DataTable
                rows1={fetchTask}
                columns1={columns}
                apiRef={apiRef}
                trigger={trigger}
                sx={{ marginTop: "10px" }}
                loading={undefined}
                columns={[]}
                rows={[]}
              />
            )
          )
        ) : (
          <KanbanBoard tasks={tasks} />
        )}
      </Paper>
    </Box>
  );
};

export default TaskListPage;
