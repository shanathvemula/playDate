/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState } from "react";

const StateContext = createContext();

// Provider Component
export const StateProvider = ({ children }) => {
  const [tabs, setTabs] = useState("mybook");
  const [selectGroud, setSelectedGroud] = useState(null);

  const handlerTabs = useCallback(
    (tab) => {
      setTabs(tab);
    },
    [setTabs]
  );

  const handlerSelectedGround = useCallback(
    (ground) => {
      setSelectedGroud(ground);
    },
    [setSelectedGroud]
  );

  return (
    <StateContext.Provider
      value={{
        tabs,
        setTabs,
        selectGroud,
        setSelectedGroud,
        handlerSelectedGround,
        handlerTabs,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom Hook to Use Data Context
export const useStateContext = () => {
  return useContext(StateContext);
};
