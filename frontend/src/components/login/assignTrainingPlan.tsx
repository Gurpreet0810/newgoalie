import { useState, useEffect, FormEvent } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from '@mui/material'; // Import Material UI components
import { toast } from 'react-toastify';
import { assignTrainingPlan } from '../store/TrainingSlice'; // Assuming you have this action
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validate } from '../utils/validate';
import axios from 'axios';

const AssignTrainingPlan = () => {
    const [assignment, setAssignment] = useState({
        goalie_id: "", // Keep as string for the goalie selection
        training_plan_id: [] as string[], // Ensure this is typed as an array of strings
    });

    const [goalies, setGoalies] = useState<any[]>([]);
    const [trainingPlans, setTrainingPlans] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
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

    const handleInputs = (event: SelectChangeEvent<string[]>) => {
        const { name, value } = event.target;
        setAssignment({ ...assignment, [name]: value });
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
                    <Form.Label>Goalie</Form.Label>
                    <Form.Control
                        as="select"
                        name="goalie_id"
                        value={assignment.goalie_id || ""} // Ensure it's either string or empty string
                        onChange={(e) => setAssignment({ ...assignment, goalie_id: e.target.value })} // Update goalie_id
                        error={!!errors.goalie_id}
                    >
                        <option value="">Select Goalie</option>
                        {goalies.map((goalie) => (
                            <MenuItem key={goalie._id} value={goalie._id}>
                                {goalie.goalie_name}
                            </MenuItem>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.goalie_id}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="trainingPlanSelect" className="profile-edit-field col-md-6">
                    <Form.Label>Training Plan</Form.Label>
                    <Form.Control
                        as="select"
                        name="training_plan_id"
                        value={assignment.training_plan_id} // Keep this as is, since it is an array
                        onChange={handleInputs} // Use handleInputs for multiple selections
                        error={!!errors.training_plan_id}
                        multiple
                    >
                        <option value="">Select Training Plan</option>
                        {trainingPlans.map((plan) => (
                            <MenuItem key={plan._id} value={plan._id}>
                                {plan.training_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {loader ? (
                    <div className="text-left">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="text-left">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AssignTrainingPlan;
