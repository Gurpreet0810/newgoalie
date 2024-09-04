import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditGoalie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/goalies/${id}`);
        const user = response.data;
        setName(user.goalie_name);
        setPhone(user.phone);
        setEmail(user.email);
        setImagePreview(user.image); // Show existing image preview
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set image preview
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('goalie_name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    if (image) {
      formData.append('image', image); // Append image if selected
    }

    try {
      await axios.put(`http://localhost:4500/api/v1/goalies/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/goalies');
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
    <div>
      <h1>Edit Goalie</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="file"
        onChange={handleImageChange}
      />
      {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
      <button onClick={handleUpdate}>Update</button>
      <button onClick={() => navigate('/goalies')}>Cancel</button>
    </div>
  );
}

export default EditGoalie;
