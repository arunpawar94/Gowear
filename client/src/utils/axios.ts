import axios from "axios";

const base_url = process.env.REACT_APP_API_URL;

const axoisApi = axios.create({
  baseURL: base_url
//   withCredentials: true, // needed to send cookies
});

export default axoisApi;