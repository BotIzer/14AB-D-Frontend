import { CarouselCaption } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

function MyCarousel() {
  const images = ["/src/assets/react.svg", "02.jpg", "03.jpg"];

  const imageList = images.map((image) => (
    <Carousel.Item>
      <img
        src={image}
        className="d-block w-50 img-fluid mx-auto"
        alt={image.slice(0, image.length - 4)}
      />
    </Carousel.Item>
  ));

  return <Carousel className="d-block w-100">{imageList}</Carousel>;
}

export default MyCarousel;
