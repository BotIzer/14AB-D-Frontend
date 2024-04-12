import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel'
import { useNavigate } from 'react-router-dom';

function MyCarousel(forums) {
  const navigate = useNavigate()
  const [isBannerValid, setIsBannerValid] = useState({})
  const carouselItems = forums.forums && forums.forums.length !== 0 ? forums.forums.map((forum) => (
    <Carousel.Item key={forum._id.forum_id} className='text-center'>
      <img
        src={isBannerValid[forum.banner] ? forum.banner : import.meta.env.VITE_BFF_DEFAULT}
        className='img-fluid bannerSize'
        alt={forum.banner.slice(0, forum.banner.lastIndexOf('.'))}
        style={{ float: 'center' }}
      />
      <Carousel.Caption className='primary'>
        <h3 className='text-outline'>{forum.forum_name}</h3>
        <div className='secondary'>
          <p className='text-outline'>{forum.description && forum.description}</p>
        </div>
        <Button className='custom-button primary' style={{border: 'solid 1px gold'}} onPointerDown={()=>goToForum(forum.forum_name, forum._id.forum_id)}>Visit Forum</Button>
      </Carousel.Caption>
    </Carousel.Item>
  )) : forums.images && forums.images.map((image) => (
    <Carousel.Item key={image} className='text-center'>
      <img
        src={isBannerValid[image] ? image : import.meta.env.VITE_BFF_DEFAULT}
        className='img-fluid bannerSize'
        alt={image.slice(0, image.lastIndexOf('.'))}
        style={{ float: 'center' }}
      />
    </Carousel.Item>
  ));
  const goToForum = async (forum_name, id)=>{
    navigate(`/forums/${decodeURIComponent(forum_name)}/${id}`)
  }
  useEffect(()=>{
    if(forums.forums){
      forums.forums.forEach(forum => {
        const img = new Image();
        img.src = forum.banner;
        img.onload = () => {
          setIsBannerValid(prevState => ({
            ...prevState,
            [forum.banner]: true
          }));
        };
        img.onerror = () => {
          setIsBannerValid(prevState => ({
            ...prevState,
            [forum.banner]: false
          }));
        };
      });
    }
    else if(forums.images){
      forums.images.forEach(image => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
          setIsBannerValid(prevState => ({
            ...prevState,
            [image]: true
          }));
        };
        img.onerror = () => {
          setIsBannerValid(prevState => ({
            ...prevState,
            [image]: false
          }));
        };
      });
    }
  },[forums])
  return (
    <Carousel
      className='d-block w-100 h-100 overflow-hidden p-0'
      indicators={false}
      interval={null}
    >
      {carouselItems}
    </Carousel>
  )
}

export default MyCarousel
