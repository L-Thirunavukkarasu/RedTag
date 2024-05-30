import React, { useState, createContext } from "react";

type userInfo = {
  selectedLang: string;
  cartCount: number;
};

const initUserInfo: userInfo = {
  selectedLang: "en",
  cartCount: 0,
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
