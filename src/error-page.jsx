import { useRouteError } from "react-router-dom";
import Navigation from "./components/Navigation";

export default function ErrorPage({errorStatus}) {
  const error = useRouteError();
  let errorMessage = false;
   if (errorStatus !== undefined) {
    if(errorStatus.response === undefined){
      console.log(errorStatus)
      errorMessage = "Internal Server error. Check back later!"
    }
    else{
      errorMessage = errorStatus.response.data.message
    }
  }
  return (
    <>
    <Navigation/>
    <div id="error-page m-5">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage || error.statusText || error.message}</i>
      </p>
    </div>
    </>);
}