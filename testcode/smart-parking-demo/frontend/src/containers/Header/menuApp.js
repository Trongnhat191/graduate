export const adminMenu = [
    { //hệ thống
        name: 'Hệ thống', menus: [
            {
                name: 'Quản trị hệ thống',
                subMenus: [
                    { name: 'Quản lý người sử dụng', link: '/system/user-manage' },
                    { name: 'Quản lý gói', link: '/system/product-manage' },
                    { name: 'Đăng ký gói dịch vụ cho nhóm/tài khoản', link: '/system/register-package-group-or-account' },
                ]
            },
            // { name: 'menu.system.system-parameter.header', link: '/system/system-parameter' },
        ]
    },
];