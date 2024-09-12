import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function EditCoach() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [coachName, setCoachName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData = { coach_name: coachName, phone, email };

    try {
      await axios.put(`http://localhost:4500/api/v1/update_coach/${id}`, updatedData);
      navigate('/list_coach');
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
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formEmail" className="profile-edit-field mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formPhone" className="profile-edit-field mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
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
