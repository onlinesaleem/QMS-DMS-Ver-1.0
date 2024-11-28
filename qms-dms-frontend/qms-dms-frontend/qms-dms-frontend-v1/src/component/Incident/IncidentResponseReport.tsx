import {
  Alert,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import { incidentFinalReport } from "../../service/TaskService";
import { useNavigate } from "react-router-dom";

interface IProps {
  incRefId: string;  // Update to specific type if necessary
  Isassign: boolean; // Use correct type as expected
}

const IncidentResponseReport: React.FC<IProps> = ({ incRefId, Isassign }) => {
  const [inctaskDatas, setInctaskDatas] = useState<any[]>([]);
  const [apierror, setApiError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidentData();
  }, [incRefId]);

  const fetchIncidentData = () => {
    console.log("Fetching incident data with id:", incRefId);
    incidentFinalReport(incRefId)
      .then((response: any) => {
        setInctaskDatas(response.data);
      })
      .catch((error) => {
        setApiError(error);
        console.log("Error:", apierror);
      });
  };

  const userFeedback = (id: string) => {
    navigate(`/user-feedback/${id}`);
  };

  if (inctaskDatas.length === 0) {
    return (
      <Typography>
        <Alert variant="filled" severity="warning">
          Corrective action assigned to the respective department person; the
          status will be updated here soon. For further clarification, contact
          the Quality department.
        </Alert>
      </Typography>
    );
  }

  return (
    <Paper>
      {inctaskDatas.map((incObj) => (
        <div key={incObj.id}>
          <hr />
          <Typography paragraph border="2px" sx={{ alignItems: "center" }}>
            Incident Status: {incObj.taskStatus.engName}
          </Typography>
          <hr />
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Inc#</TableCell>
                  <TableCell>Incident Date & Time</TableCell>
                  <TableCell>Task#</TableCell>
                  <TableCell>Task Creation</TableCell>
                  <TableCell>Task Dtls</TableCell>
                  <TableCell>Progress Notes</TableCell>
                  <TableCell>Response</TableCell>
                  <TableCell>ResponsedOn</TableCell>
                  <TableCell>ResponsedBy</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{incObj.task.incident.incNum}</TableCell>
                  <TableCell>
                    {incObj.task.incident.incDate} {incObj.task.incident.incTime}
                  </TableCell>
                  <TableCell>{incObj.task.taskNumber}</TableCell>
                  <TableCell>{incObj.task.createdOn}</TableCell>
                  <TableCell>{incObj.task.taskNote}</TableCell>
                  <TableCell>{incObj.inProgressNotes}</TableCell>
                  <TableCell>{incObj.responseText}</TableCell>
                  <TableCell>{incObj.updatedOn}</TableCell>
                  <TableCell>{incObj.userlist.name}</TableCell>
                  <TableCell>{incObj.taskStatus.engName}</TableCell>
                  {!incObj.userFeedBackDone ? (
                    <TableCell>
                      {incObj.taskStatus.id === 3 ? (
                        <Tooltip title="Your evaluation here">
                          <IconButton onClick={() => userFeedback(incObj.id)}>
                            <FeedbackOutlinedIcon sx={{ color: "blue" }} />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Typography sx={{ textAlign: "center", color: "green" }}>
                        {incObj.userFeedback.satisfactory.toUpperCase()}
                        <hr />
                        Comments: {incObj.userFeedback.comments}
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </Paper>
  );
};

export default IncidentResponseReport;
