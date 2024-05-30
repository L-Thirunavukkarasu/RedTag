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
import { resProps, itemProps, paginationProps } from "../../modal";

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
  const [resData, setResData] = useState(initRes);
  const [productList, setProductList] = useState(paginationRes);
  let isLoadMoreCalled = false;
  const [userInfo, setUserInfo] = useContext(StateContext);
  const [onRefresh, setOnRefresh] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const initLoadCount = 8;

  useEffect(() => {
    async function getData() {
      const lang = await getAsyncData("lang");
      getProducts(lang).then((res) => {
        const apiRes = {
          data: res?.data,
          loading: false,
          total_products: res?.total_products,
        };
        setResData(apiRes);
        //added logic for init load 8 items then every callback have to get another 4 items
        setProductList(
          generatePaginationRes(
            res?.data?.slice(0, initLoadCount),
            false,
            false,
            1
          )
        );
        onRefresh && setOnRefresh(false);
      });
    }
    getData();
  }, [onRefresh]);

  useEffect(() => {
    async function getData() {
      const lang = await getAsyncData("lang");
      setIsRtl(lang !== "en");
    }
    getData();
  }, []);

  const renderFooter = () => {
    return (
      <View>
        {productList?.isLoadMore && (
          <ProgressBar isLoading={true} showShadowBox={false} />
        )}
        {productList?.isListEnd && (
          <Text style={Styles.noMoreData}>
            {isRtl
              ? "لا مزيد من المنتجات في هذه اللحظة"
              : "No More products at this moment"}
          </Text>
        )}
      </View>
    );
  };

  const loadMoreUpdate = async () => {
    const loadCount = 4;
    const totalPages = await getTotalPages(resData, loadCount, initLoadCount);
    if (productList?.page <= totalPages) {
      //added logic for init load 8 items then every callback have to get another 4 items
      const startVal = (productList?.page + 1) * loadCount;
      const endVal = (productList?.page + 2) * loadCount;
      const updatedArray = [
        ...productList?.data,
        ...resData?.data.slice(startVal, endVal),
      ];
      setTimeout(() => {
        setProductList(
          generatePaginationRes(
            updatedArray,
            false,
            false,
            productList?.page + 1
          )
        );
      }, 1000);
    } else {
      setProductList(
        generatePaginationRes(productList?.data, false, true, productList?.page)
      );
      isLoadMoreCalled = false;
    }
  };

  useEffect(() => {
    if (productList.isLoadMore && !isLoadMoreCalled) {
      isLoadMoreCalled = true;
      loadMoreUpdate();
    }
  }, [productList.isLoadMore]);

  const loadMore = () => {
    const obj = {
      ...productList,
      isLoadMore: true,
    };
    setProductList(obj);
  };

  return (
    <View style={Styles.listContainer}>
      <Header data={userInfo} setUserInfo={setUserInfo} />
      <FlatList
        data={productList?.data}
        extraData={productList?.data}
        renderItem={({ item }) => (
          <MemoizedComponent
            data={item}
            onAddToCart={async () => {
              setUserInfo({
                ...userInfo,
                cartCount: userInfo?.cartCount + 1,
              });
              await storeAsyncData("count", userInfo?.cartCount + 1);
            }}
            isRtl={isRtl}
          />
        )}
        keyExtractor={() => Math.random().toString()}
        numColumns={2}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.2}
        onEndReached={() => loadMore()}
        onRefresh={() => {
          setOnRefresh(true);
          const onRefreshRes: resProps = {
            ...initRes,
            loading: false,
          };
          setResData(onRefreshRes);
          setProductList(paginationRes);
        }}
        refreshing={onRefresh}
      />
      {resData.loading && (
        <ProgressBar isLoading={resData.loading} showShadowBox={true} />
      )}
    </View>
  );
};

export default ProductListScreen;
