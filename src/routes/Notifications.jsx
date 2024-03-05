import Navigation from "../components/Navigation";
import Container from "react-bootstrap/Container";
import DesktopLayout from "../components/DesktopLayout";
import MobileLayout from "../components/MoblieLayout";

export default function Notifications() {
  return (
    <>
      <Navigation />
      <Container fluid style={{ height: "800px" }}>
        <div className="sm-hidden">
          <DesktopLayout></DesktopLayout>
        </div>
        <div className="lg-hidden">
          <MobileLayout></MobileLayout>
        </div>
        <p>Friend requests</p>
      </Container>
      
    </>
  );
}
