import { Text, View, Switch, ImageBackground } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { getAsyncData, storeAsyncData, Colors } from "../../utils";
import * as Updates from "expo-updates";
import Styles from "../../../assets/styles";
import Animated, { Easing } from "react-native-reanimated";
import { MotiView } from "moti";

const Header = ({ data, setUserInfo, animStyle }: any) => {
  const [isEnabled, setIsEnabled] = useState(data?.selectedLang !== "en");
  const [cartCount, setCartCount] = useState(data?.cartCount);
  const toggleSwitch = async () => {
    const selectedLang = !isEnabled ? "ar" : "en";
    setUserInfo({
      ...data,
      selectedLang,
    });
    await storeAsyncData("lang", selectedLang);
    Updates.reloadAsync();
  };

  useEffect(() => {
    async function getData() {
      const lang = await getAsyncData("lang");
      const count = await getAsyncData("count");
      setIsEnabled(lang !== "en");
      setCartCount(count);
    }
    getData();
  }, [data?.cartCount, cartCount]);

  const containerStyle = isEnabled
    ? Styles.headerRTLDirection
    : Styles.headerLTRDirection;
  const titleStyle = isEnabled ? Styles.headerTitleRTL : Styles.headerTitleLTR;
  return (
    <View style={[Styles.headerContainer, containerStyle]}>
      <View style={Styles.langContainer}>
        <Text>EN</Text>
        <Switch
          trackColor={{
            false: Colors.switch_track_unselected,
            true: Colors.switch_track_selected,
          }}
          thumbColor={Colors.switch_thumb_clr}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={Styles.headerSwitch}
        />
        <Text>AR</Text>
      </View>

      <Text style={[Styles.headerTitle, titleStyle]}>
        {isEnabled ? "منتجات" : "Products"}
      </Text>
      <View>
        <ImageBackground
          source={require("../../../assets/images/shopping_bag.png")}
          resizeMode="cover"
          style={Styles.headerImg}
        >
          <MotiView
            key={`${animStyle}`}
            style={[Styles.headerCount, animStyle]}
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
          >
            <Text style={Styles.headerCartCount}>
              {cartCount > 9
                ? `9+`
                : cartCount != null && cartCount != undefined
                ? cartCount
                : 0}
            </Text>
          </MotiView>
        </ImageBackground>
      </View>
    </View>
  );
};

export const MemoizedHeader = memo(Header);
