import { Row } from "react-bootstrap";
import MyCarousel from "./MyCarousel";

function MobileLayout() {
    return(
        <>
        <Row><MyCarousel images= {["/src/assets/react.svg","/src/assets/banner_test.jpg",
   "/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png"]}/></Row>
        </>
    )
}

export default MobileLayout;