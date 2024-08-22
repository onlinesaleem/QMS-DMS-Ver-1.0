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
  incRefId: any;
  Isassign: any;
}
const IncidentResponseReport = ({ incRefId }: IProps) => {
  

  const [inctaskDatas, setInctaskDatas] = useState([]);



  
  const [apierror, setApiError] = useState<Error | null>(null);

  const navigate = useNavigate();



  useEffect(() => {
    incidenRefId();
  }, []);

  function incidenRefId() {
    const id = incRefId;
    console.log("the selected id from the response page" + id);
    incidentFinalReport(id)
      .then((response: any) => {
        setInctaskDatas(response.data);
      })
      .catch((error) => {
        setApiError(error);
        console.log("null value is" + apierror);
      });
  }

  if (inctaskDatas.length === 0) {
    return (
      <Typography>
        <Alert variant="filled" severity="warning">
          corrective action assiged to the respective department person, the
          status will be update here soon. If need further clarification contact
          Quality department.
        </Alert>
      </Typography>
    );
  }

  

  function userFeedback(id: any) {
    navigate(`/user-feeback/${id}`);
  }

  return (
    <>
      <Paper>
        {inctaskDatas.map((incObj: any) => (
          <>
            <hr></hr>
            <Typography paragraph border="2px" sx={{ alignItems: "center" }}>
              Incident Status : {incObj.taskStatus.engName}
            </Typography>
            <hr></hr>
            <TableContainer>
              <Table stickyHeader style={{ border: "20px" }}>
                <TableHead style={{ backgroundColor: "black", color: "white" }}>
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
                    <TableCell>Are you satisfied with this action?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{incObj.task.incident.incNum}</TableCell>
                    <TableCell>
                      {incObj.task.incident.incDate}{" "}
                      {incObj.task.incident.incTime}
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
                        {" "}
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
                        <Typography
                          sx={{ textAlign: "center", color: "green" }}
                        >
                          {incObj.userFeedback.satisfactory.toUpperCase()}{" "}
                          <hr></hr>
                          Comments {incObj.userFeedback.comments}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ))}
      </Paper>
    </>
  );
};

export default IncidentResponseReport;
