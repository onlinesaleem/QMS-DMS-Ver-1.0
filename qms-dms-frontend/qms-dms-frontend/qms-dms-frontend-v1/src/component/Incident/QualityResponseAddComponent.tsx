import { useEffect } from "react";
import { QualityResponseModal } from "../../modal/QualityResponseModal";
import { addQualityResponse } from "../../service/IncidentService";
import { Alert } from "@mui/material";

type Iprops = {
  QualityResponseProps: QualityResponseModal;
};

const QualityResponseAddComponent = ({ QualityResponseProps }: Iprops) => {
  useEffect(() => {
    saveQualityResponse();
  }, []);

  console.log("quality response page called..");
  function saveQualityResponse() {
    const qualityModal = new QualityResponseModal(
      QualityResponseProps.incId,
      QualityResponseProps.finalActionTaken,
      QualityResponseProps.ifNotAppropriate,
      QualityResponseProps.notes
    );
    addQualityResponse(qualityModal)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div>
      <Alert severity="success">Response added successfully</Alert>
    </div>
  );
};

export default QualityResponseAddComponent;
