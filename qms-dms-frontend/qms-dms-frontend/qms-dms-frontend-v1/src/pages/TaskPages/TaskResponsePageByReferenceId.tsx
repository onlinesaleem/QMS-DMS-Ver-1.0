import { useEffect, useState } from 'react';
import { taskResponseByReferenceIdandTaskTypeId } from '../../service/TaskService';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// Define interfaces for props and data
interface IProps {
  incRefId: number;
  taskTypeId: number;
}

interface TaskDto {
  taskNumber: string;
  createdOn: string;
  taskNote: string;
}

interface TaskResponseDto {
  responseText: string;
  respondedOn: string;
  createdOn: string;
}

interface CombinedTaskResponseDto {
  taskDto: TaskDto;
  taskResponseDto: TaskResponseDto;
}

const TaskResponsePageByReferenceId = ({ incRefId, taskTypeId }: IProps) => {
  const [taskDatas, setTaskDatas] = useState<CombinedTaskResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTaskResponse();
  }, []); // Only fetch once on mount

  const fetchTaskResponse = async () => {
    try {
      const response = await taskResponseByReferenceIdandTaskTypeId(incRefId, taskTypeId);
      setTaskDatas(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch task responses.');
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper>
      {taskDatas.map((taskObj: CombinedTaskResponseDto, index: number) => (
        <div key={index}>
          <hr />
          <Typography paragraph sx={{ alignItems: 'center' }}>
            Incident Status
          </Typography>
          <hr />
          <TableContainer>
            <Table stickyHeader>
              <TableHead style={{ backgroundColor: 'black', color: 'white' }}>
                <TableRow>
                  <TableCell>Task#</TableCell>
                  <TableCell>Task Creation</TableCell>
                  <TableCell>Task Details</TableCell>
                  <TableCell>Response</TableCell>
                  <TableCell>Responded On</TableCell>
                  <TableCell>Responded By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Are you satisfied with this action?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{taskObj.taskDto.taskNumber}</TableCell>
                  <TableCell>{taskObj.taskDto.createdOn}</TableCell>
                  <TableCell>{taskObj.taskDto.taskNote}</TableCell>
                  <TableCell>{taskObj.taskResponseDto.responseText}</TableCell>
                  <TableCell>{taskObj.taskResponseDto.respondedOn}</TableCell>
                  <TableCell>{taskObj.taskResponseDto.createdOn}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </Paper>
  );
};

export default TaskResponsePageByReferenceId;
