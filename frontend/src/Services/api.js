import axios from "axios";
import { BASE_URL } from "./utils";

const login = async (email, password) => {
    console.log("email=", email, "password", password);
    try {
        const result = await axios.get(`${BASE_URL}/login/premium`, {
                params: { email, password }
            }
        );
        // const result = {
        //     data: {
        //         token: "123456789"
        //     }
        // }
        return result.data;
    } catch (e) {
        console.error("Error login", e);
        throw e;
    }
};

const register = async (email, password) => {
    console.log("register", "email=", email, "password", password);
    try {
        const result = await axios.post(`${BASE_URL}/add_premium_user`, {
            user_to_add: { email, password },
        });
        // const result = {
        //     data: {
        //         token: "123456789"
        //     }
        // }
        return result.data;
    } catch (e) {
        console.error("Error register", e);
        throw e;
    }
};

const createFreeUser = async (token) => {
    console.log("free user");
    try {
        const result = await axios.get(`${BASE_URL}/login/free`, {
            params: { token },
            headers:{
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Content-Type':'application/json'
            }
        });
        // const result = {
        //     data: "some string"
        // }
        return result.data;
    } catch (e) {
        console.error("Error createFreeUser", e);
        throw e;
    }
};

const USER_NAME  = "Gal"
const TIME_REMAINING = 10000; // milliseconds
const LOGIN_TIME = new Date();
const CURRENT_SPEED = 0; // MBps

const getStatus = async (token) => {
    const result = {
        data:{
            isPremium: true,
            name: USER_NAME,
            time_remaimning: TIME_REMAINING,
            login_time: LOGIN_TIME,
            current_speed: CURRENT_SPEED
        }
    }
    return result.data;   
}


export const loginService = {
    login,
    register,
    createFreeUser,
};

export const dataService = {
    getStatus
}