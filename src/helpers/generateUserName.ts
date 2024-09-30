export function generateUserName(fullname: string, birthday: string): string {
    // Chia tách họ tên thành các phần
    const nameParts = fullname.split(" ");

    // Lấy chữ cái đầu tiên của họ (phần đầu tiên) và phần tên (phần cuối cùng)
    const firstNameInitial = nameParts[0].charAt(0).toLowerCase();
    const lastName = nameParts[nameParts.length - 1].toLowerCase();

    // Chuyển đổi ngày sinh sang định dạng 'dd/mm/yyyy'
    const birthDate = new Date(birthday);
    const year = birthDate.getFullYear();

    // Kết hợp để tạo tên người dùng
    return `${firstNameInitial}${lastName}${year}`;
}