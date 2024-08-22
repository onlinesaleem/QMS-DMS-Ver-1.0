import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
 
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchQualityResponseByIncidentId } from "../../service/IncidentService";

interface Iprops {
  incId: any;
}
const QualityResponseViewByIncidentId = ({ incId }: Iprops) => {
  const [qualityResponse, setQualityResponse] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(true);

  useEffect(() => {
    fetchAPIQualityResponseByIncidentId();
  }, [isDataAvailable]);

  function fetchAPIQualityResponseByIncidentId() {
    fetchQualityResponseByIncidentId(incId)
      .then((response) => {
        setQualityResponse(response.data);

        isDataAvailable(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });

    function isDataAvailable(record: number) {
      if (record === 0) {
        setIsDataAvailable(false);
      } else {
        setIsDataAvailable(true);
      }
    }
  }

  return (
    <>
      {isDataAvailable ? (
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          {qualityResponse.map((qualityObj: any) => (
            <>
              <TableHead style={{ backgroundColor: "black", color: "white" }}>
                <TableRow>
                  <TableCell>Final Action</TableCell>
                  <TableCell>Created On</TableCell>
                  <TableCell>Created by</TableCell>
                  <TableCell> Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={qualityObj.id}>
                  <TableCell>
                    {qualityObj.finalActionTaken === "appropriate" ? (
                      <Alert severity="success">
                        {qualityObj.finalActionTaken}
                        <br />
                        {qualityObj.ifNotAppropriate}
                      </Alert>
                    ) : (
                      <Alert severity="warning">
                        {qualityObj.finalActionTaken}
                        <br />
                        {qualityObj.ifNotAppropriate}
                      </Alert>
                    )}
                  </TableCell>

                  <TableCell>{qualityObj.updatedOn}</TableCell>
                  <TableCell>{qualityObj.userQualityResponse.name}</TableCell>
                  <TableCell>{qualityObj.notes}</TableCell>
                </TableRow>
              </TableBody>
            </>
          ))}
        </Table>
      ) : (
        <Alert severity="warning">
          the quality response status will appear here.
        </Alert>
      )}
    </>
  );
};
export default QualityResponseViewByIncidentId;
