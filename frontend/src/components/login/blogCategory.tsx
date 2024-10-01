import { useState, ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { addBlogCat } from '../store/blogSlice'; // Assume you have a similar action for blog categories
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

const AddBlogCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { userInfo } = useSelector((state: any) => state.user);

    const fields = [
        { field: 'category_name', name: 'category_name', validate: 'required' }
    ];

    const handleInputs = (event: ChangeEvent<HTMLInputElement>) => {
        setShowValidation(true);
        setCategoryName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('category_name', categoryName);
        formData.append('user_id', userInfo[0]?.userDetails?._id);

        try {
            const isValidate = await validate(fields, { category_name: categoryName });
            if (isValidate) {
                setLoader(true);
                await addBlogCat(formData, dispatch); // Dispatch the action to add a blog category
                setLoader(false);
                navigate('/list-blog-category'); // Redirect to the list of blog categories
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error adding blog category:', error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">{t('add_drills_cat')}</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                <Form.Group controlId="categoryName" className="profile-edit-field col-md-6">
                    <Form.Label>{t('categoryname')}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={t('categoryname')}
                        value={categoryName}
                        onChange={handleInputs}
                        isInvalid={!!errors.category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.category_name}
                    </Form.Control.Feedback>
                </Form.Group>

                {loader ? (
                    <div className="text-left">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="text-left">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default AddBlogCategory;
