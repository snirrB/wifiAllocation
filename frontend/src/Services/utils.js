import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8001";
const BASE_URL = "http://10.3.141.1:8001";

class HTTP {
  get = async (url) => {
    console.log(url, "GET: Token =", this.token);
  };
  post = async (url, body = null) => {
    console.log(url, "POST: Token =", this.token);
  };
  delete = async (url, body) => {
    console.log(url, "DELETE: Token =", this.token);
  };
  token;
  dummy;
  premiumId;
  constructor(dummy) {
    this.dummy = dummy;
  }

  setToken(token) {
    this.token = token;
    if (this.dummy) {
      console.log("DUMMY Setting token", token);
      return;
    }
    if (token) {
      this.token = token;
      console.log("Setting token", token);
      // const params = {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   withCredentials: true,
      // };
      const params = undefined;

      this.get = async (url) => {
        alert(JSON.stringify({ url: BASE_URL + url, params: params }));
        return await axios.get(BASE_URL + url, params);
      };

      this.post = async (url, body = null) => {
        alert(
          JSON.stringify({ url: BASE_URL + url, body: body, params: params })
        );
        return await axios.post(BASE_URL + url, body, params);
      };

      this.delete = async (url, body = null) => {
        alert(
          JSON.stringify({ url: BASE_URL + url, body: body, params: params })
        );
        return await axios.delete(BASE_URL + url, body, params);
      };
    }
  }
}

export const http = new HTTP();
