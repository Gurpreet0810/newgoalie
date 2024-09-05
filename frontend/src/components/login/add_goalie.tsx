import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { add_goalie } from '../store/loginSlice';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

import { Image} from 'react-bootstrap';

const Addgoalie = () => {
    const [file, setFile] = useState<File | null>(null);
    const [user, setUser] = useState({
        goalie_name: "",
        phone: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const [pro_image, setProFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    
  const [image, setImage] = useState<File | null>(null);
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = event.target;
        
        if (name === 'goalie_photo' && files && files.length > 0) {
            setFile(files[0]);
            if (event.target.files) {
                const file = event.target.files[0];
                setImage(file);
                setImagePreview(URL.createObjectURL(file)); // Set image preview for new upload
                setProFile(file);
              }
                // Set the selected file to state
        } else {
            setUser({ ...user, [name]: value });
        }
    };
    const fields = [
        { field: 'goalie_name', name: 'goalie_name', validate: 'required' },
        { field: 'email', name: 'email', validate: 'required' },
        { field: 'phone', name: 'phone', validate: 'required' },
        { field: 'password', name: 'password', validate: 'required' },
        { field: 'goalie_photo', name: 'goalie_photo', validate: '' }
         // Optional validation
    ];
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

      
       
        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('goalie_name', user.goalie_name);
        formData.append('phone', user.phone);
        formData.append('email', user.email);
        formData.append('password', user.password);
        // Append the file to formData
        if (file) {
            formData.append('goalie_photo', file); 
        } 
        // Convert FormData to object for debugging (Optional)
        const formDataEntries = Object.fromEntries(formData.entries());
        console.log('FormData contents:', formDataEntries);

        try {
            const isValidate = await validate(fields, user);
            if (isValidate) {
            await add_goalie(formData);  // Assuming add_goalie accepts FormData
            console.log('User added successfully');
            navigate('/list_goalie');
        }
        } catch (error) {
            setLoader(false);
            setErrors(error);
        }
   
    };

    return (
        <div className="profile-edit-content card card-primary">
        <div className="card-header">
        <h3 className="card-title">Add Goalie</h3> </div>
            <Form onSubmit={handleSubmit} encType='multipart/form-data' className="profile-edit-form row">
                

                <Row className="mb-3">
                <Form.Group as={Col} controlId="goalieName" className="profile-edit-field mb-3">
                    <Form.Label>Goalie Name</Form.Label>
                    <Form.Control
                        type="text"
                        name='goalie_name'
                        placeholder="Goalie Name"
                        onChange={handleInputs}
                        value={user.goalie_name}
                        isInvalid={!!errors.goalie_name}
                    />
                    <Form.Control.Feedback type="invalid">
                                    {errors.goalie_name}
                                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group  as={Col} className="profile-edit-field mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name='email'
                        placeholder="name@example.com"
                        onChange={handleInputs}
                        value={user.email}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                </Form.Group>
      </Row>

      <Row className="mb-3">
                <Form.Group  as={Col}  className="profile-edit-field" controlId="goaliePhoto">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                        type="file"
                        name='goalie_photo'
                        onChange={handleInputs}
                        isInvalid={!!errors.goalie_photo}
                    />
                     <Form.Control.Feedback type="invalid">
                                    {errors.goalie_photo}
                                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group  as={Col} className="profile-edit-field " controlId="goaliePhoto">
              
          <Row className="my-3">
            <Col>
              <Image src={imagePreview} alt="Preview" thumbnail width="100" />
            </Col>
          </Row>
       
                </Form.Group>
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} className="profile-edit-field mb-3" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="tel"
                        name='phone'
                        placeholder="Enter Phone number"
                        onChange={handleInputs}
                        value={user.phone}
                        isInvalid={!!errors.phone}
                    />
                     <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="profile-edit-field mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name='password'
                        placeholder="Enter Password"
                        onChange={handleInputs}
                        value={user.password}
                        isInvalid={!!errors.password}
                    />
                     <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                </Form.Group>
                </Row>
                <div className="text-left">
                <Button type='submit' variant="primary" >Submit</Button>
                </div>
            </Form>
        </div>
    );
}

export default Addgoalie;
