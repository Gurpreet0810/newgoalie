import React from 'react';

const SimplePage: React.FC = () => {
    return (
        <div>
            {/* Banner Section */}
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="main-banner">
                                <div className="row g-0">
                                    <div className="col-lg-8 banner-content">
                                        <h1>Banner Title</h1>
                                        <p className="mt-4">This is the banner content.</p>
                                        <a href="#"><button className="btn btn-primary mt-3">View All</button></a>
                                    </div>
                                    <div className="col-lg-4 p-0 m-auto">
                                        <img src="/path/to/image.jpg" className="img-fluid w-100" alt="Banner Image" />
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
                                <h2 className="text-white">My Training Plan</h2>
                                <a href="#"><button className="btn btn-primary">All the training plans</button></a>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card">
                                <img src="/path/to/training-image.jpg" className="img-fluid w-100 mb-4" alt="Training Image" />
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <span className="budge not-started">Not Started</span>
                                    <button className="btn btn-secondary">Start</button>
                                </div>
                            </div>
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
                                <h2 className="text-white">Our Blogs</h2>
                                <a href="#"><button className="btn btn-primary">View Blogs</button></a>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card">
                                <img src="/path/to/blog-image.jpg" className="img-fluid w-100 mb-4" alt="Blog Image" />
                                <h3 className="plan-name">Blog Title</h3>
                                <p className="date"><i className="bi bi-calendar"></i> 22 Jan 2024</p>
                                <button className="btn btn-primary">Learn More</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SimplePage;
