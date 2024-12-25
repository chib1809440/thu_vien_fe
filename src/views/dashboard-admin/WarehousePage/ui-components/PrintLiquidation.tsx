import { forwardRef } from "react";
import { TLiquidation } from "../../../../types/models/liquidation.type";
import { User } from "../../../../interfaces/user";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";

// Đảm bảo xuất component theo cách đúng
const PrintLiquidation = forwardRef<HTMLDivElement, { liquidationData: TLiquidation }>(
    ({ liquidationData }, ref) => {


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
                <h2 style={{ textAlign: "center", marginTop: '10px', textTransform: "uppercase" }}>Biên bản xin thanh lý</h2>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <p style={{ margin: 0 }}>Đã đổi chiếu sổ sách và xem xét hiện trạng giá trị sử dụng ấn phẩm truyền thống hoặc tài sản như sau:</p>
                    <p style={{ margin: 0, textAlign: 'right' }}>
                        Ngày lập biên bản: {new Date().toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>STT</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Thông tin thanh lý</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Số lượng thanh lý</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Giá</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tổng giá</th>
                        </tr>
                    </thead>
                    <tbody>

                        {liquidationData?.liquidations?.map((item, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{index + 1}</td> {/* Hiển thị STT */}
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.name}</td>
                                <td width="15%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.quantityLiquidation}</td>
                                <td width="15%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.priceLiquidation}</td>
                                <td width="15%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{item.quantityLiquidation * item.priceLiquidation}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={4} style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>Tổng cộng</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>
                                {liquidationData?.liquidations?.reduce((total, item) => total + item.quantityLiquidation * item.priceLiquidation, 0)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>Lý do thanh lý: {capitalizeFirstLetter(liquidationData?.reason)}</p>

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
