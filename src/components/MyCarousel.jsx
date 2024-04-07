import Carousel from 'react-bootstrap/Carousel'

function MyCarousel(images) {

  const imageList = images.images.map((image) => (
    <Carousel.Item key={image} className='text-center' >
      <img
        src={image}
        className='img-fluid bannerSize'
        alt={image.slice(0, image.length - 4)}
        style={{ float: 'center'}}
      />
    </Carousel.Item>
  ))

  return (
    <Carousel
      className='d-block w-100 h-100 overflow-hidden p-0'
      indicators={false}
      interval={null}
    >
      {imageList}
    </Carousel>
  )
}

export default MyCarousel
