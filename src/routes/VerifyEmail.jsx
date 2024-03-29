import Navigation from "../components/Navigation";
import Container from "react-bootstrap/Container";
import DesktopLayout from "../components/DesktopLayout";
import MobileLayout from "../components/MoblieLayout";
import { useEffect } from "react";
import axios from "../api/axios";

export default function VerifyEmail() {
    const [response, setResponse] = useState(null);
    useEffect(() => {
        const VerifyEmail = async () => {
           const response = await axios.get(import.meta.env.VITE_EMAIL_VERIFICATION, {
                    headers: {
                      'Content-Type': 'application/json',
                      authorization: `Bearer null`,
                    },
                    withCredentials: true,
                  })
                  setResponse(response.data)
        }
        VerifyEmail();
    },[])
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
        {response}
      </Container>
    </>
  );
}
