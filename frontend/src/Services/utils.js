import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8001";
//export const NODOG_URL = "http://10.3.141.1:8083"

export class HTTP {
  get = async (url, body = undefined) => {};
  post = async (url, body = null) => {};
  delete = async (url, body) => {};

  constructor(baseUrl = undefined, token = "") {
    if (baseUrl) {
      this.get = async (url, body = null) =>
        await axios.get(baseUrl + url, {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            token: token
          },
          withCredentials: true,
        });

      this.post = async (url, body = null) =>
        await axios.post(baseUrl + url, body, {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            token: token
          },
          withCredentials: true,
        });

      this.delete = async (url, body = null) =>
        await axios.delete(baseUrl + url, body, {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            token: token
          },
          withCredentials: true,
        });
    }
  }
}
