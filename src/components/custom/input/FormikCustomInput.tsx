import { FormControl, FormHelperText, Typography } from "@mui/material";
import CustomInput from "../../default/input/CustomInput";

export default function FormikCustomInput({ ...props }) {
  return (
    <FormControl fullWidth error={Boolean(props.touched && props.errors)}>
      <Typography variant="body2" pb={1}>{props.label}</Typography>
      <CustomInput
        type={props.type}
        value={props.value}
        name={props.name}
        {...props}
      />
      {props.touched && props.errors && (
        <FormHelperText error>{props.errors.toString()}</FormHelperText>
      )}
    </FormControl>
  );
}