import SendIcon from '@mui/icons-material/Send';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import { dispatch, useSelector } from '../../../store';
import { getContactSchoolWaiting } from '../../../store/slices/contactSchool';
import ButtonGD from "../../../ui-component/ButtonGD";
import MainCard from "../../../ui-component/cards/MainCard";
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import CreateAccount from "./components/formInput";
import UpdateAccount from "./components/formUpdate";
import EnhancedTable from "./components/tableAccount";
import { useDeleteUser } from "./hook/deleteUser";
import Invoice from "./printCode";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  data: any;
}) {



  return (
    <>

    </>


  );
}
