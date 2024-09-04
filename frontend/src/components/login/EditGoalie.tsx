import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Image, Container, Row, Col } from 'react-bootstrap';

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
        const response = await axios.get(`http://localhost:4500/api/v1/get_goalies/${id}`);
        console.log(response.data, "Response Data");

        const user = response.data;
        setName(user.goalie_name);
        setPhone(user.phone);
        setEmail(user.email);
        setImagePreview(`http://localhost:4500/storage/productImages/${user.goalie_photo}`); // Construct the full image URL
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
      setImagePreview(URL.createObjectURL(file)); // Set image preview for new upload
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('goalie_name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    if (image) {
      formData.append('goalie_photo', image); // Append image if selected
    }

    try {
      await axios.put(`http://localhost:4500/api/v1/update_goalie/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/list_goalie');
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
    <Container className='home_section'>
      <h1>Edit Goalie</h1>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </Form.Group>

        <Form.Group controlId="formPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
          />
        </Form.Group>

        {imagePreview && (
          <Row className="my-3">
            <Col>
              <Image src={imagePreview} alt="Preview" thumbnail width="100" />
            </Col>
          </Row>
        )}

        <Button variant="primary" onClick={handleUpdate} className="me-2">
          Update
        </Button>
        <Button variant="secondary" onClick={() => navigate('/goalies')}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
}

export default EditGoalie;
