import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Typography, Paper, Container, Box } from '@mui/material';
import { useParams } from 'react-router-dom'; // Import useParams

// Define the interface for the drill data
interface Drill {
  _id: string;
  drill_name: string;
  category: string;
  description: string;
}

interface DrillCategory {
  _id: string;
  category_name: string;
}

function ListDrillsByCoach() {
  const { coachId } = useParams<{ coachId: string }>(); // Get coachId from URL
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drills by coach ID
        const drillsResponse = await axios.get<Drill[]>(`http://localhost:4500/api/v1/drills/coach/${coachId}`);
        console.log('response : ',drillsResponse)
        const fetchedDrills = drillsResponse.data.map((drill, index) => ({
          ...drill,
          id: drill._id,
          srNo: index + 1,
        }));

        // Fetch categories
        const categoriesResponse = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
        const categoryMapping = categoriesResponse.data.reduce((acc, category) => {
          acc[category._id] = category.category_name;
          return acc;
        }, {} as Record<string, string>);

        // Map drills to replace category ID with category name
        const updatedDrills = fetchedDrills.map(drill => ({
          ...drill,
          category: categoryMapping[drill.category] || 'No Category',
        }));

        setDrills(updatedDrills);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coachId]);

  const columns: GridColDef[] = [
    { field: 'srNo', headerName: 'Sr. No.', width: 100 },
    { field: 'drill_name', headerName: 'Drill Name', flex: 1 },
    { 
      field: 'category', 
      headerName: 'Category', 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => params.value,
    },
  ];

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Container maxWidth={false} sx={{ marginTop: '120px' }}>
      <Paper sx={{ height: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ padding: '15px', background: '#00617a', color: '#fff' }}>
          Drills
        </Typography>
        
        {drills.length > 0 ? (
          <DataGrid
            rows={drills}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6">No drills available for this coach.</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ListDrillsByCoach;
