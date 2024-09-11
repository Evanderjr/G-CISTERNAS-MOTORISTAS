import axios from "axios";

import { config } from "./util";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  headers: config.headers,
});
