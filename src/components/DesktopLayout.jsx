import { Col, Row } from 'react-bootstrap/';
import MyCarousel from '../components/MyCarousel';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

function DesktopLayout() {
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
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching recommended forums:', error);
      }
    };
    getRecommendedForums();
  }, []);

  return (
    <>
      <Row className='border h-100 m-5 p-0'>
        <Col className='d-flex justify-content-center border p-0' style={{ height: '180px' }}>
          <MyCarousel forums={carouselSource} />
        </Col>
      </Row>
    </>
  );
}

export default DesktopLayout;