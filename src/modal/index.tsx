interface resProps {
  data: any;
  loading: boolean;
  total_products: any;
}

interface itemProps {
  id: number;
  title: string;
  images: any;
  currency: string;
  price_min: number;
  compare_at_price_min: number;
  tags: any;
  "offer-message": string;
}

interface listItemProps {
  data: itemProps;
  onAddToCart?: () => void;
  isRtl: boolean;
}
interface paginationProps {
  data: itemProps[];
  isLoadMore: boolean;
  isListEnd: boolean;
  page: number;
}

interface cartBtnProps {
  btnOnPress?: () => void;
  btnName: string;
}

export { resProps, itemProps, listItemProps, paginationProps, cartBtnProps };
