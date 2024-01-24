import { CarouselCaption } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

function MyCarousel() {
  const images = ["/src/assets/react.svg", "/src/assets/banner_test.jpg", "03.jpg"];

  const imageList = images.map((image) => (
    <Carousel.Item>
      <img
        src={image}
        className="img-fluid w-100"
        alt={image.slice(0, image.length - 4)}
        style={{float:'center'}}
      />
    </Carousel.Item>
  ));

  return <Carousel className="d-block w-100">{imageList}</Carousel>;
}

export default MyCarousel;
