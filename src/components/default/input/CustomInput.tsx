import {
  OutlinedInput,
  OutlinedInputProps,
  Theme,
  styled,
  useTheme,
} from "@mui/material";
import useConfig from "../../../hooks/useConfig";

// Define the styled component props type
interface MainStyleProps extends OutlinedInputProps {
  borderRadius: number;
}
// Create the styled component
const InputRoot = styled(OutlinedInput)<MainStyleProps>(({ theme, borderRadius }) => ({
  width: '100%',
  borderRadius: `${borderRadius}px`,
  color: theme.palette.grey[400],
  '& .MuiOutlinedInput-notchedOutline': {
    border: `2px solid ${theme.palette.grey[300]}`,
    // backgroundColor: theme.palette.background.paper,
    color: `${theme.palette.grey[400]} !important`
  },

  '&:hover $notchedOutline': {
    borderColor: theme.palette.primary.light,
  },
  '&.MuiInputBase-multiline': {
    padding: 1,
  }
}))
const CustomInput = ({ ...props }) => {
  const { borderRadius } = useConfig()
  const theme = useTheme()
  return <InputRoot notched={false} borderRadius={borderRadius} theme={theme} {...props} />
}
export default CustomInput
