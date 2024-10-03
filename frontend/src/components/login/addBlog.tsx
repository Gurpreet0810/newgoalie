import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';  
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { addBlog } from '../store/blogSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import previewImgShow from '../../assests/admin.jpg';
import { useTranslation } from 'react-i18next'
interface BlogCategory {
    _id: string;
    category_name: string;
}

const AddBlog = () => {
    const [blog, setBlog] = useState({
        title: "",
        category: "",
        content: "",
        photo: null as File | null, // Explicitly typed as File | null
        imagePreview: previewImgShow, // For image preview
    });

    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state: any) => state.user);

    // Handle input fields (title, category, etc.)
    const handleInputs = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setShowValidation(true);
        const { name, value } = event.target;
        setBlog({ ...blog, [name]: value });
    };

    const handleContentChange = (content: string) => {
        setBlog({ ...blog, content: content });
    };

    // Handle image upload
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            if (name === 'photo') {
                setBlog({
                    ...blog,
                    photo: file,
                    imagePreview: file ? URL.createObjectURL(file) : previewImgShow,
                });
            }
        }
    };

    // Fetch blog categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get<BlogCategory[]>('http://localhost:4500/api/v1/blogCategories');
            setCategories(response.data);
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

    // Form submission handler
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', blog.title);
        formData.append('category', blog.category);
        if (blog.photo) {
            formData.append('photo', blog.photo);
        }
        formData.append('content', blog.content);
        formData.append('user_id', userInfo[0]?.userDetails?._id);

        try {
            const isValidate = await validate([
                { field: 'title', name: 'title', validate: 'required' },
                { field: 'category', name: 'category', validate: 'required' },
                { field: 'content', name: 'content', validate: 'required' },
                { field: 'photo', name: 'photo', validate: 'required' },
            ], blog);
            if (isValidate) {
                setLoader(true);
                // Assuming addBlog is a function that makes the API call to add the blog
                 await addBlog(formData, dispatch);
                setLoader(false);
                navigate('/list-blog');
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error adding blog:', error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">{t('addblog')}</h3>
            </div>
            <Form onSubmit={handleSubmit} encType='multipart/form-data' className="profile-edit-form row">
                <Form.Group controlId="title" className="profile-edit-field col-md-6">
                    <Form.Label>{t('Title')}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={t('Title')}
                        name="title"
                        value={blog.title}
                        onChange={handleInputs}
                        isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="category" className="profile-edit-field col-md-6">
                    <Form.Label>{t('Category')}</Form.Label>
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <Form.Control
                            as="select"
                            name="category"
                            value={blog.category}
                            onChange={handleInputs}
                            isInvalid={!!errors.category}
                        >
                            <option value="">{t('Select_Category')}</option>
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

                <Form.Group controlId="image" className="profile-edit-field col-md-6">
                    <Form.Label>{t('photo')} {t('Accept only: jpg,jpeg,png,gif')}</Form.Label>
                    <Form.Control
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        isInvalid={!!errors.image}
                        accept="image/jpeg, image/png, image/jpg, image/gif"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.image}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="imagePreview" className="profile-edit-field col-md-6">
                    {blog.imagePreview && (
                        <div className="image-preview mt-2">
                            <img src={blog.imagePreview} alt="Preview" style={{ maxWidth: "30%", maxHeight: "150px" }} />
                        </div>
                    )}
                </Form.Group>

                <Form.Group controlId="content" className="profile-edit-field col-md-12">
                    <Form.Label>{t('Content')}</Form.Label>
                    <ReactQuill
                        value={blog.content}
                        onChange={handleContentChange}
                        placeholder={t('Content')}
                        className={!!errors.content ? "is-invalid" : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.content}
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

export default AddBlog;
