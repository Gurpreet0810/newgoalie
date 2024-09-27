import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { validate } from '../utils/validate';
import axios from 'axios';

interface FormState {
    title: string;
    content: string;
    photo: File | null;
    link: string;
}

const HomeBannerEdit = () => {
    const [formData, setFormData] = useState<FormState>({
        title: '',
        content: '',
        photo: null,
        link: '',
    });

    const [imagePreview, setImagePreview] = useState<string>('');
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState<any>({});
    
    const navigate = useNavigate();

    const fetchHomeBannerData = async () => {
        try {
            const response = await axios.get('http://localhost:4500/api/v1/home-banner'); // Adjust the endpoint as necessary
            const bannerData = response.data; // Assuming the API returns the banner object
            setFormData({
                title: bannerData.title,
                content: bannerData.content,
                photo: null, // Reset photo field
                link: bannerData.link,
            });
            setImagePreview(`http://localhost:4500/storage/bannerImages/${bannerData.photo}`); // Adjust based on your storage path
        } catch (error) {
            console.error('Error fetching home banner data:', error);
            toast.error('Failed to load home banner data');
        }
    };

    useEffect(() => {
        fetchHomeBannerData();
    }, []);

    const fields = [
        { field: 'title', name: 'title', validate: 'required' },
        { field: 'content', name: 'content', validate: 'required' },
        { field: 'link', name: 'link', validate: 'required' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
    
        if (type === 'file') {
            const input = e.target as HTMLInputElement; // Type assertion here
            const file = input.files ? input.files[0] : null;
    
            setFormData({
                ...formData,
                [name]: file,
            });
    
            if (file) {
                setImagePreview(URL.createObjectURL(file)); // Set image preview for new upload
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const isValidate = await validate(fields, formData);
            if (isValidate) {
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('content', formData.content);
                formDataToSend.append('link', formData.link);
                if (formData.photo) {
                    formDataToSend.append('photo', formData.photo);
                }

                setLoader(true);

                const response = await axios.post(
                    'http://localhost:4500/api/v1/updateHomeBanner', // Adjust the endpoint as necessary
                    formDataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setLoader(false);
                    toast.success(response.data.message, { autoClose: 1000 });
                    navigate('/home-banner'); // Adjust the navigation path as necessary
                }
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.log(error, "HomeBannerUpdateError==>>");
            if (error?.data?.message) {
                toast.error(error?.data?.message, {
                    autoClose: 2000
                });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header">
                <h3 className="card-title">Edit Home Banner</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                <Form.Group controlId="title" className="profile-edit-field col-md-6">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter banner title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="content" className="profile-edit-field col-md-6">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter banner content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        isInvalid={!!errors.content}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.content}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="link" className="profile-edit-field col-md-6">
                    <Form.Label>Link</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter banner link"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        isInvalid={!!errors.link}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.link}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="photo" className="profile-edit-field col-md-6">
                    <Form.Label>Banner Photo (Accept only: jpg,jpeg,png,gif)</Form.Label>
                    <Form.Control
                        type="file"
                        name="photo"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={handleChange}
                    />
                </Form.Group>

                {imagePreview && (
                    <Form.Group controlId="preview" className="profile-edit-field col-md-6">
                        <img
                            src={imagePreview}
                            id="preview"
                            className="img-circle elevation-2"
                            style={{ width: '80px', marginTop: '20px', marginLeft: '20px' }}
                            alt="Banner Preview"
                        />
                    </Form.Group>
                )}

                {loader ? (
                    <div className="text-left">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="text-left">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                )}
            </Form>
        </div>
    );
}

export default HomeBannerEdit;
