import { Text, View } from "react-native";
import React, { memo } from "react";
import { listItemProps } from "../../modal";
import Styles from "../../../assets/styles";
import { MemoizedFastImage } from "../fastImageView";
import { gridItemWidth, gridItemImgHeight } from "../../../assets/styles";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import Btn from "../btn";

const ListItem = ({ data, onAddToCart, isRtl }: listItemProps) => {
  const keyId = Math.random();
  const arrayOfObjects = Object.keys(data?.images).map(
    (key) => data?.images[key]
  );

  const baseOptions = {
    vertical: false,
    width: gridItemWidth,
    height: gridItemImgHeight,
  } as const;

  const scrollOffsetValue = useSharedValue<number>(0);
  const txtStyle = isRtl ? Styles.txtStyleRTL : Styles.txtStyleLTR;

  return (
    <View key={`${keyId}`} style={[Styles.item, Styles.shadow]}>
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
          {data?.title}
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
    </View>
  );
};

export const MemoizedComponent = memo(ListItem);