import { http } from "./utils";

/*
RUN SERVER BY:
cd /home/pi/itay/wifiAllocation/backend ; /usr/bin/env /home/pi/.cache/pypoetry/virtualenvs/wifiallocation-oSdExMTR-py3.11/bin/pyt
hon /home/pi/itay/wifiAllocation/backend/_main_.py
*/

/* STATUSES */

const tokenParam = (token) => "?token=" + token;

async function userStatus(token) {
  // const url = "/login/free/";
  // send here
  const res = await http.get("/user_status" + tokenParam(token));
  return res.data;
  // const time_remaimning = "0000000000000000000000";
  // const login_time = "0000000000000000000000";
  // const current_speed = 0.0;
  // const result = {
  //   time_remaimning: time_remaimning,
  //   login_time: login_time,
  //   current_speed: current_speed,
  // };
  // return result;
}

async function totalAvgSpeed() {
  const url = "/total_avg_spd";
  const res = await http.get(url);
  // send here
  const avg_time = 0;
  const result = `Average speed is ${avg_time}`;
  return Number(result.split(" ")[0]);
}

/* PREMIUM USERS */

async function loginPremiumUser(email, password) {
  const url = "/login/premium/";
  // const res = await http.post(url, { email: email, password: password });
  try {
    const res = await http.post(url, {
      user_to_add: {
        email: email,
        password: password,
        token: http.token,
      },
    });
    return res;
  } catch (err) {
    // Check if error has a response property
    if (err.response) {
      // Extract the error detail from the server response
      const errorDetail = err.response.data?.detail ?? err.response;
      alert(errorDetail || "An unknown error occurred");
    } else {
      // Handle other types of errors (e.g., network errors)
      alert("Network error or server did not respond");
    }
  }

  // send here
  // const result = {
  //   token: "000000",
  //   email: "a@example.com",
  // };
}

async function getQrToken() {
  const url = "/barcode";
  // const res = await http.get(url);
  const result = { token: "asdlfkjdaslsmc;oepfonknvadlvj" };
  return result.token;
}

async function logoutPremiumUser(email) {
  const url = `/logout/premium_user/${email}`;
  const res = await http.get(url);

  // send here
  const result = {};
  return result;
}

async function newPremiumUser(email, password) {
  const url = "/add_premium_user";
  const res = await http.post(url, {
    user_to_add: {
      email: email,
      password: password,
      token: http.token,
    },
  });
  // send here
  /*
  {"id":10,"token":"cf87e092","email":"xx@aa.com"}
   */
  // const result = {};
  http.premiumId = res.id;
  return res.id;
}

async function setPricingPlan(pricingPlan) {
  const url = `/pricing/${pricingPlan}`;
  // const res = await http.post(url);

  const result = { accepted: true };
}

async function deletePremiumUser(email) {
  const url = "/delete_premium_user";
  const res = await http.delete(url);

  // send here
  const result = {};
  return result;
}

/* FREE USERS */

async function loginFreeUser(token) {
  const url = "/login/free";
  const res = await http.post(url + tokenParam(token));
  // send here
  const accepted = http.dummy ? true : res.token ? true : false;
  return accepted;
}

export const apiService = {
  loginPremiumUser,
  getQrToken,
  newPremiumUser,
  loginFreeUser,
  logoutPremiumUser,
  // status,
  userStatus,
  totalAvgSpeed,
  setPricingPlan,
};
