import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: "https://six-sense-server.vercel.app",
  // baseURL: "http://localhost:4000",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
