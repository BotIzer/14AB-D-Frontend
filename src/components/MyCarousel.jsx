import Carousel from "react-bootstrap/Carousel";

function MyCarousel(images) {
  // const images = [
  //   "/src/assets/react.svg",
  //   "/src/assets/banner_test.jpg",
  //   "/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png",
  // ];

  const imageList = images.images.map((image) => (
    <Carousel.Item key={image} className="text-center" style={{backgroundImage: `url(${image})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat"}}>
      <div className="primary">
        <h1 className=" text-outline">Title</h1>
      </div>
      <div className="secondary">
        <p className="text-outline">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet, non nam, nesciunt voluptates doloremque praesentium aut saepe iste cupiditate, pariatur ullam ut qui nemo distinctio! Recusandae architecto nulla non et.</p>
      </div>
    </Carousel.Item>
  ));

  return (
    <Carousel
      className="d-block w-100 h-100 p-0"
      indicators={false}
      interval={null}
    >
      {imageList}
    </Carousel>
  );
}

export default MyCarousel;
