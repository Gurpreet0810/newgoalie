import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Typography, Container, Paper, Button } from '@mui/material';
import { useTranslation } from 'react-i18next'
// Define the coach interface based on the structure of your data
interface Coach {
  _id: string;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function ListCoach() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get<Coach[]>('http://localhost:4500/api/v1/coaches');
        setCoaches(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const columns: GridColDef[] = [
    { field: 'srNo', headerName: t('srno'), width: 100 },
    { field: 'userName', headerName: t('coaches'), flex: 1 },
    { field: 'phoneNumber', headerName: t('phone'), flex: 1 },
    { field: 'email', headerName: t('email'), flex: 1 },
    {
      field: 'actions',
      headerName: t('action'),
      sortable: false,
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          component={Link}
          to={`/coach/drills/${params.row._id}`}
          aria-label="Drills"
          sx={{
            backgroundColor: '#00617a',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#004d5c', // Optional hover effect
            },
          }}
        >
          Drills
        </Button>
      ),
    },
  ];

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

  const rows = coaches.map((coach, index) => ({
    ...coach,
    id: coach._id,
    srNo: index + 1,
  }));

  return (
    <Container maxWidth={false} sx={{ marginTop: '120px' }}>
      <Paper sx={{ height: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ padding: '15px', background: '#00617a', color: '#fff' }}>
        {t('coaches')}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  );
}

export default ListCoach;
