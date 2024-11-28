import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Pagination,
  Chip,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { DocumentDTO, getDocuments } from '../../service/DocumentService';
import { Link } from 'react-router-dom';
import DocumentDataGrid from './DocumentDataGrid'; // Assuming this is the grid view component

const DocumentCardView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await getDocuments();
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    const result = documents.map((doc) => {
      const matches = doc.attachments
        ?.flatMap((att) =>
          (att.contentText?.match(new RegExp(contentSearchQuery, 'gi')) || []).map((match, index) => ({
            match,
            index,
          }))
        )
        .filter((match) => !!match) || [];

      return { ...doc, matchCount: matches.length };
    });

    setFilteredDocuments(
      result.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (contentSearchQuery ? doc.matchCount > 0 : true)
      )
    );
  }, [searchQuery, contentSearchQuery, documents]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleContentSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentSearchQuery(event.target.value);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const renderSnippet = (contentText: string) => {
    const query = contentSearchQuery.toLowerCase();
    const position = contentText.toLowerCase().indexOf(query);

    if (position === -1) return null;

    const snippetStart = Math.max(0, position - 30);
    const snippetEnd = Math.min(contentText.length, position + query.length + 30);
    const snippet = contentText.slice(snippetStart, snippetEnd);

    return (
      <Typography variant="body2">
        {snippet.slice(0, position - snippetStart)}
        <span style={{ backgroundColor: '#FFEE58', fontWeight: 'bold', color: '#1976d2' }}>{query}</span>
        {snippet.slice(position - snippetStart + query.length)}
      </Typography>
    );
  };

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={6} mb={3}>
        <Typography variant="h4" color="primary">
          Document Content Search
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => setViewMode(value || viewMode)}
          aria-label="view mode"
        >
          <ToggleButton value="card" aria-label="card view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search by title"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <TextField
          label="Search by content"
          variant="outlined"
          fullWidth
          value={contentSearchQuery}
          onChange={handleContentSearchChange}
        />
      </Box>

      {viewMode === 'grid' ? (
        <DocumentDataGrid /> // Grid view component
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {paginatedDocuments.map((doc) => (
            <Card key={doc.id} variant="outlined" sx={{ padding: 2, backgroundColor: '#f9f9f9', boxShadow: 1 }}>
              <CardContent>
                <Tooltip title="Click to view document">
                  <Typography
                    variant="h6"
                    gutterBottom
                    component={Link}
                    to={`/documents/${doc.id}`}
                    style={{ textDecoration: 'none', color: '#1976d2', cursor: 'pointer' }}
                  >
                    {doc.title}
                  </Typography>
                </Tooltip>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Department: {doc.documentDepartment?.departName} | Type: {doc.documentType?.documentType}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Effective Date: {doc.effectiveDate} | Review Date: {doc.reviewDate}
                </Typography>

                {contentSearchQuery && (
                  <Box mt={1}>
                    <Chip
                      label={`${doc.matchCount} match${doc.matchCount > 1 ? 'es' : ''} found`}
                      color="secondary"
                      size="small"
                      sx={{ fontWeight: 'bold', backgroundColor: '#e0f7fa', color: '#00796b', mb: 1 }}
                    />
                    <Box>{renderSnippet(doc.attachments?.[0]?.contentText || '')}</Box>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => window.open(`/documents/${doc.id}`, '_blank')}
                >
                  Open Document
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredDocuments.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default DocumentCardView;
