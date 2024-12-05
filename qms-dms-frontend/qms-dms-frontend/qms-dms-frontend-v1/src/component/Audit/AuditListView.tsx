import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
  Box,
  TextField,
  IconButton,
  styled,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getAuditAttachments, getAudits, getFileBlob } from '../../service/AuditService';

import CreateAuditForm from './CreateAuditForm';
import { useNavigate } from 'react-router-dom';


// Styled components for consistent styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[50],
  padding: '16px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  textTransform: 'uppercase',
  fontWeight: 'bold',
}));

const FilterTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '4px',
    },
  },
});

// Helper function to check if the due date has passed
const isDueDatePassed = (dueDate) => {
  const currentDate = new Date();
  return new Date(dueDate) < currentDate;
};

const AuditListView = () => {
    const [audits, setAudits] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
    const [filters, setFilters] = useState({ title: '', status: '', dueDate: '' });
    const [page, setPage] = useState(4); // Setting to 4 as shown in screenshot
    const [pageSize] = useState(5);
    const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
    const [open, setOpen] = useState(false); 
    
    
  const navigate=useNavigate();

    useEffect(() => {
        const fetchAudits = async () => {
            try {
                const auditsData = await getAudits();
                setAudits(auditsData);
            } catch (error) {
                console.error("Error fetching audits:", error);
            }
        };
        fetchAudits();
    }, []);

    const handleViewAttachments = async (auditId) => {
        try {
            const attachmentsData = await getAuditAttachments(auditId);
            setAttachments(attachmentsData);
        } catch (error) {
            console.error("Error fetching attachments:", error);
        }
    };
    const handleViewFile = async (auditId, fileName) => {
      try {
          const fileBlob = await getFileBlob(auditId, fileName);
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileUrls((prevUrls) => ({
              ...prevUrls,
              [`${auditId}-${fileName}`]: fileUrl,
          }));
      } catch (error) {
          console.error("Failed to fetch the file:", error);
      }
  };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };


    const handleEditClick = (auditId: number) => {
      const selected = audits.find((audit) => audit.id === auditId);
      setSelectedAudit(selected); // Set selected audit details
      navigate(`/audits/edit/${auditId}`);
      console.log('Edit button clicked');
      setOpen(true); // Open the modal
    };

    const auditReport=(auditId:number)=>{
        navigate(`/audits/${auditId}`)
    }

   const handleResponseClick=(auditId:number)=>{
    navigate(`/audits/response/${auditId}`);
   }

    const filteredAudits = audits.filter((audit) => {
        return (
            audit.title?.toLowerCase().includes(filters.title.toLowerCase()) &&
            audit.status?.engName?.toLowerCase().includes(filters.status.toLowerCase()) &&
            audit.dueDate?.includes(filters.dueDate)
        );
    });



    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Audit List
            </Typography>

            {/* Filters */}
            <Box 
                sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: 2,
                    mb: 3 
                }}
            >
                <FilterTextField
                    label="Title"
                    variant="outlined"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    size="small"
                    fullWidth
                />
                <FilterTextField
                    label="Status"
                    variant="outlined"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    size="small"
                    fullWidth
                />
                <FilterTextField
                    label="Due Date"
                    variant="outlined"
                    name="dueDate"
                    value={filters.dueDate}
                    onChange={handleFilterChange}
                    size="small"
                    fullWidth
                />
            </Box>

            {/* Table */}
            <Table sx={{ mb: 2, '& td, & th': { whiteSpace: 'nowrap' } }}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Audit Number</StyledTableCell>
                        <StyledTableCell>Title</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Due Date</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
                        <StyledTableCell>Attachment</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredAudits
                        .slice((page - 1) * pageSize, page * pageSize)
                        .map((audit) => (
                            <TableRow key={audit.id}>
                                <TableCell sx={{ fontWeight: '500' }}>
                                    {audit.auditNum}
                                </TableCell>
                                <TableCell>{audit.title}</TableCell>
                                <TableCell>{audit.status?.engName || 'Open'}</TableCell>
                                <TableCell 
                                    sx={{ 
                                        color: isDueDatePassed(audit.dueDate) ? 'error.main' : 'inherit'
                                    }}
                                >
                                    {new Date(audit.dueDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {audit.status.id===3 &&
                                        <StyledButton
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SummarizeIcon/>}
                                        size="small"
                                        onClick={() => auditReport(audit.id)}>
                                        Report
                                    </StyledButton>
                                    
                                        }
                                        {audit.status.id===1 &&
                                        <StyledButton
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            size="small"
                                            onClick={() => handleEditClick(audit.id)}>
                                            Edit
                                        </StyledButton>
                                        }
                                         {audit.status.id===1 &&
                                        <StyledButton
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<ReplyIcon />}
                                            size="small"
                                            onClick={() => handleResponseClick(audit.id)}
                                        >
                                            Respond
                                        </StyledButton>
}
                                        <StyledButton
                                            variant="outlined"
                                            startIcon={<AttachFileIcon />}
                                            onClick={() => handleViewAttachments(audit.id)}
                                            size="small"
                                        >
                                            View Attachments
                                        </StyledButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {attachments.length > 0 && (
                                        <Typography 
                                            color="primary" 
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            View Files ({attachments.length})
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 2 
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <Typography>Page {page}</Typography>
                <Button
                    variant="outlined"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * pageSize >= filteredAudits.length}
                >
                    Next
                </Button>
            </Box>

            {/* Attachments Section */}
            {attachments.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Attachments:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {attachments.map((attachment, index) => {
                                const fileUrl = fileUrls[`${attachment.auditId}-${attachment.fileName}`];
                                const fileType = attachment.fileName.split('.').pop(); // Get the file extension

                                return (
                                    <li key={index}>
                                        <Button onClick={() => handleViewFile(attachment.auditId, attachment.fileName)}>
                                            View {attachment.fileName}
                                        </Button>
                                        {fileUrl && (
                                            fileType === 'pdf' ? (
                                                <iframe 
                                                    src={fileUrl} 
                                                    style={{ width: '100%', height: '500px', marginTop: '10px' }} 
                                                    title={attachment.fileName} 
                                                />
                                            ) : (
                                                <img 
                                                    src={fileUrl} 
                                                    alt={attachment.fileName} 
                                                    style={{ maxWidth: '100%', marginTop: '10px' }} 
                                                />
                                            )
                                        )}
                                    </li>
                                );
                            })}
                                 
   
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default AuditListView;