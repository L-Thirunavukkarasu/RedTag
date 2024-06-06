import { ActivityIndicator, View, Image } from "react-native";
import React, { useState, memo } from "react";
import FastImage from "react-native-fast-image";
import * as Helper from "../../utils";
import Styles from "../../../assets/styles";

const FastImageView = (props) => {
  const { url, style } = props;

  const [isLoading, setLoading] = useState(true);

  function onLoadStart() {
    setLoading(true);
  }

  function onLoadEnd() {
    setLoading(false);
  }

  function onError() {
    setLoading(false);
  }

  return (
    <View>
      {url !== "" ? (
        <FastImage
          fallback={true}
          onError={onError}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          style={style}
          source={{
            uri: url,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.cover}
          defaultSource={props?.defaultSrc ? props.defaultSrc : ""}
        />
      ) : (
        <Image
          source={
            props?.defaultSrc
              ? props.defaultSrc
              : require("../../../assets/icon.png")
          }
          style={style}
        />
      )}
      {isLoading && url !== "" && (
        <ActivityIndicator
          style={[style, Styles.loaderStyle]}
          size={17}
          color={Helper.Colors.item_blank_bg}
        />
      )}
    </View>
  );
};

export const MemoizedFastImage = memo(FastImageView);
