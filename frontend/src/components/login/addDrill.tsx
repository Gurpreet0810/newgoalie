import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';  
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { addDrill } from '../store/drillSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import previewImgShow from '../../assests/admin.jpg'
import { useTranslation } from 'react-i18next'
interface DrillCategory {
    _id: string;
    category_name: string;
    category_status: string;
}

const AddDrill = () => {
    const [drill, setDrill] = useState({
        drill_name: "",
        category: "",
        photo: null as File | null, // Explicitly typed as File | null
        photoPreview: previewImgShow, // For image preview
        video_option: "video_upload", // default value
        video_file: null as File | null, // Explicitly typed as File | null
        video_link: "",
        description: "",
    });

    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState<DrillCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state: any) => state.user);

    // Handle input fields (drill name, category, description, etc.)
    const handleInputs = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setShowValidation(true);
        const { name, value } = event.target;
        setDrill({ ...drill, [name]: value });
    };

    const handleDescriptionChange = (content: string) => {
        setDrill({ ...drill, description: content });
    };

      // Simulate progress incrementation
      const simulateProgress = () => {
        setProgress(10); // Start at 50%
        const incrementProgress = (value: number) => {
            setTimeout(() => {
                if (value < 100) {
                    const nextValue = value + (value < 80 ? 10 : 5); // Increment by 10 until 80%, then by 5
                    setProgress(nextValue);
                    incrementProgress(nextValue); // Recursive call to increment progress
                }
            }, 300); // Increment every 300 milliseconds
        };
        incrementProgress(50); // Start incrementing from 50%
    };

    // Handle file changes (photo and video uploads)
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            
            if (name === 'photo') {
                setDrill({
                    ...drill,
                    photo: file,
                    photoPreview: file ? URL.createObjectURL(file) : previewImgShow,
                });
                // alert('1');
            }
            if (name === 'video_file') {
                simulateProgress();
                setDrill({
                    ...drill,
                    video_file: file,
                });
                // alert('2');
            }
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
    
    const navigate = useNavigate();
    // Form submission handler
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('drill_name', drill.drill_name);
        formData.append('category', drill.category);
        if (drill.photo) {
            formData.append('photo', drill.photo);
        }
        formData.append('video_option', drill.video_option);
        if (drill.video_option === "video_upload" && drill.video_file) {
            formData.append('video_file', drill.video_file); // Append video file if video upload is selected
        } else {
            formData.append('video_link', drill.video_link);
        }
        formData.append('description', drill.description);
        formData.append('user_id', userInfo[0]?.userDetails?._id);

        try {
            const isValidate = await validate([
                { field: 'drill_name', name: 'drill_name', validate: 'required' },
                { field: 'category', name: 'category', validate: 'required' },
                { field: 'description', name: 'description', validate: 'required' },
                { field: 'photo', name: 'photo', validate: 'required' },
            ], drill);
            if (isValidate) {
                setLoader(true);
                await addDrill(formData, dispatch);
                setLoader(false);
                navigate('/list-drill');
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error adding drill:', error);
            if (error?.data?.message) {
                toast.error(t('error'), { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">{t('add_drills')}</h3>
            </div>
            <Form onSubmit={handleSubmit} encType='multipart/form-data' className="profile-edit-form row">
                <Form.Group controlId="drillName" className="profile-edit-field col-md-6">
                    <Form.Label>{t('drillname')}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={t('drillname')}
                        name="drill_name"
                        value={drill.drill_name}
                        onChange={handleInputs}
                        isInvalid={!!errors.drill_name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.drill_name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="category" className="profile-edit-field col-md-6">
                    <Form.Label>{t('category')}</Form.Label>
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <Form.Control
                            as="select"
                            name="category"
                            value={drill.category}
                            onChange={handleInputs}
                            isInvalid={!!errors.category}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </Form.Control>
                    )}
                    <Form.Control.Feedback type="invalid">
                        {errors.category}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="photo" className="profile-edit-field col-md-6">
                    <Form.Label>{t('photo')} {t('Accept only: jpg,jpeg,png,gif')}</Form.Label>
                    <Form.Control
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        isInvalid={!!errors.photo}
                        accept="image/jpeg, image/png, image/jpg, image/gif"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.photo}
                    </Form.Control.Feedback>
                   
                </Form.Group>

                <Form.Group controlId="photo" className="profile-edit-field col-md-6">
                    {drill.photoPreview && (
                        <div className="image-preview mt-2">
                            <img src={drill.photoPreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "150px" }} />
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="videoOption" className="profile-edit-field col-md-6">
                    <Form.Label>{t('selectvideooption')} </Form.Label>
                    <Form.Control
                        as="select"
                        name="video_option"
                        value={drill.video_option}
                        onChange={handleInputs}
                    >
                        <option value="video_upload">{t('videoupload')}</option>
                        <option value="video_link">{t('videolink')}</option>
                    </Form.Control>
                </Form.Group>

                {drill.video_option === "video_upload" ? (
                    <Form.Group controlId="videoFile" className="profile-edit-field col-md-6">
                        <Form.Label>{t('Video File (Accept only: mp4,webm)')}</Form.Label>
                        <Form.Control
                            type="file"
                            name="video_file"
                            onChange={handleFileChange}
                            isInvalid={!!errors.video_file}
                            accept="video/mp4,video/webm"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.video_file}
                        </Form.Control.Feedback>
                        <LinearProgress variant="determinate" value={progress} />
                    </Form.Group>
                ) : (
                    <Form.Group controlId="videoLink" className="profile-edit-field col-md-6">
                        <Form.Label>{t('videolink')}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t('videolink')}
                            name="video_link"
                            value={drill.video_link}
                            onChange={handleInputs}
                            isInvalid={!!errors.video_link}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.video_link}
                        </Form.Control.Feedback>
                    </Form.Group>
                )}

                <Form.Group controlId="description" className="profile-edit-field col-md-12">
                    <Form.Label>{t('description')}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={drill.description}
                        onChange={handleInputs}
                        isInvalid={!!errors.description}
                        style={{ display: 'none' }}
                    />
                       <ReactQuill
                        value={drill.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter drill description"
                        className={!!errors.description ? "is-invalid" : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.description}
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

export default AddDrill;
