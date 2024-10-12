export function formatDate(dateString: string): string {
    // Tạo đối tượng Date từ chuỗi ISO
    const date = new Date(dateString);

    // Kiểm tra nếu date là hợp lệ
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }

    // Thêm 7 giờ vào thời gian
    date.setUTCHours(date.getUTCHours() + 7);

    // Lấy ngày, tháng, và năm từ đối tượng Date
    const day = String(date.getUTCDate()).padStart(2, '0'); // Lấy ngày theo UTC
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng theo UTC, thêm 1 vì getUTCMonth() trả về từ 0-11
    const year = date.getUTCFullYear(); // Năm theo UTC

    // Trả về chuỗi theo định dạng dd/MM/yyyy
    return `${day}/${month}/${year}`;
}