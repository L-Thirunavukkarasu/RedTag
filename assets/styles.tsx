import { StyleSheet, Platform } from "react-native";
import * as Utils from "../src/utils";

export const gridItemWidth = Utils.getWidthByPercent(45);
const gridItemHeight =
  Platform.OS === "ios"
    ? Utils.getHeightByPercent(55)
    : Utils.getHeightByPercent(58);
export const gridItemImgHeight = Utils.getHeightByPercent(35);
const padding = Utils.getWidthByPercent(3.5);

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart: 0,
  },
  loaderContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  loaderBox: {
    height: 70,
    width: 70,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Utils.Colors.white_bg,
  },
  loaderView: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    marginHorizontal: padding,
  },
  item: {
    width: gridItemWidth,
    height: gridItemHeight,
    backgroundColor: Utils.Colors.white_bg,
    //padding: 20,
    marginEnd: padding,
    marginBottom: padding,
    borderRadius: padding,
  },
  itemCarousel: {
    width: "100%",
  },
  itemInfo: {
    paddingVertical: padding,
    paddingHorizontal: padding / 1.5,
  },
  itemImg: {
    width: gridItemWidth,
    height: gridItemImgHeight,
    borderRadius: padding,
  },
  shadow: {
    shadowColor: Utils.Colors.black_bg,
    shadowOffset: { width: 0, height: 0.3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "regular",
  },
  itemCurrency: {
    fontSize: 13,
    marginVertical: "4%",
    color: Utils.Colors.red_bg,
    fontWeight: "700",
  },
  itemPrice: {
    fontSize: 15,
    color: Utils.Colors.red_bg,
    fontWeight: "700",
  },
  itemComparePrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    color: Utils.Colors.black_bg,
    fontWeight: "normal",
  },
  itemOffer: {
    fontSize: 13,
    borderColor: Utils.Colors.red_bg,
    borderWidth: 0.5,
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    backgroundColor: Utils.Colors.offer_bg,
    borderStyle: "dotted",
  },
  noMoreData: {
    textAlign: "center",
    marginVertical: "3%",
  },
  btnAddToBag: {
    marginTop: "8%",
    borderRadius: 30,
    padding: 10,
    backgroundColor: Utils.Colors.black_bg,
    alignItems: "center",
  },
  btnAddTxt: {
    color: Utils.Colors.white_bg,
    fontWeight: "700",
    fontSize: 15,
  },
  txtStyleLTR: {
    textAlign: "left",
  },
  txtStyleRTL: {
    textAlign: "right",
  },
  //header component
  headerContainer: {
    left: 0,
    right: 0,
    marginVertical: "3%",
    marginTop: Platform?.OS === "ios" ? 0 : "7%",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 26,
    fontWeight: "700",
  },
  headerImg: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  headerCartCount: {
    fontSize: 13,
    width: 15,
    height: 15,
    textAlign: "center",
    color: Utils.Colors.white_bg,
    fontWeight: "700",
  },
  headerCount: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Utils.Colors.red_bg,
    borderRadius: 10,
    padding: 3,
  },
  langContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSwitch: {
    marginHorizontal: 5,
  },
  headerLTRDirection: {
    flexDirection: "row",
  },
  headerRTLDirection: {
    flexDirection: "row-reverse",
  },
  headerTitleLTR: {
    paddingEnd: "15%",
  },
  headerTitleRTL: {
    paddingStart: "15%",
  },
  loaderStyle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Styles;
