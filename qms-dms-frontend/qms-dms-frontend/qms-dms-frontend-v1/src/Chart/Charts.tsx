// src/components/Charts.tsx

import React from "react";
import { Box } from "@mui/material";
import { Doughnut, Bar } from "react-chartjs-2";
import 'chart.js/auto';
import { getChartData, getOpenTasksByTypeData, getTasksOpenMoreThan30Days, getTasksOpenMoreThan7Days } from "./chartData";

interface ChartsProps {
  fetchTask: any[];
}

const Charts: React.FC<ChartsProps> = ({ fetchTask }) => {

  return (
    <>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Box width="48%">
          <Doughnut data={getChartData(fetchTask)} options={{ maintainAspectRatio: false }} />
        </Box>
        <Box width="48%">
          <Bar data={getOpenTasksByTypeData(fetchTask)} options={{ maintainAspectRatio: false }} />
        </Box>
      </Box>
      <Box mt={4} display="flex" justifyContent="space-between">
        <Box width="48%">
          <Bar data={getTasksOpenMoreThan7Days(fetchTask)} options={{ maintainAspectRatio: false }} />
        </Box>
        <Box width="48%">
          <Bar data={getTasksOpenMoreThan30Days(fetchTask)} options={{ maintainAspectRatio: false }} />
        </Box>
      </Box>
    </>
  );
};

export default Charts;
