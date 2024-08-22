import React, { useState } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Typography, Paper, useTheme, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const KanbanBoard: React.FC<{ tasks: any[] }> = ({ tasks }) => {
  console.log('Tasks passed to KanbanBoard:', tasks); // Debugging log

  const theme = useTheme();
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value as string);
  };

  const filteredTasks = filter
    ? tasks.filter(task => task.task.assignedUser.name === filter)
    : tasks;

  const columns = {
    open: filteredTasks.filter(task => task.taskStatus.id === 1),
    inProgress: filteredTasks.filter(task => task.taskStatus.id === 2),
    closed: filteredTasks.filter(task => task.taskStatus.id === 3),
  };

  const onDragEnd = (result: any) => {
    // Handle drag and drop logic here
    console.log('Drag result:', result); // Debugging log
  };

  const columnStyles = {
    open: { backgroundColor: theme.palette.info.light, color: theme.palette.info.dark },
    inProgress: { backgroundColor: theme.palette.warning.light, color: theme.palette.warning.dark },
    closed: { backgroundColor: theme.palette.background.default, color: theme.palette.text.primary },
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Box p={2}>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Assignee</InputLabel>
        <Select value={filter} onChange={handleFilterChange}>
          <MenuItem value=''>All</MenuItem>
          {Array.from(new Set(tasks.map(task => task.task.assignedUser.name))).map(name => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" justifyContent="space-around">
          {Object.entries(columns).map(([columnId, columnTasks]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ 
                    width: 300, 
                    margin: 2, 
                    backgroundColor: columnStyles[columnId as keyof typeof columnStyles].backgroundColor, 
                    color: columnStyles[columnId as keyof typeof columnStyles].color, 
                    padding: 2, 
                    borderRadius: 2,
                    maxHeight: 500,
                    overflowY: 'auto',
                    boxShadow: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                    {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                  </Typography>
                  {columnTasks.map((task, index) => (
                    <Draggable draggableId={task.id.toString()} index={index} key={task.id.toString()}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ 
                            padding: 2, 
                            marginBottom: 2, 
                            backgroundColor: task.taskStatus.id !== 3 && isOverdue(task.task.dueDate) ? theme.palette.error.light : theme.palette.background.paper,
                            borderRadius: 1,
                            boxShadow: 3,
                            transition: 'background-color 0.3s ease, transform 0.3s ease',
                            '&:hover': {
                              backgroundColor: theme.palette.grey[200],
                            },
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            Assigned to: {task.task.assignedUser.name}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {task.task.taskNumber}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            Due date: {task.task.dueDate}
                          </Typography>
                          <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            {task.task.taskNote}
                          </Typography>
                          {(task.taskStatus.id === 2 || task.taskStatus.id === 3) && (
                            <>
                              <Typography variant="body2" color="textSecondary">
                                Response notes: {task.taskStatus.id === 3 ? task.responseText : task.inProgressNotes}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Responded by: {task.userlist.name}
                              </Typography>
                            </>
                          )}
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {columnTasks.length > 5 && (
                    <Typography align="center" variant="caption" display="block" mt={2}>
                      Scroll to view more...
                    </Typography>
                  )}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
