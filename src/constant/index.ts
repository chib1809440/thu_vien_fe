export const identityType = [
	{
		value: "1",
		label: "CMND",
	},
	{
		value: "2",
		label: "CCCD",
	},
	{
		value: "3",
		label: "Hộ chiếu",
	}
];
export const socialsListConstant = [
	{
		value: "Facebook",
		name: "Facebook",
		icon: "/icons/socials/facebook.svg"
	},
	{
		value: "Telegram",
		name: "Telegram",
		icon: "/icons/socials/telegram.svg"
	},
	{
		value: "Zalo",
		name: "Zalo",
		icon: "/icons/socials/zalo.svg"
	},
	{
		value: "Tiktok",
		name: "Tiktok",
		icon: "/icons/socials/tiktok.svg"
	},
	{
		value: "Discord",
		name: "Discord",
		icon: "/icons/socials/discord.svg"
	},
	{
		value: "Medium",
		name: "Medium",
		icon: "/icons/socials/medium.svg"
	},
	{
		value: "Twitter",
		name: "Twitter",
		icon: "/icons/socials/twitter.svg"
	},
	{
		value: "Instagram",
		name: "Instagram",
		icon: "/icons/socials/instagram.svg"
	},
	{
		value: "YouTube",
		name: "YouTube",
		icon: "/icons/socials/youtube.svg"
	},
	{
		value: "Tùy chọn khác",
		name: "Tùy chọn khác",
		icon: "/icons/socials/more.svg"
	},
]
export const roundList = [
	{
        value: "1",
        name: "Private",
    },
    {
        value: "2",
        name: "Pre-seed funding",
    },
    {
        value: "3",
        name: "Seed funding"
    },
    {
        value: "4",
        name: "Series A",
    },
    {
        value: "5",
        name: "Series B",
    },
    {
        value: "6",
        name: "Series C",
    },
    {
        value: "7",
        name: "IPO",
    }
];

export const genderType = [
	{
		value: "1",
		label: "Nam",
	},
	{
		value: "2",
		label: "Nữ",
	},
];

export interface BusinessAreas {
	value: String | undefined | null | any,
	label: String,
	__isNew__?: undefined | null | boolean
}

export const businessAreas: BusinessAreas[] = [
	{
		value: "Thời trang, mỹ phẩm, chăm sóc sức khỏe",
		label: "Thời trang, mỹ phẩm, chăm sóc sức khỏe",
	},
	{
		value: "Máy tính, điện thoại, thiết bị văn phòng",
		label: "Máy tính, điện thoại, thiết bị văn phòng",
	},
	{
		value: "Sách, văn phòng phẩm",
		label: "Sách, văn phòng phẩm",
	},
	{
		value: "Thiết bị nội thất, ngoại thất",
		label: "Thiết bị nội thất, ngoại thất",
	},
	{
		value: "Hàng điện tử, điện lạnh, đồ gia dụng",
		label: "Hàng điện tử, điện lạnh, đồ gia dụng",
	},
	{
		value: "Hoa, quà tặng, đồ chơi",
		label: "Hoa, quà tặng, đồ chơi",
	},
	{
		value: "Bất động sản",
		label: "Bất động sản",
	},
	{
		value: "Dịch vụ lưu trú và du lịch",
		label: "Dịch vụ lưu trú và du lịch",
	},
	{
		value: "Thực phẩm, đồ uống",
		label: "Thực phẩm, đồ uống",
	},
	{
		value: "Dịch vụ việc làm",
		label: "Dịch vụ việc làm",
	},
	{
		value: "Ôtô, xe máy, xe đạp",
		label: "Ôtô, xe máy, xe đạp",
	},
	{
		value: "Công nghiệp, xây dựng",
		label: "Công nghiệp, xây dựng",
	},
	{
		value: "Dịch vụ khác",
		label: "Dịch vụ khác",
	},
	{
		value: "Hàng hóa khác",
		label: "Hàng hóa khác",
	},
	{
		value: "Dịch vụ phần mềm, thiết kế website",
		label: "Dịch vụ phần mềm, thiết kế website",
	},
	{
		value: "Dịch vụ đăng ký tên miền, hosting",
		label: "Dịch vụ đăng ký tên miền, hosting",
	},
	{
		value: "Dịch vụ thẻ",
		label: "Dịch vụ thẻ",
	},
	{
		value: "Dịch vụ trung gian thanh toán",
		label: "Dịch vụ trung gian thanh toán",
	},
	{
		value: "Đại lý vé máy bay, tàu, xe",
		label: "Đại lý vé máy bay, tàu, xe",
	},
	{
		value: "Mẹ và bé",
		label: "Mẹ và bé",
	},
	{
		value: "Dịch vụ truyền thông, quảng cáo, sự kiện",
		label: "Dịch vụ truyền thông, quảng cáo, sự kiện",
	},
	{
		value: "Dịch vụ vận chuyển, giao nhận",
		label: "Dịch vụ vận chuyển, giao nhận",
	},
	{
		value: "Dịch vụ nội dung số",
		label: "Dịch vụ nội dung số",
	},
	{
		value: "Dịch vụ đào tạo trực tuyến",
		label: "Dịch vụ đào tạo trực tuyến",
	},
	{
		value: "Điện thoại, máy tính bảng",
		label: "Điện thoại, máy tính bảng",
	},
	{
		value: "Điện gia dụng - điện máy",
		label: "Điện gia dụng - điện máy",
	},
	{
		value: "Máy tính -  Laptop",
		label: "Máy tính -  Laptop",
	},
	{
		value: "Thiết bị số - Phụ kiện (Bao gồm phụ kiện số, phụ kiện công nghệ…)",
		label: "Thiết bị số - Phụ kiện (Bao gồm phụ kiện số, phụ kiện công nghệ…)",
	},
	{
		value: "Tivi, Máy ảnh, máy quay, âm thanh",
		label: "Tivi, Máy ảnh, máy quay, âm thanh",
	},
	{
		value: "Nhà cửa - đời sống (Bao gồm đồ gia dụng, tạp hóa…)",
		label: "Nhà cửa - đời sống (Bao gồm đồ gia dụng, tạp hóa…)",
	},
	{
		value: "Làm đẹp - Sức khỏe",
		label: "Làm đẹp - Sức khỏe",
	},
	{
		value: "Thực phẩm - thực phẩm chức năng (Bao gồm thực phẩm tiêu dùng)",
		label: "Thực phẩm - thực phẩm chức năng (Bao gồm thực phẩm tiêu dùng)",
	},
	{
		value: "Thời trang - Phụ kiện (Bao gồm đồng hồ, Quần áo, giầy dép, túi ví,…)",
		label: "Thời trang - Phụ kiện (Bao gồm đồng hồ, Quần áo, giầy dép, túi ví,…)",
	},
	{
		value: "Ô tô - Xe máy - Xe đạp & Phụ kiện (Bao gồm: Định vị, Pin, đồ độ xe, camera hành trình…)",
		label: "Ô tô - Xe máy - Xe đạp & Phụ kiện (Bao gồm: Định vị, Pin, đồ độ xe, camera hành trình…)",
	},
	{
		value: "Thể thao - Dã  ngoại - Du lịch",
		label: "Thể thao - Dã  ngoại - Du lịch",
	},
	{
		value: "Sách - VPP - Quà tặng",
		label: "Sách - VPP - Quà tặng",
	},
	{
		value: "Phiếu mua hàng, phiếu sử dụng dịch vụ",
		label: "Phiếu mua hàng, phiếu sử dụng dịch vụ",
	},
	{
		value: "Thẻ khách hàng thường xuyên",
		label: "Thẻ khách hàng thường xuyên",
	},
	{
		value: "Dịch vụ vé máy bay, đặt chỗ",
		label: "Dịch vụ vé máy bay, đặt chỗ",
	},
	{
		value: "Dịch vụ Lưu trú và Du lịch",
		label: "Dịch vụ Lưu trú và Du lịch",
	},
	{
		value: "Dịch vụ ăn uống, ẩm thực",
		label: "Dịch vụ ăn uống, ẩm thực",
	},
	{
		value: "Dịch vụ giao hàng, chuyển phát",
		label: "Dịch vụ giao hàng, chuyển phát",
	},
	{
		value: "Dịch vụ vận tải bằng xe công nghệ",
		label: "Dịch vụ vận tải bằng xe công nghệ",
	},
	{
		value: "Dịch vụ môi giới việc làm",
		label: "Dịch vụ môi giới việc làm",
	},
	{
		value: "Dịch vụ đào tạo, tư vấn du học",
		label: "Dịch vụ đào tạo, tư vấn du học",
	},
	{
		value: "Dịch vụ tên miền, hosting",
		label: "Dịch vụ tên miền, hosting",
	},
	{
		value: "Dịch vụ quảng cáo trực tuyến",
		label: "Dịch vụ quảng cáo trực tuyến",
	},
	{
		value: "Dịch vụ quảng cáo, tổ chức sự kiện",
		label: "Dịch vụ quảng cáo, tổ chức sự kiện",
	},
	{
		value: "Dịch vụ chăm sóc sắc đẹp",
		label: "Dịch vụ chăm sóc sắc đẹp",
	},
	{
		value: "Dịch vụ y tế, chăm sóc sức khỏe",
		label: "Dịch vụ y tế, chăm sóc sức khỏe",
	},
	{
		value: "Dịch vụ vận tải, logistics",
		label: "Dịch vụ vận tải, logistics",
	},
	{
		value: "Dịch vụ môi giới, mua hộ",
		label: "Dịch vụ môi giới, mua hộ",
	},
	{
		value: "Dịch vụ nạp thẻ (Bao gồm thẻ điện thoại, thẻ games,…)",
		label: "Dịch vụ nạp thẻ (Bao gồm thẻ điện thoại, thẻ games,…)",
	},
	{
		value: "Dịch vụ tư vấn tài chính, kế toán, thuế",
		label: "Dịch vụ tư vấn tài chính, kế toán, thuế",
	},
	{
		value: "Dịch vụ tư vấn hồ sơ, pháp lý",
		label: "Dịch vụ tư vấn hồ sơ, pháp lý",
	},
	{
		value: "Dịch vụ sửa chữa, bảo trì, lắp đặt",
		label: "Dịch vụ sửa chữa, bảo trì, lắp đặt",
	},
	{
		value: "Dịch vụ tư vấn, thiết kế xây dựng, kiến trúc",
		label: "Dịch vụ tư vấn, thiết kế xây dựng, kiến trúc",
	},
	{
		value: "Dịch vụ vệ sinh, môi trường",
		label: "Dịch vụ vệ sinh, môi trường",
	},
	{
		value: "Dịch vụ xuất, nhập khẩu",
		label: "Dịch vụ xuất, nhập khẩu",
	},
	{
		value: "Dịch vụ Công nghệ thông tin",
		label: "Dịch vụ Công nghệ thông tin",
	},
	{
		value: "Dịch vụ viễn thông - giải trí & giá trị gia tăng",
		label: "Dịch vụ viễn thông - giải trí & giá trị gia tăng",
	},
	{
		value: "Dịch vụ cho thuê",
		label: "Dịch vụ cho thuê",
	},
	{
		value: "Dịch vụ phân phối  & Nhượng quyền",
		label: "Dịch vụ phân phối  & Nhượng quyền",
	},
	{
		value: "Dịch vụ bảo hiểm - ngân hàng - tài chính",
		label: "Dịch vụ bảo hiểm - ngân hàng - tài chính",
	},

]
