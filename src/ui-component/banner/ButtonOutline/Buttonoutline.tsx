import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
interface PropButton {
  title: string;
  color: string;
  variant: any;
  bg: string;
  border?: string;
}
function Buttonoutline({ title, color, variant, bg, border }: PropButton) {
  return (
    <Button
      variant={variant}
      style={{
        background: `${bg}`,
        color: `${color}`,
        borderRadius: "8px",
        border: `1px solid ${border}`,
        textTransform: "inherit",
      }}
    >
      {title}
    </Button>
  );
}

export default Buttonoutline;
