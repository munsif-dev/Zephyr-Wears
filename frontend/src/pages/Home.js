import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      <HorizontalCardProduct
        category={"crew-neck"}
        heading={"Top's T-Shirts"}
      />
      <HorizontalCardProduct
        category={"collar"}
        heading={"Popular's Collar T-Shirts"}
      />

      <VerticalCardProduct category={"sports"} heading={"Sports Collection"} />
      <VerticalCardProduct category={"black"} heading={"Black Collections"} />
      <VerticalCardProduct category={"bi-color"} heading={"Televisions"} />
      <VerticalCardProduct
        category={"hoodie"}
        heading={"Best Comfotable Hoodies"}
      />
      <VerticalCardProduct category={"Sweater"} heading={"Beautiful Sweaters"} />
      <VerticalCardProduct
        category={"universal"}
        heading={"Universal Color Collections"}
      />
      <VerticalCardProduct category={"tank-top"} heading={"Tank-Tops"} />
      <VerticalCardProduct category={"Moose"} heading={"New Moose Collections"} />
    </div>
  );
};

export default Home;
