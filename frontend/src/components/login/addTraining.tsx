import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';  
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { addTrainings } from '../store/TrainingSlice';

const AddTraining = () => {
    const [training, setTraining] = useState({
        training_name: "",
        category: "",
        photo: null as File | null,
        drill_name: "",
        photoPreview: "", 
    });

    interface DrillCategory {
        _id: string;
        category_name: string;
        category_status: string;
    }
    interface Drills {
        _id: string;
        drill_name: string;
        category: string;
        video_option: string;
    }
    
    const [categories, setCategories] = useState<DrillCategory[]>([]);
    const [drills, setDrills] = useState<Drills[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});
    const [showValidation, setShowValidation] = useState(false);
    const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state: any) => state.user);

    // Handle input fields (drill name, category, description, etc.)
    const handleInputs = async (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setShowValidation(true);
        const { name, value } = event.target;
        setTraining({ ...training, [name]: value });
        
        if (name === 'category') {
            // Fetch drills when category changes
            try {
                const response = await axios.get<Drills[]>(`http://localhost:4500/api/v1/drills?category=${value}`);
                setDrills(response.data);
            } catch (err) {
                if (err instanceof Error) {
                    setErrors({ fetch: err.message });
                } else {
                    setErrors({ fetch: 'An unknown error occurred' });
                }
            }
        }
    };

    // Handle file changes (photo and video uploads)
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            setTraining({
                ...training,
                photo: file,
                photoPreview: URL.createObjectURL(file),
            });
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
            const activeCategories = response.data.filter(category => category.category_status === 'active');
            setCategories(activeCategories);
        } catch (err) {
            if (err instanceof Error) {
                setErrors({ fetch: err.message });
            } else {
                setErrors({ fetch: 'An unknown error occurred' });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const weeksData = [
        { month: 'August', weeks: [31, 32, 33, 34, 35] },
        { month: 'September', weeks: [36, 37, 38, 39] },
        { month: 'October', weeks: [40, 41, 42, 43, 44] },
        { month: 'November', weeks: [44, 45, 46, 47, 48] },
        { month: 'December', weeks: [48, 49, 50, 51, 52] },
        { month: 'January', weeks: [1, 2, 3, 4, 5] },
        { month: 'February', weeks: [6, 7, 8, 9] },
        { month: 'March', weeks: [9, 10, 11, 12, 13] },
        { month: 'April', weeks: [14, 15, 16, 17] },
        { month: 'May', weeks: [18, 19, 20, 21, 22] },
        { month: 'June', weeks: [22, 23, 24, 25, 26] },
        { month: 'July', weeks: [26, 27, 28, 29, 30] },
    ];

    // Handle week checkbox changes
    const handleWeekChange = (event: ChangeEvent<HTMLInputElement>) => {
        const week = parseInt(event.target.value, 10);
        setSelectedWeeks(prevWeeks =>
            event.target.checked
                ? [...prevWeeks, week]
                : prevWeeks.filter(w => w !== week)
        );
        console.log(selectedWeeks);
    };

    // Form submission handler
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('training_name', training.training_name);
        formData.append('drill_category', training.category);
        if (training.photo) {
            formData.append('photo', training.photo);
        }
        formData.append('user_id', userInfo[0]?.userDetails?._id);
        formData.append('weeks', JSON.stringify(selectedWeeks)); // Add selected weeks
        formData.append('drill_name',training.drill_name);
        try {
            const isValidate = await validate([
                { field: 'training_name', name: 'Training Name', validate: 'required' },
                { field: 'category', name: 'Category', validate: 'required' },
            ], training);
            if (isValidate) {
                // await axios.post('http://localhost:4500/api/v1/trainings', formData);
                // toast.success('Training added successfully!', { autoClose: 2000 });
                // setLoader(true);
                await addTrainings(formData, dispatch);
                // setLoader(false);
            }
        } catch (error: any) {
            setErrors(error);
            console.error('Error adding training:', error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">Add Training</h3>
            </div>
            <Form
                onSubmit={handleSubmit}
                encType='multipart/form-data'
                className="profile-edit-form row"
            >
                <Form.Group controlId="training_name" className="profile-edit-field col-md-6">
                    <Form.Label>Training Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Training Name"
                        name="training_name"
                        value={training.training_name}
                        onChange={handleInputs}
                        isInvalid={!!errors.training_name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.training_name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="photo" className="profile-edit-field col-md-6">
                    <Form.Label>Training Image</Form.Label>
                    <Form.Control
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        isInvalid={!!errors.photo}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.photo}
                    </Form.Control.Feedback>
                    {training.photoPreview && (
                        <div className="image-preview mt-2">
                            <img src={training.photoPreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "150px" }} />
                        </div>
                    )}
                </Form.Group>
                <Form.Group controlId="category" className="profile-edit-field col-md-6">
                    <Form.Label>Drill Category</Form.Label>
                    <Form.Control
                        as="select"
                        name="category"
                        value={training.category}
                        onChange={handleInputs}
                        isInvalid={!!errors.category}
                    >
                        <option value="">Select Drill Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.category_name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.category}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="drill_name" className="profile-edit-field col-md-6">
                    <Form.Label>Drill Name</Form.Label>
                    <Form.Control
                        as="select"
                        name="drill_name"
                        value={training.drill_name}
                        onChange={handleInputs}
                        isInvalid={!!errors.drill_name}
                    >
                        <option value="">Select Drill Name</option>
                        {drills.map((drill) => (
                            <option key={drill._id} value={drill._id}>
                                {drill.drill_name}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.drill_name}
                    </Form.Control.Feedback>
                </Form.Group>

               

                <Form.Group controlId="weekSelection">
                    <Form.Label>Week</Form.Label>
                    <div className="month-flex-container">
                        {weeksData.map((monthData, index) => (
                            <div key={index} className="month-container">
                                <h5>{monthData.month}</h5>
                                <div className="week-list">
                                    {monthData.weeks.map((week) => (
                                        <Form.Check
                                            key={week}
                                            type="checkbox"
                                            label={week}
                                            value={week}
                                            onChange={handleWeekChange}
                                            className={`dis_${week} week_check`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Form.Group>                 
    
                <Form.Group>
                    <Button variant="warning">Add More</Button>
                </Form.Group>

                <Form.Group>
                    <div className="text-left">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                </Form.Group>
            </Form>
        </div>
    );
};

export default AddTraining;
