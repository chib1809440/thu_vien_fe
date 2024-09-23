import { memo } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Button,
  Avatar,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  linearProgressClasses,
} from "@mui/material";


// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 30,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.dark.light : "#fff",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.primary.dark
        : theme.palette.primary.main,
  },
}));

const CardStyle = styled(Card)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? theme.palette.dark.main
      : "#1F3D8B",
  marginBottom: "22px",
  overflow: "hidden",
  position: "fixed",
  bottom: "30px",
  left: "14px",
  display: "block",
  width: "234px",
  height: "233px",
}));

interface LinearProgressWithLabelProps {
  value: number;
}

const send = () => {
  window.open("https://gov.tss.org.vn/");
}

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({
}: LinearProgressWithLabelProps) {
  const theme = useTheme();

  return (
    <Grid container direction="column" spacing={1} sx={{
      mt: 1.5,
      background:
        theme.palette.mode === "dark"
          ? theme.palette.dark.main
          : "#1F3D8B",
    }}>
      <Grid item>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.dark.light
                    : "#CBD0F8",
              }}
            >
              Nếu nhận thấy tài khoản có dấu hiệu bất thường, liên hệ ngay Bộ phận CSKH GD VIỆT NAM
            </Typography>
          </Grid>

        </Grid>
      </Grid>
      <Button sx={{
        textAlign: 'center',
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.light : "#fff",
        color: "#1F3D8B",
        marginTop: "50px"
      }} onClick={send}>Gửi yêu cầu</Button>
    </Grid>
  );
}

// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
  const theme = useTheme();

  return (
    <CardStyle>
      <CardContent sx={{ p: 2 }}>
        <List sx={{ p: 0, m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    textAlign: 'center',
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.dark.light
                        : "#fff",
                  }}
                >
                  Chăm sóc khách hàng
                </Typography>
              }
            />
          </ListItem>
        </List>
        <LinearProgressWithLabel value={80} />
      </CardContent>

    </CardStyle>
  );
};

export default memo(MenuCard);
