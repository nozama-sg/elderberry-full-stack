let initState = {
  login: false,
  userInfo: {
    name: "",
    userId: "",
    username: "",
    elderlyId: "",
    password: "",
  },
  elderlyInfo: {},
  heartData: {
    D: [],
    W: [],
    M: [],
    Y: [],
  },
  sleepData: {
    D: [],
    W: [],
    M: [],
    Y: [],
  },
  stepData: {
    D: [],
    W: [],
    M: [],
    Y: [],
  },
  locationData: {
    current: {
      room: "",
      timeSpent: "",
    },
  },
  lastMealData: {
    loaded: false,
  },
  chat: [],
  anomalies: {
    loaded: false,
  },
};

export default initState;
