import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import previewImg from '../../assests/admin.jpg'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { validate } from '../utils/validate';
import { updateUserProfile } from '../store/loginSlice';
import axios from 'axios';

interface FormState {
    userName: string;
    email: string;
    photo: File | null;
    phoneNumber: string;
    password: string;
}

const ProfileEdit = () => {
    const { userInfo } = useSelector((state: any) => state.user);
    const [formData, setFormData] = useState<FormState>({
        userName: '',
        email: '',
        photo: null,
        phoneNumber: '',
        password: ''
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(previewImg);

    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [showValidation, setShowValidation] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4500/api/v1/user-profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    _id: userInfo[0]?.userDetails?._id,
                }
            });
            const userData = response.data;
            console.log("udata : ",userData);
            setFormData({
                userName: userData.userName,
                email: userData.email,
                photo: null,
                phoneNumber: userData.phoneNumber,
                password: ''
            });
            setImagePreview(`http://localhost:4500/storage/productImages/${userData.photo}`);
            // const uImg = userData.photo;
            // console.log('uu :',uImg);
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load profile data');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fields = [
        { field: 'userName', name: 'userName', validate: 'required' },
        { field: 'email', name: 'email', validate: 'required' },
        { field: 'phoneNumber', name: 'phoneNumber', validate: 'required' },
        { field: 'password', name: 'password', validate: '' }
    ];


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowValidation(true);
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files ? files[0] : null,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Set image preview for new upload
          }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const isValidate = await validate(fields, formData);
            if (isValidate) {
                const formDataToSend = new FormData();
                formDataToSend.append('userName', formData.userName);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('phoneNumber', formData.phoneNumber);
                if (formData.photo) {
                    formDataToSend.append('photo', formData.photo);
                }
                if (formData.password) {
                    formDataToSend.append('password', formData.password);
                }

                setLoader(true);

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                };

                const response = await axios.post(
                    'http://localhost:4500/api/v1/updateProfile',
                    formDataToSend,
                    config
                );

                if (response.status === 200) {
                    setLoader(false);
                    toast.success(response.data.message, { autoClose: 1000 });
                    navigate('/profile');
                }
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.log(error, "ProfileUpdateError==>>");
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
                <h3 className="card-title">Profile</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                <Form.Group controlId="name" className="profile-edit-field col-md-6">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="profile-edit-field col-md-6">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        disabled={true}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="phoneNumber" className="profile-edit-field col-md-6">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your phone number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        isInvalid={!!errors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.phoneNumber}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="profile-edit-field col-md-6">
                    <Form.Label>Set New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter a new password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="photo" className="profile-edit-field col-md-6">
                    <Form.Label>Profile Photo</Form.Label>
                    <Form.Control
                        type="file"
                        name="photo"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleChange}
                    />
                    {errors.photo && <div className='text-danger'>{errors.photo}</div>}
                </Form.Group>
                <Form.Group controlId="preview" className="profile-edit-field col-md-6">
                <img
                    src={imagePreview}
                    id="preview"
                    className="img-circle elevation-2"
                    style={{ width: '80px', marginTop: '20px', marginLeft: '20px' }}
                    alt="Profile Preview"
                />
            </Form.Group>

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

export default ProfileEdit;