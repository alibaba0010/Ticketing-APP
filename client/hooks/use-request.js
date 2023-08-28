import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [error, setError] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setError(null); //set state for new request
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
         console.log("data: ", response.data); 
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setError(
        <div className="a  rt alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.error.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, error };
};
