import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Image, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'
function EditGoalie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [pro_image, setProFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/get_goalies/${id}`);
        console.log(response.data, "Response Data");

        const user = response.data;
        setName(user.userName);
        setPhone(user.phoneNumber);
        setEmail(user.email);
        setImagePreview(`http://localhost:4500/storage/productImages/${user.photo}`); // Construct the full image URL
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
      setProFile(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('goalie_name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    if (pro_image) {
      formData.append('goalie_photo', pro_image); // Append image if selected
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
    <Container className="profile-edit-content card card-primary">
  <div className="card-header">
    <h3 className="card-title">{t('editgoalie')}</h3>
  </div>
  
  <Form onSubmit={handleUpdate} className="profile-edit-form row">
    <Row className="mb-3">
      <Form.Group as={Col} controlId="formName" className="profile-edit-field mb-3">
        <Form.Label>{t('name')}</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('goalie_name')}
        />
      </Form.Group>

      <Form.Group as={Col} controlId="formEmail" className="profile-edit-field mb-3">
        <Form.Label>{t('email')}</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
        />
      </Form.Group>
    </Row>

    <Row className="mb-3">
      <Form.Group as={Col} controlId="formImage" className="profile-edit-field mb-3">
        <Form.Label>{t('photo')} {t('Accept only: jpg,jpeg,png,gif')}</Form.Label>
        <Form.Control
          type="file"
          name="image"
          onChange={handleImageChange}
          accept="image/jpeg, image/png, image/jpg, image/gif"
        />
      </Form.Group>

      {imagePreview && (
        <Form.Group as={Col} className="profile-edit-field mb-3">
          <Row className="my-3">
            <Col>
              <Image src={imagePreview} alt="Preview" thumbnail width="100" />
            </Col>
          </Row>
        </Form.Group>
      )}
    </Row>

    
    <Row className="mb-3">
      <Form.Group as={Col} controlId="formPhone" className="profile-edit-field mb-3">
        <Form.Label>Phone (Accept only: Numbers)</Form.Label>
        <Form.Control
          type="number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
        />
      </Form.Group>

      <Form.Group as={Col}  className="profile-edit-field mb-3">
        
      </Form.Group>
    </Row>

    <div className="text-left">
      <Button type="submit" variant="primary" className="me-2">Update</Button>
      <Button variant="secondary" onClick={() => navigate('/goalies')}>Cancel</Button>
    </div>
  </Form>
</Container>

  );
}

export default EditGoalie;
