import axios from "axios";
import dotenv from "dotenv";
dotenv.config();



axios.defaults.baseURL = process.env.BASE_URL;

