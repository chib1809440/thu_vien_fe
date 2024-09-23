export function chuanHoaChuoi(chuoi: string): string {
    // Chuyển đổi sang chữ thường và loại bỏ dấu
    if (chuoi === undefined || chuoi === null || chuoi === '')
        return '';
    return chuoi?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}