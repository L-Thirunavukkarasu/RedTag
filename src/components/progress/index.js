import { View, ActivityIndicator } from "react-native";
import React from "react";
import Styles from "../../../assets/styles";
import { Colors } from "../../utils";

const ProgressBar = (props) => {
  return (
    <View style={props?.showShadowBox ? Styles.loaderContainer : Styles.loader}>
      <View
        style={
          props?.showShadowBox
            ? [Styles.loaderBox, Styles.shadow]
            : Styles.loaderView
        }
      >
        <ActivityIndicator
          animating={props?.isLoading}
          color={Colors.black_bg}
          size={35}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
