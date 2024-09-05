import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
// Define the user interface based on the structure of your data
interface User {
  _id: string;
  goalie_name: string;
  phone: string;
  email: string;
  goalie_photo:string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function ListGoalie() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:4500/api/v1/goalies');
        setUsers(response.data);
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

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4500/api/v1/deleteGoalies/${id}`);
      setUsers(users.filter(user => user._id !== id));
      toast.success('Goalie deleted successfully', { autoClose: 1000 });
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
    <h1>Goalies List</h1>
    {users.length > 0 ? (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Logo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.goalie_name}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
                <td><img src={`http://localhost:4500/storage/productImages/${user.goalie_photo}`} style={{ width: "200px" }}  /></td>
             
                {/* <td>${user.goalie_photo}</td> */}
              <td>
                <Link to={`/goalies/edit/${user._id}`}>
                  <Button variant="warning" className="me-2">Edit</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>No users found</p>
    )}
  </div>
  );
}

export default ListGoalie;
