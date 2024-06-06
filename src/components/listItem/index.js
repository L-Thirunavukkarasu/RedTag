import { Text, View } from "react-native";
import React, { memo } from "react";
import { listItemProps } from "../../modal";
import Styles from "../../../assets/styles";
import { MemoizedFastImage } from "../fastImageView";
import { gridItemWidth, gridItemImgHeight } from "../../../assets/styles";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import Btn from "../btn";
import { MotiView } from "moti";

const ListItem = ({ data, onAddToCart, isRtl, pos, page, initLoad }) => {
  const keyId = Math.random();
  const arrayOfObjects = Object.keys(data?.images).map(
    (key) => data?.images[key]
  );

  const baseOptions = {
    vertical: false,
    width: gridItemWidth,
    height: gridItemImgHeight,
  };

  const scrollOffsetValue = useSharedValue(0);
  const txtStyle = isRtl ? Styles.txtStyleRTL : Styles.txtStyleLTR;
  //console.log("ressss", page);

  return (
    <MotiView
      key={`${keyId}`}
      style={[Styles.item, Styles.shadow]}
      from={initLoad ? { opacity: 0, translateY: 50 } : {}}
      animate={initLoad ? { opacity: 1, translateY: 0 } : {}}
      transition={initLoad ? { delay: pos * 200 } : {}}
    >
      <Carousel
        {...baseOptions}
        loop
        enabled
        defaultScrollOffsetValue={scrollOffsetValue}
        testID={`${keyId}`}
        style={Styles.itemCarousel}
        autoPlay={true}
        autoPlayReverse={isRtl}
        autoPlayInterval={3000}
        data={arrayOfObjects}
        pagingEnabled={true}
        renderItem={({ item }) => {
          return <MemoizedFastImage url={item} style={Styles.itemImg} />;
        }}
      />
      <View style={Styles.itemInfo}>
        <Text numberOfLines={2} style={[Styles.itemName, txtStyle]}>
          {data?.title + pos}
        </Text>
        <Text numberOfLines={1} style={[Styles.itemCurrency, txtStyle]}>
          {data?.currency}
          <Text numberOfLines={1} style={Styles.itemPrice}>
            {` ${data?.price_min?.toFixed(2)} `}
            <Text numberOfLines={1} style={Styles.itemComparePrice}>
              {data?.compare_at_price_min}
            </Text>
          </Text>
        </Text>
        <Text numberOfLines={1} style={[Styles.itemOffer, txtStyle]}>
          {data["offer-message"]}
        </Text>
        <Btn
          btnOnPress={onAddToCart}
          btnName={isRtl ? "أضف الى الحقيبة" : "ADD TO BAG"}
        />
      </View>
    </MotiView>
  );
};

export const MemoizedComponent = memo(ListItem);
