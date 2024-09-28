import { lazy } from "react";
// project imports
import MainLayout, { MainLayoutV2 } from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/route-guard/AuthGuard";
import AuthGuardV2 from "../utils/route-guard/AuthGuardV2";

const HomePage = Loadable(
  lazy(() => import("../views/dashboard-admin/HomePage"))
);
const ExamplePage = Loadable(
  lazy(() => import("../views/dashboard-admin/ExamplePage"))
);

// hệ thống
const GroupPage = Loadable(
  lazy(() => import("../views/dashboard-admin/GroupPage"))
);
const LibraryPage = Loadable(
  lazy(() => import("../views/dashboard-admin/LibraryPage"))
);

// danh mục
const MaterialPage = Loadable(
  lazy(() => import("../views/dashboard-admin/MaterialPage"))
);
const ContactPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Contact"))
);
const AccountPage = Loadable(
  lazy(() => import("../views/dashboard-admin/SystemPage/AccountPage"))
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
// 
const TypeProductPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/TypeProduct"))
);
const TypeSupplyPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/TypeSupply"))
);
const SlideProductPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/sildeProduct"))
);
const AuthorPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/Author"))
);
const ProducerPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/Producer"))
);
const PrintedMatterPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/PrintedMatter"))
);
const ArchiveProductPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/ArchiveProduct"))
);
const CabinProductPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/CabinProduct"))
);
const StateOfBookPage = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/StateOfBook"))
);
const AssetLib = Loadable(
  lazy(() => import("../views/dashboard-admin/Directory/AssetLib"))
);
// PublicationsPage
const PublicationsPage = Loadable(
  lazy(() => import("../views/dashboard-admin/PublicationsPage"))
);
const PublicationsPageV2 = Loadable(
  lazy(() => import("../views/dashboard-admin/PublicationsPageV2"))
);
const DetailsPublicationsPage = Loadable(
  lazy(() => import("../views/dashboard-admin/DetailsPublications"))
);
const DetailsDirectoryPage = Loadable(
  lazy(() => import("../views/dashboard-admin/DetailsDirectory"))
);
const BorrowPage = Loadable(
  lazy(() => import("../views/dashboard-admin/BorrowToPayPage/BorrowPage"))
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
      element: <ContactPage />,
    },
    {
      path: "/quan-ly-tai-khoan",
      element: <AccountPage />,
    },
    {
      path: "/quan-ly-thanh-vien",
      element: <UserProfilePage />,
    },
    {
      path: "/quan-ly-danh-muc/tu-ke",
      element: <SlideProductPage />,
    },
    // {
    //   path: "quan-ly-danh-muc/dang-hoc-lieu",
    //   element: <TypeProductPage />,
    // },
    {
      path: "quan-ly-danh-muc/dang-hoc-lieu",
      element: <MaterialPage />,
    },
    {
      path: "/quan-ly-danh-muc/linh-vuc",
      element: <TypeSupplyPage />,
    },
    {
      path: "/quan-ly-danh-muc/tac-gia",
      element: <AuthorPage />,
    },
    {
      path: "/quan-ly-danh-muc/nha-san-xuat",
      element: <ProducerPage />,
    },
    {
      path: "/quan-ly-danh-muc/loai-hoc-lieu",
      element: <PrintedMatterPage />,
    },
    {
      path: "/tai-san-thu-vien",
      element: <AssetLib />,
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
      path: "/thu-vien/an-pham",
      element: <PublicationsPage />,
    },
    {
      path: "/thu-vien/hoc-lieu",
      element: <PublicationsPageV2 />,
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
      path: "/quan-ly-kho/tu-ke",
      element: <ArchiveProductPage />,
    },
    {
      path: "/quan-ly-kho/kho",
      element: <CabinProductPage />,
    },
    {
      path: "/quan-ly-kho/thanh-ly-hu-hong",
      element: <StateOfBookPage />,
    },
    {
      path: "/quan-ly-muon-tra/phieu-muon",
      element: <BorrowPage />,
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
