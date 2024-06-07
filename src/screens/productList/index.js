import { Text, View, FlatList } from "react-native";
import React, { useEffect, useContext, useRef } from "react";
import ProgressBar from "../../components/progress";
import { getProducts } from "../../api";
import Styles from "../../../assets/styles";
import { MemoizedComponent } from "../../components/listItem";
import { getAsyncData, getTotalPages, storeAsyncData } from "../../utils";
import { MemoizedHeader } from "../../components/header";
import { StateContext } from "../../hook/stateContext";
//animation
import {
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  Extrapolation,
} from "react-native-reanimated";

const ProductListScreen = () => {
  let isLoadMoreCalled = false;
  const [userInfo, setUserInfo] = useContext(StateContext);
  const initLoadCount = 8;
  const initialized = useRef(false);

  //animation
  const linear = useSharedValue(0);

  useEffect(() => {
    async function getData() {
      const lang = await getAsyncData("lang");
      const count = await getAsyncData("count");
      getProducts(lang).then((res) => {
        const apiRes = {
          data: res?.data,
          loading: false,
          total_products: res?.total_products,
        };
        //added logic for init load 8 items then every callback have to get another 4 items
        setUserInfo({
          ...userInfo,
          resData: apiRes,
          products: res?.data?.slice(0, initLoadCount),
          onRefresh: false,
          loading: false,
          isRtl: lang !== "en",
          page: 1,
          cartCount: count,
        });
      });
    }
    if (!initialized.current) {
      initialized.current = true;
      getData();
    }
  }, [userInfo.onRefresh]);

  const renderFooter = () => {
    return (
      <View>
        {userInfo?.isLoadMore && (
          <ProgressBar isLoading={true} showShadowBox={false} />
        )}
        {userInfo?.isListEnd && (
          <Text style={Styles.noMoreData}>
            {userInfo.isRtl
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
      userInfo.resData,
      loadCount,
      initLoadCount
    );
    if (userInfo?.page <= totalPages) {
      //added logic for init load 8 items then every callback have to get another 4 items
      const startVal = (userInfo?.page + 1) * loadCount;
      const endVal = (userInfo?.page + 2) * loadCount;
      const updatedArray = [
        ...userInfo.products,
        ...userInfo.resData?.data.slice(startVal, endVal),
      ];
      setTimeout(() => {
        setUserInfo({
          ...userInfo,
          products: updatedArray,
          isLoadMore: false,
          isListEnd: false,
          page: userInfo.page + 1,
        });
      }, 1000);
    } else {
      setUserInfo({
        ...userInfo,
        products: userInfo?.products,
        isLoadMore: false,
        isListEnd: true,
      });
    }
    isLoadMoreCalled = false;
  };

  const loadMore = () => {
    if (!isLoadMoreCalled) {
      isLoadMoreCalled = true;
      setUserInfo({
        ...userInfo,
        isLoadMore: true,
      });
      loadMoreUpdate();
    }
  };

  //console.log("res-called", userInfo);

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
        renderItem={({ item, index }) => (
          <MemoizedComponent
            data={item}
            onAddToCart={async () => {
              setUserInfo({
                ...userInfo,
                cartCount: userInfo?.cartCount + 1,
              });
              await storeAsyncData("count", userInfo?.cartCount + 1);
            }}
            isRtl={userInfo.isRtl}
            pos={index}
            page={userInfo.page}
            initLoad={userInfo.initLoad}
          />
        )}
        keyExtractor={() => Math.random().toString()}
        numColumns={2}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.2}
        onEndReached={() => loadMore()}
        onRefresh={() => {
          initialized.current = false;
          setUserInfo({
            ...userInfo,
            onRefresh: true,
            loading: false,
            products: [],
          });
        }}
        refreshing={userInfo.onRefresh}
      />
      {userInfo.loading && (
        <ProgressBar isLoading={true} showShadowBox={true} />
      )}
    </View>
  );
};

export default ProductListScreen;
