import { forwardRef } from "react";
import Barcode from "react-barcode";
import { formatDate } from "../../../../helpers/formatDate";
import { Role } from "../../../../interfaces/role";
import { User } from "../../../../interfaces/user";
import { statusRole } from "../../../../utils/constants.utils";
import { getLabelFromOptions } from "../../../../utils/object";
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
                            padding: "16px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            border: "2px solid #000",
                            borderRadius: "8px",
                        }}
                    >
                        {user?.school && (
                            <div
                                style={{
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    margin: "0 0 2px 0",
                                    fontSize: "14px",
                                    color: "#fd6033",
                                }}
                            >
                                {user?.school}
                            </div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "90px",
                                }}
                            >
                                <img
                                    src={process.env.REACT_APP_BASE_API_FILE_URL + user?.avatar}
                                    alt="Avatar"
                                    style={{ width: "80px", height: "100%", borderRadius: "8px" }}
                                />
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <h4
                                    style={{
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        margin: "0 0 2px 0",
                                        fontSize: "14px",
                                        color: "#fd6033",
                                    }}
                                >
                                    Thẻ thư viện
                                </h4>
                                <div style={{ textAlign: "center", fontSize: "11px" }}>
                                    {getLabelFromOptions(
                                        statusRole,
                                        (user?.roleId as Role)?.name
                                    )}
                                </div>
                                <div style={{ fontSize: "12px" }}>
                                    <strong>Họ và tên:</strong> {user?.fullname}
                                </div>
                                <div style={{ display: "flex", gap: "2px", fontSize: "11px" }}>
                                    <strong>Ngày sinh:</strong> {formatDate(user?.birthday)}
                                </div>
                                {user?.class && (
                                    <div style={{ fontSize: "11px", margin: "0 0 1px 0" }}>
                                        <strong>Lớp:</strong> {user?.class}
                                    </div>
                                )}
                                {user?.barcode && (
                                    <div style={{ textAlign: "center" }}>
                                        <Barcode
                                            value={user?.barcode}
                                            width={1}
                                            height={30}
                                            fontSize={6}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default PrintAccount;