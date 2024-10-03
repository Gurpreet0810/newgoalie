import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import { assignTrainingPlan } from '../store/TrainingSlice'; // Assuming you have this action
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validate } from '../utils/validate';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
const AssignTrainingPlan = () => {
    const [assignment, setAssignment] = useState({
        goalie_id: "",
        training_plan_id: [] as string[], // Ensure this is typed as an array of strings
    });

    const [goalies, setGoalies] = useState<any[]>([]);
    const [trainingPlans, setTrainingPlans] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state: any) => state.user);

    const fields = [
        { field: 'goalie_id', name: 'goalie_id', validate: 'required' },
        { field: 'training_plan_id', name: 'training_plan_id', validate: 'required' },
    ];

    // Fetch goalies
    useEffect(() => {
        const fetchGoalies = async () => {
            try {
                const res = await axios.get('http://localhost:4500/api/v1/goalies');
                setGoalies(res.data);
            } catch (error) {
                console.error('Error fetching goalies:', error);
                toast.error('Error fetching goalies');
            }
        };

        fetchGoalies();
    }, []);

    // Fetch training plans
    useEffect(() => {
        const fetchTrainingPlans = async () => {
            try {
                const res = await axios.get('http://localhost:4500/api/v1/trainings');
                setTrainingPlans(res.data);
            } catch (error) {
                console.error('Error fetching training plans:', error);
                toast.error('Error fetching training plans');
            }
        };

        fetchTrainingPlans();
    }, []);

    const handleInputs = (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setShowValidation(true);
        const { name } = event.target;

        if (name === 'training_plan_id') {
            const target = event.target as HTMLSelectElement; // Assert to HTMLSelectElement
            const options = Array.from(target.selectedOptions).map((option) => option.value); // Get selected values
            setAssignment({ ...assignment, [name]: options });
        } else {
            setAssignment({ ...assignment, [name]: event.target.value });
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('goalie_id', assignment.goalie_id);
        assignment.training_plan_id.forEach(plan => {
            formData.append('training_plan_id[]', plan); // Append each selected training plan
        });
        formData.append('user_id', userInfo[0]?.userDetails?._id);

        try {
            const isValidate = await validate(fields, assignment);
            if (isValidate) {
                setLoader(true);
                await assignTrainingPlan(formData, dispatch);
                setLoader(false);
                navigate('/list-assignments');
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error assigning training plan:', error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">{t('assigntrainingplan')}</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                <Form.Group controlId="goalieSelect" className="profile-edit-field col-md-6">
                    <Form.Label>{t('goalie')}</Form.Label>
                    <Form.Control
                        as="select"
                        name="goalie_id"
                        value={assignment.goalie_id}
                        onChange={handleInputs}
                        isInvalid={!!errors.goalie_id}
                    >
                        <option value="">{t('selectgoalie')}</option>
                        {goalies.map((goalie) => (
                            <option key={goalie._id} value={goalie._id}>
                                {goalie.goalie_name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.goalie_id}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="trainingPlanSelect" className="profile-edit-field col-md-6">
                    <Form.Label>{t('trainingplan')}</Form.Label>
                    <Form.Control
                        as="select"
                        name="training_plan_id"
                        value={assignment.training_plan_id}
                        onChange={handleInputs}
                        isInvalid={!!errors.training_plan_id}
                        multiple={true}
                    >
                        <option value="">{t('selecttrainingplan')}</option>
                        {trainingPlans.map((plan) => (
                            <option key={plan._id} value={plan._id}>
                                {plan.training_name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.training_plan_id}
                    </Form.Control.Feedback>
                </Form.Group>

                {loader ? (
                    <div className="text-left">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="text-left">
                        <Button variant="primary" type="submit">{t('submit')}</Button>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default AssignTrainingPlan;
