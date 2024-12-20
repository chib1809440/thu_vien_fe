export const typeOptions = [
    { value: 'ấn phẩm cứng', label: 'Ấn phẩm truyền thống' },
    { value: 'ấn phẩm mềm', label: 'Ấn phẩm điện tử' },
];
export const genderOptions = [
    { value: 'nữ', label: 'Nữ' },
    { value: 'nam', label: 'Nam' },
];
export const statusAssetOptions = [
    { value: 'có sẵn', label: 'Có sẵn' },
    { value: 'mới', label: 'Mới' },
];

export const statusOptions = [
    { value: 'trên kệ', label: 'Trên kệ' },
    { value: 'thanh lý', label: 'Thanh lý' },
    { value: 'bị hư hại', label: 'Bị hư hại' },
    { value: 'có sẵn', label: 'Có sẵn' },
    { value: 'không có sẵn', label: 'Không có sẵn' },
];

export const stockStatusOptions = [
    { value: 'trên kệ', label: 'Chuyển lên tủ - kệ' },
    { value: 'thanh lý', label: 'Ấn phẩm thanh lý' },
    { value: 'hư hỏng', label: 'Ấn phẩm hư hỏng' },
];

export const positionLiquidationDamaged = [
    { value: 'trên kệ', label: 'Từ trên kệ' },
    { value: 'trong kho', label: 'Từ trong kho' },
]

export const statusVoiceImage = [
    { value: false, label: 'Chung' },
    { value: true, label: 'Riêng' },
]

export const statusRole = [
    { value: "Admin", label: 'Thủ thư' },
    { value: "Teacher", label: 'Giáo viên' },
    { value: "Student", label: 'Học sinh' },
    { value: "Owner", label: 'Trưởng nhóm' },
    { value: "Super Admin", label: 'Super Admin' },
]

export const typeMaterial = [
    { value: "Video", label: 'Video' },
    { value: "pdf", label: 'Sách tham khảo' },
    { value: "img", label: 'Tranh ảnh' },
    { value: "word", label: 'Kế hoạch bài dạy' },
    { value: "ppt", label: 'Kế hoạch bài giảng' },
]

export function colorType(mimetype: string): string {
    switch (mimetype) {
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return '#007bff'; // Word
        case "application/vnd.ms-powerpoint":
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return '#ffc107'; // Powerpoint
        case "application/pdf":
            return '#fd6033'; // PDF
        case "video/mp4":
        case "video/x-msvideo":
        case "video/x-matroska":
        case "video/webm":
            return '#0b52cb'; // Video
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/bmp":
        case "image/webp":
            return '#28a745'; // Image
        default:
            return '#007e43'; // Default color
    }
}

const pastelGradients = [
    "linear-gradient(90deg, rgba(144, 238, 144, 1) 0%, rgba(173, 216, 230, 1) 100%)",
    "linear-gradient(90deg, rgba(221, 160, 221, 1) 0%, rgba(255, 192, 203, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 255, 224, 1) 0%, rgba(255, 165, 0, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 192, 203, 1) 0%, rgba(255, 99, 71, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 99, 71, 1) 0%, rgba(255, 255, 224, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 165, 0, 1) 0%, rgba(255, 192, 203, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 192, 203, 1) 0%, rgba(255, 99, 71, 1) 100%)",
    "linear-gradient(90deg, rgba(255, 255, 224, 1) 0%, rgba(255, 165, 0, 1) 100%)",
    "linear-gradient(90deg, rgba(135, 206, 235, 1) 0%, rgba(0, 255, 255, 1) 100%)",
    "linear-gradient(90deg, rgba(221, 160, 221, 1) 0%, rgba(255, 192, 203, 1) 100%)",
];

export const getRandomPastelGradient = () => {
    return pastelGradients[Math.floor(Math.random() * pastelGradients.length)];
};
