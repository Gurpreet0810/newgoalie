import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Typography, Snackbar, Alert, Paper, Container, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material'; // Import Material UI icons
import { toast } from 'react-toastify';

// Define the interface for the training data
interface Training {
  _id: string;
  training_name: string;
  category: string;
  drill_name: string;
  week: number[];
  __v: number;
}

interface DrillCategory {
  _id: string;
  category_name: string;
}

function ListTrainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null); // For delete confirmation

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trainings
        const trainingsResponse = await axios.get<Training[]>('http://localhost:4500/api/v1/trainings');
        const fetchedTrainings = trainingsResponse.data.map((training, index) => ({
          ...training,
          id: training._id,
          srNo: index + 1,
        }));

        // Fetch categories
        const categoriesResponse = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
        const categoryMapping = categoriesResponse.data.reduce((acc, category) => {
          acc[category._id] = category.category_name;
          return acc;
        }, {} as Record<string, string>);

        // Map trainings to replace category ID with category name
        const updatedTrainings = fetchedTrainings.map(training => ({
          ...training,
          category: categoryMapping[training.category] || 'No Category', // Assign the category name, or a fallback value
        }));

        setTrainings(updatedTrainings);
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

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:4500/api/v1/deletetrainings/${deleteId}`);
      setTrainings(trainings.filter(training => training._id !== deleteId));
      toast.success('Training deleted successfully', { autoClose: 1000 });
      setDialogOpen(false); // Close the confirmation dialog after deletion
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleClickDelete = (id: string) => {
    setDeleteId(id); // Store the training ID to delete
    setDialogOpen(true); // Open the confirmation dialog
  };

  const columns: GridColDef[] = [
    { field: 'srNo', headerName: 'Sr. No.', width: 200 },
    { field: 'id', headerName: 'ID', width: 300 },
    { field: 'training_name', headerName: 'Training Name', width: 300 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      sortable: false, 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            component={Link}
            to={`/edit-training/${params.row._id}`}
            aria-label="edit"
            style={{ marginRight: 8 }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleClickDelete(params.row._id)} // Trigger delete confirmation dialog
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
          Training List
        </Typography>
        <DataGrid
          rows={trainings}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle>{"Delete Training"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert onClose={() => setOpen(false)} severity="success">
            Training deleted successfully
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default ListTrainings;
