import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

interface TrainingPlan {
    drill_id: string;
    drill_name: string;
    drill_description: string;
    category_name: string;
    drill_photo: string;
}

const SimplePage: React.FC = () => {
    const [groupedTrainingPlans, setGroupedTrainingPlans] = useState<{ [key: string]: TrainingPlan[] }>({});
    const { userInfo } = useSelector((state: any) => state.user);
    const { trainingPlanId } = useParams<{ trainingPlanId: string }>();

    useEffect(() => {
        const fetchTrainingPlan = async () => {
            try {
                const userId = userInfo[0]?.userDetails?._id; // Extract user ID from userInfo
                const response = await axios.get(`http://localhost:4500/api/v1/training/${trainingPlanId}`);
               
                // Assuming the response contains an array of drills
                const trainingPlans: TrainingPlan[] = response.data;
                setGroupedTrainingPlans(groupByCategory(trainingPlans)); // Group by category

                console.log('response data :', response.data);
            } catch (error) {
                console.error("Error fetching training plan:", error);
            }
        };

        if (userInfo[0]?.userDetails?._id) {
            fetchTrainingPlan();
        }
    }, [userInfo, trainingPlanId]);

    const [activePanel, setActivePanel] = useState<number | null>(null); // State to manage active panel

    const togglePanel = (panelIndex: number) => {
        setActivePanel(activePanel === panelIndex ? null : panelIndex); // Toggle active panel
    };

    // Helper function to group training plans by category
    const groupByCategory = (plans: TrainingPlan[]) => {
        return plans.reduce((acc: { [key: string]: TrainingPlan[] }, plan: TrainingPlan) => {
            if (!acc[plan.category_name]) {
                acc[plan.category_name] = [];
            }
            acc[plan.category_name].push(plan);
            return acc;
        }, {});
    };

    return (
        <section className="py-5 goalie_home" id="single-training">
            <div className="container">
                <div id="list">

                    {/* Loop through grouped categories */}
                    {Object.keys(groupedTrainingPlans).map((categoryName, index) => (
                        <div key={index}>
                            <h3 className="text-white my-2 mt-5">{categoryName}</h3> {/* Display category name */}
                            
                            {/* Map through drills under each category */}
                            {groupedTrainingPlans[categoryName].map((plan, drillIndex) => (
                                <Accordion
                                    key={index}
                                    // expanded={activePanel === index}
                                    onChange={() => togglePanel(index)}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${index}-content`}
                                        id={`panel${index}-header`}
                                        style={{ background: '#25576C',color: '#fff' }}
                                    >
                                        <h3>{plan.drill_name}</h3>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <img src={`http://localhost:4500/storage/productImages/${plan.drill_photo}`} width="100%"/>
                                            </div>
                                            <div className='col-md-8'>
                                            <h3>{categoryName}</h3>
                                            <div dangerouslySetInnerHTML={{ __html: plan.drill_description }} />
                                            <a href={`/goalie/view-drill/${plan.drill_id}`}><button className="btn btn-primary mt-3">More Detail</button></a>
                                            </div>
                                        </div>
                                        
                                        {/* Add other drill details if needed */}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SimplePage;
