import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { cartBtnProps } from "../../modal";
import Styles from "../../../assets/styles";

const Btn = ({ btnOnPress, btnName }) => {
  return (
    <TouchableOpacity onPress={btnOnPress} style={Styles.btnAddToBag}>
      <Text style={Styles.btnAddTxt}>{btnName}</Text>
    </TouchableOpacity>
  );
};

export default Btn;
