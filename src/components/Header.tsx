import { FolderOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router'
import { Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useProfileInfoQuery } from "@/store/services/authService";
import { deleteCookie, getCookie } from "cookies-next";
import { selectAuthState, setAuthState, setId, setName } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/Menu.module.scss"


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
    {
        label: 'Выход',
        key: 'logout',
        icon: <LogoutOutlined />,
    },
];

const Header = () => {
    const router = useRouter()
    const [current, setCurrent] = useState('');

    const token = getCookie('token')
    const {data} = useProfileInfoQuery(token as string)
    const authState = useSelector(selectAuthState);
    const dispatch = useDispatch();


    useEffect(() => {
        if (data) {
            dispatch(setAuthState(true))
            dispatch(setName(data.name))
            dispatch(setId(data.id))
        }
    }, [data, dispatch])

    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            deleteCookie('token')
            router.push(`/projects`)
            router.reload()
            return
        }
        setCurrent(e.key);
        router.push(`/${e.key}`)
    };

    useEffect(() => {
        const keyFromRoute = router.pathname.split('/')[1]
        setCurrent(keyFromRoute)
    }, [router])

    return (
        <header>
            <Menu 
                className={`header__content ${styles.menu}`}
                onClick={onClick} 
                selectedKeys={[current]} 
                mode="horizontal" 
                items={items.filter(item => {
                    if (authState === true && item.key === 'login') return false
                    if (authState === false && ['profile', 'logout'].includes(item.key as string)) return false
                    return true
                })} 
            />
        </header>
    )
}

export default Header