import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import { assignTrainingPlan } from '../store/TrainingSlice'; // Assuming you have this action
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { validate } from '../utils/validate';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'; // Import Material UI components
import { useTranslation } from 'react-i18next';

const EditAssignTrainingPlan = () => {
    interface Assignment {
        goalie_id: string;
        training_plan_id: string[]; // Assuming each assignment has an array of training plans
    }

    const [assignment, setAssignment] = useState<Assignment>({
        goalie_id: "",
        training_plan_id: [] as string[], // Ensure this is typed as an array of strings
    });
    const { t, i18n } = useTranslation();
    const [goalies, setGoalies] = useState<any[]>([]);
    const [trainingPlans, setTrainingPlans] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming the route includes the assignment ID

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
                toast.error(t('error'));
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
                toast.error(t('error'));
            }
        };

        fetchTrainingPlans();
    }, []);

    // Fetch existing assignment details
    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:4500/api/v1/assignments/${id}`);
                const assignmentData = res.data;
                const firstAssignment = assignmentData[0];
                if (assignmentData) {
                    setAssignment({
                        goalie_id: firstAssignment.goalie_id,
                        training_plan_id: assignmentData.map((assignment: Assignment) => assignment.training_plan_id).flat(),
                    });
                }
            } catch (error) {
                console.error('Error fetching assignment details:', error);
                toast.error(t('error'));
            }
        };

        if (id) {
            fetchAssignmentDetails();
        }
    }, [id]);

    // Change handler for goalie select box
    const handleInputs = (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setAssignment({ ...assignment, [name]: value });
    };

    // Change handler for training plan select box
    const handleTrainingPlanChange = (event: SelectChangeEvent<string[]>) => {
        const selectedValues = event.target.value as string[]; // Ensure the selected value is treated as an array of strings
        setAssignment({ ...assignment, training_plan_id: selectedValues });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('goalie_id', assignment.goalie_id);
        assignment.training_plan_id.forEach(plan => {
            formData.append('training_plan_id[]', plan); // Append each selected training plan
        });
        formData.append('coach_id', userInfo[0]?.userDetails?._id);

        try {
            const isValidate = await validate(fields, assignment);
            if (isValidate) {
                setLoader(true);
                await assignTrainingPlan(formData, dispatch);
                setLoader(false);
                navigate('/manage-assign-training-plan');
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error updating training plan assignment:', error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">{t('manageassigntrainingplan')}</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                {/* Goalie Select Box */}
                <Form.Group controlId="goalieSelect" className="profile-edit-field col-md-6">
                    <Form.Label>{t('goalie')}</Form.Label>
                    <Form.Control
                        as="select"
                        name="goalie_id"
                        value={assignment.goalie_id}
                        onChange={handleInputs}
                        isInvalid={!!errors.goalie_id}
                        disabled
                    >
                        <option value="">{t('selectgoalie')}</option>
                        {goalies.map((goalie) => (
                            <option key={goalie._id} value={goalie._id}>
                                {goalie.userName}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.goalie_id}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Training Plans Select Box - Now a Material-UI Select */}
                <Form.Group controlId="trainingPlanSelect" className="profile-edit-field col-md-6">
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="training-plan-select-label">{t('trainingplan')}</InputLabel>
                        <Select
                            labelId="training-plan-select-label"
                            name="training_plan_id"
                            multiple
                            value={assignment.training_plan_id} // Set the selected values
                            onChange={handleTrainingPlanChange} // Use handleTrainingPlanChange for multiple selections
                            error={!!errors.training_plan_id}
                        >
                            <MenuItem value="">
                                <em>{t('selecttrainingplan')}</em>
                            </MenuItem>
                            {trainingPlans.map((plan) => (
                                <MenuItem key={plan._id} value={plan._id}>
                                    {plan.training_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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

export default EditAssignTrainingPlan;
