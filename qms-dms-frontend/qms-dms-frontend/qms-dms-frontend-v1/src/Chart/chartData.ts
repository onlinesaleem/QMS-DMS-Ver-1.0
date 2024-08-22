// src/data/chartData.ts

export const getChartData = (fetchTask: any[]) => ({
    labels: ["Open", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Status Distribution",
        data: [
          fetchTask.filter(task => task.statusId === 1).length,
          fetchTask.filter(task => task.statusId === 2).length,
          fetchTask.filter(task => task.statusId === 3).length,
        ],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
        hoverBackgroundColor: ["#388e3c", "#1976d2", "#f57c00"]
      }
    ]
  });
  
  export const getOpenTasksByTypeData = (fetchTask: any[]) => ({
    labels: [...new Set(fetchTask.map(task => task.task.typeOfTask.engName))],
    datasets: [
      {
        label: 'Open Tasks by Type',
        data: [...new Set(fetchTask.map(task => task.task.typeOfTask.engName))].map(type => fetchTask.filter(task => task.task.typeOfTask.engName === type && task.statusId === 1).length),
        backgroundColor: "#4caf50"
      }
    ]
  });
  
  export const getTasksOpenMoreThan7Days = (fetchTask: any[]) => ({
    labels: ["Tasks > 7 Days"],
    datasets: [
      {
        label: 'Tasks open for more than 7 days',
        data: [fetchTask.filter(task => {
          const dueDate = new Date(task.task.dueDate);
          const today = new Date();
          const diffInMs = today.getTime() - dueDate.getTime();
          const daysPastDue = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
          return daysPastDue > 7 && task.statusId === 1;
        }).length],
        backgroundColor: "#2196f3"
      }
    ]
  });
  
  export const getTasksOpenMoreThan30Days = (fetchTask: any[]) => ({
    labels: ["Tasks > 30 Days"],
    datasets: [
      {
        label: 'Tasks open for more than 30 days',
        data: [fetchTask.filter(task => {
          const dueDate = new Date(task.task.dueDate);
          const today = new Date();
          const diffInMs = today.getTime() - dueDate.getTime();
          const daysPastDue = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
          return daysPastDue > 30 && task.statusId === 1;
        }).length],
        backgroundColor: "#ff9800"
      }
    ]
  });
  