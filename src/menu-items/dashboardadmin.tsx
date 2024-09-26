import { FormattedMessage } from 'react-intl';
import {
    IconArticle,
    IconBrandWechat,
    IconBrowser,
    IconBrowserPlus,
    IconBuildingCastle,
    IconBuildingWarehouse,
    IconCategory,
    IconCloudComputing,
    IconDeviceAnalytics,
    IconDevices,
    IconEyeTable,
    IconForklift,
    IconHome2,
    IconHomeSearch,
    IconLocation,
    IconNotes,
    IconPrinter,
    IconReceipt, IconReceiptRefund,
    IconReportAnalytics,
    IconReportMoney,
    IconShare,
    IconSmartHome,
    IconUserPlus,
    IconUsers,
    IconVocabulary
} from '@tabler/icons';
import { VERSION } from '../config';

// constant
const icons = {
    IconDeviceAnalytics, IconHome2, IconUsers, IconArticle, IconVocabulary,
    IconCloudComputing, IconCategory, IconPrinter, IconForklift, IconBuildingWarehouse,
    IconHomeSearch, IconDevices, IconEyeTable, IconSmartHome, IconUserPlus,
    IconReceipt, IconReceiptRefund, IconShare, IconLocation, IconBuildingCastle,
    IconReportMoney, IconReportAnalytics, IconBrowserPlus, IconBrowser, IconNotes, IconBrandWechat
};


// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboardAdmin = {
    id: 'dashboard-admin',
    title: `Version ${VERSION}`,
    type: 'group',
    children: [
        {
            id: 'trang-chu',
            title: "Trang chủ",
            type: 'item',
            url: '/trang-chu',
            icon: icons.IconHome2,
            breadcrumbs: false
        },
        {
            id: 'vi-du',
            title: "Ví dụ",
            type: 'item',
            url: '/vi-du',
            icon: icons.IconCategory,
            breadcrumbs: false
        },
        {
            id: 'quan-ly-nhom',
            title: "Nhóm",
            type: 'item',
            url: '/quan-ly-nhom',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        },
        {
            id: 'quan-ly-tai-khoan',
            title: "Tài khoản",
            type: 'item',
            url: '/quan-ly-tai-khoan',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        },
        {
            id: 'quan-ly-thanh-vien',
            title: "Thành viên",
            type: 'item',
            url: '/quan-ly-thanh-vien',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        },
        {
            id: 'thu-vien',
            title: "Thư viện",
            type: 'collapse',
            url: '/thu-vien',
            icon: icons.IconBrowser,
            breadcrumbs: false,
            children: [
                {
                    id: 'an-pham',
                    title: "Ấn phẩm",
                    type: 'item',
                    url: '/thu-vien/an-pham',
                    icon: icons.IconEyeTable,
                    breadcrumbs: false
                },
                {
                    id: 'hoc-lieu',
                    title: "Học liệu điện tử",
                    type: 'item',
                    url: '/thu-vien/hoc-lieu',
                    icon: icons.IconDevices,
                    breadcrumbs: false
                },
            ]
        },
        {
            id: 'quan-ly-kho',
            title: "Quản lý kho",
            type: 'collapse',
            url: '/quan-ly-kho',
            icon: icons.IconBrowser,
            breadcrumbs: false,
            children: [
                {
                    id: 'tu-ke',
                    title: "Tủ - Kệ",
                    type: 'item',
                    url: '/quan-ly-kho/tu-ke',
                    icon: icons.IconEyeTable,
                    breadcrumbs: false
                },
                {
                    id: 'kho',
                    title: "Kho",
                    type: 'item',
                    url: '/quan-ly-kho/kho',
                    icon: icons.IconDevices,
                    breadcrumbs: false
                },
                {
                    id: 'thanh-ly-hu-hong',
                    title: "Thanh lý - Hư hỏng",
                    type: 'item',
                    url: '/quan-ly-kho/thanh-ly-hu-hong',
                    icon: icons.IconDevices,
                    breadcrumbs: false
                },
            ]
        },
        {
            id: 'quan-ly-muon-tra',
            title: "Quản lý mượn trả",
            type: 'collapse',
            icon: icons.IconSmartHome,
            children: [
                {
                    id: 'phieu-muon',
                    title: "Phiếu mượn",
                    type: 'item',
                    url: '/quan-ly-muon-tra/phieu-muon',
                    icon: icons.IconReceipt,
                    breadcrumbs: false
                },
                {
                    id: 'phieu-tra',
                    title: "Phiếu trả",
                    type: 'item',
                    url: '/quan-ly-muon-tra/phieu-tra',
                    icon: icons.IconReceiptRefund,
                    breadcrumbs: false
                },
            ]
        },
        {
            id: 'quan-ly-danh-muc',
            title: "Quản lý danh mục",
            type: 'collapse',
            icon: icons.IconBrowser,
            children: [
                //     {
                //     id: 'loai-hoc-lieu',
                //     title:"Loại học liệu" ,
                //     type: 'item',
                //     url: '/quan-ly-danh-muc/loai-hoc-lieu',
                //     icon: icons.IconArticle,
                //     breadcrumbs: false
                // },
                {
                    id: 'dang-hoc-lieu',
                    title: "Dạng học liệu",
                    type: 'item',
                    url: 'quan-ly-danh-muc/dang-hoc-lieu',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
                {
                    id: 'linh-vuc',
                    title: "Lĩnh vực",
                    type: 'item',
                    url: '/quan-ly-danh-muc/linh-vuc',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
                {
                    id: 'tu-ke',
                    title: "Tủ - Kệ",
                    type: 'item',
                    url: '/quan-ly-danh-muc/tu-ke',
                    icon: icons.IconHomeSearch,
                    breadcrumbs: false
                },
                {
                    id: 'tac-gia',
                    title: "Tác giả",
                    type: 'item',
                    url: '/quan-ly-danh-muc/tac-gia',
                    icon: icons.IconUserPlus,
                    breadcrumbs: false
                },
                {
                    id: 'nha-san-xuat',
                    title: "Nhà xuất bản",
                    type: 'item',
                    url: '/quan-ly-danh-muc/nha-san-xuat',
                    icon: icons.IconUsers,
                    breadcrumbs: false
                }]
        },
        {
            id: 'thong-tin',
            title: "Thông tin trường",
            type: 'item',
            url: '/thong-tin',
            icon: icons.IconLocation,
            breadcrumbs: false
        },
        {
            id: 'quan-ly-tai-san',
            title: "Quản lý tài sản",
            type: 'item',
            url: '/tai-san-thu-vien',
            icon: icons.IconBuildingCastle,
            breadcrumbs: false
        },
        {
            id: 'ho-tro-ai',
            title: "Hỗ trợ AI",
            type: 'item',
            url: '/ho-tro-ai',
            icon: icons.IconBrandWechat,
            breadcrumbs: false
        },
        {
            id: 'lien-thong',
            title: "Liên thông thư viện",
            type: 'item',
            url: '/lien-thong',
            icon: icons.IconBuildingCastle,
            breadcrumbs: false
        },
    ]
};

export const dashboardAdminV2 = {
    id: 'dashboard-admin',
    title: `Version ${VERSION}`,
    type: 'group',
    children: [
        {
            id: 'lien-thong',
            title: "Trang chủ",
            type: 'item',
            url: '/lien-thong',
            icon: icons.IconHome2,
            breadcrumbs: false
        },
        {
            id: 'chia-se-danh-muc',
            title: "Chia sẻ danh mục",
            url: 'chia-se-danh-muc',
            breadcrumbs: false,
            type: 'collapse',
            icon: icons.IconBrowser,
            children: [
                {
                    id: 'chia-se-danh-muc/dang-hoc-lieu',
                    title: "Dạng học liệu",
                    type: 'item',
                    url: 'chia-se-danh-muc/dang-hoc-lieu',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
                {
                    id: 'chia-se-danh-muc/linh-vuc',
                    title: "Lĩnh vực",
                    type: 'item',
                    url: 'chia-se-danh-muc/linh-vuc',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
                {
                    id: 'chia-se-danh-muc/tac-gia',
                    title: "Tác giả",
                    type: 'item',
                    url: 'chia-se-danh-muc/tac-gia',
                    icon: icons.IconUserPlus,
                    breadcrumbs: false
                },
                {
                    id: 'chia-se-danh-muc/nha-san-xuat',
                    title: "Nhà xuất bản",
                    type: 'item',
                    url: 'chia-se-danh-muc/nha-san-xuat',
                    icon: icons.IconUsers,
                    breadcrumbs: false
                }]
        },
        {
            id: 'chia-se-thu-vien',
            title: "Chia sẻ thư viện",
            url: 'chia-se-thu-vien',
            breadcrumbs: false,
            type: 'collapse',
            icon: icons.IconBrowser,
            children: [
                {
                    id: '/chia-se-thu-vien/an-pham',
                    title: "Ấn phẩm",
                    type: 'item',
                    url: '/chia-se-thu-vien/an-pham',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
                {
                    id: 'chia-se-thu-vien/hoc-lieu',
                    title: "Học liệu điện tử",
                    type: 'item',
                    url: 'chia-se-thu-vien/hoc-lieu',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
            ]
        },
        {
            id: 'danh-sach-muon-tra-lien-thong',
            title: "Quản lý mượn trả",
            url: 'danh-sach-muon-tra-lien-thong',
            breadcrumbs: false,
            type: 'collapse',
            icon: icons.IconBrowser,
            children: [
                {
                    id: 'danh-sach-muon-tra-lien-thong/dang-ky',
                    title: "Danh sách đăng ký",
                    type: 'item',
                    url: 'danh-sach-muon-tra-lien-thong/dang-ky',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
                {
                    id: 'danh-sach-muon-tra-lien-thong/muon',
                    title: "Danh sách mượn",
                    type: 'item',
                    url: 'danh-sach-muon-tra-lien-thong/muon',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                },
            ]
        },
        {
            id: 'tai-khoan-lien-thong',
            title: "Quản lý tài khoản",
            type: 'item',
            url: '/tai-khoan-lien-thong',
            icon: icons.IconHome2,
            breadcrumbs: false
        },
    ]
};


export default dashboardAdmin;
