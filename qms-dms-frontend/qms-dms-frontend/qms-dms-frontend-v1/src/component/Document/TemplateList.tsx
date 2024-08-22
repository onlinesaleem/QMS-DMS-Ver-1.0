import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TemplateDTO, getTemplates } from '../../service/TemplateService';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await getTemplates();
      setTemplates(response.data);
    };
    fetchTemplates();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Templates</Typography>
      <List>
        {templates.map(template => (
          <ListItem key={template.id} component={Link} to={`/templates/${template.id}`} button>
            <ListItemText primary={template.name} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" component={Link} to="/templates/new">Create New Template</Button>
    </Container>
  );
};

export default TemplateList;
