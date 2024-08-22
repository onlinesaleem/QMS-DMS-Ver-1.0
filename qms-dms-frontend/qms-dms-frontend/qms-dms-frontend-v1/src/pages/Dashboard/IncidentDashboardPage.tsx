import  { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CardHeader } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { Line } from 'react-chartjs-2';
 // Adjust the import path as needed
import { format } from 'date-fns';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchIncidentMonthlyCount } from '../../service/IncidentService';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IProps {
  openIncident: number;
  closedIncident: number;
}

const IncidentDashboardPage = ({ openIncident, closedIncident }: IProps) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchIncidentMonthlyCount();
        const data = response.data;

        const labels = data.map((item: [number, number]) => format(new Date(2024, item[0] - 1), 'MMMM'));
        const counts = data.map((item: [number, number]) => item[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Incidents',
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              data: counts,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Incident Dashboard
      </Typography>
      <Grid container spacing={4} direction="row" alignItems="flex-start" justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Card sx={{ minWidth: 275, boxShadow: 3, bgcolor: '#f0f4f8' }}>
            <CardHeader
              avatar={<ErrorOutlineIcon color="primary" />}
              title="Open Incidents"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h4" component="div">
                {openIncident}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ minWidth: 275, boxShadow: 3, bgcolor: '#e8f5e9' }}>
            <CardHeader
              avatar={<CheckCircleOutlineIcon color="success" />}
              title="Closed Incidents"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h4" component="div">
                {closedIncident}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ minWidth: 275, boxShadow: 3, bgcolor: '#f3e5f5' }}>
            <CardHeader
              avatar={<CodeOutlinedIcon color="secondary" />}
              title="Total Incidents"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h4" component="div">
                {openIncident + closedIncident}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ minWidth: 275, boxShadow: 3, bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Monthly Incident Count
              </Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default IncidentDashboardPage;
