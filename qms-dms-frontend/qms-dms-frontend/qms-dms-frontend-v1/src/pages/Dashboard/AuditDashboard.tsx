import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { getAuditCompletionProgress, getAuditSummary, getMonthlyAuditData } from '../../service/AuditService';
import { useNavigate } from 'react-router-dom';

const AuditDashboard: React.FC = () => {
  const [auditSummary, setAuditSummary] = useState<any>(null); // State to store audit summary
  const [monthlyData, setMonthlyData] = useState<any[]>([]); // Initialize as an empty array
  const [completionData, setCompletionData] = useState<any[]>([]); // Data for line chart
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // For navigation between pages

  useEffect(() => {
    setLoading(true);
    const fetchAuditData = async () => {
      try {
        // Fetch monthly audit data
        const monthlyAuditData = await getMonthlyAuditData();
        if (Array.isArray(monthlyAuditData)) {
          setMonthlyData(monthlyAuditData);
        } else {
          console.error('Expected an array for monthly audit data');
        }
        const audSummary = await getAuditSummary();
        setAuditSummary(audSummary);

        // Fetch audit completion progress
        const auditCompletionData = await getAuditCompletionProgress();
        if (Array.isArray(auditCompletionData)) {
          setCompletionData(auditCompletionData);
        } else {
          console.error('Expected an array for audit completion data');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Pie Chart Data for Audit Status Breakdown
  const pieData = [
    { name: 'Open Audits', value: auditSummary?.openAudits },
    { name: 'Closed Audits', value: auditSummary?.closedAudits },
    { name: 'Due Audits', value: auditSummary?.dueAudits },
  ];

  // Bar Chart Data for Monthly Audits
  const barData = monthlyData.map((item) => ({
    name: item.month,
    audits: item.count,
  }));

  // Line Chart Data for Audit Completion Progress
  const lineData = completionData.map((item) => ({
    name: item.month,
    completed: item.completed,
  }));

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1A73E8',marginTop:'30px' }}>Audit Dashboard</Typography>
        <Box sx={{marginTop:'30px'}}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2, borderRadius: '20px' }}
            onClick={() => navigate('/audits/create')}
          >
            Create New Audit
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: '20px' }}
            onClick={() => navigate('/audits')}
          >
            View All Audits
          </Button>
        </Box>
      </Box>

      {/* Audit Status Breakdown Row */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: '10px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Audit Status Breakdown</Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={70}
                  fill="#8884d8"
                >
                  <Cell fill="#FF5722" />
                  <Cell fill="#8BC34A" />
                  <Cell fill="#FFEB3B" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Audit Counts and Audit Completion Progress in one row */}
      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: '10px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Monthly Audit Counts</Typography>
              <BarChart width={400} height={300} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="audits" stackId="a" fill="#4CAF50" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: '10px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Audit Completion Progress</Typography>
              <LineChart width={400} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#FF5722" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditDashboard;
