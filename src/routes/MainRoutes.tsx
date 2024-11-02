import { lazy } from "react";
// project imports
import MainLayout, { MainLayoutV2 } from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/route-guard/AuthGuard";
import PermissionGuard from "../utils/route-guard/PermissionGuard";
const LoanSlipDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LoanSlipPage/LoanSlipDeleteListPage"))
);
const HomePage = Loadable(
  lazy(() => import("../views/dashboard-admin/HomePage"))
);
const ExamplePage = Loadable(
  lazy(() => import("../views/dashboard-admin/ExamplePage"))
);
const AssetPage = Loadable(
  lazy(() => import("../views/dashboard-admin/AssetPage"))
);
const AssetTrashPage = Loadable(
  lazy(() => import("../views/dashboard-admin/AssetPage/AssetTrash"))
);
const LibInformationPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LibInformationPage"))
);

const AccountPage = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/AccountPage"))
);
const AdminAccountPage = Loadable(
  lazy(() => import("../views/dashboard-admin/AdminPage"))
);
const AccountTrashPage = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/AccountPage/AccountTrashPage"))
);
const RolePage = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/RolePage"))
);

const GroupPage = Loadable(
  lazy(() => import("../views/dashboard-admin/GroupPage"))
);
const LibraryPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LibraryPage"))
);

// cate
const MaterialPage = Loadable(
  lazy(() => import("../views/dashboard-admin/MaterialPage"))
);
const CategoryPage = Loadable(
  lazy(() => import("../views/dashboard-admin/CategoryPage"))
);
const AuthorPage = Loadable(
  lazy(() => import("../views/dashboard-admin/AuthorPage"))
);
const AuthorDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/AuthorPage/AuthorDeleteListPage"))
);
const CategoryDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/CategoryPage/CategoryDeleteListPage"))
);
const PublisherPage = Loadable(
  lazy(() => import("../views/dashboard-admin/PublisherPage"))
);
const PublisherDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/PublisherPage/PublisherDeleteListPage"))
);
const MaterialDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/MaterialPage/MaterialDeleteListPage"))
);
const ShelfPage = Loadable(
  lazy(() => import("../views/dashboard-admin/ShelfPage"))
);
const ShelfDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/ShelfPage/ShelfDeleteListPage"))
);
const TypeVoicePage = Loadable(
  lazy(() => import("../views/dashboard-admin/TypeVoicePage"))
);
const TypeVoiceDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/TypeVoicePage/TypeVoiceDeleteListPage"))
);
const VoicePage = Loadable(
  lazy(() => import("../views/dashboard-admin/VoicePage"))
);
const VoiceDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/VoicePage/VoiceDeleteListPage"))
);

// PublicationsPage
const PublicationsPage = Loadable(
  lazy(() => import("../views/dashboard-admin/PublicationsPage"))
);
const PublicationsDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/PublicationsPage/PublicationsDeleteListPage"))
);

// Stock
const ShelvesProductPage = Loadable(
  lazy(() => import("../views/dashboard-admin/WarehousePage/ShelvesProductPage"))
);
const StockProductPage = Loadable(
  lazy(() => import("../views/dashboard-admin/WarehousePage/StockProductPage"))
);
const LiquidationProductPage = Loadable(
  lazy(() => import("../views/dashboard-admin/WarehousePage/LiquidationProductPage"))
);


const LoanSlipPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LoanSlipPage"))
);

// );
const AIBOX = Loadable(
  lazy(() => import("../views/dashboard-admin/AI"))
);
const Print = Loadable(
  lazy(() => import("../views/dashboard-admin/Print"))
);
const LibraryConnection = Loadable(
  lazy(() => import("../views/dashboard-admin/LibraryConnection"))
);
// lienthong
const LibraryPublicationsPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibraryPublicationsPage"))
);
const LibMaterialPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibMaterialPage"))
);
const LibCategoryPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibCategoryPage"))
);
const LibAuthorPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibAuthorPage"))
);
const LibPublisherPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibPublisherPage"))
);

const LibLoanSlipPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibLoanSlipPage"))
);

const LibLoanSlipRequestPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibLoanSlipPage/LoanSlipRequestLink"))
);



const LibAccount = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/Account"))
);
//Supplier
const SupplierPage = Loadable(
  lazy(() => import("../views/dashboard-admin/WareHouseReceiptPage/SupplierPage"))
);
const SupplierDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/WareHouseReceiptPage/SupplierDeleteListPage"))
);
//WareHouseReceipt
const WareHouseReceiptPage = Loadable(
  lazy(() => import("../views/dashboard-admin/WareHouseReceiptPage/WareHouseReceiptPage"))
);
const WareHouseReceiptDeleteListPage = Loadable(
  lazy(() => import("../views/dashboard-admin/WareHouseReceiptPage/WareHouseDeleteListPage"))
);
//Error Page
const ForbiddenPage = Loadable(
  lazy(() => import("../views/ErrorPage/ForbiddenPage"))
);
const MainRoutes = {
  path: "/",
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: "/trang-chu",
      element: (
        <PermissionGuard
          requiredPermissions={[{ resource: 'statisticals', action: 'read' }]}
        >
          <HomePage />
        </PermissionGuard>
      ),
    },
    {
      path: "/403",
      element: <ForbiddenPage />,
    },
    {
      path: "/vi-du",
      element: <ExamplePage />,
    },
    {
      path: "/he-thong/quan-ly-nhom",
      element: <GroupPage />,
    },
    {
      path: "/he-thong/quan-ly-thu-vien",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'libraries', action: 'manage' }]}
      >
        <LibraryPage />
      </PermissionGuard>,
    },
    {
      path: "/thong-tin",
      element: <LibInformationPage />,
    },
    {
      path: "/quan-ly-tai-khoan",
      element: <AccountPage />,
    },
    {
      path: "/he-thong/quan-ly-tai-khoan-admin",
      element: <AdminAccountPage />,
    },
    {
      path: "/quan-ly-tai-khoan/thung-rac",
      element: <AccountTrashPage />,
    },

    {
      path: "/vai-tro",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'roles', action: 'manage' }]}
      >
        <RolePage />
      </PermissionGuard>,
    },
    {
      path: "/tai-san-thu-vien",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'assets', action: 'manage' }]}
      >
        <AssetPage />
      </PermissionGuard>,
    },
    {
      path: "quan-ly-danh-muc/dang-hoc-lieu",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <MaterialPage />
      </PermissionGuard>,
    },
    {
      path: "quan-ly-danh-muc/linh-vuc",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <CategoryPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/tac-gia",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <AuthorPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-tac-gia",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <AuthorDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-linh-vuc",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <CategoryDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/nha-san-xuat",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <PublisherPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-nha-san-xuat",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <PublisherDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-dang-hoc-lieu",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <MaterialDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/tu-ke",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <ShelfPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-tu-ke",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <ShelfDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/loai-voice",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <TypeVoicePage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-loai-voice",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <TypeVoiceDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/voice",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <VoicePage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-voice",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }]}
      >
        <VoiceDeleteListPage />
      </PermissionGuard>,
    },

    // sách
    {
      path: "/thu-vien/an-pham",
      element: <PublicationsPage />,
    },
    {
      path: "/thu-vien/danh-sach-xoa-an-pham",
      element: <PublicationsDeleteListPage />,
    },

    // kho
    {
      path: "/quan-ly-kho/tu-ke",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'publications', action: 'manage' }, { resource: 'warehousereceipts', action: 'manage' }]}
      >
        <ShelvesProductPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-kho/kho",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'publications', action: 'manage' }, { resource: 'warehousereceipts', action: 'manage' }]}
      >
        <StockProductPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-kho/thanh-ly-hu-hong",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'publications', action: 'manage' }, { resource: 'warehousereceipts', action: 'manage' }]}
      >
        <LiquidationProductPage />
      </PermissionGuard>,
    },

    {
      path: "/tai-san-thu-vien/thung-rac",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'assets', action: 'manage' }]}
      >
        <AssetTrashPage />
      </PermissionGuard>,
    },
    // Nhập kho
    {
      path: "/quan-ly-nhap-kho/nha-cung-cap",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'suppliers', action: 'manage' }]}
      >
        <SupplierPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-nhap-kho/nha-cung-cap/danh-sach-xoa-nha-cung-cap",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'suppliers', action: 'manage' }]}
      >
        <SupplierDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-nhap-kho/phieu-nhap-kho",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'warehousereceipts', action: 'manage' }]}
      >
        <WareHouseReceiptPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-nhap-kho/phieu-nhap-kho/danh-sach-xoa-phieu-nhap-kho",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'warehousereceipts', action: 'manage' }]}
      >
        <WareHouseReceiptDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-muon-tra/phieu-muon",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'loanslips', action: 'manage' }]}
      >
        <LoanSlipPage />
      </PermissionGuard>,
    },
    {
      path: "/quan-ly-muon-tra/phieu-muon/danh-sach-xoa-phieu-muon",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'loanslips', action: 'manage' }]}
      >
        <LoanSlipDeleteListPage />
      </PermissionGuard>,
    },
    {
      path: "/ho-tro-ai",
      element: <AIBOX />,
    },
    {
      path: "/bao-cao",
      element: <Print />,
    },
    {
      path: "/lien-ket-thu-vien",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }, { resource: 'categories', action: 'manage' }, { resource: 'authors', action: 'manage' }, { resource: 'publishers', action: 'manage' }]}
      >
        <LibraryConnection />
      </PermissionGuard>,
    }
  ],
};

// lien thong
export const MainRoutesV2 = {
  path: "/",
  element: (
    <PermissionGuard
      requiredPermissions={[{ resource: 'materials', action: 'read' }, { resource: 'categories', action: 'read' }, { resource: 'authors', action: 'read' }, { resource: 'publishers', action: 'read' }]}
    >
      <AuthGuard>
        <MainLayoutV2 />
      </AuthGuard>
    </PermissionGuard>
  ),
  children: [
    {
      path: "lien-thong",
      element: <LibraryPublicationsPage />,
    },
    // danh mục chia sẽ liên thông
    {
      path: "lien-thong/chia-se-danh-muc/dang-hoc-lieu",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }, { resource: 'categories', action: 'manage' }, { resource: 'authors', action: 'manage' }, { resource: 'publishers', action: 'manage' }]}
      >
        <LibMaterialPage />
      </PermissionGuard>,
    },
    {
      path: "lien-thong/chia-se-danh-muc/linh-vuc",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }, { resource: 'categories', action: 'manage' }, { resource: 'authors', action: 'manage' }, { resource: 'publishers', action: 'manage' }]}
      >
        <LibCategoryPage />
      </PermissionGuard>,
    },
    {
      path: "lien-thong/chia-se-danh-muc/tac-gia",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }, { resource: 'categories', action: 'manage' }, { resource: 'authors', action: 'manage' }, { resource: 'publishers', action: 'manage' }]}
      >
        <LibAuthorPage />
      </PermissionGuard>,
    },
    {
      path: "lien-thong/chia-se-danh-muc/nha-san-xuat",
      element: <PermissionGuard
        requiredPermissions={[{ resource: 'materials', action: 'manage' }, { resource: 'categories', action: 'manage' }, { resource: 'authors', action: 'manage' }, { resource: 'publishers', action: 'manage' }]}
      >
        <LibPublisherPage />
      </PermissionGuard>,
    },
    {
      path: "lien-thong/chia-se-danh-muc/phieu-muon-lien-thong",
      element: <LibLoanSlipPage />,
    },
    {
      path: "lien-thong/chia-se-danh-muc/phieu-muon-yeu-cau-lien-thong",
      element: <LibLoanSlipRequestPage />,
    },
    {
      path: "tai-khoan-lien-thong",
      element: <LibAccount />,
    },
  ],
};
export default MainRoutes;
