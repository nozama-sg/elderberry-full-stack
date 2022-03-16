const login = (state, action) => {
  return {
    ...state,
    login: true,
    userInfo: {
      name: action.payload.name,
      userId: action.payload.userId,
      elderlyId: action.payload.elderlyId,
    },
    elderlyInfo: {
      ...action.payload.elderlyInfo,
    },
  };
};

const updateElderlyInfo = (state, action) => {
  return {
    ...state,
    elderlyInfo: {
      ...state.elderlyInfo,
      [action.payload.key]: action.payload.data,
    },
  };
};

export { login, updateElderlyInfo };
