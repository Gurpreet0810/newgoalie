import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import Loader from "react-js-loader";
import '../style/style.scss'
import { validate } from '../utils/validate'
import logo from '../../assests/logo-white.png'
import bglogo from '../../assests/bg-login.jpg'
import logo2 from '../../assests/draw2.webp'
import { getForgotPassword } from '../store/loginSlice'
import { Form, Button, Spinner } from 'react-bootstrap';


interface formState {
    email: string
}
const ForgotPassword = () => {
    const [loader , setLoader] = useState(false)
    const navigate = useNavigate()

const dispatch = useDispatch()
    const [formData, setFormData] = useState <formState>({
        email:''
    })
    const [errors ,setErrors] = useState<any>({})
    
    const [isFormValid, setIsFormValid] = useState(false);
    const[showValidation , setShowValidation] = useState(false)

    const fields = [
        { field: 'email', name: 'email', validate: 'required' }
    ]
    
    
    const handleChange = (e : any) => {
        setShowValidation(true)
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = async (e : any) => {
        e.preventDefault()
        setShowValidation(true)
    
         try {
            const isValidate = await validate(fields, formData)
             if (isValidate) {
        setLoader(true)
             const data =  await getForgotPassword(formData,dispatch)
             console.log('res login data', data);
                navigate('/home')
                if (data?.statusCode == 200) {
                    toast.success(data.message, {autoClose:2000})
                    setLoader(false)
                    navigate('/')
                }
             }
         } catch (error : any) {
            setErrors(error)
            setLoader(false)
             console.log(error, "signUpError==>>")
    
             if (error?.data?.message) {
                 toast.error(error?.data?.message, {
                    autoClose:2000
                 })
             }
             
         }
    
    
     };
    

     return (
        <div className="sign-in-page" style={{ backgroundImage: `url(${bglogo})` }}>
            <div className="signin-wrapper">
                <div className="right-content">
                    <div className="center">
                        <div className="login-content">
                            <img src={logo} alt="" className='login-img'/>
                            <Form onSubmit={handleSubmit} className="login-form">
                                <Form.Group controlId="formEmail" className="login-username mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                    />
                                    {errors.email && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                {loader ? (
                                    <div className="loader">
                                        <Loader type="box-up" bgColor={'red'} color={'yellow'} size={100} />
                                    </div>
                                ) : (
                                    <div className="submit-button">
                                        <Button variant="primary" type="submit" className="form-submit-button">
                                            Send Password Reset Email
                                        </Button>
                                    </div>
                                )}
                            </Form>
                        </div>
                    </div>                
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword