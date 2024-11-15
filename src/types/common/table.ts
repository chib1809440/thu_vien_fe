import { SxProps, Theme } from "@mui/material";
import React from "react";

export type TColumn<Data> = {
    id: Extract<keyof Data, string> | string;
    label: string;
    align?: "left" | "right" | "center";
    disablePadding?: "none" | "normal";
    render?: (value: Data) => React.ReactNode;
    sxColumn?: SxProps<Theme>;
    sxRow?: SxProps<Theme>;
};

export type TMenuOption = {
    label?: string;
    icon?: React.ReactNode | React.JSX.Element;
    onClick?: () => void;
    component?: React.ReactNode;
};
