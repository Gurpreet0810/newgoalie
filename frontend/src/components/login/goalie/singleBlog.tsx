import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Blog {
    _id: string;
    title: string;
    photo: string;
    content: string;
    createdAt: string;
}

const SimplePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:4500/api/v1/get_blog/${id}`);
                console.log('blog :', response.data);
                setBlog(response.data);
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };

        fetchBlog();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:mm:ss
    };

    return (
        <div>
            {/* Blog Section */}
            <section className="py-5 goalie_home" id="service">
                <div className="container">
                    {blog ? (
                        <div className="row g-4">
                            <div className="col-12 mb-5">
                            <div className="d-flex align-items-center justify-content-between">
                                <h2 className="text-white" style={{ textAlign: "center", margin: "auto" }}>Blogs</h2>
                            </div>
                        </div>
                            <div className="col-lg-12 mb-5">
                                <div className="card">
                                    <img src={`http://localhost:4500/storage/productImages/${blog.photo}`} className="img-fluid w-100 mb-4" alt="Blog Image" />
                                    <h3 className="plan-name">{blog.title}</h3>
                                    <p className="date"><CalendarTodayIcon /> {formatDate(blog.createdAt)}</p>
                                    <div
                                        className="blog-description"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading blog...</p>
                    )}
                </div>
                <a href="/goalie/view-all-blogs/">
                <button className="btn btn-primary" style={{ margin: 'auto', display: 'table' }}>
                    Back
                </button>
            </a>
            </section>
        </div>
    );
};

export default SimplePage;
