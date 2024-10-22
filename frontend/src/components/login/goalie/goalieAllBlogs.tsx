import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import uicon from '../../../assests/section-banner.jpg';
import banner_vg from '../../../assests/banner-vg.png';
import graph_svg from '../../../assests/graph.svg';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Blog {
    _id: string;
    title: string;
    photo: string;
    createdAt: string;
}

const SimplePage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [visibleBlogs, setVisibleBlogs] = useState(2);
    const { userInfo } = useSelector((state: any) => state.user);

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:mm:ss
    };

    return (
        <div>
             {/* Blog Section */}
            <section className="py-5 goalie_home" id="service">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12 mb-5">
                            <div className="d-flex align-items-center justify-content-between">
                                <h2 className="text-white" style={{ textAlign: "center", margin: "auto" }}>Our Blogs</h2>
                            </div>
                        </div>
                        {blogs.slice(0, visibleBlogs).map((blog) => (
                            <div className="col-lg-6" key={blog._id}>
                                <div className="card">
                                    <img src={`http://localhost:4500/storage/productImages/${blog.photo}`} style={{ height: "312px" }} className="img-fluid w-100 mb-4" alt="Blog Image" />
                                    <h3 className="plan-name">{blog.title.length > 40 ? `${blog.title.substring(0, 40)}...` : blog.title}</h3>
                                    <p className="date"><CalendarTodayIcon /> {formatDate(blog.createdAt)}</p>
                                    <a href={`/goalie/blog/${blog._id}`}>
                                        <button className="btn btn-primary">Learn More</button>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {visibleBlogs < blogs.length && (
                    <button onClick={loadMoreBlogs} className="cst_load_more_blog btn btn-primary">Load More</button>
                )}
            </section>
        </div>
    );
};

export default SimplePage;