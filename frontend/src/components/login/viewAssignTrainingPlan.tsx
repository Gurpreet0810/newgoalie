import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewAssignTrainingPlan = () => {
    interface Assignment {
        goalie_id: string;
        training_plan_id: string;
        status: number; // Assuming status is a number (0=Not Started, 1=In Progress, 2=Completed)
        _id: string; // Assuming assignment has an _id field for updating the status
    }

    const [assignment, setAssignment] = useState<Assignment[]>([]);
    const [goalie, setGoalie] = useState<any>(null);
    const [trainingPlans, setTrainingPlans] = useState<any[]>([]);
    const [loader, setLoader] = useState(false);
    const { id } = useParams(); // Get the assignment ID from the route params

    // Fetch goalie details by goalie_id
    const fetchGoalieDetails = async (goalieId: string) => {
        try {
            const res = await axios.get(`http://localhost:4500/api/v1/get_goalies/${goalieId}`);
            setGoalie(res.data);
        } catch (error) {
            console.error('Error fetching goalie details:', error);
            toast.error('Error fetching goalie details');
        }
    };

    // Fetch assignment details and the assigned training plans
    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                setLoader(true);
                const res = await axios.get(`http://localhost:4500/api/v1/assignments/${id}`);
                const assignmentData = res.data;

                if (assignmentData && assignmentData.length > 0) {
                    const firstAssignment = assignmentData[0];
                    setAssignment(assignmentData); // Save all assignments

                    // Fetch goalie details
                    fetchGoalieDetails(firstAssignment.goalie_id);
                }
                setLoader(false);
            } catch (error) {
                setLoader(false);
                console.error('Error fetching assignment details:', error);
                toast.error('Error fetching assignment details');
            }
        };

        if (id) {
            fetchAssignmentDetails();
        }
    }, [id]);

    // Fetch all training plans (to display names in the table)
    useEffect(() => {
        const fetchTrainingPlans = async () => {
            try {
                const res = await axios.get('http://localhost:4500/api/v1/trainings');
                setTrainingPlans(res.data);
            } catch (error) {
                console.error('Error fetching training plans:', error);
                toast.error('Error fetching training plans');
            }
        };

        fetchTrainingPlans();
    }, []);

    // Filter and match training plans with assignments
    const assignedTrainingPlans = assignment.map(assign => {
        const plan = trainingPlans.find(plan => plan._id === assign.training_plan_id);
        return {
            ...plan,
            status: assign.status, // Attach status from assignment model
            assignment_id: assign._id // Attach assignment _id for updating the status
        };
    });

    // Update status of an assigned training plan
    const handleStatusChange = (assignmentId: string, newStatus: number) => {
        setAssignment(prevAssignments =>
            prevAssignments.map(assign =>
                assign._id === assignmentId ? { ...assign, status: newStatus } : assign
            )
        );
    };

    // Function to handle updating status in the backend
    const updateStatus = async (assignmentId: string, status: number) => {
        try {
            await axios.put(`http://localhost:4500/api/v1/assignments/${assignmentId}`, { status });
            toast.success('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error updating status');
        }
    };

    // Convert status code to a readable text
    const getStatusText = (status: number) => {
        switch (status) {
            case 0:
                return 'Not Started';
            case 1:
                return 'In Progress';
            case 2:
                return 'Completed';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="profile-edit-content card card-primary">
            <div className="card-header" style={{ backgroundColor: '#00617a', marginBottom: '20px' }}>
                <h3 className="card-title">View Training Plan Assignment</h3>
            </div>

            {loader ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <div>
                    <div className="profile-view-field">
                        <h5><b>Goalie Name:</b></h5>
                        <p>{goalie?.goalie_name || 'N/A'}</p> {/* Display Goalie Name */}
                    </div>
                    <div className="profile-view-field">
                        <h5><b>Email:</b></h5>
                        <p>{goalie?.email || 'N/A'}</p> {/* Display Goalie Name */}
                    </div>

                    <div className="profile-view-field">
                        <h5><b>Assigned Training Plans:</b></h5>
                        {assignedTrainingPlans.length > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Training Plan Name</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedTrainingPlans.map((plan, index) => (
                                        <tr key={plan?._id || index}>
                                            <td>{index + 1}</td>
                                            <td>{plan?.training_name || 'N/A'}</td>
                                            <td>
                                                <select
                                                    value={plan.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(plan.assignment_id, Number(e.target.value))
                                                    }
                                                >
                                                    <option value={0}>Not Started</option>
                                                    <option value={1}>In Progress</option>
                                                    <option value={2}>Completed</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => updateStatus(plan.assignment_id, plan.status)}
                                                    className="btn btn-primary"
                                                >
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No training plans assigned.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAssignTrainingPlan;
