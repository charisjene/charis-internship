import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Skeleton from "../UI/Skeleton";
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const HotCollections = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    loop: true,
    margin: 10,
    nav: true,
    items: 4,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      900: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  };

  useEffect(() => {
    const getExploreData = async () => {
      try {
        const response = await axios.get(
          'https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections',
          { timeout: 5000 }  // Force error if no response in 5s to prevent hanging
        );
        setData(response.data);
        // Keep your 2-second delay for previewing skeletons
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getExploreData();

    // Optional: Uncomment for mock data if API is unreliable (simulates success)
    // setTimeout(() => {
    //   setData([
    //     { nftImage: 'https://via.placeholder.com/300x200', authorImage: 'https://via.placeholder.com/50', name: 'Mock Collection 1', tokenType: 'ERC-721', authorName: 'Mock Author 1' },
    //     // Add more objects...
    //   ]);
    //   setLoading(false);
    // }, 2000);
  }, []);

  if (error) {
    return <p>Error loading collections: {error.message}</p>;
  }

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="row">
            {new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft_coll">
                  <div className="nft_wrap">
                    <Skeleton width="100%" height="200px" />
                  </div>
                  <div className="nft_coll_pp">
                    <Skeleton width="50px" height="50px" borderRadius="50%" />
                    <i className="fa fa-check"></i>
                  </div>
                  <div className="nft_coll_info">
                    <Skeleton width="100px" height="20px" />
                    <br />
                    <Skeleton width="60px" height="20px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-12">
              <OwlCarousel className="owl-carousel" {...options}>
                {data.map((collection, index) => (
                  <div key={index}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img 
                            src={collection.nftImage || 'default-image.jpg'} 
                            className="lazy img-fluid" 
                            alt={collection.name} 
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img 
                            className="lazy pp-coll" 
                            src={collection.authorImage || 'default-author.jpg'} 
                            alt={collection.authorName} 
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.name || 'Collection Name'}</h4>
                        </Link>
                        <span>{collection.tokenType || 'ERC-192'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </OwlCarousel>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HotCollections;