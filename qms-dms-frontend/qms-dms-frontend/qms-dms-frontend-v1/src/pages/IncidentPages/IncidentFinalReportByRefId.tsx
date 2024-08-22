import {
  
  Card,

  CardContent,

  Typography,
 
} from "@mui/material";
import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";



import IncidentFormViewById from "../../component/Incident/IncidentFormViewById";


const IncidentFinalReportByRefId = () => {




  const { incRefID } = useParams();
  const [incidentId, setIncidentId] = useState(0);

  


  useEffect(() => {
    incidenRefId();
  }, []);

  function incidenRefId() {
    const id = `${incRefID}`;
    setIncidentId(parseInt(id));

  }

  return (
    
    
        <div>
          <Card
            style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 5px" }}
          >
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                style={{ marginBottom: "5%" }}
              >
                Incident Report
              </Typography>

              <IncidentFormViewById PropsIncId={incidentId}/>
            </CardContent>

          
          </Card>
          
 
    </div>
  );
};
export default IncidentFinalReportByRefId;
