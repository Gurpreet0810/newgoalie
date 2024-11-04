import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DrillDetails = () => {
  const { id } = useParams<{ id: string }>(); // Get drill ID from the URL
  const [drill, setDrill] = useState<any>(null); // State to hold the drill details
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    // Fetch drill details from the API
    const fetchDrillDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/api/v1/drillswithcat/${id}`);
        setDrill(response.data.data.drill); // Set the drill data from the nested 'data' object
        setLoading(false); // Loading complete
      } catch (error) {
        console.error('Error fetching drill details:', error);
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchDrillDetails();
  }, [id]);


  if (!drill) {
    return <p>No drill details found</p>;
  }

  // Conditional rendering based on video_option
  const renderMedia = () => {
    const { video_option, video_file, video_link, photo } = drill;

    if (video_option === 'video_upload' && video_file) {
      return (
        <video width="100%" height="315" controls>
          <source src={`http://localhost:4500/storage/productImages/${video_file}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (video_option === 'video_link' && video_link) {
      // Modify YouTube URL for embedding if needed
      const embeddedLink = video_link.replace('watch?v=', 'embed/');
      return (
        <iframe
          width="100%"
          height="315"
          src={embeddedLink}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else if (!video_file && !video_link && photo) {
      return <img src={photo} alt="Drill" style={{ width: '100%', height: 'auto' }} />;
    }

    return <p>No media available</p>;
  };

  return (
    <section style={{ paddingTop: '10rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div className="row">
          <div className="row justify-content-between">
            <div className="col-lg-8">
              <div className="row g-5">
                <div className="col-12 pr-5">
                  <div className="drill-category-name d-flex justify-content-between align-items-center">
                    <h2 className="text-white">{drill.drill_name}</h2>
                    <span className="traning-name position-relative text-white">
                      {drill?.category?.category_name || 'Category not available'}
                    </span>
                  </div>
                </div>
                <div className="col-12 mt-4">{renderMedia()}</div>
                <div className="col-12 mt-3" style={{ color: 'white' }}>
                  <div dangerouslySetInnerHTML={{ __html: drill.description }} className="text-white" />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row" style={{ position: 'sticky', top: '4px' }}>
                <div className="col-12">
                  <div className="latest-drill">
                    <div className="drill-category-name d-flex justify-content-between align-items-center">
                      <h2 className="text-white">Autres d’entraînement</h2>
                      <a href="/goalie/view-trainings/">Voir tout</a>
                    </div>
                    <div className="card cat-one not-started">
                      <div className="cat-name">
                        <h2>Dummy new plan</h2>
                      </div>
                      <div className="graph">
                        <p style={{ color: 'red' }}>Pas commencé</p>
                      </div>
                    </div>
                    {/* Additional drill items go here */}
                  </div>
                </div>
              </div>
            </div>
            <a href="/goalie/view-training/">
              <button className="btn btn-primary" style={{ margin: 'auto', display: 'table' }}>
                Back
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrillDetails;
