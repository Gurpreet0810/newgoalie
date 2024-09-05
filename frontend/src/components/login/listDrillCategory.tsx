import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
        setCategories(response.data);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home_section container-fluid">
      <h1>Drill Categories List</h1>
      {categories.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Category Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category._id}>
                <td>{category.category_name}</td>
                <td>{category.category_status === 'active' ? 'Active' : 'Not Active'}</td>
                <td>
                  <Link to={`/drill-categories/edit/${category._id}`}>
                    <Button variant="warning" className="me-2">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(category._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No drill categories found</p>
      )}
    </div>
  );
}

export default ListDrillCategory;
