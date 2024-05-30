import axios from "axios";

const getProducts = async (lang: any) => {
  const url = `https://shopifyapptst1.bma.ae/react-native-exercise/?lang=${lang}`;
  const response = await axios.get(url);
  const res = {
    data: response?.data?.data?.products ? response?.data?.data?.products : [],
    total_products: response?.data?.data?.total_product
      ? response?.data?.data?.total_product
      : 0,
  };
  return res;
};

export { getProducts };
