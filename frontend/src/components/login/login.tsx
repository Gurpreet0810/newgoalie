import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import logo from '../../assests/logo-white.png'
import bglogo from '../../assests/bg-login.jpg'
import logo2 from '../../assests/draw2.webp'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Loader from "react-js-loader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/style.scss'
import { validate } from '../utils/validate';
import { FaFacebook } from "react-icons/fa";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaGooglePlus } from "react-icons/fa6";
import { userLogin } from '../store/loginSlice'
import { Form, Button, Spinner } from 'react-bootstrap';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';
import { useTranslation } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: { escapeValue: false }, // React already handles escaping
});

interface formState {
    userName: string,
    password: string
}
const Login = () => {
    const [formData, setFormData] = useState<formState>({
        userName: '',
        password: ''
    });
    
    
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState<any>({});
   
    const [isFormValid, setIsFormValid] = useState(false);
    const [showValidation, setShowValidation] = useState(false);


    const from = location.state?.from?.pathname || '/';
    console.log('before path is ', from, location.state?.from?.pathname);
    const fields = [
        { field: 'userName', name: 'userName', validate: 'required' },
        { field: 'password', name: 'password', validate: 'required' },
    ]


    const handleChange = (e: any) => {
        setShowValidation(true);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const isValidate = await validate(fields, formData)
            if (isValidate) {
                setLoader(true);
                const data = await userLogin(formData, dispatch);
                
                if (data?.statusCode === 200) {
                  setLoader(false);
                  toast.success(data.message, {autoClose: 1000})
                  navigate('/profile'); // Redirect to the previous page or home
                }
            }
        } catch (error: any) {
            setLoader(false);
            setErrors(error)
            console.log(error, "signUpError==>>");
            if (error?.data?.message) {
                toast.error(error?.data?.message, {
                    autoClose: 2000
                });
            }
        }
    };

    const changeLanguage = (lng: any) => {
      i18n.changeLanguage(lng);
    };


    return (
        <div className="sign-in-page" style={{ backgroundImage: `url(${bglogo})` }}>
            <div className="signin-wrapper">
                <div className="right-content"><button onClick={() => changeLanguage('en')}>English</button>
                <button onClick={() => changeLanguage('fr')}>Français</button>
                    <div className="center">
                        {/* <span>Welcome to Maya Support</span> */}
                        <div className="login-content">
                        <img src={logo} alt="" className='login-img'/>
                        <Form onSubmit={handleSubmit} className="login-form">
    <Form.Group controlId="formUserName" className="login-username mb-3">
        
      <Form.Label>{t('username')}</Form.Label>
      <InputField
        placeholder={t('Enter a valid User Name')}
        onChange={handleChange}
        title={formData.userName}
        type="text"
        id="userName"
        name="userName"
      />
      {errors.userName && <Form.Text className="text-danger">{errors.userName}</Form.Text>}
    </Form.Group>

    <Form.Group controlId="formPassword" className="login-password mb-3">
      <Form.Label>{t('password')}</Form.Label>
      <InputField
        placeholder={t('Enter password')}
        onChange={handleChange}
        title={formData.password}
        type="password"
        id="password"
        name="password"
      />
      {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
    </Form.Group>

    <Form.Group controlId="formRememberMe" className="login-password remember_me mb-3">
      <Form.Check
        type="checkbox"
        label={t('Remember me')}
        id="remember"
      />
    </Form.Group>

    {loader ? (
      <div className="loader">
        <Loader type="box-up" bgColor={'#00003E'} color={'yellow'} size={100} />
      </div>
    ) : (
      <Button variant="primary" type="submit" className="form-submit-button">
        {t('Login')}
      </Button>

    )}

<div className="d-flex justify-content-between align-items-center pt-3">
    <Form.Text>
      <a href="/forgot-password" className="forgot-password-link">
       {t('Forgot Password')} 
      </a>
    </Form.Text>
  </div>
  </Form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login



interface InputFieldProps {
    id?: string
    type?: string;
    title?: string;
    placeholder?: string;
    name?: string;
    disable?: boolean,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
    type = 'text',
    title = '',
    placeholder = '',
    onChange,
    onClick,
    id,
    name
}) => {

    return (
        <input
            type={type}
            value={title}
            placeholder={placeholder}
            onChange={onChange}
            onClick={onClick} // Ensure onChange is correctly passed down
            id={id}
            name={name}
        />
    );
};