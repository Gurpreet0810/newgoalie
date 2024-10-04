import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { add_coach } from '../store/loginSlice'; // Replace with your actual action
// import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
const AddCoach = () => {
    const [coach, setCoach] = useState({
        coach_name: "",
        phone: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { t, i18n } = useTranslation();
    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCoach({ ...coach, [name]: value });
    };

    const fields = [
        { field: 'coach_name', name: 'coach_name', validate: 'required' },
        { field: 'email', name: 'email', validate: 'required' },
        { field: 'phone', name: 'phone', validate: 'required' },
        { field: 'password', name: 'password', validate: 'required' }
    ];

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const isValidate = await validate(fields, coach);
            if (isValidate) {
                setLoader(true);
                await add_coach(coach);  // Assuming add_coach accepts the coach object
                navigate('/list-coach');  // Navigate to coach listing page after success
            }
        } catch (error) {
            setLoader(false);
            setErrors(error);
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header">
                <h3 className="card-title">{t('addcoaches')}</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="coachName" className="profile-edit-field mb-3">
                        <Form.Label>{t('coachname')}</Form.Label>
                        <Form.Control
                            type="text"
                            name='coach_name'
                            placeholder={t('coachname')}
                            onChange={handleInputs}
                            value={coach.coach_name}
                            isInvalid={!!errors.coach_name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.coach_name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group as={Col} controlId="email" className="profile-edit-field mb-3">
                        <Form.Label>{t('email')}</Form.Label>
                        <Form.Control
                            type="email"
                            name='email'
                            placeholder="name@example.com"
                            onChange={handleInputs}
                            value={coach.email}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="phone" className="profile-edit-field mb-3">
                        <Form.Label>{t('phone')}</Form.Label>
                        <Form.Control
                            type="number"
                            name='phone'
                            placeholder={t('Enter your phone number')}
                            onChange={handleInputs}
                            value={coach.phone}
                            isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group as={Col} controlId="password" className="profile-edit-field mb-3">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control
                            type="password"
                            name='password'
                            placeholder={t('Enter a new password')}
                            onChange={handleInputs}
                            value={coach.password}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <div className="text-left">
                    <Button type='submit' variant="primary" disabled={loader}>{t('submit')}</Button>
                </div>
            </Form>
        </div>
    );
}

export default AddCoach;
