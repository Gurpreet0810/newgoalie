import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addTrainings, addTrainingsDrills } from '../store/TrainingSlice';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
interface Training {
    category: string;
    drill_name: string;
    photoPreview: string;
}

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

const AddTraining = () => {
    const [trainings, setTrainings] = useState<Training[]>([{
        category: "",
        drill_name: "",
        photoPreview: "",
    }]);
    const [trainingName, setTrainingName] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [selectedWeeks, setSelectedWeeks] = useState<number[][]>([[]]);
    const [categories, setCategories] = useState<any[]>([]);
    const [drillOptions, setDrillOptions] = useState<{ [key: number]: Drills[] }>({});
    const [errors, setErrors] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false); 
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.user);
    const navigate = useNavigate();

    const handleInputs = async (event: ChangeEvent<HTMLSelectElement>, index: number) => {
        const { name, value } = event.target;

        const newTrainings = [...trainings];
        newTrainings[index] = {
            ...newTrainings[index],
            [name]: value as keyof Training,
        };
        setTrainings(newTrainings);

        if (name === 'category') {
            try {
                const response = await axios.get(`http://localhost:4500/api/v1/getAllDrillsbycategory?category=${value}`);
                setDrillOptions((prev) => ({
                    ...prev,
                    [index]: response.data, // Set drills only for the current index
                }));
            } catch (err) {
                setErrors([...errors, { fetch: 'An error occurred while fetching drills' }]);
            }
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        
        if (files && files.length > 0) {
            setPhoto(files[0]);
            setTrainings(trainings.map((training, index) => {
                if (index === 0) {  
                    return {
                        ...training,
                        photoPreview: URL.createObjectURL(files[0]),
                    };
                }
                return training;
            }));
        }
    };

    const handleAddMore = () => {
        setTrainings([
            ...trainings,
            { category: "", drill_name: "", photoPreview: "" }
        ]);
        setSelectedWeeks([...selectedWeeks, []]);
        setErrors([...errors, {}]);
    };

    const handleRemove = (index: number) => {
        setTrainings(trainings.filter((_, i) => i !== index));
        setSelectedWeeks(selectedWeeks.filter((_, i) => i !== index));
        setErrors(errors.filter((_, i) => i !== index));
        setDrillOptions((prev) => {
            const newDrillOptions = { ...prev };
            delete newDrillOptions[index]; // Remove drills for the deleted training
            return newDrillOptions;
        });
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
            setCategories(response.data.filter(category => category.category_status === 'active'));
        } catch (err) {
            setErrors([...errors, { fetch: err instanceof Error ? err.message : 'An unknown error occurred' }]);
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
        { month: 'October', weeks: [40, 41, 42, 43] },
        { month: 'November', weeks: [44, 45, 46, 47] },
        { month: 'December', weeks: [48, 49, 50, 51, 52] },
        { month: 'January', weeks: [1, 2, 3, 4, 5] },
        { month: 'February', weeks: [6, 7, 8, 9] },
        { month: 'March', weeks: [10, 11, 12, 13] },
        { month: 'April', weeks: [14, 15, 16, 17] },
        { month: 'May', weeks: [18, 19, 20, 21] },
        { month: 'June', weeks: [22, 23, 24, 25] },
        { month: 'July', weeks: [26, 27, 28, 29, 30] },
    ];

    const handleWeekChange = (event: ChangeEvent<HTMLInputElement>, formIndex: number) => {
        const week = parseInt(event.target.value, 10);
        setSelectedWeeks(prevSelectedWeeks => {
            const newSelectedWeeks = [...prevSelectedWeeks];
            newSelectedWeeks[formIndex] = event.target.checked
                ? [...newSelectedWeeks[formIndex], week]
                : newSelectedWeeks[formIndex].filter((w) => w !== week);
            return newSelectedWeeks;
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('training_name', trainingName);
        if (photo) {
            formData.append('photo', photo); 
        }
        formData.append('user_id', userInfo[0]?.userDetails?._id);
        
        try {
            const res = await addTrainings(formData, dispatch);
            const training_id = res.data.addCategorySuccess._id;
            
            for (let i = 0; i < trainings.length; i++) {
                const formData_drills = new FormData();
                formData_drills.append('drill_category', trainings[i].category);
                formData_drills.append('drill_name', trainings[i].drill_name);
                formData_drills.append('trainingplan_id', training_id);
                formData_drills.append('weeks', JSON.stringify(selectedWeeks[i]));
                
                await addTrainingsDrills(formData_drills, dispatch);
            }
            toast.success('Training added successfully!');
            navigate('/manage-training');
        } catch (error) {
            toast.error('Error adding training');
        }
    };

    return (
        <div className="profile-edit-content card card-primary" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px' }}>
            <div className="card-header" style={{ backgroundColor: '#00617a', color: '#fff', padding: '15px', borderRadius: '10px 10px 0 0', marginBottom: '20px' }}>
                <h3 className="card-title">{t('addtraining')}</h3>
            </div>
            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                <Form.Group controlId="training_name" className="profile-edit-field col-md-6" style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ fontWeight: 'bold' }}>{t('trainingname')}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Training Name"
                        value={trainingName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTrainingName(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px' }}
                        required
                    />
                </Form.Group>
        
                <Form.Group controlId="photo" className="profile-edit-field col-md-6" style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ fontWeight: 'bold' }}>{t('trainingplan')} {t('photo')}</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        style={{ padding: '10px', borderRadius: '5px' }}
                        required
                    />
                    {photo && (
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <img src={URL.createObjectURL(photo)} alt="Preview" style={{ width: '100px', height: '100px', border: '2px solid #00617a', borderRadius: '5px' }} />
                        </div>
                    )}
                </Form.Group>
        
                {trainings.map((training, index) => (
                    <div key={index} className="training-entry" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                      <div className="row">
                      <div className="col-md-6">     <Form.Group controlId={`category-${index}`} className="profile-edit-field  col-md-12" style={{ marginBottom: '10px' }}>
                            <Form.Label style={{ fontWeight: 'bold' }}>{t('drill_category')}</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={training.category}
                                onChange={(e) => handleInputs(e as unknown as ChangeEvent<HTMLSelectElement>, index)} 
                                style={{ padding: '10px', borderRadius: '5px' }}
                                required
                            >
                                <option value="">{t('selectcategory')}</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
        </div>  
        <div className="col-md-6"> 
                        <Form.Group controlId={`drill_name-${index}`}  className="profile-edit-field col-md-12"  style={{ marginBottom: '10px' }}>
                            <Form.Label style={{ fontWeight: 'bold' }}>{t('drillname')}</Form.Label>
                            <Form.Control
                                as="select"
                                name="drill_name"
                                value={training.drill_name}
                                onChange={(e) => handleInputs(e as unknown as ChangeEvent<HTMLSelectElement>, index)} 
                                style={{ padding: '10px', borderRadius: '5px' }}
                                required
                            >
                                <option value="">{t('selectdrill')}</option>
                                {(drillOptions[index] || []).map((drill) => (
                                    <option key={drill._id} value={drill._id}>
                                        {drill.drill_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                   </div></div>             
                    <div className="weeks-checkboxes"  style={{ marginBottom: '15px' }}>
                        {weeksData.map((weekData, weekIndex) => (
                            <div key={weekIndex} style={{ marginBottom: '10px' }}>
                                <strong style={{ display: 'block', marginBottom: '5px' }}>{weekData.month}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {weekData.weeks.map((week) => (
                                        <Form.Check className='profile-edit-field col-md-2'
                                            key={week}
                                            type="checkbox"
                                            id={`week_${week}_${index}`}
                                            label={`Week ${week}`}
                                            value={week}
                                            checked={selectedWeeks[index].includes(week)}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleWeekChange(e, index)}
                                            style={{ marginRight: '10px' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {index > 0 && (
                                   
                                   <Button variant="danger" onClick={() => handleRemove(index)} style={{ marginTop: '10px', padding: '10px 15px', borderRadius: '5px' }}>
                                       {t('remove')}
                                   </Button>
                            )}
                    </div>
                ))}
        
                <Button variant="primary" onClick={handleAddMore}>{t('addmore')}</Button>
                <div className="d-flex justify-content-end mt-3">
          <Button variant="primary" type="submit" disabled={loading}>
          {t('submit')}
          </Button>
        </div>
                {/* <Button variant="success" type="submit" style={{ marginTop: '20px' }}>Submit</Button> */}
            </Form>
        </div>
    );
};

export default AddTraining;
