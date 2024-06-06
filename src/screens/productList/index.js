import { Text, View, FlatList } from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import ProgressBar from "../../components/progress";
import { getProducts } from "../../api";
import Styles from "../../../assets/styles";
import { MemoizedComponent } from "../../components/listItem";
import {
  generatePaginationRes,
  getAsyncData,
  getTotalPages,
  storeAsyncData,
} from "../../utils";
import { MemoizedHeader } from "../../components/header";
import { StateContext } from "../../hook/stateContext";
import {
  resProps,
  itemProps,
  paginationProps,
  productsProps,
} from "../../modal";
//animation
import Animated, {
  Easing,
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";

const ProductListScreen = () => {
  const products = [];
  const initRes = {
    data: products,
    loading: true,
    total_products: 0,
  };
  const paginationRes = {
    data: products,
    isLoadMore: false,
    isListEnd: false,
    page: 1,
  };
  const listObj = {
    resData: initRes,
    productList: paginationRes,
    isRtl: false,
    onRefresh: false,
    initLoad: true,
  };
  let isLoadMoreCalled = false;
  const [userInfo, setUserInfo] = useContext(StateContext);
  const [listPageState, setListPageState] = useState(listObj);
  const initLoadCount = 8;
  const initialized = useRef(false);
  var listProducts = [];

  //animation
  const { Value, timing } = Animated;
  const highlightAnimationValue = useSharedValue(0);
  const highlightAnimationValue1 = withTiming(0);
  const linear = useSharedValue(0);

  useEffect(() => {
    async function getData() {
      const lang = await getAsyncData("lang");
      getProducts(lang).then((res) => {
        const apiRes = {
          data: res?.data,
          loading: false,
          total_products: res?.total_products,
        };
        //added logic for init load 8 items then every callback have to get another 4 items
        const products = generatePaginationRes(
          res?.data?.slice(0, initLoadCount),
          false,
          false,
          1
        );
        const obj = {
          resData: apiRes,
          productList: products,
          isRtl: lang !== "en",
          onRefresh: listPageState.onRefresh && false,
          initLoad: false,
        };
        listProducts = products.data;
        console.log("use", listProducts);
        setUserInfo({
          ...userInfo,
          products: products.data,
        });
        listPageState?.initLoad && setListPageState(obj);
      });
    }
    if (!initialized.current) {
      initialized.current = true;
      getData();
    }
  }, []);

  const renderFooter = () => {
    return (
      <View>
        {listPageState.productList?.isLoadMore && (
          <ProgressBar isLoading={true} showShadowBox={false} />
        )}
        {listPageState.productList?.isListEnd && (
          <Text style={Styles.noMoreData}>
            {listPageState.isRtl
              ? "لا مزيد من المنتجات في هذه اللحظة"
              : "No More products at this moment"}
          </Text>
        )}
      </View>
    );
  };

  const loadMoreUpdate = async () => {
    const loadCount = 4;
    const totalPages = await getTotalPages(
      listPageState.resData,
      loadCount,
      initLoadCount
    );
    if (listObj.productList?.page <= totalPages) {
      //added logic for init load 8 items then every callback have to get another 4 items
      const startVal = (listPageState.productList?.page + 1) * loadCount;
      const endVal = (listPageState.productList?.page + 2) * loadCount;
      const updatedArray = [
        ...listPageState.productList.data,
        ...listPageState.resData?.data.slice(startVal, endVal),
      ];
      listProducts = [
        ...listProducts,
        ...listPageState.resData?.data.slice(startVal, endVal),
      ];
      const products = generatePaginationRes(
        updatedArray,
        false,
        false,
        listPageState.productList?.page + 1
      );
      console.log("res---", updatedArray, products);

      setTimeout(() => {
        const obj: productsProps = {
          ...listPageState,
          productList: products,
        };
        setUserInfo({
          ...userInfo,
          products: products.data,
        });
        setListPageState(obj);
      }, 1000);
    } else {
      isLoadMoreCalled = false;
      const products = generatePaginationRes(
        listPageState.productList?.data,
        false,
        true,
        listPageState.productList?.page
      );
      const obj: productsProps = {
        ...listPageState,
        productList: products,
      };
      setListPageState(obj);
    }
  };

  useEffect(() => {
    if (listPageState.productList.isLoadMore && !isLoadMoreCalled) {
      isLoadMoreCalled = true;
      loadMoreUpdate();
    }
  }, [listPageState.productList.isLoadMore]);

  const loadMore = () => {
    const obj = {
      ...listPageState.productList,
      isLoadMore: true,
    };
    const finalObj = {
      ...listPageState,
      productList: obj,
    };
    setListPageState(finalObj);
  };

  //animation
  const startHighlightAnimation = () => {
    // withTiming(highlightAnimationValue1, {
    //   toValue: 1,
    //   duration: 500, // Adjust duration as needed
    //   easing: Easing.inOut(Easing.ease),
    // })

    withTiming(linear.value, {
      duration: 1000,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
  };

  console.log("res-called", userInfo);

  // const animStyle = {
  //   transform: [
  //     {
  //       scale: highlightAnimationValue.interpolate({
  //         inputRange: [0, 0.5, 1],
  //         outputRange: [1, 1.2, 1],
  //       }),
  //     },
  //   ],
  // };
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      linear.value,
      [0, 0.5, 1],
      [1, 1.2, 1],
      Extrapolation.EXTEND
    ),
  }));

  return (
    <View style={Styles.listContainer}>
      <MemoizedHeader
        data={userInfo}
        setUserInfo={setUserInfo}
        animStyle={animatedStyle}
      />
      <FlatList
        data={userInfo.products}
        //extraData={listPageState.productList?.data}
        renderItem={({ item, index }) => (
          <MemoizedComponent
            data={item}
            onAddToCart={async () => {
              setUserInfo({
                ...userInfo,
                cartCount: userInfo?.cartCount + 1,
              });
              await storeAsyncData("count", userInfo?.cartCount + 1);
              //startHighlightAnimation();
            }}
            isRtl={listPageState.isRtl}
            pos={index}
            page={listPageState.productList.page}
            initLoad={listPageState.initLoad}
          />
        )}
        keyExtractor={() => Math.random().toString()}
        numColumns={2}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.2}
        onEndReached={() => loadMore()}
        onRefresh={() => {
          const obj = {
            ...listPageState,
            onRefresh: true,
            loading: false,
          };
          setListPageState(obj);
        }}
        refreshing={listPageState.onRefresh}
      />
      {listPageState.resData.loading && (
        <ProgressBar
          isLoading={listPageState.resData.loading}
          showShadowBox={true}
        />
      )}
    </View>
  );
};

export default ProductListScreen;
