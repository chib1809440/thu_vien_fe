import { lazy } from "react";
// project imports
import MainLayout, { MainLayoutV2 } from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/route-guard/AuthGuard";
import AuthGuardV2 from "../utils/route-guard/AuthGuardV2";
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
const ContactPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Contact"))
);
const AccountPage = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/AccountPage"))
);
const RolePage = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/RolePage"))
);
const UserProfilePage = Loadable(
  lazy(() => import("../views/dashboard-admin/ProfileUser"))
);
const DistributionOfPowers = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/DistributionOfPowers"))
);
const ControlPower = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/ControlPower"))
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

const DetailsPublicationsPage = Loadable(
  lazy(() => import("../views/dashboard-admin/DetailsPublications"))
);
const DetailsDirectoryPage = Loadable(
  lazy(() => import("../views/dashboard-admin/DetailsDirectory"))
);
const LoanSlipPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LoanSlipPage"))
);
const PayPage = Loadable(
  lazy(() => import("../views/dashboard-admin/BorrowToPayPage/PayPage"))
);
const RegistrationPage = Loadable(
  lazy(() => import("../views/dashboard-admin/BorrowToPayPage/RegistrationPage"))
);
const Documents = Loadable(
  lazy(() => import("../views/dashboard-admin/Documents"))
);
const TaiKhoan = Loadable(
  lazy(() => import("../views/dashboard-admin/Documents/taikhoan/taikhoan"))
);
const LoaiSach = Loadable(
  lazy(() => import("../views/dashboard-admin/Documents/danhmuc/loaisach"))
);
const AIBOX = Loadable(
  lazy(() => import("../views/dashboard-admin/AI"))
);
const Print = Loadable(
  lazy(() => import("../views/dashboard-admin/Print"))
);
const LibraryConnection = Loadable(
  lazy(() => import("../views/dashboard-admin/LibraryConnection"))
);

const LoginLienThong = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/AuthLT/index"))
);
const LibraryOriginal = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/Library/Original"))
);
const LibraryElectronic = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/Library/Electronic"))
);
const LibAuthor = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/Author"))
);
const LibCategory = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/Category"))
);
const LibTypeOfSupplies = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LibTypeOfSupplies"))
);
const LibPublisher = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/Publisher"))
);

const LibLoan = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LoanPayment/Loan"))
);
const LibPayment = Loadable(
  lazy(() => import("../views/dashboard-admin/LienThong/LIB/LoanPayment/Payment"))
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
      element: <HomePage />,
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
      element: <LibraryPage />,
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
      path: "/vai-tro",
      element: <RolePage />,
    },
    {
      path: "/tai-san-thu-vien",
      element: <AssetPage />,
    },
    {
      path: "quan-ly-danh-muc/dang-hoc-lieu",
      element: <MaterialPage />,
    },
    {
      path: "quan-ly-danh-muc/linh-vuc",
      element: <CategoryPage />,
    },
    {
      path: "/quan-ly-danh-muc/tac-gia",
      element: <AuthorPage />,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-tac-gia",
      element: <AuthorDeleteListPage />,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-linh-vuc",
      element: <CategoryDeleteListPage />,
    },
    {
      path: "/quan-ly-danh-muc/nha-san-xuat",
      element: <PublisherPage />,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-nha-san-xuat",
      element: <PublisherDeleteListPage />,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-dang-hoc-lieu",
      element: <MaterialDeleteListPage />,
    },
    {
      path: "/quan-ly-danh-muc/tu-ke",
      element: <ShelfPage />,
    },
    {
      path: "/quan-ly-danh-muc/danh-sach-xoa-tu-ke",
      element: <ShelfDeleteListPage />,
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
      element: <ShelvesProductPage />,
    },
    {
      path: "/quan-ly-kho/kho",
      element: <StockProductPage />,
    },
    {
      path: "/quan-ly-kho/thanh-ly-hu-hong",
      element: <LiquidationProductPage />,
    },

    {
      path: "/tai-san-thu-vien/thung-rac",
      element: <AssetTrashPage />,
    },
    {
      path: "/quan-ly-thanh-vien",
      element: <UserProfilePage />,
    },
    // Nhập kho
    {
      path: "/quan-ly-nhap-kho/nha-cung-cap",
      element: <SupplierPage />,
    },
    {
      path: "/quan-ly-nhap-kho/nha-cung-cap/danh-sach-xoa-nha-cung-cap",
      element: <SupplierDeleteListPage />,
    },
    {
      path: "/quan-ly-nhap-kho/phieu-nhap-kho",
      element: <WareHouseReceiptPage />,
    },
    {
      path: "/quan-ly-nhap-kho/phieu-nhap-kho/danh-sach-xoa-phieu-nhap-kho",
      element: <WareHouseReceiptDeleteListPage />,
    },
    {
      path: "/nhom-phan-quyen",
      element: <DistributionOfPowers />,
    },
    {
      path: "/phan-quyen",
      element: <ControlPower />,
    },
    {
      path: "/chi-tiet-hoc-lieu",
      element: <DetailsPublicationsPage />,
    },
    {
      path: "/chi-tiet-danh-muc",
      element: <DetailsDirectoryPage />,
    },

    {
      path: "/quan-ly-muon-tra/phieu-muon",
      element: <LoanSlipPage />,
    },
    {
      path: "/quan-ly-muon-tra/phieu-muon/danh-sach-xoa-phieu-muon",
      element: <LoanSlipDeleteListPage />,
    },
    {
      path: "/quan-ly-muon-tra/phieu-tra",
      element: <PayPage />,
    },
    {
      path: "/quan-ly-muon-tra/phieu-dang-ky-muon",
      element: <RegistrationPage />,
    },
    {
      path: "/Documents",
      element: <Documents />,
    },
    {
      path: "/Documents/tai-khoan",
      element: <TaiKhoan />,
    },
    {
      path: "/Documents/danh-muc/linh-vuc",
      element: <LoaiSach />,
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
      element: <LibraryConnection />,
    }
  ],
};

export const MainRoutesV2 = {
  path: "/",
  element: (
    <AuthGuardV2>
      <MainLayoutV2 />
    </AuthGuardV2>
  ),
  children: [
    {
      path: "lien-thong",
      element: <LoginLienThong />,
    },
    {
      path: "chia-se-thu-vien",
      element: <LibraryConnection />,
    },
    {
      path: "chia-se-thu-vien/an-pham",
      element: <LibraryOriginal />,
    },
    {
      path: "chia-se-thu-vien/hoc-lieu",
      element: <LibraryElectronic />,
    },
    {
      path: "chia-se-danh-muc/dang-hoc-lieu",
      element: <LibCategory />,
    },
    {
      path: "chia-se-danh-muc/linh-vuc",
      element: <LibTypeOfSupplies />,
    },
    // {
    //   path: "chia-se-danh-muc/tu-ke",
    //   element: <LibraryConnection />,
    // },
    {
      path: "chia-se-danh-muc/tac-gia",
      element: <LibAuthor />,
    },
    {
      path: "chia-se-danh-muc/nha-san-xuat",
      element: <LibPublisher />,
    },
    {
      path: "danh-sach-muon-tra-lien-thong/dang-ky",
      element: <LibLoan />,
    },
    {
      path: "danh-sach-muon-tra-lien-thong/muon",
      element: <LibPayment />,
    },
    {
      path: "tai-khoan-lien-thong",
      element: <LibAccount />,
    },
  ],
};
export default MainRoutes;
