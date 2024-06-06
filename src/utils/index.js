import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const screenWidth = width,
  screenHeight = height;

const getWidthByPercent = (percent) => {
  return (screenWidth * percent) / 100;
};
const getHeightByPercent = (percent) => {
  return (screenHeight * percent) / 100;
};

const Colors = {
  black_bg: "#151515",
  item_blank_bg: "#D9D9D9",
  btn_bg: "#444444",
  offer_bg: "#fbe6e6",
  logo_bg_light: "#f9d6d4",
  white_bg: "#ffffff",
  red_bg: "#E33614",
  switch_track_selected: "#81b0ff",
  switch_track_unselected: "#767577",
  switch_thumb_clr: "#f4f3f4",
};

const storeAsyncData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);

    // Update authentication state if auth data changes
  } catch (e) {
    // saving error
    console.log("res-async-save-err", e);
  }
};

const getAsyncData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log("res-async-get-err", e);
  }
};

const generatePaginationRes = (res, isLoadMore, isListEnd, page) => {
  return {
    data: res,
    isLoadMore,
    isListEnd,
    page,
  };
};

const getTotalPages = async (res, divideVal, initLoadCount) => {
  return await Math.ceil((res?.data?.length - initLoadCount) / divideVal);
};

export {
  Colors,
  screenWidth,
  screenHeight,
  getWidthByPercent,
  getHeightByPercent,
  storeAsyncData,
  getAsyncData,
  generatePaginationRes,
  getTotalPages,
};
