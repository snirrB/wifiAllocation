/* STATUSES */

async function status() {
  // send here
  const no_dog_resp = 0;
  const sql_resp = "DB is up and ready";
  const result = { "no dog status": no_dog_resp, db_status: sql_resp };
  return result;
}

async function userStatus(tokenToSend) {
  const url = "/login/free/";
  // send here
  const time_remaimning = "0000000000000000000000";
  const login_time = "0000000000000000000000";
  const current_speed = 0.0;
  const result = {
    time_remaimning: time_remaimning,
    login_time: login_time,
    current_speed: current_speed,
  };
  return result;
}

async function totalAvgSpeed(tokenToSend) {
  const url = "total_avg_spd";
  // send here
  const avg_time = 0;
  const result = `Average speed is ${avg_time}`;
  return Number(result.split(" ")[0]);
}

/* PREMIUM USERS */

async function loginPremiumUser(token, email, password) {
  const url = "/login/premium/";
  // send here
  const result = {
    token: "000000",
    email: "a@example.com",
  };
  return result;
}

async function getQrToken() {
  const result = { token: "asdlfkjdaslsmc;oepfonknvadlvj" };
  return result.token;
}

async function logoutPremiumUser(email) {
  const url = `/logout/premium_user/${email}`;
  // send here
  const result = {};
  return result;
}

async function newPremiumUser(token, email, password) {
  const url = "/add_premium_user";
  // send here
  const result = {};
  return result;
}

async function setPricingPlan(token, pricingPlan) {
  const url = `/pricing/${pricingPlan}`;
  const result = { accepted: true };
}

async function deletePremiumUser(token, email) {
  const url = "/delete_premium_user";
  // send here
  const result = {};
  return result;
}

/* FREE USERS */

async function loginFreeUser(token) {
  const url = "/login/free/";
  // send here
  const result = {};
  return result;
}

export const apiService = {
  loginPremiumUser,
  getQrToken,
  newPremiumUser,
  loginFreeUser,
  logoutPremiumUser,
  status,
  userStatus,
  totalAvgSpeed,
};
