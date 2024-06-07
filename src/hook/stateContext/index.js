import React, { useState, createContext } from "react";

const initUserInfo = {
  selectedLang: "en",
  cartCount: 0,
  products: [],
  onRefresh: false,
  loading: true,
  isLoadMore: false,
  isListEnd: false,
  page: 1,
  resData: [],
  isRtl: false,
  initLoad: false,
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
