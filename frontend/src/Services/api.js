import axios from "axios";
import { BASE_URL } from "./utils";

const login = async (email, password, token) => {
    try {
        const result = await axios.get(`${BASE_URL}/login/premium`, {
            user_to_add: { 
                email, 
                password, 
                token 
            }
        });

        return result.data;
    } catch (e) {
        console.error("Error login", e);
        throw e;
    }
};

const register = async (email, password, token) => {
    try {
        const result = await axios.post(`${BASE_URL}/add_premium_user`, {
            user_to_add: { 
                email, 
                password, 
                token 
            }
        });

        return result.data;
    } catch (error) {
        console.error("Error register", error);
        throw error;
    }
};

const createFreeUser = async (token) => {
    try {
        const result = await axios.get(`${BASE_URL}/login/free`, {
            params: { token },
        });

        return result.data;
    } catch (e) {
        console.error("Error create Free User", e);
        throw e;
    }
};

const getStatus = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/user_status`, {
            params: { token }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching status", error);
        throw error;
    }
};

export const loginService = {
    login,
    register,
    createFreeUser,
};

export const dataService = {
    getStatus
}