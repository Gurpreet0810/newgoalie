import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { add_goalie } from '../store/loginSlice';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Addgoalie = () => {
    const [file, setFile] = useState<File | null>(null);
    const [user, setUser] = useState({
        goalie_name: "",
        phone: "",
        email: "",
        password: ""
    });

    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = event.target;
        
        if (name === 'goalie_photo' && files && files.length > 0) {
            setFile(files[0]);  // Set the selected file to state
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            alert('Please upload a file.');
            return;
        }

        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('goalie_name', user.goalie_name);
        formData.append('phone', user.phone);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('goalie_photo', file);  // Append the file to formData

        // Convert FormData to object for debugging (Optional)
        const formDataEntries = Object.fromEntries(formData.entries());
        console.log('FormData contents:', formDataEntries);

        try {
            await add_goalie(formData);  // Assuming add_goalie accepts FormData
            console.log('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div className="home_section card card-primary container-fluid" style={{paddingBottom: '30px' }}>
         <div className='card-header' style={{ backgroundColor: '#00617a' ,marginBottom: '30px' }} > <h4>Add Goalie</h4> </div>
            <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                

                <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="goalieName">
                    <Form.Label>Goalie Name</Form.Label>
                    <Form.Control
                        type="text"
                        name='goalie_name'
                        placeholder="Goalie Name"
                        onChange={handleInputs}
                        value={user.goalie_name}
                    />
                </Form.Group>
                <Form.Group  as={Col} className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name='email'
                        placeholder="name@example.com"
                        onChange={handleInputs}
                        value={user.email}
                    />
                </Form.Group>
      </Row>


                <Form.Group className="mb-3" controlId="goaliePhoto">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                        type="file"
                        name='goalie_photo'
                        onChange={handleInputs}
                    />
                </Form.Group>
                <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="tel"
                        name='phone'
                        placeholder="Enter Phone number"
                        onChange={handleInputs}
                        value={user.phone}
                    />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name='password'
                        placeholder="Enter Password"
                        onChange={handleInputs}
                        value={user.password}
                    />
                </Form.Group>
                </Row>
                <Button type='submit' variant="primary" style={{ backgroundColor: '#00617a' }}>Submit</Button>
            </Form>
        </div>
    );
}

export default Addgoalie;
