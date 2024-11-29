import { memo, useMemo } from "react";

// project imports
import { IconHome2 } from "@tabler/icons";
import { useAuth } from "../../../../contexts/JWTContext";
import { useFetchGroup } from "../../../../hooks/services/group/group-query";
import { Role } from "../../../../interfaces/role";
import { User } from "../../../../interfaces/user";
import menuItem, { menuItemsV2 } from "../../../../menu-items";
import NavGroup from "./NavGroup";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const { user } = useAuth();
    const { data: dataGroup } = useFetchGroup();
    // console.log(`user:::`, user);
    // console.log(`dataGroup:::`, dataGroup);

    const navItems = useMemo(() => {
        if (!user) return null;

        const _user = (user as any)?.data as User;

        if (!_user) return null;

        let menus = { ...menuItem };

        if (!dataGroup?.data?.result) return <NavGroup item={menus} />;

        const groups = [...dataGroup?.data?.result];
        const libId = _user?.libraryId;
        const roleName = (_user?.roleId as Role)?.name;

        const hiddenRoutes = ["thu-vien"];

        if (roleName === 'Student' || roleName === 'Teacher') {
            menus.children = menus.children.filter((t) => !hiddenRoutes.includes(t.id));
        }

        if (groups.some((group) => group?.libraries?.some((lib) => lib._id === libId))) {
            return <NavGroup item={menus} />;
        }

        menus.children = menus.children.filter((t) => t.id !== "lien-thong-thu-vien");

        return <NavGroup item={menus} />;
    }, [user, dataGroup]);

    return <>{navItems}</>;
};

export const MenuListV2 = () => {
    const { user } = useAuth();
    // console.log(`user:::`, user);

    const navItems = useMemo(() => {
        if (!user) return null;

        const _user = (user as any)?.data as User;

        if (!_user) return null;

        let menus = { ...menuItemsV2 };

        if ((_user?.roleId as Role)?.name === "Admin" || (_user?.roleId as Role)?.name === "Owner") {
            menus.children = [
                {
                    id: "trang-chu",
                    title: "Trang chủ thư viện",
                    type: "item",
                    url: "/trang-chu",
                    icon: IconHome2,
                    breadcrumbs: false,
                },
                ...menus.children,
            ];
        } else {
            menus.children = [
                {
                    id: "an-pham",
                    title: "Trang chủ ấn phẩm",
                    type: "item",
                    url: "/thu-vien/an-pham",
                    icon: IconHome2,
                    breadcrumbs: false,
                },
                ...menus.children,
            ];
        }

        return <NavGroup item={menus} />;
    }, [user]);

    return <>{navItems}</>;
};

export default memo(MenuList);