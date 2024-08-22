import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateDTO, createTemplate } from '../../service/TemplateService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Container, TextField, Button, Typography, Box } from '@mui/material';

const TemplateForm: React.FC = () => {
  const [template, setTemplate] = useState<TemplateDTO>({ name: '', content: '', departmentId: 0 });
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    setTemplate(prevTemplate => ({ ...prevTemplate, content: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTemplate(prevTemplate => ({ ...prevTemplate, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTemplate(template);
    navigate('/templates');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create Template</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Name"
            name="name"
            value={template.name}
            onChange={handleInputChange}
            required
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <ReactQuill value={template.content} onChange={handleChange} />
        </Box>
        <Box mb={2}>
          <TextField
            label="Department ID"
            name="departmentId"
            type="number"
            value={template.departmentId}
            onChange={handleInputChange}
            required
            fullWidth
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">Create</Button>
      </form>
    </Container>
  );
};

export default TemplateForm;
