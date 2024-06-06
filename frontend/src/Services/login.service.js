import axios from "axios";
import { BASE_URL } from "./utils";

const login = async (email, password) => {
    console.log("email=", email, "password", password);
    try {
        const result = await axios.post(
            `${BASE_URL}/db/add_premium_user`,
            {
              user_to_add: { email, password },
            }
          );
          return result;
    } catch (e) {
        console.error("Error login", e);
        return undefined;
    }
}

const register = async (email, password) => {
    console.log("register","email=", email, "password", password);
    try {
        const result = axios.get(`${BASE_URL}/login/premium`, {
            params: {
              user_to_add: { email, password },
            },
          });
          return result;
    } catch (e) {
        console.error("Error login", e);
        return undefined;
    }
}

const createFreeUser = async (token) => {
    console.log("free user");
    try {
        const result = axios.get(`${BASE_URL}/db/login/free`, {
            params: {
              token: token,
            },
          });
          return result;
    } catch (e) {
        console.error("Error login", e);
        return undefined;
    }
}

const hello = async () => {
    console.log("Getting Hello");
    await axios.get(`${BASE_URL}/hello`)
}

export const loginService = {
    login,
    register,
    createFreeUser,
    hello
}