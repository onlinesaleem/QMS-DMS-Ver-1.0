import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ContentSnippetProps {
  content: string;
  keyword: string;
  positions: number[];
}

const ContentSnippet: React.FC<ContentSnippetProps> = ({ content, keyword, positions }) => {
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);

  const handleNextKeyword = () => {
    setCurrentKeywordIndex((prevIndex) => (prevIndex + 1) % positions.length);
  };

  const handlePrevKeyword = () => {
    setCurrentKeywordIndex((prevIndex) => (prevIndex - 1 + positions.length) % positions.length);
  };

  const getSnippetWithHighlight = () => {
    if (!content || !keyword || positions.length === 0) return null;

    const position = positions[currentKeywordIndex];
    const snippetLength = 30;
    const snippetStart = Math.max(0, position - snippetLength);
    const snippetEnd = Math.min(content.length, position + keyword.length + snippetLength);
    const snippet = content.slice(snippetStart, snippetEnd);

    // Split content and insert highlights without `dangerouslySetInnerHTML`
    const parts = snippet.split(new RegExp(`(${keyword})`, 'gi'));

    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <Box>
      <Typography variant="body1" component="div">
        {getSnippetWithHighlight()}
      </Typography>
      {positions.length > 1 && (
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handlePrevKeyword} size="small" variant="outlined">
            Previous
          </Button>
          <Typography variant="caption" color="textSecondary">
            Match {currentKeywordIndex + 1} of {positions.length}
          </Typography>
          <Button onClick={handleNextKeyword} size="small" variant="outlined">
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ContentSnippet;
