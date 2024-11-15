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
    IconReportMoney, IconReportAnalytics, IconBrowserPlus, IconBrowser, IconNotes, IconBrandWechat, IconMicrophone, IconFileText, IconBook
};


// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboardAdmin = {
    id: 'dashboard-admin',
    // title: `Version ${VERSION}`,
    type: 'group',
    children: [
        {
            id: 'trang-chu',
            title: "Trang chủ",
            type: 'item',
            url: '/trang-chu',
            icon: icons.IconHome2,
            breadcrumbs: false,
            permissions: [{
                "resource": "statisticals",
                "action": "manage"
            }],
        },
        {
            id: 'thu-vien',
            title: "Hệ thống",
            type: 'collapse',
            // url: '/he-thong',
            icon: icons.IconBrowser,
            breadcrumbs: false,
            permissions: [{
                "resource": "groups",
                "action": "manage"
            }, {
                "resource": "groups",
                "action": "read"
            }, {
                "resource": "all",
                "action": "manage"
            }],
            children: [
                {
                    id: 'quan-ly-nhom',
                    title: "Nhóm",
                    type: 'item',
                    url: '/he-thong/quan-ly-nhom',
                    icon: icons.IconDeviceAnalytics,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "groups",
                        "action": "manage"
                    }, {
                        "resource": "groups",
                        "action": "read"
                    }, {
                        "resource": "all",
                        "action": "manage"
                    }],
                },
                {
                    id: 'quan-ly-thu-vien',
                    title: "Thư viện",
                    type: 'item',
                    url: '/he-thong/quan-ly-thu-vien',
                    icon: icons.IconDeviceAnalytics,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }],
                },
                {
                    id: 'quan-ly-tai-khoan-admin',
                    title: "Tài khoản admin thư viện",
                    type: 'item',
                    url: '/he-thong/quan-ly-tai-khoan-admin',
                    icon: icons.IconDeviceAnalytics,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }],
                },
                {
                    id: 'quan-ly-tai-khoan',
                    title: "Tài khoản",
                    type: 'item',
                    url: '/quan-ly-tai-khoan',
                    icon: icons.IconDeviceAnalytics,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "users",
                        "action": "manage"
                    }, {
                        "resource": "all",
                        "action": "manage"
                    }],
                },
                {
                    id: 'vai-tro',
                    title: "Vai trò",
                    type: 'item',
                    url: '/vai-tro',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }],
                },
            ]
        },
        {
            id: 'an-pham',
            title: "Ấn phẩm",
            type: 'item',
            url: '/thu-vien/an-pham',
            icon: icons.IconBook,
            breadcrumbs: false
        },
        {
            id: 'quan-ly-nhap-kho',
            title: "Quản lý nhập kho",
            type: 'collapse',
            url: '/quan-ly-nhap-kho',
            icon: icons.IconBrowser,
            breadcrumbs: false,
            permissions: [{
                "resource": "suppliers",
                "action": "manage"
            },
            {
                "resource": "warehousereceipts",
                "action": "manage"
            },
            ],

            children: [
                {
                    id: 'nha-cung-cap',
                    title: "Nhà cung cấp",
                    type: 'item',
                    url: '/quan-ly-nhap-kho/nha-cung-cap',
                    icon: icons.IconEyeTable,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "suppliers",
                        "action": "manage"
                    }],
                },
                {
                    id: 'phieu-nhap-kho',
                    title: "Phiếu nhập kho",
                    type: 'item',
                    url: '/quan-ly-nhap-kho/phieu-nhap-kho',
                    icon: icons.IconEyeTable,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "warehousereceipts",
                        "action": "manage"
                    }],
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
            permissions: [
            {
                "resource": "suppliers",
                "action": "manage"
            },
            {
                "resource": "warehousereceipts",
                "action": "manage"
            },],
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
            id: 'phieu-muon',
            title: "Thông tin phiếu mượn",
            type: 'item',
            url: '/quan-ly-muon-tra/phieu-muon',
            icon: icons.IconReceipt,
            breadcrumbs: false,
            permissions: [{
                "resource": "loanslips",
                "action": "manage"
            }],
        },
        {
            id: 'quan-ly-danh-muc',
            title: "Quản lý danh mục",
            type: 'collapse',
            icon: icons.IconBrowser,
            permissions: [{
                "resource": "materials",
                "action": "manage"
            }, {
                "resource": "voices",
                "action": "manage"
            }, {
                "resource": "categories",
                "action": "manage"
            }, {
                "resource": "typevoices",
                "action": "manage"
            }, {
                "resource": "authors",
                "action": "manage"
            }, {
                "resource": "publishers",
                "action": "manage"
            }, {
                "resource": "all",
                "action": "manage"
            }],
            children: [
                {
                    id: 'dang-hoc-lieu',
                    title: "Dạng học liệu",
                    type: 'item',
                    url: 'quan-ly-danh-muc/dang-hoc-lieu',
                    icon: icons.IconFileText,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "materials",
                        "action": "manage"
                    }, {
                        "resource": "all",
                        "action": "manage"
                    }],
                },
                {
                    id: 'linh-vuc',
                    title: "Lĩnh vực",
                    type: 'item',
                    url: '/quan-ly-danh-muc/linh-vuc',
                    icon: icons.IconBrowser,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }, {
                        "resource": "categories",
                        "action": "manage"
                    }],
                },
                {
                    id: 'tu-ke',
                    title: "Tủ - Kệ",
                    type: 'item',
                    url: '/quan-ly-danh-muc/tu-ke',
                    icon: icons.IconHomeSearch,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }, {
                        "resource": "shelves",
                        "action": "manage"
                    }],
                },
                {
                    id: 'tac-gia',
                    title: "Tác giả",
                    type: 'item',
                    url: '/quan-ly-danh-muc/tac-gia',
                    icon: icons.IconUserPlus,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "authors",
                        "action": "manage"
                    }, {
                        "resource": "all",
                        "action": "manage"
                    }],
                },
                {
                    id: 'nha-san-xuat',
                    title: "Nhà xuất bản",
                    type: 'item',
                    url: '/quan-ly-danh-muc/nha-san-xuat',
                    icon: icons.IconUsers,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }, {
                        "resource": "publishers",
                        "action": "manage"
                    }],
                },
                {
                    id: 'loai-voice',
                    title: "Loại voice",
                    type: 'item',
                    url: '/quan-ly-danh-muc/loai-voice',
                    icon: icons.IconMicrophone,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }, {
                        "resource": "typevoices",
                        "action": "manage"
                    }],
                },
                {
                    id: 'voice',
                    title: "Voice",
                    type: 'item',
                    url: '/quan-ly-danh-muc/voice',
                    icon: icons.IconMicrophone,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "all",
                        "action": "manage"
                    }, {
                        "resource": "voices",
                        "action": "manage"
                    }],
                }
            ]
        },
        {
            id: 'thong-tin',
            title: "Thông tin trường",
            type: 'item',
            url: '/thong-tin',
            icon: icons.IconLocation,
            breadcrumbs: false,
            permissions: [{
                "resource": "statisticals",
                "action": "manage"
            }],
        },
        {
            id: 'tai-san-thu-vien',
            title: "Quản lý tài sản",
            type: 'item',
            url: '/tai-san-thu-vien',
            icon: icons.IconBuildingCastle,
            breadcrumbs: false,
            permissions: [{
                "resource": "assets",
                "action": "manage"
            }],
        },
        // {
        //     id: 'ho-tro-ai',
        //     title: "Hỗ trợ AI",
        //     type: 'item',
        //     url: '/ho-tro-ai',
        //     icon: icons.IconBrandWechat,
        //     breadcrumbs: false
        // },
        {
            id: 'lien-thong',
            title: "Liên thông thư viện",
            type: 'item',
            url: '/lien-thong',
            icon: icons.IconBuildingCastle,
            breadcrumbs: false,
            permissions: [{
                "resource": "categories",
                "action": "manage"
            }, {
                "resource": "materials",
                "action": "manage"
            }, {
                "resource": "authors",
                "action": "manage"
            }, {
                "resource": "publishers",
                "action": "manage"
            }, {
                "resource": "loanslips",
                "action": "manage"
            }, {
                "resource": "publications",
                "action": "read"
            }
            ],
            // disabled
        },
    ]
};

export const dashboardAdminV2 = {
    id: 'dashboard-admin',
    // title: `Version ${VERSION}`,
    type: 'group',
    children: [
        {
            id: 'trang-chu',
            title: "Trang chủ thư viện",
            type: 'item',
            url: '/trang-chu',
            icon: icons.IconHome2,
            breadcrumbs: false
        },
        {
            id: 'lien-thong',
            title: "Chia sẻ ấn phẩm",
            type: 'item',
            url: '/lien-thong',
            icon: icons.IconBook,
            breadcrumbs: false
        },
        {
            id: 'chia-se-danh-muc',
            title: "Chia sẻ danh mục",
            breadcrumbs: false,
            type: 'collapse',
            icon: icons.IconBrowser,
            permissions: [{
                "resource": "categories",
                "action": "manage"
            }, {
                "resource": "materials",
                "action": "manage"
            }, {
                "resource": "authors",
                "action": "manage"
            }, {
                "resource": "publishers",
                "action": "manage"
            }],
            children: [
                {
                    id: 'dang-hoc-lieu',
                    title: "Dạng học liệu",
                    type: 'item',
                    url: '/lien-thong/chia-se-danh-muc/dang-hoc-lieu',
                    icon: icons.IconFileText,
                    breadcrumbs: false,
                },
                {
                    id: 'linh-vuc',
                    title: "Lĩnh vực",
                    type: 'item',
                    url: '/lien-thong/chia-se-danh-muc/linh-vuc',
                    icon: icons.IconBrowser,
                    breadcrumbs: false,
                },
                {
                    id: 'tac-gia',
                    title: "Tác giả",
                    type: 'item',
                    url: '/lien-thong/chia-se-danh-muc/tac-gia',
                    icon: icons.IconUserPlus,
                    breadcrumbs: false
                },
                {
                    id: 'nha-san-xuat',
                    title: "Nhà xuất bản",
                    type: 'item',
                    url: '/lien-thong/chia-se-danh-muc/nha-san-xuat',
                    icon: icons.IconUsers,
                    breadcrumbs: false
                }]
        },
        {
            id: 'danh-sach-muon-tra-lien-thong',
            title: "Quản lý mượn trả",
            url: 'danh-sach-muon-tra-lien-thong',
            breadcrumbs: false,
            type: 'collapse',
            icon: icons.IconBrowser,
            permissions: [{
                "resource": "publications",
                "action": "manage"
            }, {
                "resource": "publications",
                "action": "create"
            }],
            children: [
                {
                    // mượn trường khác
                    id: 'phieu-muon-lien-thong',
                    title: "Danh sách mượn",
                    type: 'item',
                    url: '/lien-thong/chia-se-danh-muc/phieu-muon-lien-thong',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "loanslips",
                        "action": "manage"
                    }],
                },
                {
                    // trường khác yêu cầu mượn
                    id: 'phieu-muon-yeu-cau-lien-thong',
                    title: "Danh sách yêu cầu mượn",
                    type: 'item',
                    url: '/lien-thong/chia-se-danh-muc/phieu-muon-yeu-cau-lien-thong',
                    icon: icons.IconBrowserPlus,
                    breadcrumbs: false,
                    permissions: [{
                        "resource": "categories",
                        "action": "manage"
                    }, {
                        "resource": "materials",
                        "action": "manage"
                    }, {
                        "resource": "authors",
                        "action": "manage"
                    }, {
                        "resource": "publishers",
                        "action": "manage"
                    }]
                },
            ]
        }
    ]
};


export default dashboardAdmin;
