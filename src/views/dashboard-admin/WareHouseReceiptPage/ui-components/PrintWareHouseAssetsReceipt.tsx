import { forwardRef } from "react";
import { User } from "../../../../interfaces/user";
import { TSupplier } from "../../../../types/models/supplier.type";
import { TWareHouseAssetsReceipt } from "../../../../types/models/warehouse-assets-receipt";
import Barcode from "react-barcode";
import { formatPrice } from "../../../../utils/object";

// Đảm bảo xuất component theo cách đúng
const PrintWareHouseAssetsReceipt = forwardRef<HTMLDivElement, { wareHouseAssetsReceipt: TWareHouseAssetsReceipt }>(
    ({ wareHouseAssetsReceipt }, ref) => {
        console.log(wareHouseAssetsReceipt);


        return (
            <div ref={ref} className="invoice-content" style={{ marginTop: 0, fontSize: '9px' }}>
                <h2 style={{ textAlign: "center", marginTop: 0 }}>Phiếu nhập tài sản vào thư viện</h2>
                <p>
                    <strong>Thư viện:</strong> {(wareHouseAssetsReceipt?.createBy as User)?.school}
                </p>
                <p>
                    <strong>Nhà cung cấp:</strong> {(wareHouseAssetsReceipt?.supplierId as TSupplier).name}
                </p>
                <p>
                    <strong>Email:</strong> {(wareHouseAssetsReceipt?.supplierId as TSupplier).email}
                </p>
                <p>
                    <strong>Số điện thoại:</strong> {(wareHouseAssetsReceipt?.supplierId as TSupplier).phoneNumber}
                </p>
                <p>
                    <strong>Địa chỉ:</strong>  {(wareHouseAssetsReceipt?.supplierId as TSupplier).address}
                </p>
                <p>
                    Ngày lập phiếu nhập: {new Date().toLocaleDateString('vi-VN')}
                </p>

                <h3 style={{ textAlign: "center", marginTop: '0px' }}>Tài sản nhập kho</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>STT</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tên tài sản</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Số lượng</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Giá nhập</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tổng giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wareHouseAssetsReceipt?.assets?.map((asset, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{index + 1}</td> {/* Hiển thị STT */}
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{asset.name}</td>
                                <td width="15%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{asset.quantity}</td>
                                <td width="15%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{formatPrice(asset.price)}</td>
                                <td width="15%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{formatPrice(asset.quantity * asset.price)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={4} style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>Tổng cộng</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>
                                {formatPrice(wareHouseAssetsReceipt?.assets?.reduce((total, asset) => total + asset.quantity * asset.price, 0))}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ textAlign: "center" }}>
                    <Barcode
                        value={wareHouseAssetsReceipt?.barcode}
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
                        <p >{(wareHouseAssetsReceipt?.createBy as User)?.fullname}</p>
                    </div>
                </div>
            </div>
        );
    }
);

// Xuất component
export default PrintWareHouseAssetsReceipt;
