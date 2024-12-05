
import { Button } from '@mui/material';

const AuditExportButtons = () => {
  const handleExportExcel = () => {
    window.location.href = '/api/audits/export/excel';
  };

  const handleExportPdf = () => {
    window.location.href = '/api/audits/export/pdf';
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleExportExcel}>
        Export to Excel
      </Button>
      <Button variant="contained" color="secondary" onClick={handleExportPdf}>
        Export to PDF
      </Button>
    </div>
  );
};

export default AuditExportButtons;
