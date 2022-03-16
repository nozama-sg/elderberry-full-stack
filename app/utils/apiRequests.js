let baseUrl = "http://119.13.104.214:80";
let tunnelUrl = "http://13ab-121-6-250-53.ngrok.io";
const axios = require("axios");
const { createRoutesFromChildren } = require("react-router-native");

// PROFILE
const tryLogin = async (username, password) => {
  try {
    let res = await axios.post(`${baseUrl}/users/authenticateCaregiver`, {
      username,
      password,
    });

    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const getUserInfo = async (username) => {
  try {
    let res = await axios.post(`${baseUrl}/users/getCaregiverProfile`, {
      username: username,
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    console.log("GET REPORT ERR:", e);
    return {
      success: false,
      data: e,
    };
  }
};

// DASHBOARD UPDATE
const getData = async (type, interval, userId, dateInp) => {
  const date = new Date().toISOString().slice(0, 10);
  const map = {
    D: "day",
    W: "week",
    M: "month",
    Y: "year",
  };

  try {
    let res = await axios.post(`${baseUrl}/${type}/${map[interval]}`, {
      userId: userId,
      date: `${date}`,
    });

    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const getLocation = async (userId) => {
  try {
    let response = await axios.post(`${baseUrl}/currentLocation`, {
      userId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const getAnomalies = async (userId) => {
  try {
    let response = await axios.post(`${baseUrl}/getAnomalies`, {
      userId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

// CHAT UPDATES
const getConvo = async (userId) => {
  try {
    let res = await axios.post(`${baseUrl}/getConversation`, {
      userId,
    });

    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const postVoiceMsg = async (userId, audio) => {
  try {
    let response = await axios.post(`${baseUrl}/recordedCaregiverMessage`, {
      userId,
      audio,
    });
    return {
      success: true,
      data: response,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const announceMessage = async (userId, text) => {
  try {
    let response = await axios.post(`${baseUrl}/announceMessage`, {
      userId: userId,
      text: text,
    });

    return {
      success: true,
      data: response,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const announceReminder = async (userId, medicine, timeToRemind) => {
  try {
    let response = await axios.post(`${tunnelUrl}/medicineReminder/new`, {
      userId: userId,
      medicine,
      time: timeToRemind,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const deleteReminder = async (medId) => {
  try {
    let response = await axios.post(`${tunnelUrl}/medicineReminder/delete`, {
      medicineReminderId: medId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const getAllMedReminders = async (userId) => {
  try {
    let response = await axios.post(`${tunnelUrl}/getAllMedicineReminders`, {
      userId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

// FOOD UPDATE
const getLastmeal = async (userId) => {
  try {
    let res = await axios.post(`${baseUrl}/food/lastMeal`, {
      userId,
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    console.log("GET REPORT ERR:", e);
    return {
      success: false,
      data: e,
    };
  }
};

const getDateMeal = async (
  userId,
  date = new Date().toISOString().slice(0, 10)
) => {
  try {
    let res = await axios.post(`${baseUrl}/food/date`, {
      userId,
      date,
    });
    return {
      success: true,
      data: res.data.map((e) => ({
        ...e,
        date: date,
      })),
    };
  } catch (e) {
    console.log("GET REPORT ERR:", e);
    return {
      success: false,
      data: e,
    };
  }
};

const deleteFood = async (foodId) => {
  try {
    let response = await axios.post(`${baseUrl}/food/deleteEntry`, {
      foodId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const editFoodGroup = async (foodId, correctFoodGroup) => {
  try {
    let response = await axios.post(`${baseUrl}/food/updateFoodGroup`, {
      foodId,
      correctFoodGroup,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

const addFood = async (mealId, foodName, correctFoodGroup) => {
  try {
    let response = await axios.post(`${baseUrl}/food/addFood`, {
      mealId,
      foodName,
      correctFoodGroup,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return {
      success: false,
      data: e,
    };
  }
};

// REPORT UPDATE
const getReport = async (userId) => {
  try {
    let res = await axios.post(`${baseUrl}/generateReport`, {
      userId,
    });

    console.log(res.data, "id");
    return {
      success: true,
      data: `http://119.13.104.214:80/getReport/${res.data.id}`,
    };
  } catch (e) {
    console.log("GET REPORT ERR:", e);
    return {
      success: false,
      msg: e,
    };
  }
};

const getMockReport = async () => {
  try {
    let res = await axios.get(`${baseUrl}/mockReport`);
    return {
      success: true,
      msg: `http://119.13.104.214:80/getReport/${res.data.id}`,
    };
  } catch (e) {
    console.log("GET REPORT ERR:", e);
    return {
      success: false,
      msg: e,
    };
  }
};

module.exports = {
  announceMessage,
  tryLogin,
  getData,
  getConvo,
  getReport,
  getUserInfo,
  getLastmeal,
  getDateMeal,
  postVoiceMsg,
  getLocation,
  deleteFood,
  editFoodGroup,
  addFood,
  getAnomalies,
  announceReminder,
  deleteReminder,
  getAllMedReminders,
  getMockReport,
};
