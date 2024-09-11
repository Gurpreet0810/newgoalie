import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateTraining, fetchTrainingById } from '../store/TrainingSlice';
import { useNavigate, useParams } from 'react-router';

interface Training {
  category: string;
  drill_name: string;
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
  const [trainings, setTrainings] = useState<Training[]>([
    {
      category: '',
      drill_name: '',
      photoPreview: '',
    },
  ]);
  const [trainingName, setTrainingName] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState<number[][]>([[]]);
  const [categories, setCategories] = useState<any[]>([]);
  const [drills, setDrills] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trainingId } = useParams(); // Get training ID from route parameters
  const { userInfo } = useSelector((state: any) => state.user);
  console.log(trainingId);
  const fetchTraining = async (id: string) => {
    try { 
        const token = localStorage.getItem('token'); // Or get it from userInfo state if using Redux: userInfo.token

        // Add authorization header with the token
        const response = await axios.get(`http://localhost:4500/api/v1/singletrainings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the header
          },
        });
    //   const response = await axios.get(`http://localhost:4500/api/v1/singletrainings/${id}`);
      const trainingData = response.data;
      const response_drill = await axios.get(`http://localhost:4500/api/v1/singletrainingsdrills/${trainingData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the header
        },
      });
        console.log(trainingData);
      setTrainingName(trainingData.training_name);
      setTrainings(
        trainingData.drills.map((drill: any) => ({
          photoPreview: drill.image || '',
        }))
      );
      setSelectedWeeks(trainingData.weeks || []);
    } catch (err) {
      toast.error('Error fetching training data');
    }
  };

  useEffect(() => {
    if (trainingId) {
      fetchTraining(trainingId);
    }
    fetchCategories();
  }, [trainingId]);

  const handleInputs = async (event: ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = event.target;

    const newTrainings = [...trainings];
    newTrainings[index] = {
      ...newTrainings[index],
      [name]: value as keyof Training,
    };
    setTrainings(newTrainings);

    if (name === 'category') {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/getAllDrillsbycategory?category=${value}`);
        setDrills(response.data);
      } catch (err) {
        setErrors([...errors, { fetch: 'An error occurred while fetching drills' }]);
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      setPhoto(files[0]);
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
    setSelectedWeeks((prevSelectedWeeks) => {
      const newSelectedWeeks = [...prevSelectedWeeks];
      newSelectedWeeks[formIndex] = event.target.checked
        ? [...newSelectedWeeks[formIndex], week]
        : newSelectedWeeks[formIndex].filter((w) => w !== week);
      return newSelectedWeeks;
    });
  };

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append('training_name', trainingName);
//     if (photo) formData.append('photo', photo as Blob);
//     formData.append('user_id', userInfo[0]?.userDetails?._id);

//     try {
//       const res = await dispatch(updateTraining({ id: trainingId, data: formData }));
//       var training_id = res.payload._id;

//       for (let i = 0; i < trainings.length; i++) {
//         const formData_drills = new FormData();
//         formData_drills.append('drill_category', trainings[i].category);
//         formData_drills.append('drill_name', trainings[i].drill_name);
//         formData_drills.append('trainingplan_id', training_id);
//         formData_drills.append('weeks', JSON.stringify(selectedWeeks[i]));
//         await addTrainingsDrills(formData_drills, dispatch);
//       }

//       toast.success('Training updated successfully!');
//       navigate('/manage-training');
//     } catch (error) {
//       toast.error('Error updating training');
//     }
//   };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get<DrillCategory[]>('http://localhost:4500/api/v1/drillCategories');
      setCategories(response.data.filter((category) => category.category_status === 'active'));
    } catch (err) {
      setErrors([...errors, { fetch: err instanceof Error ? err.message : 'An unknown error occurred' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-content card card-primary">
      <div className="card-header">
        <h3 className="card-title">Edit Training</h3>
      </div>
      <Form 
      //onSubmit={handleSubmit}
       encType="multipart/form-data">
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
          {photo && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <img src='' alt="Preview" style={{ width: '100px', height: '100px' }} />
            </div>
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
              {/* Loop through weeksData as in AddTraining */}
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
