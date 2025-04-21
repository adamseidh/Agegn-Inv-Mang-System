import React, { createElement } from "react";
import { Card, Box, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const CardWithIcon = ({
  icon,
  title,
  subtitle,
  link,
  passedColor,
  children,
}) => {
  // Format the subtitle as a number with thousands separators
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <Card
      style={{
        minHeight: 52,
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Link
        to={link ? link : "#"}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            style={{ width: "3em", color: "secondary.main" }}
            className="icon"
          >
            {createElement(icon, { fontSize: "large" })}
          </Box>
          <Box style={{ textAlign: "right" }}>
            <Typography color="textSecondary">{title}</Typography>
            <Typography variant="h5" component="h2" color={passedColor}>
              {subtitle ? formatNumber(subtitle) : ""}
            </Typography>
          </Box>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              height: "200%",
              width: "200%",
              transform: "translate(-30%, -60%)",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.15)", // Replace secondary.main opacity equivalent
            }}
          ></div>
        </Box>
      </Link>
      {children && <Divider />}
      {children}
    </Card>
  );
};

export default CardWithIcon;
