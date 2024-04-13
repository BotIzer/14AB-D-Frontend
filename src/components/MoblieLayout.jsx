import { Row } from 'react-bootstrap'
import MyCarousel from './MyCarousel'
import { useEffect, useState } from 'react';
import axios from '../api/axios';

function MobileLayout() {
    const [carouselSource, setCarouselSource] = useState([]);
  useEffect(() => {
    const getRecommendedForums = async () => {
      try {
        const response = await axios.get('/forum/recommendForums', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        setCarouselSource(response.data);
      } catch (error) {
        console.error('Error fetching recommended forums:', error);
      }
    };
    getRecommendedForums();
  }, []);
    return(
        <>
        <Row><MyCarousel forums={carouselSource}/></Row>
        </>
    )
}

export default MobileLayout