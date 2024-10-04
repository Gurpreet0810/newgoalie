import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { validate } from '../utils/validate';
import { toast } from 'react-toastify';
import { addloaderimage , updateloaderimage } from '../store/drillSlice';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Image} from 'react-bootstrap';
import { useTranslation } from 'react-i18next'
import axios from 'axios';

const Loaders = () => {
    const [category, setCategory] = useState({
        image: "",
        category_status: "active"  // default value
    });

    const [errors, setErrors] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const { userInfo } = useSelector((state: any) => state.user);
    const [_id, setId] = useState('');
  const [error, setError] = useState<string>('');


  useEffect(() => {
    const fetchimage = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/get_loaderimage`);
        setImagePreview(`http://localhost:4500/storage/productImages/${response.data[0].photo}`);
        setId(response.data[0]._id);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };
  
    fetchimage();
  }, []);  // Runs only once on component mount
  

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const file = e.target.files[0];
          setImage(file);
          setImagePreview(URL.createObjectURL(file)); // Set image preview for new upload
        }
      };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
       
        const formData = new FormData();
      if(image) {formData.append('photo', image); }
      else{
        toast.error("Upload Loader Image");
        return false;
      }

        try {
                setLoader(true);
               
                
                if(_id){
                    await axios.put(`http://localhost:4500/api/v1/updateloaderimage/${_id}`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                        
                      });
                      toast.success('Loader Image updated successfully');
                        
            }
            else{
                await addloaderimage(formData, dispatch);
            }
                setLoader(false);
         
            } catch (error: any) {
            setLoader(false);
            setErrors(error);
            console.error('Error adding Loader Image:', error);
            if (error?.data?.message) {
                toast.error(error?.data?.message, { autoClose: 2000 });
            }
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a' }}>
                <h3 className="card-title">{t('loaderimage')}</h3>
            </div>
            <Form onSubmit={handleSubmit} className="profile-edit-form row">
                <Form.Group controlId="loaderimage" className="profile-edit-field col-md-6">
                    <Form.Label>{t('Image')}</Form.Label>
                    <Form.Control
                        type="file"
                        name="photo"
                        onChange={handleImageChange}
                        isInvalid={!!errors.loaderimage}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.photo}
                    </Form.Control.Feedback>
                </Form.Group>
                {imagePreview && (
                            <Form.Group as={Col} className="profile-edit-field mb-3">
                            <Row className="my-3">
                                <Col>
                                <Image src={imagePreview} alt="Preview" thumbnail width="100" />
                                </Col>
                            </Row>
                            </Form.Group>
                        )}


                {loader ? (
                    <div className="text-left">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="text-left">
                        <Button variant="primary" type="submit">{t('submit')}</Button>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default Loaders;
