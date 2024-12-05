import React, { ReactNode, useEffect, useState } from 'react';
import { Button, TextField, Typography, Box, Snackbar, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { createAuditResponse } from '../../service/AuditService'; // Assuming the service function is created already
import { useParams, useNavigate } from 'react-router-dom'; // Importing useParams and useNavigate
import { fetchStatus } from '../../service/TaskService';

const AuditResponseForm: React.FC = () => {
  const { auditId } = useParams<{ auditId: string }>(); // Extract auditId from URL params
  const navigate = useNavigate(); // Hook to programmatically navigate

  const [response, setResponse] = useState(''
  ); // State for the response text
  const [statusId,setStatusId]=useState(0);
  const [file, setFile] = useState<File | null>(null); // State for the file upload
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState<string>(''); // Message to display in Snackbar
  const [status,setStatus]=useState([]);

  useEffect(()=>{
    
    getStatus();
    

  },[]
    
  )

  const getStatus=async()=>{
    try{
      const response =await fetchStatus();
      setStatus(response.data);
    }catch(error){
      console.log(error);
    }
  }
  // Handle changes in the response text field
  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponse(e.target.value);
  };

  // Handle file changes (if a file is uploaded)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('response', response);
      formData.append('statusId',String(statusId));
      // Submit the audit response using the service function
      const responseData = await createAuditResponse(Number(auditId), formData, file);

      // Show a success notification
      setSnackbarMessage('Audit response submitted successfully!');
      setOpenSnackbar(true);

      // Navigate back to the audit details page after submission
      setTimeout(() => {
        navigate(`/audits/${auditId}`); // Navigate back after the snackbar disappears
      }, 2000); // Delay the navigation so the user sees the notification
    } catch (err) {
      // Handle error (e.g., show an error message)
      setError('Failed to submit audit response');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function handleStatusChange(e: SelectChangeEvent<number>) {
   setStatusId(Number(e.target.value) );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto', marginTop: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Submit Audit Response
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Response TextField */}
        <TextField
          label="Audit Response"
          value={response}
          onChange={handleResponseChange}
          fullWidth
          multiline
          rows={4}
          required
          margin="normal"
        />
<FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
             
              onChange={handleStatusChange}
              name="statusId"
              fullWidth
            >
              <MenuItem value={0} disabled>Select Status</MenuItem>
              {status.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.engName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        {/* File Upload */}
        <input type="file" onChange={handleFileChange} />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ marginTop: 2 }}>
          {loading ? 'Submitting...' : 'Submit Response'}
        </Button>

        {error && <Typography color="error">{error}</Typography>}
      </form>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AuditResponseForm;
