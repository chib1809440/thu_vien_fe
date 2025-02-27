import {
    IconArticle,
    IconBook,
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
    IconFileText,
    IconForklift,
    IconHome2,
    IconHomeSearch,
    IconLocation,
    IconMicrophone,
    IconNotes,
    IconPrinter,
    IconReceipt,
    IconReceiptRefund,
    IconReportAnalytics,
    IconReportMoney,
    IconShare,
    IconSmartHome,
    IconUserPlus,
    IconUsers,
    IconVocabulary,
    IconInfoCircle,
    IconBrandWindows,
    IconTransferIn,
    IconHomeQuestion,
    IconReceipt2,
    IconBrandUbuntu,
    IconUserCircle,
    IconBooks,
    IconBrandAirtable,
    IconChartRadar,
    IconFolder,
    IconListDetails,
    IconListCheck,
} from "@tabler/icons";
import { VERSION } from "../config";

// constant
const icons = {
    IconDeviceAnalytics,
    IconHome2,
    IconUsers,
    IconArticle,
    IconVocabulary,
    IconCloudComputing,
    IconCategory,
    IconPrinter,
    IconForklift,
    IconBuildingWarehouse,
    IconHomeSearch,
    IconDevices,
    IconEyeTable,
    IconSmartHome,
    IconUserPlus,
    IconReceipt,
    IconReceiptRefund,
    IconShare,
    IconLocation,
    IconBuildingCastle,
    IconReportMoney,
    IconReportAnalytics,
    IconBrowserPlus,
    IconBrowser,
    IconNotes,
    IconBrandWechat,
    IconMicrophone,
    IconFileText,
    IconBook,
    IconInfoCircle,
    IconBrandWindows,
    IconTransferIn,
    IconHomeQuestion,
    IconReceipt2,
    IconBrandUbuntu,
    IconUserCircle,
    IconBooks,
    IconBrandAirtable,
    IconChartRadar,
    IconFolder,
    IconListDetails,
    IconListCheck,
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboardAdmin = {
    id: "dashboard-admin",
    // title: `Version ${VERSION}`,
    type: "group",
    children: [
        {
            id: "trang-chu",
            title: "Trang chủ",
            type: "item",
            url: "/trang-chu",
            icon: icons.IconHome2,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "statisticals",
                    action: "manage",
                },
            ],
        },
        {
            id: "thu-vien",
            title: "Hệ thống",
            type: "collapse",
            // url: '/he-thong',
            icon: icons.IconBrandWindows,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "groups",
                    action: "manage",
                },
                {
                    resource: "groups",
                    action: "read",
                },
                {
                    resource: "all",
                    action: "manage",
                },
            ],
            children: [
                {
                    id: "quan-ly-nhom",
                    title: "Nhóm",
                    type: "item",
                    url: "/he-thong/quan-ly-nhom",
                    icon: icons.IconBrandUbuntu,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "groups",
                            action: "manage",
                        },
                        {
                            resource: "groups",
                            action: "read",
                        },
                        {
                            resource: "all",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "quan-ly-thu-vien",
                    title: "Thư viện",
                    type: "item",
                    url: "/he-thong/quan-ly-thu-vien",
                    icon: icons.IconBooks,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "all",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "quan-ly-tai-khoan-admin",
                    title: "Tài khoản thủ thư",
                    type: "item",
                    url: "/he-thong/quan-ly-tai-khoan-admin",
                    icon: icons.IconUserCircle,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "all",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "quan-ly-tai-khoan",
                    title: "Tài khoản",
                    type: "item",
                    url: "/quan-ly-tai-khoan",
                    icon: icons.IconUserCircle,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "users",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "vai-tro",
                    title: "Vai trò",
                    type: "item",
                    url: "/vai-tro",
                    icon: icons.IconChartRadar,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "all",
                            action: "manage",
                        },
                    ],
                },
            ],
        },
        {
            id: "an-pham",
            title: "Ấn phẩm",
            type: "item",
            url: "/thu-vien/an-pham",
            icon: icons.IconBook,
            breadcrumbs: false,
        },
        {
            id: "quan-ly-nhap-kho",
            title: "Quản lý nhập kho",
            type: "collapse",
            url: "/quan-ly-nhap-kho",
            icon: icons.IconTransferIn,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "suppliers",
                    action: "manage",
                },
                {
                    resource: "warehousereceipts",
                    action: "manage",
                },
            ],

            children: [
                {
                    id: "nha-cung-cap",
                    title: "Nhà cung cấp",
                    type: "item",
                    url: "/quan-ly-nhap-kho/nha-cung-cap",
                    icon: icons.IconHomeQuestion,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "suppliers",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "phieu-nhap-an-pham",
                    title: "Phiếu nhập ấn phẩm",
                    type: "item",
                    url: "/quan-ly-nhap-kho/phieu-nhap-an-pham",
                    icon: icons.IconReceipt2,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "warehousereceipts",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "phieu-nhap-tai-san",
                    title: "Phiếu nhập tài sản",
                    type: "item",
                    url: "/quan-ly-nhap-kho/phieu-nhap-tai-san",
                    icon: icons.IconBrowser,
                    breadcrumbs: false,
                    // permissions: [
                    //     {
                    //         resource: "warehousereceiptsassets",
                    //         action: "manage",
                    //     },
                    // ],
                },
            ],
        },
        {
            id: "tai-san-thu-vien",
            title: "Quản lý số lượng tài sản",
            type: "collapse",
            url: "/tai-san-thu-vien",
            icon: icons.IconBrowser,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "assets",
                    action: "manage",
                },
                {
                    resource: "shelves",
                    action: "manage",
                },
            ],
            children: [
                {
                    id: "danh-sach-tai-san",
                    title: "Danh sách tài sản",
                    type: "item",
                    url: "/tai-san-thu-vien/danh-sach",
                    icon: icons.IconBrandAirtable,
                    breadcrumbs: false,
                },
                {
                    id: "tu-ke",
                    title: "Quản lý tủ - kệ",
                    type: "item",
                    url: "/tai-san-thu-vien/tu-ke",
                    icon: icons.IconHomeSearch,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "shelves",
                            action: "manage",
                        },
                    ],
                },
            ],
        },
        {
            id: "quan-ly-kho",
            title: "Quản lý số lượng ấn phẩm",
            type: "collapse",
            url: "/quan-ly-kho",
            icon: icons.IconBuildingWarehouse,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "suppliers",
                    action: "manage",
                },
                {
                    resource: "warehousereceipts",
                    action: "manage",
                },
            ],
            children: [
                {
                    id: "tu-ke",
                    title: "Ấn phẩm trên tủ - kệ",
                    type: "item",
                    url: "/quan-ly-kho/tu-ke",
                    icon: icons.IconBrandAirtable,
                    breadcrumbs: false,
                },
                {
                    id: "kho",
                    title: "Ấn phẩm trong kho",
                    type: "item",
                    url: "/quan-ly-kho/kho-an-pham",
                    icon: icons.IconBuildingWarehouse,
                    breadcrumbs: false,
                },
                // {
                //     id: "kho-tai-san",
                //     title: "Kho tài sản",
                //     type: "item",
                //     url: "/quan-ly-kho/kho-tai-san",
                //     icon: icons.IconBuildingWarehouse,
                //     breadcrumbs: false,
                // },
                
                // {
                //     id: "thanh-ly-hu-hong",
                //     title: "Thanh lý - Hư hỏng",
                //     type: "item",
                //     url: "/quan-ly-kho/thanh-ly-hu-hong",
                //     icon: icons.IconDevices,
                //     breadcrumbs: false,
                // },
            ],
        },

        {
            id: "thanh-ly-tai-san-an-pham",
            title: "Thanh lý tài sản & ấn phẩm",
            type: "item",
            url: "/thanh-ly-tai-san-an-pham",
            icon: icons.IconDevices,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "assets",
                    action: "manage",
                }
            ],
        },
        {
            id: "phieu-muon",
            title: "Thông tin phiếu mượn",
            type: "item",
            url: "/quan-ly-muon-tra/phieu-muon",
            icon: icons.IconReceipt,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "loanslips",
                    action: "manage",
                },
            ],
        },
        {
            id: "quan-ly-danh-muc",
            title: "Quản lý danh mục",
            type: "collapse",
            icon: icons.IconFolder,
            permissions: [
                {
                    resource: "materials",
                    action: "manage",
                },
                {
                    resource: "voices",
                    action: "manage",
                },
                {
                    resource: "categories",
                    action: "manage",
                },
                {
                    resource: "typevoices",
                    action: "manage",
                },
                {
                    resource: "authors",
                    action: "manage",
                },
                {
                    resource: "publishers",
                    action: "manage",
                },
                {
                    resource: "all",
                    action: "manage",
                },
            ],
            children: [
                {
                    id: "dang-hoc-lieu",
                    title: "Dạng học liệu",
                    type: "item",
                    url: "quan-ly-danh-muc/dang-hoc-lieu",
                    icon: icons.IconFileText,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "materials",
                            action: "manage",
                        },
                        {
                            resource: "all",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "linh-vuc",
                    title: "Lĩnh vực",
                    type: "item",
                    url: "/quan-ly-danh-muc/linh-vuc",
                    icon: icons.IconCategory,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "all",
                            action: "manage",
                        },
                        {
                            resource: "categories",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "chu-de",
                    title: "Chủ đề",
                    type: "item",
                    url: "/quan-ly-danh-muc/chu-de",
                    icon: icons.IconCategory,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "all",
                            action: "manage",
                        },
                        {
                            resource: "topics",
                            action: "manage",
                        },
                    ],
                },
                // {
                //     id: "tu-ke",
                //     title: "Tủ - Kệ",
                //     type: "item",
                //     url: "/quan-ly-danh-muc/tu-ke",
                //     icon: icons.IconHomeSearch,
                //     breadcrumbs: false,
                //     permissions: [
                //         {
                //             resource: "all",
                //             action: "manage",
                //         },
                //         {
                //             resource: "shelves",
                //             action: "manage",
                //         },
                //     ],
                // },
                {
                    id: "tac-gia",
                    title: "Tác giả",
                    type: "item",
                    url: "/quan-ly-danh-muc/tac-gia",
                    icon: icons.IconUserPlus,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "authors",
                            action: "manage",
                        },
                        {
                            resource: "all",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "nha-san-xuat",
                    title: "Nhà xuất bản",
                    type: "item",
                    url: "/quan-ly-danh-muc/nha-san-xuat",
                    icon: icons.IconUsers,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "all",
                            action: "manage",
                        },
                        {
                            resource: "publishers",
                            action: "manage",
                        },
                    ],
                },
                {
                    id: "loai-voice",
                    title: "Loại voice",
                    type: "item",
                    url: "/quan-ly-danh-muc/loai-voice",
                    icon: icons.IconMicrophone,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "all",
                            action: "manage",
                        },
                        {
                            resource: "typevoices",
                            action: "manage",
                        },
                    ],
                },
                // {
                //     id: "voice",
                //     title: "Voice",
                //     type: "item",
                //     url: "/quan-ly-danh-muc/voice",
                //     icon: icons.IconMicrophone,
                //     breadcrumbs: false,
                //     permissions: [
                //         {
                //             resource: "all",
                //             action: "manage",
                //         },
                //         {
                //             resource: "voices",
                //             action: "manage",
                //         },
                //     ],
                // },
            ],
        },
        {
            id: "thong-tin",
            title: "Thông tin trường",
            type: "item",
            url: "/thong-tin",
            icon: icons.IconInfoCircle,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "statisticals",
                    action: "manage",
                },
            ],
        },
        // {
        //     id: "tai-san-thu-vien",
        //     title: "Quản lý tài sản",
        //     type: "item",
        //     url: "/tai-san-thu-vien",
        //     icon: icons.IconBrowser,
        //     breadcrumbs: false,
        //     permissions: [
        //         {
        //             resource: "assets",
        //             action: "manage",
        //         },
        //     ],
        // },
        // {
        //     id: 'ho-tro-ai',
        //     title: "Hỗ trợ AI",
        //     type: 'item',
        //     url: '/ho-tro-ai',
        //     icon: icons.IconBrandWechat,
        //     breadcrumbs: false
        // },
        {
            id: "lien-thong-thu-vien",
            title: "Liên thông thư viện",
            type: "item",
            url: "/lien-thong",
            icon: icons.IconBuildingCastle,
            breadcrumbs: false,
            permissions: [
                {
                    resource: "categories",
                    action: "manage",
                },
                {
                    resource: "materials",
                    action: "manage",
                },
                {
                    resource: "authors",
                    action: "manage",
                },
                {
                    resource: "publishers",
                    action: "manage",
                },
                {
                    resource: "loanslips",
                    action: "manage",
                },
                {
                    resource: "publications",
                    action: "read",
                },
            ],
        },
    ],
};

export const dashboardAdminV2 = {
    id: "dashboard-admin",
    // title: `Version ${VERSION}`,
    type: "group",
    children: [
        // {
        //     id: 'trang-chu',
        //     title: "Trang chủ thư viện",
        //     type: 'item',
        //     url: '/trang-chu',
        //     icon: icons.IconHome2,
        //     breadcrumbs: false
        // },

        {
            id: "chia-se-danh-muc",
            title: "Chia sẻ danh mục",
            breadcrumbs: false,
            type: "collapse",
            icon: icons.IconFolder,
            permissions: [
                {
                    resource: "categories",
                    action: "manage",
                },
                {
                    resource: "materials",
                    action: "manage",
                },
                {
                    resource: "authors",
                    action: "manage",
                },
                {
                    resource: "publishers",
                    action: "manage",
                },
            ],
            children: [
                {
                    id: "dang-hoc-lieu-lien-thong",
                    title: "Dạng học liệu",
                    type: "item",
                    url: "/lien-thong/chia-se-danh-muc/dang-hoc-lieu",
                    icon: icons.IconFileText,
                    breadcrumbs: false,
                },
                {
                    id: "linh-vuc-lien-thong",
                    title: "Lĩnh vực",
                    type: "item",
                    url: "/lien-thong/chia-se-danh-muc/linh-vuc",
                    icon: icons.IconCategory,
                    breadcrumbs: false,
                },
                {
                    id: "tac-gia-lien-thong",
                    title: "Tác giả",
                    type: "item",
                    url: "/lien-thong/chia-se-danh-muc/tac-gia",
                    icon: icons.IconUserPlus,
                    breadcrumbs: false,
                },
                {
                    id: "nha-san-xuat-lien-thong",
                    title: "Nhà xuất bản",
                    type: "item",
                    url: "/lien-thong/chia-se-danh-muc/nha-san-xuat",
                    icon: icons.IconUsers,
                    breadcrumbs: false,
                },
            ],
        },
        {
            id: "lien-thong",
            title: "Chia sẻ ấn phẩm",
            type: "item",
            url: "/lien-thong",
            icon: icons.IconBook,
            breadcrumbs: false,
        },
        {
            id: "danh-sach-muon-tra-lien-thong",
            title: "Quản lý mượn trả",
            url: "danh-sach-muon-tra-lien-thong",
            breadcrumbs: false,
            type: "collapse",
            icon: icons.IconReceipt,
            permissions: [
                {
                    resource: "publications",
                    action: "manage",
                },
                {
                    resource: "publications",
                    action: "create",
                },
            ],
            children: [
                {
                    // mượn trường khác
                    id: "phieu-muon-lien-thong",
                    title: "Danh sách mượn",
                    type: "item",
                    url: "/lien-thong/chia-se-danh-muc/phieu-muon-lien-thong",
                    icon: icons.IconListDetails,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "loanslips",
                            action: "manage",
                        },
                    ],
                },
                {
                    // trường khác yêu cầu mượn
                    id: "phieu-muon-yeu-cau-lien-thong",
                    title: "Danh sách yêu cầu mượn",
                    type: "item",
                    url: "/lien-thong/chia-se-danh-muc/phieu-muon-yeu-cau-lien-thong",
                    icon: icons.IconListCheck,
                    breadcrumbs: false,
                    permissions: [
                        {
                            resource: "categories",
                            action: "manage",
                        },
                        {
                            resource: "materials",
                            action: "manage",
                        },
                        {
                            resource: "authors",
                            action: "manage",
                        },
                        {
                            resource: "publishers",
                            action: "manage",
                        },
                    ],
                },
            ],
        },
    ],
};

export default dashboardAdmin;