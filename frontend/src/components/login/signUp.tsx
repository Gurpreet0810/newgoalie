import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-js-loader";
import '../style/style.scss'
import { validate } from '../utils/validate'
import logo from '../../assests/logo.png'
import logo2 from '../../assests/draw2.webp'



interface formState {
    email: string,
    password: string,
    userName: string
}

const SignUp = () => {
    const [formData, setFormData] = useState <formState>({
        email:'',
        password:'',
        userName:''
    })
    const [errors ,setErrors] = useState<any>({})
    
    const [isFormValid, setIsFormValid] = useState(false);
    const[showValidation , setShowValidation] = useState(false)
    const [loader , setLoader] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fields = [
        { field: 'email', name: 'email', validate: 'required' },
        { field: 'password', name: 'password', validate: 'required' },
        { field: 'userName', name: 'userName', validate: 'required' },
    ]
    
    const handleChange = (e : any) => {
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
            const isValidate = await (validate(fields, formData))
             if (isValidate) {
         setLoader(true)
            //  const data =  await signupFunction(formData,dispatch)
            //  if (data?.statusCode == 201) {
            // navigate('/')
            // toast.success(data.message, {
            //     autoClose:1000
            // })
            //    setLoader(false)
            //  }
             }
         } catch (error : any) {
             console.log(error, "signUpError==>>")
             setErrors(error)
             if (error?.data?.message) {
                 toast.error(error?.data?.message, {
                    autoClose:1000
                 })
                 setLoader(false)
             }
             
         }
         setLoader(false)
 
    
     };

        return (
            <div className="sign-in-page">
            <div className="signin-wrapper">
                <div className="left-content">
                <div>
                    <img src={logo} alt="" />
                    </div>
                    <div>
                    <img src={logo2} alt="" />
                    </div>
                </div>
                <div className="right-content">
                 
                    <div className="c-small-img">
                        <img  src={logo} alt=""/>
                    </div>
                    <div className="center">
                        <div className="login-content">
                            <form
                            onSubmit={handleSubmit}
                             className="login-form" action="#">
                                <div className="login-username">
                                    <label >UserName</label>
                                    <input
                                    onChange={handleChange}
                                    value={formData.userName}
                                     type="text" name="userName" id="name"/>
                                </div>
                                {
                                    errors.userName ?
                                    <span className='error'>{errors.userName}</span> :
                                    null
                                }
                                <div className="login-username">
                                    <label >Email</label>
                                    <input
                                    onChange={handleChange}
                                    value={formData.email}
                                     type="text" name="email" id="name"/>
                                </div>
                                {
                                    errors.email ?
                                    <span className='error'>{errors.email}</span> :
                                    null
                                }
                                <div className="login-password">
                                    <label >Password</label>
                                    <input
                                    value={formData.password}
                                    onChange={handleChange}
                                     type="password" name="password" id="name" />
                                </div>
                                {
                                         errors.password ?
                                         <span className='error'>{errors.password}</span> :
                                         null
                                       }
                                       {
                                        loader ?

                                <Loader type="box-up" bgColor={'red'} color={'yello'} size={100} />
: 
<div className="submit-button">
                                    <button className="form-submit-button" type="submit">Sign In</button>
                                </div>
                                       }
                                
                            </form>
                        </div>
                        <div className="bottom">
                            <div className="create-acc">
                                <p>Existing user?</p>
                                <Link className='select_link' to='/'>
                                Login
                                </Link>
                            </div>
                        </div>
                    </div>
               
                </div>
                <div className='copy_right_content'>
                                    <p>Copyright © 2020. All rights reserved.</p>
                </div>
            </div>
        </div>
        )
}

export default SignUp