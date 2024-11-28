// src/types/AuditTypes.ts

export interface AuditDto {
  id: number;
  auditNum?: string;
  title: string;
  auditTypeId?: number; // ID of the audit type, used for categorization
  auditTypeName?: string; // Name of the audit type, if needed for display
  assignedDate?: string; // Date when the audit was assigned
  dueDate: string; // Deadline for completing the audit
  assignedToId?: number; // ID of the user assigned to the audit
  assignedUser?: string; // Name of the user assigned to the audit
  description?: string; // Detailed description of the audit
  status?: { id: number; engName: string; active: boolean }; // Status object with ID and name
  statusId?: number; // ID of the status
  createdOn?: string; // Timestamp of audit creation
  createdBy?: string; // Name or ID of the user who created the audit
  updatedOn?: string; // Timestamp of the last update
  updatedBy?: string; // Name or ID of the user who last updated the audit
  completionDate?: string; // Date when the audit was completed
  departmentId?: number; // ID of the department related to the audit
  attachments?: Array<{
    id: number;
    fileName: string;
    filePath: string;
    uploadDate: string;
    contentText?: string; // Extracted text from the attachment for searching
  }>; // List of attachment metadata
  }
  