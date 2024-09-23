import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validate } from '../utils/validate';

function EditBlogCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    category_name: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fields = [
    { field: 'category_name', name: 'category_name', validate: 'required' },
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/get_blog_category/${id}`);
        const categoryData = response.data;
        setCategory({
          category_name: categoryData.category_name
        });
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

    fetchCategory();
  }, [id]);

  const handleInputs = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setShowValidation(true);
    const { name, value } = event.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const isValidate = await validate(fields, category);
      if (isValidate) {
        setLoader(true);
        await axios.put(`http://localhost:4500/api/v1/update_blog_category/${id}`, category);
        setLoader(false);
        toast.success('Blog Category updated successfully', { autoClose: 1000 });
        navigate('/list-blog-category');
      }
    } catch (error: any) {
      setLoader(false);
      setErrors(error);
      console.error('Error updating blog category:', error);
      if (error?.data?.message) {
        toast.error(error?.data?.message, { autoClose: 2000 });
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-edit-content card card-primary">
      <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
        <h3 className="card-title">Edit Blog Category</h3>
      </div>
      <Form onSubmit={handleSubmit} className="profile-edit-form row">
        <Form.Group controlId="categoryName" className="profile-edit-field col-md-6">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            name="category_name"
            value={category.category_name}
            onChange={handleInputs}
            isInvalid={!!errors.category_name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.category_name}
          </Form.Control.Feedback>
        </Form.Group>

        {loader ? (
          <div className="text-left">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="text-left">
            <Button variant="primary" type="submit" className="me-2">Update</Button>
            <Button variant="secondary" onClick={() => navigate('/list-blog-category')}>Cancel</Button>
          </div>
        )}
      </Form>
    </div>
  );
}

export default EditBlogCategory;