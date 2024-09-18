import React, { useEffect, useState } from 'react';
import { getPendingApprovals, updateApprovalStatus } from '../../../service/ApprovalService';
import { findUserIdByUsernameAPI } from '../../../service/UserService';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled component for the table container
const StyledTableContainer = styled(TableContainer)({
    marginTop: '20px',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
});

const ApprovalList = () => {
    const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
    const [_userId, setUserId] = useState(0);
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState('');
    
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

    // Approval action (approve/reject)
    const handleApprovalAction = async (approval: any, action: 'approve' | 'reject') => {

        
        const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
       

        const documentApprovalLevelDto = { comments, status };

        try {
            // Call the updateApprovalStatus API with the approval level ID and DTO
            await updateApprovalStatus(approval.id, documentApprovalLevelDto);
            console.log(`Approval ID ${approval.id} was ${status}`);
            
            // Optimistically update the UI
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
        <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom align="center">
                    Pending Approvals
                </Typography>

                <StyledTableContainer as={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Document Title</TableCell>
                                <TableCell align="left">Approval Level</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">Comments</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingApprovals
                                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                .map((approval) => (
                                    <TableRow key={approval.id}>
                                        <TableCell>{approval.document.title}</TableCell>
                                        <TableCell>{approval.level}</TableCell>
                                        <TableCell>{approval.status}</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                placeholder="Add comments"
                                                variant="outlined"
                                                size="small"
                                                value={comments}
                                                onChange={(e) => setComments(e.target.value)}
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
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>

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