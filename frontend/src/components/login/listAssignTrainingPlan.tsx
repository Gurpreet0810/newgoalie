import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Typography, Snackbar, Alert, Paper, Container, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material'; // Import Material UI icons
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Define the interface for the assigned training plan data
interface AssignedTrainingPlan {
  _id: string;
  goalie_name: string;
  training_plan_name: string;
  status: number; // 0 = Not Started, 1 = In Progress, 2 = Completed
}

function ListAssignTrainingPlan() {
  const [assignedTrainingPlans, setAssignedTrainingPlans] = useState<AssignedTrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null); // For delete confirmation

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assigned training plans
        const response = await axios.get<AssignedTrainingPlan[]>('http://localhost:4500/api/v1/assignTrainingPlans');
        const fetchedData = response.data.map((item, index) => ({
          ...item,
          id: item._id,
          srNo: index + 1,
        }));

        setAssignedTrainingPlans(fetchedData); // Keep status as a number
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

  // Helper function to map status values to human-readable text (used in render)
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Not Started';
      case 1:
        return 'In Progress';
      case 2:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:4500/api/v1/assignTrainingPlans/${deleteId}`);
      setAssignedTrainingPlans(assignedTrainingPlans.filter(plan => plan._id !== deleteId));
      toast.success('Assigned Training Plan deleted successfully', { autoClose: 1000 });
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
    setDeleteId(id); // Store the assigned training plan ID to delete
    setDialogOpen(true); // Open the confirmation dialog
  };

  const columns: GridColDef[] = [
    { field: 'srNo', headerName: 'Sr. No.', width: 150 },
    // { field: 'id', headerName: 'ID', width: 300 },
    // { field: 'goalie_name', headerName: 'Goalie Name', width: 250 },
    // { field: 'goalie_email', headerName: 'Goalie Email', width: 250 },
    { field: 'goalie_name', headerName: 'Goalie Name', width: 250 },
    { field: 'goalie_email', headerName: 'Goalie Email', width: 350 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      sortable: false, 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            component={Link}
            to={`/edit-assigned-training-plan/${params.row._id}`}
            aria-label="edit"
            style={{ marginRight: 8 }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="view"
            component={Link}
            to={`/view-assigned-training-plan/${params.row._id}`}
          >
            <VisibilityIcon />
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
          Assigned Training Plan List
        </Typography>
        <DataGrid
          rows={assignedTrainingPlans}
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
          <DialogTitle>{"Delete Assigned Training Plan"}</DialogTitle>
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
            Assigned Training Plan deleted successfully
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default ListAssignTrainingPlan;
