import IBreadcrumsCustom from "../../../../ui-component/breadcrums";
import MainCard from "../../../../ui-component/cards/MainCard";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  projectItem: any;
}) {

  return (
    <>
      <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile=" PHÂN QUYỀN" link="/trang-chu" />
      <MainCard title="DANH SÁCH QUYỀN">
       
      </MainCard>
    </>

  );
}
