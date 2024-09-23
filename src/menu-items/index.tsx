import { NavItemType }  from '../types';
import dashboardAdmin, { dashboardAdminV2 } from './dashboardadmin';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
    items: [dashboardAdmin]
};
export const menuItemsV2: { items: NavItemType[] } = {
    items: [dashboardAdminV2]
};

export default menuItems;
