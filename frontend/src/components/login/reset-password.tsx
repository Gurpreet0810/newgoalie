import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Loader from "react-js-loader";
import '../style/style.scss';
import { validate } from '../utils/validate';
import logo from '../../assests/logo-white.png';
import bglogo from '../../assests/bg-login.jpg';
import { resetPassword } from '../store/loginSlice';
import { Form, Button } from 'react-bootstrap';

interface formState {
    password: string;
    confirmPassword: string;
}

const ResetPassword = () => {
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useParams<{ token: string }>(); // Capture the token from the URL

    const [formData, setFormData] = useState<formState>({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<any>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

    const fields = [
        { field: 'password', name: 'password', validate: 'required' },
        { field: 'confirmPassword', name: 'confirmPassword', validate: 'required|match:password' }
    ];

    const handleChange = (e: any) => {
        setShowValidation(true);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setShowValidation(true);

        // Custom validation for matching passwords
        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        try {
            const isValidate = await validate(fields, formData);
            if (isValidate) {
                setLoader(true);
                const data = await resetPassword({ ...formData, token }, dispatch);
                console.log('Reset password response', data);

                if (data?.statusCode === 200) {
                    toast.success(data.message, { autoClose: 2000 });
                    setLoader(false);
                    navigate('/');
                }
            }
        } catch (error: any) {
            setErrors(error);
            setLoader(false);
            console.log(error,"ResetPasswordError==>>");

                if (error?.data?.message) {
                    toast.error(error?.data?.message, {
                        autoClose: 2000
                    });
                }
            }
        };
    
        return (
            <div className="reset-password-page" style={{ backgroundImage: `url(${bglogo})` }}>
                <div className="signin-wrapper">
                    <div className="right-content">
                        <div className="center">
                            <div className="reset-content">
                                <img src={logo} alt="" className='reset-img' />
                                <Form onSubmit={handleSubmit} className="reset-form">
                                    <Form.Group controlId="formPassword" className="reset-password mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter your new password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            isInvalid={!!errors.password}
                                        />
                                        {errors.password && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
    
                                    <Form.Group controlId="formConfirmPassword" className="reset-confirm-password mb-3">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm your new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            isInvalid={!!errors.confirmPassword}
                                        />
                                        {errors.confirmPassword && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
    
                                    {loader ? (
                                        <div className="loader">
                                            <Loader type="box-up" bgColor={'red'} color={'yellow'} size={100} />
                                        </div>
                                    ) : (
                                       
                                            <Button variant="primary" type="submit" className="form-submit-button">
                                                Reset Password
                                            </Button>
                                    
                                    )}
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    export default ResetPassword;
    