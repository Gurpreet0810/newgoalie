import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateTraining } from '../store/TrainingSlice';
import { useNavigate, useParams } from 'react-router';
import { Image } from 'react-bootstrap';

interface Training {
  category: string;
  drill_name: string;
  weeks: number[];
  photoPreview: string;
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

      setTrainingName(trainingData.training_name);
      setTrainings(response_drill.data.drills.map((drill: any) => ({
        category: drill.category,
        drill_name: drill.drill_name,
        weeks: drill.weeks, 
        photoPreview: '', 
      })));
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

  const handleInputs = async (event: ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = event.target;

    const newTrainings = [...trainings];
    newTrainings[index] = {
      ...newTrainings[index],
      [name]: value,
    };
    setTrainings(newTrainings);

    if (name === 'category') {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/getAllDrillsbycategory?category=${value}`);
        setDrills(response.data);
      } catch (err) {
        toast.error('An error occurred while fetching drills');
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      setPhoto(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));
      setTrainings(trainings.map((training, index) => {
        if (index === 0) {
          return {
            ...training,
            photoPreview: URL.createObjectURL(files[0]),
          };
        }
        return training;
      }));
    }
  };

  const handleWeekChange = (event: ChangeEvent<HTMLInputElement>, formIndex: number) => {
    const week = parseInt(event.target.value, 10);
    setTrainings((prevTrainings) => {
      const newTrainings = [...prevTrainings];
      newTrainings[formIndex].weeks = event.target.checked
        ? [...newTrainings[formIndex].weeks, week]
        : newTrainings[formIndex].weeks.filter((w) => w !== week);
      return newTrainings;
    });
  };

  const weeksData = [
    { month: 'August', weeks: [31, 32, 33, 34, 35] },
    { month: 'September', weeks: [36, 37, 38, 39] },
    // ...other months and weeks
  ];

  return (
    <div className="profile-edit-content card card-primary">
      <div className="card-header">
        <h3 className="card-title">Edit Training</h3>
      </div>
      <Form encType="multipart/form-data">
        <Form.Group controlId="training_name" className="profile-edit-field col-md-6">
          <Form.Label>Training Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Training Name"
            value={trainingName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTrainingName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="photo" className="profile-edit-field col-md-6">
          <Form.Label>Training Photo</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
          {imagePreview && (
            <Image src={imagePreview} alt="Preview" thumbnail width="100" />
          )}
        </Form.Group>

        {trainings.map((training, index) => (
          <div key={index} className="addmore_div">
            <Form.Group controlId={`category_${index}`} className="profile-edit-field col-md-6">
              <Form.Label>Drill Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={training.category}
                onChange={(e) => handleInputs(e as unknown as ChangeEvent<HTMLSelectElement>, index)}
              >
                <option value="">Select Drill Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId={`drill_name_${index}`} className="profile-edit-field col-md-6">
              <Form.Label>Drill Name</Form.Label>
              <Form.Control
                as="select"
                name="drill_name"
                value={training.drill_name}
                onChange={(e) => handleInputs(e as unknown as ChangeEvent<HTMLSelectElement>, index)}
              >
                <option value="">Select Drill Name</option>
                {drills.map((drill) => (
                  <option key={drill._id} value={drill._id}>
                    {drill.drill_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <div className="weeks-checkboxes">
              {weeksData.map((weekData, weekIndex) => (
                <div key={weekIndex} style={{ marginBottom: '10px' }}>
                  <strong style={{ display: 'block', marginBottom: '5px' }}>{weekData.month}:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {weekData.weeks.map((week) => (
                      <Form.Check
                        key={week}
                        type="checkbox"
                        id={`week_${week}_${index}`}
                        label={`Week ${week}`}
                        value={week}
                        checked={training.weeks.includes(week)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleWeekChange(e, index)}
                        style={{ marginRight: '10px' }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button variant="primary" type="submit">
          Update Training
        </Button>
      </Form>
    </div>
  );
};

export default EditTraining;
