import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

function EditCoach() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [coachName, setCoachName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/get_coach/${id}`);
        const coach = response.data;
        setCoachName(coach.userName);
        setPhone(coach.phoneNumber);
        setEmail(coach.email);
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

    fetchCoach();
  }, [id]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!coachName) errors.coachName = 'Coach Name is required';
    if (!phone) errors.phone = 'Phone is required';
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    return errors;
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    const updatedData = { coach_name: coachName, phone, email };

    try {
      await axios.put(`http://localhost:4500/api/v1/update_coach/${id}`, updatedData);
      toast.success('Coach updated successfully')
      navigate('/list-coach');
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
        <h3 className="card-title">Edit Coach</h3>
      </div>

      <Form onSubmit={handleUpdate} className="profile-edit-form row">
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formCoachName" className="profile-edit-field mb-3">
            <Form.Label>Coach Name</Form.Label>
            <Form.Control
              type="text"
              name="coachName"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              placeholder="Coach Name"
              isInvalid={!!formErrors.coachName}
            />
            <Form.Control.Feedback type="invalid">{formErrors.coachName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="formEmail" className="profile-edit-field mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              isInvalid={!!formErrors.email}
            />
            <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
          </Form.Group>
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
              isInvalid={!!formErrors.phone}
            />
            <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <div className="text-left">
          <Button type="submit" variant="primary" className="me-2">Update</Button>
          <Button variant="secondary" onClick={() => navigate('/list-coach')}>Cancel</Button>
        </div>
      </Form>
    </Container>
  );
}

export default EditCoach;
