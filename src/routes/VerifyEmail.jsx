import Navigation from "../components/Navigation";
import Container from "react-bootstrap/Container";
import DesktopLayout from "../components/DesktopLayout";
import MobileLayout from "../components/MoblieLayout";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useLocation } from "react-router-dom";

export default function VerifyEmail() {
    const [response, setResponse] = useState(null);
    const location = useLocation();
    useEffect(() => {
        const path = `${import.meta.env.VITE_EMAIL_VERIFICATION}/${location.pathname.split('/')[2]}`
        console.log(path)
        const VerifyEmail = async () => {
           const response = await axios.get(path, {
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
