import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import uicon from '../../../assests/section-banner.jpg';
import banner_vg from '../../../assests/banner-vg.png';
import graph_svg from '../../../assests/graph.svg';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTranslation } from 'react-i18next';
interface BannerContent {
    title: string;
    content: string;
    link: string;
    photo: string;
}

interface Assignment {
    status: number;
}

interface TrainingPlan {
    training_name: string;
    image: string;
    id: string;
    status: number;
}

interface Blog {
    _id: string;
    title: string;
    photo: string;
    createdAt: string;
  }

const SimplePage: React.FC = () => {
    const [bannerContent, setBannerContent] = useState<BannerContent | null>(null);
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [visibleBlogs, setVisibleBlogs] = useState(2);
    const { userInfo } = useSelector((state: any) => state.user);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchBannerContent = async () => {
            try {
                const response = await axios.get('http://localhost:4500/api/v1/banner-content');
                setBannerContent(response.data[0]);
            } catch (error) {
                console.error("Error fetching banner content:", error);
            }
        };

        fetchBannerContent();
    }, []);

    useEffect(() => {
        const fetchTrainingPlan = async () => {
            try {
                const userId = userInfo[0]?.userDetails?._id; // Extract user ID from userInfo
                const response = await axios.get(`http://localhost:4500/api/v1/trainings-home/${userId}`);
               
                const trainingData = response.data.map((item: any) => ({
                    id: item.trainingPlan._id,
                    training_name: item.trainingPlan.training_name,
                    image: item.trainingPlan.image,
                    status: item.trainingPlan.assignments.status, // Use the status from assignments
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

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:4500/api/v1/blogs');
                console.log('blog :',response);
                setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching banner content:", error);
            }
        };

        fetchBlogs();
    }, []);

    const loadMoreBlogs = () => {
        setVisibleBlogs(prevVisibleBlogs => prevVisibleBlogs + 2);
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:mm:ss
    };

    return (
        <div>
            {/* Banner Section */}
            <section className='goalie_home'>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="main-banner" style={{ backgroundImage: `url(${banner_vg})` }}>
                                <div className="row g-0">
                                    <div className="col-lg-8 banner-content">
                                        <h1>{bannerContent?.title || "Welcome to the Excellence Goalie App"}</h1>
                                        <p className="mt-4">{bannerContent?.content || "Default description here."}</p>
                                        <a href={bannerContent?.link || "#"}>
                                            <button className="btn btn-primary mt-3">{t('view all')}</button>
                                        </a>
                                    </div>
                                    <div className="col-lg-4 p-0 m-auto">
                                        <img 
                                            src={bannerContent?.photo ? `http://localhost:4500/storage/productImages/${bannerContent.photo}` : uicon} 
                                            className="img-fluid w-100" 
                                            alt="Banner Image" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-5 my-3" id="about">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12 mb-5">
                            <div className="d-flex align-items-center justify-content-between">
                                <h2 className="text-white">{t('my')}  <span className="highlight-text">{t('training')}</span> {t('plan')} </h2>
                                <a href="/goalie/view-all-trainings/"><button className="btn btn-primary">{t('All the training plans')}</button></a>
                            </div>
                        </div>

                        {trainingPlans.slice(0, 3).map((training) => (
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

            <section className="py-5 my-3 myprogress">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h2 className="text-white">{t('myprogress')}</h2>
                        </div>
                        <div className="col-lg-4">
                            <img
                                src={graph_svg}
                                className="img-fluid w-100"
                                alt="Progress Graph"
                            />
                        </div>
                    </div>
                </div>
            </section>

             {/* Blog Section */}
            <section className="py-5 my-3" id="service">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12 mb-5">
                            <div className="d-flex align-items-center justify-content-between">
                                <h2 className="text-white">{t('ourblogs')}</h2>
                                <a href="/goalie/view-all-blogs/"><button className="btn btn-primary">{t('viewblogs')}</button></a>
                            </div>
                        </div>
                        {blogs.slice(0, visibleBlogs).map((blog) => (
                            <div className="col-lg-6" key={blog._id}>
                                <div className="card">
                                    <img src={`http://localhost:4500/storage/productImages/${blog.photo}`} style={{ height: "312px" }} className="img-fluid w-100 mb-4" alt="Blog Image" />
                                    <h3 className="plan-name">{blog.title.length > 40 ? `${blog.title.substring(0, 40)}...` : blog.title}</h3>
                                    <p className="date"><CalendarTodayIcon /> {formatDate(blog.createdAt)}</p>
                                    <a href={`/goalie/blog/${blog._id}`}>
                                        <button className="btn btn-primary">{t('learnmore')}</button>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {visibleBlogs < blogs.length && (
                    <button onClick={loadMoreBlogs} className="cst_load_more_blog btn btn-primary">{t('loadmore')}</button>
                )}
            </section>
        </div>
    );
};

export default SimplePage;
