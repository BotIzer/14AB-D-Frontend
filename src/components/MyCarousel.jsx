import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel'
import { useNavigate } from 'react-router-dom';

function MyCarousel(forums) {
  const navigate = useNavigate()
  const [isBannerValid, setIsBannerValid] = useState({})
  const carouselItems = forums.forums && forums.forums.length !== 0 && forums.forums.map((forum) => (
    <Carousel.Item key={forum._id.forum_id} className='text-center'>
      <img
        src={isBannerValid[forum.banner] ? forum.banner : import.meta.env.VITE_BFF_DEFAULT}
        className='img-fluid bannerSize'
        alt={forum.banner.slice(0, forum.banner.lastIndexOf('.'))}
        style={{ float: 'center' }}
      />
      <Carousel.Caption>
        {/* TODO: ADD BFF STYLING ALSO ADD RECOMMENDED FORUMS HEADER */}
        <h3>{forum.forum_name}</h3>
        <h3><Button onPointerDown={()=>goToForum(forum.forum_name, forum._id.forum_id)}>Visit Forum</Button></h3>
        <p>{forum.description && forum.description}</p>
      </Carousel.Caption>
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
