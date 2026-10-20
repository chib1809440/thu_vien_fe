import { forwardRef } from "react";
import Barcode from "react-barcode";
import { formatDate } from "../../../../helpers/formatDate";
import { Role } from "../../../../interfaces/role";
import { User } from "../../../../interfaces/user";
import { statusRole } from "../../../../utils/constants.utils";
import { getLabelFromOptions } from "../../../../utils/object";
import { TLibrary } from "../../../../types/models/library.type";
interface PrintAccountProps {
    dataUsers: User | User[];
}

const PrintAccount = forwardRef<HTMLDivElement, PrintAccountProps>(({ dataUsers }, ref) => {
    const users = Array.isArray(dataUsers) ? dataUsers : [dataUsers];
    const usersPerPage = 8
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / usersPerPage);

    const paginatedUsers = Array.from({ length: totalPages }, (_, pageIndex) => {
        return users.slice(pageIndex * usersPerPage, (pageIndex + 1) * usersPerPage);
    });

    return (
        <div style={{ display: "none" }}>
            <div
                ref={ref}
                id="printAccountBarCode"
                style={{
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    textAlign: "center",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "16px",
                }}
            >
                {users?.map((user, index) => (
                    <div
                        key={user._id}
                        className="printAccountCard"
                        style={{
                            width: "100%",
                            height: "220px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            border: "2px solid #000",
                            borderRadius: "8px",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ width: "100%", height: "220px", position: "relative" }}>
                            <img
                                src={`${import.meta.env.REACT_APP_BASE_API_FILE_URL}/default/bg-img.png`}
                                alt="bg"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    imageRendering: "pixelated",
                                    opacity: 1,
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    filter: "blur(1px)"
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    right: "0",
                                    bottom: "0",
                                    background: "rgba(243, 217, 178, 0.4)",
                                    zIndex: 1,
                                }}
                            />
                        </div>

                        <div style={{
                            position: "absolute",
                            top: "6px",
                            left: "26px",
                            fontSize: "16px",
                            color: "#fff",
                            fontWeight: "bold",
                            zIndex: 2
                        }}>
                            <div>
                                {user?.libraryId && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            textTransform: "uppercase",
                                            margin: "0 0 2px 0",
                                            fontSize: "12px",
                                            color: "blue",
                                        }}
                                    >
                                        Sở Giáo Dục & Đào Tạo {(user?.libraryId as TLibrary)?.managementAgency}
                                    </div>
                                )}
                                {user?.school && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            textTransform: "uppercase",
                                            margin: "0 0 4px 0",
                                            fontSize: "13px",
                                            color: "#75ba75",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Trường {user?.school}
                                    </div>
                                )}
                                <h4
                                    style={{
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        margin: "0 0 2px 0",
                                        fontSize: "16px",
                                        color: "red",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Thẻ thư viện
                                </h4>
                                <div style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", color: "black" }}>
                                    {getLabelFromOptions(
                                        statusRole,
                                        (user?.roleId as Role)?.name
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "14px",
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "120px",
                                        width: "40%",
                                    }}
                                >
                                    <img
                                        src={import.meta.env.REACT_APP_BASE_API_FILE_URL + user?.avatar}
                                        alt="Avatar"
                                        style={{ width: "100%", height: "100%", borderRadius: "8px", marginBottom: 5 }}
                                    />
                                </div>
                                <div style={{ textAlign: "left", width: "60%" }}>

                                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "blue" }}>
                                        <strong>Họ và tên:</strong> {user?.fullname}
                                    </div>
                                    <div style={{ display: "flex", gap: "2px", fontSize: "11px", fontWeight: "bold", color: "blue" }}>
                                        <strong>Ngày sinh:</strong> {formatDate(user?.birthday)}
                                    </div>
                                    {user?.class && (
                                        <div style={{ fontSize: "11px", fontWeight: "bold", color: "blue" }}>
                                            <strong>Lớp:</strong> {user?.class}
                                        </div>
                                    )}
                                    {user?.barcode && (
                                        <div>
                                            <Barcode
                                                value={user?.barcode}
                                                width={1}
                                                height={30}
                                                fontSize={6}
                                                background="transparent"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default PrintAccount;