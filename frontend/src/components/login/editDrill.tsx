import { useState, useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DrillCategory {
    _id: string;
    category_name: string;
    category_status: string;
}

const EditDrill = () => {
    const { id } = useParams<{ id: string }>(); // Get drill ID from URL
    const navigate = useNavigate();
    
    const [drill, setDrill] = useState({
        drill_name: "",
        category: "",
        photo: null as File | null, 
        photoPreview: "",
        video_option: "video_upload", 
        video_file: null as File | null,
        videoPreview: "",
        video_link: "",
        description: "",
    });

    const [categories, setCategories] = useState<DrillCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

    const { userInfo } = useSelector((state: any) => state.user);

    const fetchDrill = async () => {
        try {
            const response = await axios.get(`http://localhost:4500/api/v1/drills/${id}`);
            const data = response.data;
            setDrill({
                drill_name: data.drill_name,
                category: data.category,
                photo: null, // Initialize with null since it's not coming from the backend
                photoPreview: data.photo ? `http://localhost:4500/storage/productImages/${data.photo}` : "", // Assuming photo URL is returned
                video_option: data.video_option,
                video_file: null,
                videoPreview: data.video_file ? `http://localhost:4500/storage/productImages/${data.video_file}` : "", // Assuming video URL is returned
                video_link: data.video_link,
                description: data.description,
            });
        } catch (err) {
            console.error("Error fetching drill:", err);
        } finally {
            setLoading(false);
        }
    };
    

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
            const activeCategories = response.data.filter(category => category.category_status === 'active');
            setCategories(activeCategories);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    useEffect(() => {
        fetchDrill();
        fetchCategories();
    }, [id]);

    const handleInputs = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setShowValidation(true);
        const { name, value } = event.target;
        setDrill({ ...drill, [name]: value });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            
            if (name === 'photo') {
                setDrill({
                    ...drill,
                    photo: file,
                    photoPreview: URL.createObjectURL(file),
                });
            }
            if (name === 'video_file') {
                setDrill({
                    ...drill,
                    video_file: file,
                    videoPreview: URL.createObjectURL(file), // Set video preview for uploaded video
                });
            }
        }
    };

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
            formData.append('video_file', drill.video_file);
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
            ], drill);

            if (isValidate) {
                setLoader(true);
                await axios.put(`http://localhost:4500/api/v1/update_drill/${id}`, formData); // Update drill
                setLoader(false);
                toast.success('Drill updated successfully', { autoClose: 1000 });
                navigate('/list-drill');
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error updating drill:', error);
            toast.error(error?.response?.data?.message || "Error updating drill", { autoClose: 2000 });
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">Edit Drill</h3>
            </div>
            {loading ? <Spinner animation="border" /> : (
                <Form onSubmit={handleSubmit} encType="multipart/form-data" className="profile-edit-form row">
                    {/* Drill Name */}
                    <Form.Group controlId="drillName" className="profile-edit-field col-md-6">
                        <Form.Label>Drill Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="drill_name"
                            value={drill.drill_name}
                            onChange={handleInputs}
                            isInvalid={!!errors.drill_name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.drill_name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Category */}
                    <Form.Group controlId="category" className="profile-edit-field col-md-6">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            name="category"
                            value={drill.category}
                            onChange={handleInputs}
                            isInvalid={!!errors.category}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.category}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Photo */}
                    <Form.Group controlId="photo" className="profile-edit-field col-md-6">
                        <Form.Label>Photo</Form.Label>
                        <Form.Control
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            isInvalid={!!errors.photo}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.photo}
                        </Form.Control.Feedback>
                        {drill.photoPreview && (
                            <div className="image-preview mt-2">
                                <img src={drill.photoPreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "150px" }} />
                            </div>
                        )}
                    </Form.Group>

                    {/* Video Option */}
                    <Form.Group controlId="videoOption" className="profile-edit-field col-md-6">
                        <Form.Label>Video Option</Form.Label>
                        <Form.Control
                            as="select"
                            name="video_option"
                            value={drill.video_option}
                            onChange={handleInputs}
                        >
                            <option value="video_upload">Video Upload</option>
                            <option value="video_link">Video Link</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Video Upload or Video Link */}
                    {drill.video_option === "video_upload" ? (
                        <Form.Group controlId="videoFile" className="profile-edit-field col-md-6">
                            <Form.Label>Video File</Form.Label>
                            <Form.Control
                                type="file"
                                name="video_file"
                                onChange={handleFileChange}
                                isInvalid={!!errors.video_file}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.video_file}
                            </Form.Control.Feedback>
                            {drill.videoPreview && (
                                <div className="video-preview mt-2">
                                    <video controls style={{ maxWidth: "100%", maxHeight: "200px" }}>
                                        <source src={drill.videoPreview} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </Form.Group>
                    ) : (
                        <Form.Group controlId="videoLink" className="profile-edit-field col-md-6">
                            <Form.Label>Video Link</Form.Label>
                            <Form.Control
                                type="text"
                                name="video_link"
                                value={drill.video_link}
                                onChange={handleInputs}
                                isInvalid={!!errors.video_link}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.video_link}
                            </Form.Control.Feedback>
                            {drill.video_link && (
                                <div className="iframe-preview mt-2">
                                    <iframe
                                        width="100%"
                                        height="200"
                                        src={drill.video_link}
                                        title="Video Preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </Form.Group>
                    )}

                    {/* Description */}
                    <Form.Group controlId="description" className="profile-edit-field col-md-12">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={drill.description}
                            onChange={handleInputs}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Loader */}
                    {loader ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <Button variant="primary" type="submit" style={{ width: '20%' }}>Update</Button>
                    )}
                </Form>
            )}
        </div>
    );
};

export default EditDrill;
