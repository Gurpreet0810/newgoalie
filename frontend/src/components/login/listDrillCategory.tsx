import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Typography, Snackbar, Alert, Paper, Container, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material'; // Import Material UI icons
import { toast } from 'react-toastify';

// Define the interface for the drill category data
interface DrillCategory {
  _id: string;
  category_name: string;
  category_status: string;
  __v: number;
}

function ListDrillCategory() {
  const [categories, setCategories] = useState<DrillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
        const formattedCategories = response.data.map((category, index) => ({
          ...category,
          id: category._id, // Create an `id` field for the DataGrid
          srNo: index + 1, // Add Sr. No. field, starting from 1
        }));
        setCategories(formattedCategories);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4500/api/v1/drillCategories/${id}`);
      setCategories(categories.filter(category => category._id !== id));
      toast.success('Drill Category deleted successfully', { autoClose: 1000 });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'srNo', headerName: 'Sr. No.', width: 100 },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'category_name', headerName: 'Category Name', flex: 1 },
    { 
      field: 'category_status', 
      headerName: 'Category Status', 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value === 'active' ? 'Active' : 'Not Active'}
        </Typography>
      ),
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      sortable: false, 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            component={Link}
            to={`/drill-categories/edit/${params.row._id}`}
            aria-label="edit"
            style={{ marginRight: 8 }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row._id)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];
  
  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <Container maxWidth={false} sx={{ marginTop: '120px' }}>
    <Paper sx={{ height: 400, width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ padding: '15px', background: '#00617a', color: '#fff' }}>
        Drill Categories List
      </Typography>
      <DataGrid
        rows={categories}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success">
          Drill Category deleted successfully
        </Alert>
      </Snackbar>
    </Paper>
    </Container>
  );
}

export default ListDrillCategory;
