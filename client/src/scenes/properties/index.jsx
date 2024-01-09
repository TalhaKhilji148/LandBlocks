import React, { useState,useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";   
import Header from "components/Header";
// import { useGetProductsQuery } from "state/api";
import { request } from "../../util/fetchApi.js";
import classes from "./property.module.css";

const Product = ({
  _id,
  currentOwner,
  desc,
  title,
  type,
  img,
  price,
  city,
  address,
  featured, // Add a prop to receive the isFeatured value from the backend
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
const [isFeatured, setIsFeatured] = useState(() => {
  const storedValue = localStorage.getItem(`property-${_id}`);
  return storedValue !== null ? storedValue === "true" : featured;
});
const handleToggleFeatured = async () => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const toggledValue = !isFeatured; // Toggle the local state
    console.log("Current isFeatured state:", isFeatured);
    console.log("Toggled value:", toggledValue);

    setIsFeatured(toggledValue);

    const requestData = {
      _id: _id,
      featured: toggledValue, // Use the toggled value
    };

    const response = await fetch(
      `http://localhost:4000/client/updatefeatured/${_id}`,
      {
        method: "PUT",
        headers: options.headers,
        body: JSON.stringify(requestData),
      }
    );

    console.log("Full Response:", response);

    if (response.status === 200) {
      const responseData = await response.json();
      console.log("Property updated :", responseData);
      console.log("Backend Response Featured:", responseData.featured);
      setIsFeatured(responseData.featured);
      localStorage.setItem(`property-${_id}`, String(toggledValue));
    } else {
      // If the request fails, revert the local state to the previous value
      setIsFeatured(!toggledValue);
      console.log("Server returned an error status code:", response.status);
    }
  } catch (error) {
    // If an error occurs, revert the local state to the previous value
    // setIsFeatured(!toggledValue);
    console.error("An error occurred:", error);
  }
};





  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <div style={{ position: "relative" }}>
          <Button
            size="large"
            onClick={handleToggleFeatured}
            sx={{
              position: "absolute",
              marginTop: "-12px",
              right: "0.5rem",
              fontSize: "32px", // Adjust font size as needed
              borderRadius: "8px", // Add border radius
              padding: "0.2rem 0.5rem", // Add padding
            }}
          >
            {isFeatured ? (
              <FaToggleOn color={theme.palette.secondary[200]} />
            ) : (
              <FaToggleOff />
            )}{" "}
            {/* Replace text with icon */}
          </Button>

          <p>Make it Featured?</p>

          <img src={img} className={classes.imgSize}></img>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[100]}
            gutterBottom
          >
            {type}
          </Typography>
          <Typography
            sx={{ mb: "1.5rem" }}
            color={theme.palette.secondary[100]}
          >
            {Number(price).toFixed(7)}eth
          </Typography>
          {/* <Rating value={title} readOnly /> */}

          <Typography variant="body2">{address}</Typography>
        </div>
      </CardContent>
      <CardActions>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Type of the Property : {type}</Typography>
          <Typography>City: {city}</Typography>
          <Typography>Description: {desc}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Properties = () => {
  // const { data, isLoading } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
   const [featuredProperties, setFeaturedProperties] = useState([]);
   

   useEffect(() => {
     
     
     // console.log("initial");
     const fetchFeatured = async () => {
       try {
         const data = await request("/client/find/", "GET");
         setFeaturedProperties(data);
         console.log("ttttttttttttttttttttt ", data);
       } catch (error) {
         console.error(error);
       }
     };
     fetchFeatured();
   }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Featured Properties" subtitle="See your list of featured properties." />
      {featuredProperties ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {featuredProperties?.map(
            ({ _id, currentOwner, title, type, img, price, city, address,desc }) => (
              <Product
                key={_id}
                _id={_id}
                currentOwner={currentOwner}
                title={title}
                img={img}
                price={price}
                type={type}
                city={city}
                desc={desc}
                address={address}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Properties;
