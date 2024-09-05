import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { add_goalie } from '../store/loginSlice';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const AddDrillCategory = () => {
    const [category, setCategory] = useState({
        category_name: "",
        category_status: "active"  // default value
    });

    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target as HTMLInputElement | HTMLSelectElement;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Assuming add_category is a function to handle the category submission
            // await add_category(category);
            console.log('Category added successfully');
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <div className="home_section card card-primary container-fluid" style={{ paddingBottom: '30px' }}>
            <div className='card-header' style={{ backgroundColor: '#00617a', marginBottom: '30px' }}>
                <h4>Add Drill Category</h4>
            </div>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} className="mb-3" controlId="categoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            name='category_name'
                            placeholder="Category Name"
                            onChange={handleInputs}
                            value={category.category_name}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} className="mb-3" controlId="categoryStatus">
                        <Form.Label>Category Status</Form.Label>
                        <Form.Control
                            as="select"
                            name='category_status'
                            onChange={handleInputs}
                            value={category.category_status}
                        >
                            <option value="active">Active</option>
                            <option value="not_active">Not Active</option>
                        </Form.Control>
                    </Form.Group>
                </Row>

                <Button type='submit' variant="primary" style={{ backgroundColor: '#00617a' }}>Submit</Button>
            </Form>
        </div>
    );
};

export default AddDrillCategory;
