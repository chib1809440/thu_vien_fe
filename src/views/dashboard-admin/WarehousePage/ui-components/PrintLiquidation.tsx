import { forwardRef } from "react";
import { TLiquidation } from "../../../../types/models/liquidation.type";
import { User } from "../../../../interfaces/user";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { formatPrice } from "../../../../utils/object";

// Đảm bảo xuất component theo cách đúng
const PrintLiquidation = forwardRef<HTMLDivElement, { liquidationData: TLiquidation }>(
    ({ liquidationData }, ref) => {
        console.log(liquidationData);


        return (
            <div ref={ref} className="invoice-content" style={{ marginTop: 0, fontSize: '9px' }}>
                {/* Cộng hòa xã hội chủ nghĩa Việt Nam và khẩu hiệu */}
                <div style={{ textAlign: "center", fontWeight: "bold", display: "flex", justifyContent: "space-around", margin: 0 }}>
                    <p style={{ margin: 0, textTransform: "uppercase" }}>THƯ VIỆN: {(liquidationData?.createBy as User)?.school}</p>
                    <div>
                        <p style={{ margin: 0 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                        <p style={{ margin: 0, fontStyle: "italic" }}>Độc lập - Tự do - Hạnh phúc</p>
                    </div>
                </div>
                <br />
                <br />
                <h2 style={{ textAlign: "center", marginTop: '10px', textTransform: "uppercase" }}>Phiếu thông tin thanh lý</h2>
                <br />
                <h2 style={{ textAlign: "center", marginTop: '11px', textTransform: "uppercase" }}>DANH MỤC TÀI NGUYÊN THÔNG TIN ĐỦ ĐIỀU KIỆN THANH LỌC TÀI SẢN VÀ THANH LÝ ẤN PHẨM</h2>
                <br />

                <h3 style={{ textAlign: "left", marginTop: '10px', textTransform: "uppercase" }}>I. Thành phần tham dự</h3>
                <div>
                    <p style={{ margin: 0, textAlign: 'left', width: "300px", display: "flex", justifyContent: "space-between" }}>
                        1/ Đ/c ........................................................  <strong>Hiệu trưởng</strong>
                    </p>
                    <p style={{ margin: 0, textAlign: 'left', width: "300px", display: "flex", justifyContent: "space-between" }}>
                        2/ Đ/c {(liquidationData?.createBy as User)?.fullname}  <strong>Thủ thư thư viện</strong>
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: "10px" }}>
                    <p style={{ margin: 0 }}>Đã đổi chiếu sổ sách và xem xét hiện trạng giá trị sử dụng ấn phẩm truyền thống hoặc tài sản như sau:</p>
                    <p style={{ margin: 0, textAlign: 'right' }}>
                        Ngày lập biên bản: {new Date().toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>STT</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tên tài nguyên</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Số lượng</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Đơn vị tính</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Giá</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tổng giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Tài sản thư viện (Asset) */}
                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>Tài sản thư viện</td>
                        </tr>
                        {liquidationData?.liquidations?.filter(item => item.type === "Asset").map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{index + 1}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.name}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.quantityLiquidation}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Cái/Thiết bị</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{formatPrice(item.priceLiquidation)}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                                    {formatPrice(item.quantityLiquidation * item.priceLiquidation)}
                                </td>
                            </tr>
                        ))}

                        {/* Tổng cộng cho Tài sản thư viện */}
                        <tr>
                            <td colSpan={5} style={{ border: "1px solid black", padding: "8px", textAlign: "left", fontWeight: 'bold' }}>Tổng cộng thanh lọc tài sản</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>
                                {formatPrice(liquidationData?.liquidations?.filter(item => item.type === "Asset")
                                    .reduce((total, item) => total + item.quantityLiquidation * item.priceLiquidation, 0))}
                            </td>
                        </tr>

                        {/* Ấn phẩm truyền thống (Publications) */}
                        <tr>
                            <td colSpan={6} style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>Ấn phẩm truyền thống</td>
                        </tr>
                        {liquidationData?.liquidations?.filter(item => item.type === "Publication").map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{index + 1}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.name}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.quantityLiquidation}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Quyển</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{formatPrice(item.priceLiquidation)}</td>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>
                                    {formatPrice(item.quantityLiquidation * item.priceLiquidation)}
                                </td>
                            </tr>
                        ))}

                        {/* Tổng cộng cho Ấn phẩm truyền thống */}
                        <tr>
                            <td colSpan={5} style={{ border: "1px solid black", padding: "8px", textAlign: "left", fontWeight: 'bold' }}>Tổng cộng thanh lý ấn phẩm</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>
                                {formatPrice(liquidationData?.liquidations?.filter(item => item.type === "Publication")
                                    .reduce((total, item) => total + item.quantityLiquidation * item.priceLiquidation, 0))}
                            </td>
                        </tr>

                        {/* Tổng cộng toàn bộ */}
                        <tr>
                            <td colSpan={5} style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>Tổng cộng toàn bộ</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>
                                {formatPrice(liquidationData?.liquidations?.reduce((total, item) => total + item.quantityLiquidation * item.priceLiquidation, 0))}
                            </td>
                        </tr>
                    </tbody>
                </table>


                <p>Lý do thanh lý/thanh lọc: {capitalizeFirstLetter(liquidationData?.reason)}</p>

                {/* Phần ký tên */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ marginBottom: '0', marginLeft: '40px', marginRight: "40px" }}>
                        <br />
                        <p style={{ fontWeight: "bold" }}>Hiệu trưởng</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p >.............., ngày ........tháng........năm {new Date().getFullYear()}</p>
                        <p style={{ fontWeight: "bold" }}>Thủ thư</p>
                        <p ><i>(Ký tên)</i></p>
                        <br />
                        <p >{(liquidationData?.createBy as User)?.fullname}</p>
                    </div>
                </div>
            </div>


        );
    }
);

// Xuất component
export default PrintLiquidation;
