import { Text, View, FlatList } from "react-native";
import React, { useState, useEffect, useContext } from "react";
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
import Header from "../../components/header";
import { StateContext } from "../../hook/stateContext";
import {
  resProps,
  itemProps,
  paginationProps,
  productsProps,
} from "../../modal";

const ProductListScreen = () => {
  const products: itemProps[] = [];
  const initRes: resProps = {
    data: products,
    loading: true,
    total_products: 0,
  };
  const paginationRes: paginationProps = {
    data: products,
    isLoadMore: false,
    isListEnd: false,
    page: 1,
  };
  const listObj: productsProps = {
    resData: initRes,
    productList: paginationRes,
    isRtl: false,
    onRefresh: false,
  };
  let isLoadMoreCalled = false;
  const [userInfo, setUserInfo] = useContext(StateContext);
  const [listPageState, setListPageState] = useState(listObj);
  const initLoadCount = 8;
  let cll = 0;

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
        const obj: productsProps = {
          resData: apiRes,
          productList: products,
          isRtl: listPageState.isRtl && lang !== "en",
          onRefresh: listPageState.onRefresh && false,
        };
        setListPageState(obj);
      });
    }
    getData();
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
      const newArray = listPageState.resData?.data.slice(startVal, endVal);
      const updatedArray = [
        ...listPageState.productList?.data,
        ...listPageState.resData?.data.slice(startVal, endVal),
      ];

      const products = generatePaginationRes(
        updatedArray,
        false,
        false,
        listPageState.productList?.page + 1
      );
      // setTimeout(() => {
      //   const obj: productsProps = {
      //     ...listPageState,
      //     productList: products,
      //   };
      await newArray?.map((item: any) => {
        listPageState.productList.data.push(item);
      });

      //setListPageState(obj);
      // }, 1000);
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
  cll = cll + 1;
  console.log("res-called", cll);

  return (
    <View style={Styles.listContainer}>
      <Header data={userInfo} setUserInfo={setUserInfo} />
      <FlatList
        data={listPageState.productList?.data}
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
            }}
            isRtl={listPageState.isRtl}
            pos={index}
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
