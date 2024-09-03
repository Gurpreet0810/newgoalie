import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import screenLogo from '../../assests/screenLogo.png';
import { useEffect, useState } from 'react';
import EastIcon from '@mui/icons-material/East';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { validate } from '../utils/validate';

const company = [
    { id: 1, name: 'PC - 1' },
    { id: 2, name: 'PC - 2' },
    { id: 3, name: 'PC - 3' },
    { id: 4, name: 'PC - 4' },
    { id: 5, name: 'PC - 5' },
    { id: 6, name: 'PC - 6' },
    { id: 7, name: 'PC - 7' },
    { id: 8, name: 'PC - 8' },
    { id: 9, name: 'PC - 9' },
    { id: 10, name: 'PC - 10' },
];

interface StateData {
    PC: string;
}

const CheckScreen = () => {
    const [formData, setFormData] = useState<StateData>({ PC: '' });
    const navigate = useNavigate()
    const {userInfo} = useSelector((state: any) => state.user)

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
       ;(() => {
        let token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
       })()
    },[])


    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setFormData({ ...formData, PC: event.target.value });
    };

    const fields = [
        { field: 'PC', name: 'PC', validate: 'required' },
    ]

    const handleSubmit = async (e: any) => {
                e.preventDefault()
               try {
                const isValidate = await  validate(fields, formData)
                if (isValidate) {
                    navigate('/')
                }
               } catch (error) {
                setErrors(error)
               }
    }


    return (
        <div className="check_screen_container">
            <div className="inner_section">
                <div className="child">
                    <h1>Maya Support</h1>
                </div>
                <div className="child">
                    <p className='user_name'>
                        {
                        userInfo[0] &&  userInfo[0].user?.userName
                        }
                    </p>
                </div>
                <div className="child select_pc">
                    <div className="image-container">
                        <img src={screenLogo} alt="" />
                    </div>
                    <div>
                        <form action="" className="select_pc_number">
                            <FormControl fullWidth>
                                <InputLabel id="status-select-label">- Select Your PC -</InputLabel>
                                <Select
                                    sx={{ '.MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                                    className="pc_input_field"
                                    labelId="status-select-label"
                                    id="status-select"
                                    value={formData.PC}
                                    name='PC'
                                    label="Select"
                                    onChange={handleStatusChange}
                                >
                                    {company.map((item) => (
                                        <MenuItem key={item.id} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <span
                            onClick={handleSubmit}
                            >
                                <EastIcon />
                            </span>
                        </form>
                        {
                            errors.PC && <span className='error'>{
                                errors.PC
                            }</span>
                        }
                    </div>
                </div>
                <div className="child">
                    <p>Please select your PC Name.</p>
                    <button
                    onClick={() => {navigate('/login')}}
                    className='navigate_link'>Or sign in as a different user</button>
                </div>
            </div>
        </div>
    );
};

export default CheckScreen;
