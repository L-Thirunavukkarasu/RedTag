import React, { useState, createContext } from "react";
import { itemProps } from "../../modal";

const initUserInfo = {
  selectedLang: "en",
  cartCount: 0,
  products: [],
};

//invoke and export createcontext component
export const StateContext = createContext(initUserInfo);

export const StateProvider = (props) => {
  const [userInfo, setUserInfo] = useState(initUserInfo);

  return (
    <StateContext.Provider value={[userInfo, setUserInfo]}>
      {props.children}
    </StateContext.Provider>
  );
};
