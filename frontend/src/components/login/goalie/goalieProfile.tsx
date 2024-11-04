import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import previewImg from '../../../assests/admin.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { validate } from '../../utils/validate';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
    const [imagePreview, setImagePreview] = useState<string>(previewImg);
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const navigate = useNavigate();
    

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4500/api/v1/user-profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { _id: userInfo[0]?.userDetails?._id }
            });
            const userData = response.data;
            setFormData({
                userName: userData.userName,
                email: userData.email,
                photo: null,
                phoneNumber: userData.phoneNumber,
                password: ''
            });
            setImagePreview(`http://localhost:4500/storage/productImages/${userData.photo}`);
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load profile data');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files ? files[0] : null;
            setFormData({ ...formData, photo: file });
            setImagePreview(file ? URL.createObjectURL(file) : previewImg);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationFields = [
            { field: 'userName', name: 'userName', validate: 'required' },
            { field: 'email', name: 'email', validate: 'required' },
            { field: 'phoneNumber', name: 'phoneNumber', validate: 'required' },
            { field: 'password', name: 'password', validate: '' }
        ];
        try {
            const isValid = await validate(validationFields, formData);
            if (isValid) {
                const formDataToSend = new FormData();
                formDataToSend.append('userName', formData.userName);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('phoneNumber', formData.phoneNumber);
                if (formData.photo) formDataToSend.append('photo', formData.photo);
                if (formData.password) formDataToSend.append('password', formData.password);

                setLoader(true);
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                };

                const response = await axios.post(
                    'http://localhost:4500/api/v1/updateProfile',
                    formDataToSend,
                    config
                );

                if (response.status === 200) {
                    setLoader(false);
                    toast.success(response.data.message, { autoClose: 1000 });
                    navigate('/goalie-profile');
                }
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    const { t } = useTranslation();
    return (
        <section className="goalie_profile_section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-12 m-auto">
                        <Form onSubmit={handleSubmit} className="profile-form" id="u_profile">
                            <div className="avatar-upload">
                                <div className="avatar-edit">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        name="photo"
                                        onChange={handleChange}
                                        accept=".jpg, .jpeg, .png"
                                        id="imageUpload"
                                    />
                                    <label htmlFor="imageUpload"></label>
                                </div>
                                <div className="avatar-preview">
                                    <div
                                        style={{ backgroundImage: `url(${imagePreview})`, backgroundSize: 'contain' }}
                                        className="imagePreview"
                                    ></div>
                                </div>
                            </div>
                            <div className="text-center text-white mb-4">
                                <h3>{formData.userName}</h3>
                            </div>

                            <Form.Group className="form-floating mb-4">
                            <Form.Control
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                isInvalid={!!errors.userName}
                            />
                            <Form.Label>{t('name')}</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {errors.userName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-floating mb-4">
                            <Form.Control
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                required
                                isInvalid={!!errors.email}
                            />
                            <Form.Label>{t('email')}</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-floating mb-4">
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                isInvalid={!!errors.phoneNumber}
                            />
                            <Form.Label>{t('phone')}</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {errors.phoneNumber}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-floating mb-4">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder={t("Text.set_new_pass")}
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Label>{t('set_new_pass')}</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                            <div className="text-center mb-3">
                                {loader ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <Button variant="primary" type="submit">
                                        {t('submit')}
                                    </Button>
                                )}
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileEdit;
