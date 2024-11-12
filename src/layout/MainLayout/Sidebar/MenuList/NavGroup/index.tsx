import { ReactNode, useMemo } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { List, Typography } from "@mui/material";

// project imports
import NavItem from "../NavItem";
import NavCollapse from "../NavCollapse";
import { GenericCardProps } from "../../../../../types";
import { Permission } from "../../../../../interfaces/role";
import { hasPermission } from "../../../../../helpers/hasPermission";
import { useAuth } from "../../../../../contexts/JWTContext";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

export interface NavGroupProps {
  item: {
    id?: string;
    type?: string;
    icon?: GenericCardProps["iconPrimary"];
    children?: NavGroupProps["item"][];
    title?: ReactNode | string;
    caption?: ReactNode | string;
    color?: "primary" | "secondary" | "default" | undefined;
    permissions?: Permission[]
  };
}

const NavGroup = ({ item }: NavGroupProps) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userPermissions = useMemo(() => {
    if (!user) return null;

    const _user = { ...user } as any;

    return _user.data.roleId.permissions;
  }, [user]);


  // menu list collapse & items
  const items = item.children
    ?.filter((menu) => !menu.permissions || hasPermission(menu.permissions, userPermissions)) // Filter items by permissions
    .map((menu) => {
      switch (menu.type) {
        case "collapse":
          return <NavCollapse key={menu.id} menu={menu} level={1} />;
        case "item":
          return <NavItem key={menu.id} item={menu} level={1} />;
        default:
          return (
            <Typography key={menu.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });


  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.menuCaption }}
              display="block"
              gutterBottom
            >
              {item.title}
              {item.caption && (
                <Typography
                  variant="caption"
                  sx={{ ...theme.typography.subMenuCaption }}
                  display="block"
                  gutterBottom
                >
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>

      {/* group divider */}
      {/* <Divider sx={{ mt: 0.25, mb: 1.25 }} /> */}
    </>
  );
};

export default NavGroup;
