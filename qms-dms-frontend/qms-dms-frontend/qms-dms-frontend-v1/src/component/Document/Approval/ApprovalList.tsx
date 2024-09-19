import React, { useEffect, useState } from 'react';
import { getPendingApprovals, updateApprovalStatus } from '../../../service/ApprovalService';
import { findUserIdByUsernameAPI } from '../../../service/UserService';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography, TextField, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled component for table header cells
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    padding: '10px',
}));

// Styled component for table rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

// Styled typography for title
const TitleTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.success.main,
    textTransform: 'uppercase',
    marginBottom: '20px',
}));

const ApprovalList = () => {
    const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
    const [_userId, setUserId] = useState(0);
    const [page, setPage] = useState(1);
    const [commentsMap, setCommentsMap] = useState<{ [key: number]: string }>({});

    const itemsPerPage = 5;

    useEffect(() => {
        loggedUserId();
    }, []);

    const fetchPendingApprovals = async (id: number) => {
        const response = await getPendingApprovals(id);
        setPendingApprovals(response.data);
    };

    const loggedUserId = async () => {
        const response = await findUserIdByUsernameAPI();
        setUserId(response.data);
        fetchPendingApprovals(response.data);
    };

    // Pagination handler
    const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Update comments for each approval
    const handleCommentChange = (approvalId: number, value: string) => {
        setCommentsMap((prevCommentsMap) => ({
            ...prevCommentsMap,
            [approvalId]: value,
        }));
    };

    // Approval action (approve/reject)
    const handleApprovalAction = async (approval: any, action: 'approve' | 'reject') => {
        const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
        const documentApprovalLevelDto = { comments: commentsMap[approval.id] || '', status };

        try {
            // Call API to update the status
            await updateApprovalStatus(approval.id, documentApprovalLevelDto);
            
            // Optimistically update the UI by updating the status in the state
            setPendingApprovals((prevApprovals) =>
                prevApprovals.map((item) =>
                    item.id === approval.id ? { ...item, status } : item
                )
            );
        } catch (error) {
            console.error('Error updating approval status', error);
        }
    };

    return (
        <Grid container justifyContent="center" style={{ padding: '40px' }}>
            <Grid item xs={12} md={10}>
                <TitleTypography variant="h4" align="center">
                    Pending Approvals
                </TitleTypography>

                <TableContainer component={Paper} sx={{ marginTop: '20px', padding: '20px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableHeadCell align="left">Document Title</StyledTableHeadCell>
                                <StyledTableHeadCell align="left">Document Type</StyledTableHeadCell>
                                <StyledTableHeadCell align="left">Approval Level</StyledTableHeadCell>
                                <StyledTableHeadCell align="left">Status</StyledTableHeadCell>
                                <StyledTableHeadCell align="left">Comments</StyledTableHeadCell>
                                <StyledTableHeadCell align="left">Actions</StyledTableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingApprovals
                                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                .map((approval) => (
                                    <StyledTableRow key={approval.id}>
                                        <TableCell>
                                            <Link href={`/documents/${approval.document.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                {approval.document.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{approval.document.documentType}</TableCell>
                                        <TableCell>{approval.level}</TableCell>
                                        <TableCell>{approval.status}</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                placeholder="Add comments"
                                                variant="outlined"
                                                size="small"
                                                value={commentsMap[approval.id] || ''}
                                                onChange={(e) => handleCommentChange(approval.id, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleApprovalAction(approval, 'approve')}
                                                disabled={approval.status !== 'PENDING'}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleApprovalAction(approval, 'reject')}
                                                disabled={approval.status !== 'PENDING'}
                                            >
                                                Reject
                                            </Button>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination Component */}
                <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                    <Pagination
                        count={Math.ceil(pendingApprovals.length / itemsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ApprovalList;
