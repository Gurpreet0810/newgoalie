import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

interface Assignment {
    status: number;
}

interface TrainingPlan {
    training_name: string;
    image: string;
    id: string;
    status: number;
}

const SimplePage: React.FC = () => {
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
    const { userInfo } = useSelector((state: any) => state.user);

    useEffect(() => {
        const fetchTrainingPlan = async () => {
            try {
                const userId = userInfo[0]?.userDetails?._id; // Extract user ID from userInfo
                const response = await axios.get(`http://localhost:4500/api/v1/trainings-home/${userId}`);
               
                const trainingData = response.data.map((item: any) => ({
                    id: item.trainingPlan._id,
                    training_name: item.trainingPlan.training_name,
                    image: item.trainingPlan.image,
                    status: item.trainingPlan.assignments.status,
                }));

                console.log('response data :', trainingData)
                setTrainingPlans(trainingData);
            } catch (error) {
                console.error("Error fetching training plan:", error);
            }
        };

        if (userInfo[0]?.userDetails?._id) {
            fetchTrainingPlan();
        }
    }, [userInfo]);

    const getStatusClass = (status: number) => {
        switch (status) {
            case 0: return "not-started"; 
            case 1: return "in-progress";
            case 2: return "completed";
            default: return "";
        }
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0: return "Not Started"; 
            case 1: return "In Progress";
            case 2: return "Completed";
            default: return "Unknown";
        }
    };

    return (
        <div>
            {/* About Section */}
            <section className="py-5 goalie_home" id="about">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12 mb-5">
                            <div className="d-flex align-items-center justify-content-between">
                                <h2 className="text-white" style={{ textAlign: "center", margin: "auto" }}>My <span className="highlight-text">Training</span> plan </h2>
                            </div>
                        </div>

                        {trainingPlans.map((training) => (
                            <div className="col-lg-4 cst_grid_load_1 cst_grid_loadss" key={training.id}>
                                <div className="card">
                                    <img 
                                        src={`http://localhost:4500/storage/productImages/${training.image}`} 
                                        className="img-fluid w-100 mb-4 tranining_pl" 
                                        alt={training.training_name} 
                                    />
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className={`budge ${getStatusClass(training.status)}`}>
                                            {getStatusLabel(training.status)}
                                        </span>
                                        <a href={`/goalie/view-training/${training.id}`}>
                                        <button className="btn btn-secondary">
                                            {training.training_name}
                                        </button></a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SimplePage;
