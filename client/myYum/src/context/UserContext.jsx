// src/context/UserContext.jsx
import React, { createContext, useReducer, useContext } from "react";

const UserContext = createContext();

const initialState = {
  userId: null, // Default user ID - hardcoded for now
  username: null, // Default username - hardcoded for now
  // meals: [],
};

function userReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, userId: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "ADD_MEAL":
      return { ...state, meals: [...state.meals, action.payload] };
    case "LOGOUT":
      return { ...state, userId: null, username: null };

    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
