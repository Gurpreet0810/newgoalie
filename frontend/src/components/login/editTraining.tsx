import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateTraining, addTrainingsDrills } from '../store/TrainingSlice';
import { useNavigate, useParams } from 'react-router';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface Training {
  category: string;
  drill_name: string;
  id: string;
  weeks: number[];
  photoPreview?: string; // Optional since it may not always be set
}

interface DrillCategory {
  _id: string;
  category_name: string;
  category_status: string;
}

interface Drills {
  _id: string;
  drill_name: string;
  category: string;
  video_option: string;
}

const EditTraining = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingName, setTrainingName] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories, setCategories] = useState<DrillCategory[]>([]);
  const [drills, setDrills] = useState<Drills[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trainingId } = useParams(); // Get training ID from route parameters
  const { userInfo } = useSelector((state: any) => state.user);

  const fetchTraining = async (id: string) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:4500/api/v1/singletrainings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const trainingData = response.data;

      const response_drill = await axios.get(`http://localhost:4500/api/v1/singletrainingsdrills/${trainingData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mapping drills and parsing weeks correctly
      setTrainingName(trainingData.training_name);
      setTrainings(
        response_drill.data.map((drill: any) => ({
          id: drill._id,
          category: drill.drill_category, // Use drill_category from response
          drill_name: drill.drill_name, // Use drill_name from response
          weeks: drill.weeks.flatMap((week: string) => JSON.parse(week)), // Parse weeks and flatten if needed
        }))
      );
      setImagePreview(`http://localhost:4500/storage/productImages/${trainingData.image}`);
    } catch (err) {
      toast.error('Error fetching training data');
    }
  };

  useEffect(() => {
    if (trainingId) {
      fetchTraining(trainingId);
    }
  }, [trainingId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
      setCategories(response.data.filter((category) => category.category_status === 'active'));
    } catch (err) {
      toast.error('An error occurred while fetching categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchDrills = async () => {
    try {
      const response = await axios.get(`http://localhost:4500/api/v1/drills`);
      setDrills(response.data);
    } catch (err) {
      toast.error('An error occurred while fetching drills');
    }
  };

  useEffect(() => {
    fetchDrills();
  }, []);

  const handleInputs = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value } = e.target;

    const newTrainings = [...trainings];
    newTrainings[index] = {
      ...newTrainings[index],
      [name]: value,
    };
    setTrainings(newTrainings);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      setPhoto(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));

      setTrainings(
        trainings.map((training, index) => {
          if (index === 0) {
            return {
              ...training,
              photoPreview: URL.createObjectURL(files[0]),
            };
          }
          return training;
        })
      );
    }
  };

  const handleWeekChange = (event: ChangeEvent<HTMLInputElement>, formIndex: number) => {
    const week = parseInt(event.target.value, 10);
    const isChecked = event.target.checked;

    setTrainings((prevTrainings) => {
      const newTrainings = [...prevTrainings];
      const currentWeeks = [...newTrainings[formIndex].weeks];

      if (isChecked) {
        if (!currentWeeks.includes(week)) {
          currentWeeks.push(week);
        }
      } else {
        const weekIndex = currentWeeks.indexOf(week);
        if (weekIndex !== -1) {
          currentWeeks.splice(weekIndex, 1);
        }
      }

      newTrainings[formIndex].weeks = currentWeeks;
      return newTrainings;
    });
  };

  const weeksData = [
    { month: 'August', weeks: [31, 32, 33, 34, 35] },
    { month: 'September', weeks: [36, 37, 38, 39] },
    { month: 'October', weeks: [40, 41, 42, 43] },
    { month: 'November', weeks: [44, 45, 46, 47] },
    { month: 'December', weeks: [48, 49, 50, 51, 52] },
    { month: 'January', weeks: [1, 2, 3, 4, 5] },
    { month: 'February', weeks: [6, 7, 8, 9] },
    { month: 'March', weeks: [9, 10, 11, 12, 13] },
    { month: 'April', weeks: [14, 15, 16, 17] },
    { month: 'May', weeks: [18, 19, 20, 21] },
    { month: 'June', weeks: [22, 23, 24, 25] },
    { month: 'July', weeks: [26, 27, 28, 29, 30] },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('training_name', trainingName);
    if (photo) {
      formData.append('photo', photo);
    }
    try {
      await axios.put(`http://localhost:4500/api/v1/updateTraining/${trainingId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      for (let i = 0; i < trainings.length; i++) {
        const drillFormData = new FormData();
        drillFormData.append('drill_category', trainings[i].category);
        drillFormData.append('drill_name', trainings[i].drill_name);
        drillFormData.append('weeks', JSON.stringify(trainings[i].weeks));
        
        if (!trainings[i].id || trainings[i].id.trim() === "") {
          drillFormData.append('trainingplan_id', `${trainingId}`); 
          await addTrainingsDrills(drillFormData, dispatch);
        } else {
          await axios.put(`http://localhost:4500/api/v1/updateTrainingDrills/${trainings[i].id}`, drillFormData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        }
      }
      toast.success('Training updated successfully');
      navigate('/manage-training');
    } catch (error) {
      toast.error('Error updating training');
    }
  };

  const addTrainingEntry = () => {
    setTrainings((prevTrainings) => [
      ...prevTrainings,
      { category: '', drill_name: '', id: '', weeks: [] }
    ]);
  };

  return (
    <div className="profile-edit-content card card-primary" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px' }}>
      <div className="card-header" style={{ backgroundColor: '#00617a', color: '#fff', padding: '15px', borderRadius: '10px 10px 0 0', marginBottom: '20px' }}>
        <h3 className="card-title">{t('edittraningplan')}</h3>
      </div>
      <Form onSubmit={handleSubmit}>
      <div className="row">
      <div className="col-md-6"> 
          <Form.Group className="profile-edit-field col-md-12">
          <Form.Label>{t('trainingname')}</Form.Label>
          <Form.Control
            type="text"
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
            required
          />
        </Form.Group>
      </div>
        <div className="col-md-6"> 
        <Form.Group className="profile-edit-field col-md-12">
          <Form.Label>{t('trainingplan')} {t('photo')}</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>
        
        {imagePreview && <Image src={imagePreview} rounded style={{ maxWidth: '200px', marginBottom: '20px' }} />}
        </div></div>
        {trainings.map((training, index) => (
          <div key={index} className="mb-3 border p-3 rounded">
             <div className="row">
             <div className="col-md-6"> 
               <Form.Group className="profile-edit-field col-md-12">
              <Form.Label>{t('drill_category')}</Form.Label>
              <Form.Select
                name="category"
                value={training.category}
                onChange={(e) => handleInputs(e, index)}
                required
              >
                <option value="">{t('selectcategory')}</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group >
            </div>   <div className="col-md-6"> 
            <Form.Group className="profile-edit-field col-md-12">
              <Form.Label>{t('drillname')}</Form.Label>
              <Form.Select
                name="drill_name"
                value={training.drill_name}
                onChange={(e) => handleInputs(e, index)}
                required
              >
                <option value="">{t('selectdrill')}</option>
                {drills.map((drill) => (
                  <option key={drill._id} value={drill._id}>
                    {drill.drill_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            </div>
            </div>
            <Form.Group>
            <Form.Label style={{ fontWeight: 'bold' }}>{t('Week')}</Form.Label>
            {weeksData.map((weekData, weekIndex) => (
              <div key={weekIndex} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  <strong style={{ display: 'block', marginBottom: '5px' }}>{weekData.month}:</strong>
                  {weekData.weeks.map((week) => (
                    <Form.Check 
                      key={week}
                      type="checkbox"
                      id={`week_${week}_${weekIndex}`} // Ensure a unique ID
                      name={`week_${week}`}
                      label={`Week ${week}`}
                      value={week}
                      checked={training.weeks.includes(week)}
                      onChange={(e) => handleWeekChange(e, index)} // Call handleWeekChange on change
                      style={{ marginRight: '10px' }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Form.Group>
          </div>
        ))}

        <Button variant="secondary" onClick={addTrainingEntry}>{t('addmore')}</Button>

        <div className="d-flex justify-content-end mt-3">
          <Button variant="primary" type="submit" disabled={loading}>
          {t('submit')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditTraining;
