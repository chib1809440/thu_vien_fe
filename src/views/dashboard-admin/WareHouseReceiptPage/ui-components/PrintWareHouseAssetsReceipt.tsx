import { forwardRef } from "react";
import { TSupplier } from "../../../../types/models/supplier.type";
import { TWareHouseAssetsReceipt } from "../../../../types/models/warehouse-assets-receipt";

// Đảm bảo xuất component theo cách đúng
const PrintWareHouseAssetsReceipt = forwardRef<HTMLDivElement, { wareHouseAssetsReceipt: TWareHouseAssetsReceipt }>(
    ({ wareHouseAssetsReceipt }, ref) => {
        // Tính tổng số lượng
        const totalQuantity = wareHouseAssetsReceipt?.assets?.reduce((total, publication) => {
            return total + (publication.quantityWareHouse || 0); // Cộng dồn số lượng, mặc định là 0 nếu không có
        }, 0);

        return (
            <div ref={ref} className="invoice-content" style={{ marginTop: 0, fontSize: '9px' }}>
                <h2 style={{ textAlign: "center", marginTop: 0 }}>Phiếu nhập ấn phẩm vào thư viện</h2>
                <p>
                    <strong>Đơn vị:</strong> .........................................................................
                </p>
                <p>
                    <strong>Bộ phận:</strong> .....................................................................
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
                <h3 style={{ textAlign: "center", marginTop: '0px' }}>Tài sản nhập kho</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>STT</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tên tài sản</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wareHouseAssetsReceipt?.assets?.map((asset, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{index + 1}</td> {/* Hiển thị STT */}
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{asset.name}</td>
                                <td width="30%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{asset.quantityWareHouse}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>Tổng cộng</td>
                            <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: 'bold' }}>{totalQuantity}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Phần ký tên */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <p style={{ marginBottom: '0', marginLeft: '40px' }}>Hiệu trưởng</p>
                    <p style={{ marginBottom: '0', marginLeft: '40px' }}>Thủ thư</p>
                    <p style={{ marginBottom: '0', marginRight: '40px' }}>Các bộ nhập tài sản</p>
                </div>
            </div>
        );
    }
);

// Xuất component
export default PrintWareHouseAssetsReceipt;
