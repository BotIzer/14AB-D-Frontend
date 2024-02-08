import { useRouteError } from "react-router-dom";

export default function ErrorPage({errorStatus}) {
  const error = useRouteError();
  let errorMessage = false;
  if(error){
    console.error(error.statusText);
  }
  else if (errorStatus !== undefined) {
   errorMessage = errorStatus.response.data.message
  }
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage || error.statusText || error.message}</i>
      </p>
    </div>
  );
}