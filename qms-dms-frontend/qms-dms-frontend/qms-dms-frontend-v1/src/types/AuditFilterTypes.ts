export interface AuditFilterDto {
    title?: string;
    statusId?: string;
    assignedToId?: string;
    assignedDate?: string;
    dueDate?: string;
    auditType?: string; // Make this optional
    startDate?: string; // Make this optional
    endDate?: string; // Make this optional
}
