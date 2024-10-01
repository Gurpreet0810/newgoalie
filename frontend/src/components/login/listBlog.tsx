import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Typography, Snackbar, Alert, Paper, Container, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Define the interfaces for blog and blog category data
interface Blog {
  _id: string;
  title: string;
  category: string; // This stores the category ID
  content: string;
  photo: string;
  __v: number;
}

interface BlogCategory {
  _id: string;
  category_name: string;
}

function ListBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null); // For delete confirmation dialog
  const [dialogOpen, setDialogOpen] = useState(false); // State to control the delete dialog

  useEffect(() => {
    const fetchBlogsAndCategories = async () => {
      try {
        const [blogsResponse, categoriesResponse] = await Promise.all([
          axios.get<Blog[]>('http://localhost:4500/api/v1/blogs'),
          axios.get<BlogCategory[]>('http://localhost:4500/api/v1/blogCategories'),
        ]);

        const categoriesMap = new Map(categoriesResponse.data.map(cat => [cat._id, cat.category_name]));

        const formattedBlogs = blogsResponse.data.map((blog, index) => ({
          ...blog,
          id: blog._id,
          srNo: index + 1,
          category_name: categoriesMap.get(blog.category) || 'Unknown', // Map category ID to category_name
        }));

        setBlogs(formattedBlogs);
        setCategories(categoriesResponse.data);
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

    fetchBlogsAndCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:4500/api/v1/blogs/${deleteId}`);
      setBlogs(blogs.filter(blog => blog._id !== deleteId));
      toast.success('Blog deleted successfully', { autoClose: 1000 });
      setDialogOpen(false); // Close dialog after deletion
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleClickDelete = (id: string) => {
    setDeleteId(id); // Store the blog ID to delete
    setDialogOpen(true); // Open the confirmation dialog
  };

  const columns: GridColDef[] = [
    { field: 'srNo', headerName: 'Sr. No.', width: 100 },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'category_name', headerName: 'Category', flex: 1 }, // Use category_name here
    {
      field: 'photo',
      headerName: 'Photo',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <img
          src={`http://localhost:4500/storage/productImages/${params.row.photo}`}
          alt="Blog"
          style={{ width: 50, height: 50 }}
        />
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
            to={`/blog/edit/${params.row._id}`}
            aria-label="edit"
            style={{ marginRight: 8 }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleClickDelete(params.row._id)} // Open confirmation dialog
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
          Blog List
        </Typography>
        <DataGrid
          rows={blogs}
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
          <DialogTitle>{"Delete Blog"}</DialogTitle>
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
            Blog deleted successfully
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default ListBlogs;
