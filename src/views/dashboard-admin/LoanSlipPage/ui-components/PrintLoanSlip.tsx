import React, { forwardRef, useMemo } from "react";
import { TLoanSlip } from "../../../../types/models/loanSlip.type";
import Barcode from 'react-barcode';
import { useAuth } from "../../../../contexts/JWTContext";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
// Đảm bảo xuất component theo cách đúng
const PrintLoanSlip = forwardRef<HTMLDivElement, { loanSlip: TLoanSlip, libraryDetail: any }>(
    ({ loanSlip, libraryDetail }, ref) => {

        return (
            <div ref={ref} className="invoice-content" style={{ marginTop: 0, fontSize: '9px' }}>
                <h2 style={{ textAlign: "center", marginTop: 0 }}>Phiếu mượn sách</h2>
                <h4 style={{ textAlign: "center", marginTop: 0 }}>{capitalizeFirstLetter(libraryDetail?.name)}</h4>
                <p>
                    <strong>Họ và tên người mượn sách:</strong> {loanSlip?.userId?.fullname}
                </p>
                <p>
                    <strong>Email:</strong> {loanSlip?.userId?.email}
                </p>
                <p>
                    <strong>Số điện thoại:</strong> {loanSlip?.userId?.phoneNumber}
                </p>
                <p>
                    <strong>Địa chỉ:</strong> {loanSlip?.userId?.address}
                </p>
                {
                    loanSlip?.userId?.class && <p>
                        <strong>Lớp:</strong> {loanSlip?.userId?.class}
                    </p>
                }
                {
                    loanSlip?.userId?.school && <p>
                        <strong>Trường:</strong> {loanSlip?.userId?.school}
                    </p>
                }
                <h3 style={{ textAlign: "center", marginTop: '0px' }}>Danh sách sách mượn</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Tên sách</th>
                            <th style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanSlip?.publications?.map((publication, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{publication.name}</td>
                                <td width="30%" style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>{publication.quantityLoan}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: "center" }}>
                    <Barcode
                        value={loanSlip.barcode}
                        width={1} // Kích thước chiều rộng
                        height={50} // Kích thước chiều cao
                        fontSize={10}
                    />
                </div>
                <p>Cám ơn bạn!</p>
            </div>
        );
    });

// Xuất component
export default PrintLoanSlip;
