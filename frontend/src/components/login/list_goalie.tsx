// src/components/login/list_goalie.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the user interface based on the structure of your data
interface User {
  _id: string;
  goalie_name: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the error type for TypeScript
interface AxiosError {
  message: string;
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<div className="home_section">
      <h1>Goalies List</h1>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.goalie_name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>{new Date(user.updatedAt).toLocaleString()}</td>
                <td><a href="#">Edit</a></td>
                <td><a href="#">Delete</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default ListGoalie;
