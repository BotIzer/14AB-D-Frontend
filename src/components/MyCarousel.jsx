import Carousel from "react-bootstrap/Carousel";

function MyCarousel() {
  const images = [
    "/src/assets/react.svg",
    "/src/assets/banner_test.jpg",
    "/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png",
  ];

  const imageList = images.map((image) => (
    <Carousel.Item key={image} className="h-100">
      <img
        src={image}
        className="img-fluid imgSize py-3"
        alt={image.slice(0, image.length - 4)}
        style={{ float: "center" }}
      />
    </Carousel.Item>
  ));

  return (
    <Carousel
      className="d-block w-100 h-100 overflow-hidden"
      indicators={false}
    >
      {imageList}
    </Carousel>
  );
}

export default MyCarousel;
