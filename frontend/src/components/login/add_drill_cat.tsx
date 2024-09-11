import { useState, ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { addDrillCat } from '../store/drillSlice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddDrillCategory = () => {
    const [category, setCategory] = useState({
        category_name: "",
        category_status: "active"  // default value
    });

    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state: any) => state.user);
    
    const fields = [
        { field: 'category_name', name: 'category_name', validate: 'required' },
        { field: 'category_status', name: 'category_status', validate: 'required' },
    ];

    const handleInputs = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setShowValidation(true);
        const { name, value } = event.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('category_name', category.category_name);
        formData.append('category_status', category.category_status);
        formData.append('user_id', userInfo[0]?.userDetails?._id);

        try {
            const isValidate = await validate(fields, category);
            if (isValidate) {
                setLoader(true);
                await addDrillCat(formData, dispatch);
                setLoader(false);
                navigate('/list-drill-cat');
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error adding category:', error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">Add Drill Category</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                <Form.Group controlId="categoryName" className="profile-edit-field col-md-6">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        name="category_name"
                        value={category.category_name}
                        onChange={handleInputs}
                        isInvalid={!!errors.category_name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.category_name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="categoryStatus" className="profile-edit-field col-md-6">
                    <Form.Label>Category Status</Form.Label>
                    <Form.Control
                        as="select"
                        name="category_status"
                        value={category.category_status}
                        onChange={handleInputs}
                        isInvalid={!!errors.category_status}
                    >
                        <option value="active">Active</option>
                        <option value="not-active">Not Active</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.category_status}
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

export default AddDrillCategory;
