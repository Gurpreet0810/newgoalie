
import { useEffect, useState } from 'react';
import Form   from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { add_goalie } from '../store/loginSlice';

const Addgoalie = () => {
  const [file, setFile] = useState(null);
    const [user , setUser] = useState({
        goalie_name: "" , phone:"" ,email: "" ,goalie_photo: "" ,password: ""
    })
    let name="";
    let value = "" ; 


    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
       
        name =event.target.name;
        value= event.target.value;

        setUser({...user, [name]:value })
    }
   
    const Handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();    
        console.log(user);
        add_goalie(user);
    }
    return <>   
    <div className="home_section">
        <h1>Add Goalie</h1>
     <Form onSubmit={Handlesubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Goalie Name</Form.Label>
        <Form.Control type="text" name='goalie_name' placeholder="Goalie Name" 
        onChange={handleInputs}
        value={user.goalie_name}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name='email' placeholder="name@example.com" 
        onChange={handleInputs}
        value={user.email}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Photo</Form.Label>
        <Form.Control type="file" name='goalie_photo' 
        
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Phone</Form.Label>
        <Form.Control type="tel" name='phone' placeholder="Enter Phone number" 
        onChange={handleInputs}
        value={user.phone}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label> Password</Form.Label>
        <Form.Control type="password" name='password' placeholder="Enter Password" 
        onChange={handleInputs}
        value={user.password}
        />
      </Form.Group>
      <Button type='submit' variant="primary">Primary</Button>
    </Form>
    </div>
    </>
}
export default Addgoalie
