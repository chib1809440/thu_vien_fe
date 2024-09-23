import React from "react";
import { useTheme, styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

function TitleHeader({ title }: any) {
  return (
    <Typography
      component={"div" as any}
      gutterBottom
      style={{
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "20px",
        color: "#000000",
      }}
    >
      {title}
    </Typography>
  );
}

export default TitleHeader;
