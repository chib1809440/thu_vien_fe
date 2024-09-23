import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  projectItem: any;
}) {

  return (
    <>
      <IBreadcrumsCustom profile="Quản lý phân quyền" mainProfile="Danh sách hồ sơ" link="/trang-chu" />
      <MainCard title="Quản lý hồ sơ">
       
      </MainCard>
    </>

  );
}
