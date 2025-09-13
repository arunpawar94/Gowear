import { Grid2 as Grid, styled, Button, Box } from "@mui/material";
import { primaryColor } from "../config/colors";
import CartBox from "./CartBox";
import CartBoxSkeleton from "./CartBoxSkeleton";
import GradientCircularProgress from "./GradientCircularProgress";
import configJSON from "./config";
import { useEffect, useState } from "react";
import axios from "axios";

const base_url = process.env.REACT_APP_API_URL;

interface ColorsInterface {
  name: string;
  images: { imgUrl: string }[];
  sizes: { name: string; quantity: number }[];
}

type GetProductsResp = {
  name: string;
  description: string;
  categorie: "men" | "women";
  subCategorie: "topwear" | "bottomwear";
  price: number;
  mrp: number;
  discount: number;
  colors: ColorsInterface[];
};

export default function CartBoxContainer() {
  const [products, setProducts] = useState<GetProductsResp[]>([]);
  const [isProductsFetched, setIsProductsFetched] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, [page]);

  const getProducts = () => {
    axios
      .get(`${base_url}/products/show_products`, {
        params: {
          per_page: 20,
          page,
        },
      })
      .then((response) => {
        const productsShow = response.data.data;
        setProducts((prevState) => [...prevState, ...productsShow]);
        setIsProductsFetched(true);
        setTotalPages(response.data.metadata.totalPages);
        setMoreLoading(false);
      })
      .catch((_error) => {
        setIsProductsFetched(true);
        setMoreLoading(false);
      });
  };

  const handleMoreViewClick = () => {
    setPage((prevState) => prevState + 1);
    setMoreLoading(true);
  };

  const handleCartProductDetail = (product: GetProductsResp) => {
    let imageUrl = "";
    product.colors.forEach((item) => {
      const checkAvailability = item.sizes.some(
        (sizeItem) => sizeItem.quantity > 0
      );
      if (checkAvailability) {
        imageUrl = item.images[0].imgUrl;
      }
    });
    const dataObject = {
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      discount: product.discount,
      imageUrl,
    };
    return dataObject;
  };
  return (
    <GridBox>
      <Grid container spacing={3}>
        {isProductsFetched ? (
          <>
            {products.map((item, index) => (
              <Grid size={{ xs: 12, sm: 4, md: 3, lg: 2.4 }} key={index}>
                <CartBox product={handleCartProductDetail(item)} />
              </Grid>
            ))}
          </>
        ) : (
          <>
            {Array(10)
              .fill(null)
              .map((_item, index) => (
                <Grid size={{ xs: 12, sm: 4, md: 3, lg: 2.4 }} key={index}>
                  <CartBoxSkeleton />
                </Grid>
              ))}
          </>
        )}
      </Grid>
      {products.length > 0 && page < totalPages && (
        <AddButton onClick={handleMoreViewClick}>
          {moreLoading ? (
            <GradientCircularProgress size={20} margin="2px 24px" />
          ) : (
            configJSON.viewMore
          )}
        </AddButton>
      )}
    </GridBox>
  );
}

const AddButton = styled(Button)({
  background: primaryColor,
  color: "#fff",
  textTransform: "none",
});

const GridBox = styled(Box)({
  maxWidth: "85%",
  margin: "20px auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "25px",
  "@media (max-width: 900px)": {
    maxWidth: "100%",
    margin: "20px",
  },
});
