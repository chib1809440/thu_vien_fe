import React, { forwardRef } from "react";
import { TWareHouseReceipt } from "../../../../types/models/warehouse-receipt";
import Barcode from 'react-barcode';
import { TSupplier } from "../../../../types/models/supplier.type";
import { User } from "../../../../interfaces/user";

// Đảm bảo xuất component theo cách đúng
const PrintWareHouseReceipt = forwardRef<HTMLDivElement, { wareHouseReceipt: TWareHouseReceipt }>(
    ({ wareHouseReceipt }, ref) => {
        // Tính tổng số lượng
        const totalQuantity = wareHouseReceipt?.publications?.reduce((total, publication) => {
            return total + (publication.quantityWareHouse || 0); // Cộng dồn số lượng, mặc định là 0 nếu không có
        }, 0);

        return (
            <div ref={ref} className="invoice-content" style={{ marginTop: 0, fontSize: '9px' }}>
                <h2 style={{ textAlign: "center", marginTop: 0 }}>Phiếu nhập ấn phẩm vào thư viện</h2>
                <p>
                    <strong>Thư viện:</strong> {(wareHouseReceipt?.createBy as User)?.school}
                </p>
                <p>
                    <strong>Nhà cung cấp:</strong> {(wareHouseReceipt?.supplierId as TSupplier).name}
                </p>
                <p>
                    <strong>Email:</strong> {(wareHouseReceipt?.supplierId as TSupplier).email}
                </p>
                <p>
                    <strong>Số điện thoại:</strong> {(wareHouseReceipt?.supplierId as TSupplier).phoneNumber}
                </p>
                <p>
                    <strong>Địa chỉ:</strong>  {(wareHouseReceipt?.supplierId as TSupplier).address}
                </p>
                <h3 style={{ textAlign: "center", marginTop: '0px' }}>Ấn phẩm nhập kho</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>STT</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tên ấn phẩm</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wareHouseReceipt?.publications?.map((publication, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{index + 1}</td> {/* Hiển thị STT */}
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{publication.name}</td>
                                <td width="30%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{publication.quantityWareHouse}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>Tổng cộng</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>{totalQuantity}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ textAlign: "center" }}>
                    <Barcode
                        value={wareHouseReceipt.barcode}
                        width={1} // Kích thước chiều rộng
                        height={50} // Kích thước chiều cao
                        fontSize={10}
                    />
                </div>
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
                        <p >{(wareHouseReceipt?.createBy as User)?.fullname}</p>
                    </div>
                </div>
            </div>
        );
    }
);

// Xuất component
export default PrintWareHouseReceipt;
