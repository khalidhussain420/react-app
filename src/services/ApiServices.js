import axios from "axios";
// import { getToken, getUserID } from "../Storage/Storage";
import { getToken } from "../storage/Storage";

const baseUrl = process.env.REACT_APP_API_ADMIN_URL;

//------------------------- POST API -------------------------//
export const requestPostApiCall = async (urlEndPoint, payload, callback) => {
  try {
    const token = await getToken();
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    // Post request with axios, payload being FormData
    const response = await axios({
      url: `${baseUrl}${urlEndPoint}`,
      data: payload, // FormData
      method: "POST",
      headers: headers, // Headers (without Content-Type as FormData sets it automatically)
    });

    // Call the callback with response data if provided
    if (callback && typeof callback === "function") {
      callback(response.data);
    }

    return response.data; // Return response for further handling
  } catch (error) {
    // Handle error response properly
    const errorData = error.response
      ? error.response.data
      : {
          status: "error",
          message: "Unknown error occurred.",
          code: 500,
        };

    if (callback && typeof callback === "function") {
      callback(errorData);
    }

    return errorData;
  }
};

//------------------------- GET API -------------------------//
export const requestGetApiCall = async (urlEndPoint, params = {}, callback) => {
  try {
    const token = await getToken();
    const response = await axios({
      url: `${baseUrl}${urlEndPoint}`,
      method: "GET",
      params: params,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('token',token)

    // Ensure callback is invoked if it's a function
    if (callback && typeof callback === "function") {
      callback(response.data);
    }

    return response.data;
  } catch (error) {
    const errorData = error.response
      ? error.response.data
      : {
          status: "error",
          message: "Unknown error occurred.",
          code: 500,
        };

    if (callback && typeof callback === "function") {
      callback(errorData);
    }

    return errorData;
  }
};
