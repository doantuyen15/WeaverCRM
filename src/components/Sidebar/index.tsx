import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
// import { Switch } from './components/Switch';
// import { SidebarHeader } from './components/SidebarHeader';
// import { Diamond } from './icons/Diamond';
// import { BarChart } from './icons/BarChart';
// import { Global } from './icons/Global';
// import { InkBottle } from './icons/InkBottle';
// import { Book } from './icons/Book';
// import { Calendar } from './icons/Calendar';
// import { ShoppingCart } from './icons/ShoppingCart';
// import { Service } from './icons/Service';
// import { SidebarFooter } from './components/SidebarFooter';
// import { Badge } from './components/Badge';
// import { Typography } from './components/Typography';
// import { PackageBadges } from './components/PackageBadges';

type Theme = 'light' | 'dark';

const themes = {
    light: {
        root: {
            text: {
                color: `var(--white)`
            }
        },
        sidebar: {
            backgroundColor: '#ffffff',
            color: '#607489',
        },
        menu: {
            menuContent: 'var(--primary)',
            icon: '#0098e5',
            hover: {
                // backgroundColor: '#c5e4ff',
                backgroundColor: '#FFF',
                color: '#44596e',
            },
            disabled: {
                color: '#9fb6cf',
            },
        },
    },
    dark: {
        root: {
            text: {
                color: 'var(--white)'
            }
        },
        sidebar: {
            backgroundColor: '#0b2948',
            color: '#8ba1b7',
        },
        menu: {
            menuContent: '#082440',
            icon: '#59d0ff',
            hover: {
                backgroundColor: '#00458b',
                color: '#b6c8d9',
            },
            disabled: {
                color: '#3e5e7e',
            },
        },
    },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const SidebarLayout: React.FC = () => {
    const [toggled, setToggled] = React.useState(false);
    const [broken, setBroken] = React.useState(false);
    const [rtl, setRtl] = React.useState(false);
    const [hasImage, setHasImage] = React.useState(false);
    const [theme, setTheme] = React.useState<Theme>('light');

    // handle on RTL change event
    const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRtl(e.target.checked);
    };

    // handle on theme change event
    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    };

    // handle on image change event
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasImage(e.target.checked);
    };

    const menuItemStyles: MenuItemStyles = {
        root: {
            fontSize: '13px',
            fontWeight: 400,
            color: themes[theme].root.text.color,
        },
        icon: {
            color: themes[theme].menu.icon,
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
        },
        SubMenuExpandIcon: {
            color: 'var(--white)',
            paddingBottom: 3
        },
        subMenuContent: ({ level }: { level: any }) => ({
            backgroundColor: themes[theme].menu.menuContent
            // level === 0
            //   ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
            //   : 'transparent',
        }),
        button: {
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
            '&:hover': {
                // backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
                backgroundColor: themes[theme].menu.hover.backgroundColor,
                color: themes[theme].menu.hover.color,
                borderTopLeftRadius: '5rem',
                borderBottomLeftRadius: '5rem',
            },
        },
        label: ({ open }) => ({
            fontWeight: open ? 600 : undefined,
        }),
    };

    const [collapsed, setCollapse] = useState(true)
    const toggleCollapse = () => {
        setCollapse(prev => !prev)
    }

    return (

        // <div className='flex-1'>
        <Sidebar
            onMouseEnter={toggleCollapse}
            onMouseLeave={toggleCollapse}
            onTouchStart={toggleCollapse}
            onTouchEnd={toggleCollapse}
            collapsed={collapsed}
            toggled={toggled}
            onBackdropClick={() => setToggled(false)}
            onBreakPoint={setBroken}
            rtl={rtl}
            breakPoint="md"
            backgroundColor={'var(--primary)'}
            rootStyles={{
                color: themes[theme].sidebar.color,
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* <SidebarHeader rtl={rtl} style={{ marginBottom: '24px', marginTop: '16px' }} /> */}
                <div style={{ flex: 1, marginBottom: '32px' }}>
                    {/* <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography>
            </div> */}
                    <Menu menuItemStyles={menuItemStyles}>
                        <SubMenu
                            label="Charts"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                </svg>
                            }
                        // suffix={
                        //   <Badge variant="danger" shape="circle">
                        //     6
                        //   </Badge>
                        // }
                        >
                            <MenuItem> Pie charts</MenuItem>
                            <MenuItem> Line charts</MenuItem>
                            <MenuItem> Bar charts</MenuItem>
                        </SubMenu>
                        <SubMenu
                            label="Maps"
                        // icon={<Global />}
                        >
                            <MenuItem> Google maps</MenuItem>
                            <MenuItem> Open street maps</MenuItem>
                        </SubMenu>
                        <SubMenu
                            label="Theme"
                        // icon={<InkBottle />}
                        >
                            <MenuItem> Dark</MenuItem>
                            <MenuItem> Light</MenuItem>
                        </SubMenu>
                        <SubMenu
                            label="Components"
                        // icon={<Diamond />}
                        >
                            <MenuItem> Grid</MenuItem>
                            <MenuItem> Layout</MenuItem>
                            <SubMenu label="Forms">
                                <MenuItem> Input</MenuItem>
                                <MenuItem> Select</MenuItem>
                                <SubMenu label="More">
                                    <MenuItem> CheckBox</MenuItem>
                                    <MenuItem> Radio</MenuItem>
                                </SubMenu>
                            </SubMenu>
                        </SubMenu>
                    </Menu>

                    <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
                        {/* <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                Extra
              </Typography> */}
                    </div>
                </div>
                {/* <SidebarFooter collapsed={collapsed} /> */}
            </div>
        </Sidebar>
        // </div>
    );
};