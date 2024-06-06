import React, { useState, createContext } from "react";
import { itemProps } from "../../modal";

type userInfo = {
  selectedLang: string;
  cartCount: number;
  products: itemProps[];
};

const initUserInfo: userInfo = {
  selectedLang: "en",
  cartCount: 0,
  products: [],
};

//invoke and export createcontext component
export const StateContext = createContext<userInfo>(initUserInfo);

export const StateProvider = (props: any) => {
  const [userInfo, setUserInfo] = useState(initUserInfo);

  return (
    <StateContext.Provider value={[userInfo, setUserInfo]}>
      {props.children}
    </StateContext.Provider>
  );
};
