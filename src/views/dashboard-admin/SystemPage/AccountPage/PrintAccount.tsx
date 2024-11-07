import { forwardRef } from "react";
import { User } from "../../../../interfaces/user";
import { formatDate } from "../../../../helpers/formatDate";
import Barcode from "react-barcode";
import { TLibrary } from "../../../../types/models/library.type";
import { Role } from "../../../../interfaces/role";
import { getLabelFromOptions } from "../../../../utils/object";
import { statusRole } from "../../../../utils/constants.utils";
// Đảm bảo xuất component theo cách đúng
const PrintAccount = forwardRef<HTMLDivElement, { user: User }>(
    ({ user }, ref) => {

        return (
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",  // 2 cột
                gap: "16px",  // Khoảng cách giữa các card
                padding: "16px"
            }}>

                <div ref={ref} style={{
                    maxWidth: "300px",
                    padding: "16px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    margin: "8px",
                    backgroundColor: "#fff",
                    textAlign: "center"
                }}>
                    <div >
                        {user?.school && (
                            <div style={{ textAlign: "center", marginBottom: "10px", fontSize: "10px" }}>
                                <strong>Trường:</strong>
                                <span style={{ fontWeight: "bold", color: "#333" }}>{user?.school}</span>
                            </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img
                                    src="/images/user.png"
                                    alt="Avatar"
                                    style={{ width: "50px", height: "auto", borderRadius: "8px" }}
                                />
                            </div>
                            <div style={{ width: "70%", textAlign: "left" }}>
                                <h5 style={{ textAlign: "center", fontWeight: "bold", textTransform: "uppercase", margin: "0 0 8px 0", fontSize: "10px" }}>
                                    {(user?.libraryId as TLibrary)?.name}
                                </h5>
                                <h4 style={{ textAlign: "center", textTransform: "uppercase", margin: "0 0 12px 0", fontSize: "10px" }}>Thẻ thư viện</h4>
                                <div style={{ fontSize: "10px" }}>
                                    <strong>Họ và tên:</strong> {user?.fullname}
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <div style={{ display: "flex", gap: "4px", fontSize: "10px" }} >
                                        <strong>Ngày sinh:</strong> {formatDate(user?.birthday)}
                                    </div>
                                    <div style={{ display: "flex", gap: "4px", fontSize: "10px" }}>
                                        <strong>Đối tượng:</strong> {getLabelFromOptions(statusRole, (user?.roleId as Role)?.name)}
                                    </div>
                                </div>
                                <div style={{ textAlign: "center", marginTop: "12px" }}>
                                    <Barcode
                                        value={user?.barcode}
                                        width={1}
                                        height={20}
                                        fontSize={6}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    });

// Xuất component
export default PrintAccount;
