import { FolderOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router'
import { Menu, MenuProps } from "antd";
import { useState } from "react";


const items: MenuProps['items'] = [
    {
      label: 'Проекты',
      key: 'projects',
      icon: <FolderOutlined />,
    },
    {
        label: 'Профиль',
        key: 'profile',
        icon: <UserOutlined />,
    },
    {
        label: 'Вход',
        key: 'login',
        icon: <UserOutlined />,
    },
];

const Header = () => {
    const router = useRouter()
    const keyFromRoute = router.pathname.split('/')[1]
    const [current, setCurrent] = useState(keyFromRoute || 'projects');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        router.push(`/${e.key}`)
    };

    return (
        <header>
            <Menu 
                className="header__content" 
                onClick={onClick} 
                selectedKeys={[current]} 
                mode="horizontal" 
                items={items} 
            />
        </header>
    )
}

export default Header