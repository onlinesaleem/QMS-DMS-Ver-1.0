// ApprovalAction.tsx
import  { useState } from 'react';
import { updateApprovalStatus } from '../../../service/ApprovalService';


const ApprovalAction = ({ approvalLevelId }: { approvalLevelId: number }) => {
    const [status, setStatus] = useState("APPROVED");
    const [comments, setComments] = useState("");

    const handleSubmit = async () => {
        const documentApprovalLevelDto = { comments: comments, status: status };
        await updateApprovalStatus(approvalLevelId,documentApprovalLevelDto );
        alert("Approval status updated");
    };

    return (
        <div>
            <h3>Approve or Reject</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="APPROVED">Approve</option>
                <option value="REJECTED">Reject</option>
            </select>
            <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Comments (optional)"
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default ApprovalAction;
