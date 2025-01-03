import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentDTO, createDocument, getDocumentById, updateDocument, getFileBlob, getDocumentTypes } from '../../service/DocumentService';
import { TemplateDTO, getTemplates, getTemplateById } from '../../service/TemplateService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { departmentListAPI } from '../../service/UserService';

const DocumentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentDTO>({
    title: '',
    content: '',
    departmentId: 0,
    effectiveDate:'',
    issueDate:'',
    reviewDate:'',
    approvalStatus: 'UNDER_REVIEW',
    documentTypeId:0,
    changeSummary:'',
    attachments: [],
  });
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [departments, setDepartments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [documentTypeId, setDocumentTypeId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const[changeSummary,setChangeSummary]=useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getTemplates();
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    const documentTypes=async()=>{
      try{
        const response=await getDocumentTypes();
        setDocumentTypes(response.data);
        console.log(response.data);
      }catch(error){
        console.error('Error fetching document types:',error);
      }
    }

    const deparmentList = async () => {
      try {
        const response = await departmentListAPI();
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchTemplates();
    deparmentList();
    documentTypes();
  }, []);

  useEffect(() => {
    const loadTemplateContent = async () => {
      if (selectedTemplateId) {
        try {
          const response = await getTemplateById(selectedTemplateId);
          setDocument(prevDocument => ({ ...prevDocument, content: response.data.content }));
          
        } catch (error) {
          console.error('Error loading template content:', error);
        }
      }
    };
    loadTemplateContent();
  }, [selectedTemplateId]);

  useEffect(() => {
    if (id) {
      const fetchDocument = async () => {
        try {
          const response = await getDocumentById(Number(id));
          setDocument(response.data);
          setDepartmentId(response.data.departmentId); // Set the departmentId correctly
          setDocumentTypeId(response.data.documentTypeId || "");
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      };
      fetchDocument();
    }
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (value: string) => {
    setDocument(prevDocument => ({ ...prevDocument, content: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocument(prevDocument => ({ ...prevDocument, [name]: value }));
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedTemplateId(Number(event.target.value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      const quill = quillRef.current?.getEditor();
      filesArray.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            const range = quill?.getSelection();
            if (range) {
              quill?.insertEmbed(range.index, 'image', reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleViewFile = async (documentId: number, fileName: string) => {
    try {
      const fileBlob = await getFileBlob(documentId, fileName);
      const fileUrl = URL.createObjectURL(fileBlob);
      setFileUrls((prevUrls) => ({
        ...prevUrls,
        [`${documentId}-${fileName}`]: fileUrl,
      }));
    } catch (error) {
      console.error("Failed to fetch the file:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', document.title);
      formData.append('content', document.content);
      formData.append('departmentId', departmentId);
      formData.append('approvalStatus', document.approvalStatus);
      formData.append('documentTypeId', documentTypeId);
      formData.append('effectiveDate', document.effectiveDate);
      formData.append('issueDate', document.issueDate);
      formData.append('reviewDate', document.reviewDate);
      formData.append('changeSummary',document.changeSummary);
      selectedFiles.forEach(file => {
          formData.append('file', file);
      });

      let response;
      if (id) {
          response = await updateDocument(Number(id), formData);
      } else {
          response = await createDocument(formData);
      }

      if (response.status === 200 || response.status === 201) {
          setSnackbarMessage('Document saved successfully!');
          setSnackbarOpen(true);
          setTimeout(() => {
              navigate('/documents');
          }, 2000);
      } else {
          throw new Error('Failed to save document');
      }
  } catch (error: any) {
      console.error('Error saving document:', error);

      // Display server error message in snackbar if available
      const errorMessage = error.response?.data?.message || 'Error saving document';
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
  }
};
  return (
    <Container>
      <Typography variant="h4" gutterBottom>{id ? 'Edit Document' : 'Create Document'}</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Title"
            name="title"
            value={document.title}
            onChange={handleInputChange}
            required
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel>Template</InputLabel>
            <Select
              value={selectedTemplateId || ''}
              onChange={handleTemplateChange}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {templates.map(template => (
                <MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <input type="file" onChange={handleFileChange} multiple />
          <ReactQuill
            ref={quillRef}
            value={document.content}
            onChange={handleChange}
            modules={{
              clipboard: {
                matchVisual: false
              }
            }}
          />
        </Box>
        <Box mb={2}>
        <Select
  label="Department"
  fullWidth
  required
  name="departmentId"
  value={departmentId}
  onChange={(e) => setDepartmentId(e.target.value)}
  displayEmpty
  variant="outlined"
  renderValue={(selected) => {
    if (!selected) {
      return <em>Select Department</em>;
    }
    const selectedDepartment = departments.find(dept => dept.id === selected);
    return selectedDepartment ? selectedDepartment.departName : <em>Select Department</em>;
  }}
>
  
  <MenuItem disabled value="">
    <em>Select Department</em>
  </MenuItem>
  {departments.map((dept: any) => (
    <MenuItem key={dept.id} value={dept.id}>
      {dept.departName}
    </MenuItem>
  ))}
</Select>
        </Box>
        <Box mb={2}>
          <TextField type="date"
            label="Effective Date"
            name="effectiveDate"
            value={document.effectiveDate}
            onChange={handleInputChange}
            required
            fullWidth></TextField>
        </Box>
        <Box mb={2}>
          <TextField type="date"
            label="Issue Date"
            name="issueDate"
            value={document.issueDate}
            onChange={handleInputChange}
            required
            fullWidth></TextField>
        </Box>

        <Box mb={2}>
          <TextField type="date"
            label="Review Date"
            name="reviewDate"
            value={document.reviewDate}
            onChange={handleInputChange}
            required
            fullWidth></TextField>
            </Box>

            <Box mb={2}>
          <TextField type="text"
            label="Approval status"
            name="approvalStatus"
            value={document.approvalStatus}
            onChange={handleInputChange}
            required
            fullWidth></TextField>
            </Box>

            <Box mb={2}>
  <FormControl fullWidth>
    <InputLabel>Document Type</InputLabel>
    <Select
      label="Document Type"
      name="documentTypeId"
      value={documentTypeId}
      onChange={(e) => setDocumentTypeId(e.target.value)}
      displayEmpty
      variant="outlined"
    >
      {/* Placeholder option */}
      <MenuItem disabled value="">
        <em>Select Document Type</em>
      </MenuItem>
      {/* Map through document types */}
      {documentTypes.map((docType: any) => (
        <MenuItem key={docType.id} value={docType.id}>
          {docType.documentType}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>
{/* 
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel>Approval Status</InputLabel>
            <Select
              name="status"
              value={document.approvalStatus}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="ARCHIVED">Archived</MenuItem>
            </Select>
          </FormControl>
        </Box> */}
        {id &&(
          <Box mb={2}>
            <Typography variant="h6">Change summary:</Typography>
            <TextField
            label="changeSummary"
            name="changeSummary"
            
            onChange={handleInputChange}
            required
            fullWidth
          />

          </Box>

        )}
        {id && (
          <Box mb={2}>
            <Typography variant="h6">Current Attachments:</Typography>
            {document.attachments.map((attachment, index) => {
              const fileUrl = fileUrls[`${document.id}-${attachment.fileName}`];
              const fileType = attachment.fileName.split('.').pop(); // Get the file extension

              return (
                <div key={index}>
                  <Button onClick={() => handleViewFile(document.id, attachment.fileName)}>
                    View {attachment.fileName}
                  </Button>
                  {fileUrl && (
                    fileType === 'pdf' ? (
                      <iframe 
                        src={fileUrl} 
                        style={{ width: '100%', height: '500px', marginBottom: '20px' }}
                        title={`Preview ${attachment.fileName}`}
                      />
                    ) : (
                      <img
                        src={fileUrl}
                        alt={attachment.fileName}
                        style={{ maxWidth: '100%', marginBottom: '20px' }}
                      />
                    )
                  )}
                </div>
              );
            })}
          </Box>
        )}

        <Button type="submit" variant="contained" color="primary">{id ? 'Update Document' : 'Create Document'}</Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={success ? 'success' : 'error'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DocumentForm;
