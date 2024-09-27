import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { validate } from '../utils/validate';

function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Blog data and categories
  const [blog, setBlog] = useState({
    title: '',
    category: '',
    content: '',
    photo: '', // Will store the URL of the image
    file: null as File | null, // Will store the File object
  });
  const [categories, setCategories] = useState<{ _id: string, category_name: string }[]>([]); 
  const [errors, setErrors] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Validation fields
  const fields = [
    { field: 'title', name: 'title', validate: 'required' },
    { field: 'category', name: 'category', validate: 'required' },
    { field: 'content', name: 'content', validate: 'required' },
  ];

  // Fetch blog and categories data
  useEffect(() => {
    const fetchBlogAndCategories = async () => {
      try {
        const [blogResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:4500/api/v1/get_blog/${id}`),
          axios.get(`http://localhost:4500/api/v1/blogCategories`),
        ]);

        const blogData = blogResponse.data;
        setBlog({
          title: blogData.title,
          category: blogData.category,
          content: blogData.content,
          photo: 'http://localhost:4500/storage/productImages/'+blogData.photo,
          file: null, // No file yet, just the URL
        });

        setCategories(categoriesResponse.data);
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

    fetchBlogAndCategories();
  }, [id]);

  // Handle input changes
  const handleInputs = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setShowValidation(true);
    const { name, value } = event.target;
    setBlog({ ...blog, [name]: value });
  };

  // Handle file selection (image upload)
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setBlog({ ...blog, photo: URL.createObjectURL(file), file });
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const isValidate = await validate(fields, blog);
      if (isValidate) {
        setLoader(true);

        const formData = new FormData();
        formData.append('title', blog.title);
        formData.append('category', blog.category);
        formData.append('content', blog.content);

        // If a new file is selected, append it to the form data
        if (blog.file) {
          formData.append('photo', blog.file);
        }

        await axios.put(`http://localhost:4500/api/v1/update_blog/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setLoader(false);
        toast.success('Blog updated successfully', { autoClose: 1000 });
        navigate('/list-blog');
      }
    } catch (error: any) {
      setLoader(false);
      setErrors(error);
      console.error('Error updating blog:', error);
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
        <h3 className="card-title">Edit Blog</h3>
      </div>
      <Form onSubmit={handleSubmit} className="profile-edit-form row">
        {/* Title Field */}
        <Form.Group controlId="title" className="profile-edit-field col-md-6">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter blog title"
            name="title"
            value={blog.title}
            onChange={handleInputs}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Category Field */}
        <Form.Group controlId="category" className="profile-edit-field col-md-6">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={blog.category}
            onChange={handleInputs}
            isInvalid={!!errors.category}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.category_name}</option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.category}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Content Field (React Quill for Rich Text Editing) */}
        <Form.Group controlId="content" className="profile-edit-field col-md-12">
          <Form.Label>Content</Form.Label>
          <ReactQuill
            value={blog.content}
            onChange={(value) => setBlog({ ...blog, content: value })}
            theme="snow"
          />
          {errors.content && <div className="invalid-feedback d-block">{errors.content}</div>}
        </Form.Group>

        {/* Image Upload Field */}
        <Form.Group controlId="photo" className="profile-edit-field col-md-6">
          <Form.Label>Upload Photo</Form.Label>
          <Form.Control
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        {/* Image Preview */}
        {blog.photo && (
          <div className="profile-edit-field col-md-6">
            <Form.Label>Preview:</Form.Label>
            <img src={blog.photo} alt="Blog preview" style={{ maxWidth: '30%', height: 'auto' }} />
          </div>
        )}

        {loader ? (
          <div className="text-left">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="text-left">
            <Button variant="primary" type="submit" className="me-2">Update</Button>
            <Button variant="secondary" onClick={() => navigate('/list-blogs')}>Cancel</Button>
          </div>
        )}
      </Form>
    </div>
  );
}

export default EditBlog;
