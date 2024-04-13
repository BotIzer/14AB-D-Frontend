import { Col, Row, Container } from 'react-bootstrap/'
import MyCarousel from '../components/MyCarousel'
import { useEffect, useState } from 'react'
import axios from '../api/axios'

function DesktopLayout() {
  const [carouselSource, setCarouselSource] = useState([])
  useEffect(() => {
    const getRecommendedForums = async () => {
      try {
        const response = await axios.get('/forum/recommendForums', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        setCarouselSource(response.data)
      } catch (error) {
        console.error('Error fetching recommended forums:', error)
      }
    }
    getRecommendedForums()
  }, [])

  return (
    <>
      <Container>
        <Row className='justify-content-center'><h1 className='text-center'>Recommended forums</h1></Row>
        <Row className='border border-warning h-100'>
          <Col className='d-flex justify-content-center p-0' style={{ height: '180px' }}>
            <MyCarousel forums={carouselSource} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default DesktopLayout