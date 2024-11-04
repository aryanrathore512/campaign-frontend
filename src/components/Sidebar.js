import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaGem, FaList, FaHeart, FaUser } from 'react-icons/fa';

const SidebarComponent = () => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar collapsed={collapsed}>
          <Menu iconShape="square">
            <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
            <MenuItem icon={<FaList />}>Components</MenuItem>
            <MenuItem icon={<FaHeart />}>Favorites</MenuItem>
            <MenuItem icon={<FaUser />}>Profile</MenuItem>
          </Menu>
          <button onClick={handleToggleSidebar} className="btn btn-dark" style={{ marginLeft: '20px', marginTop: '25rem' }}>
            {collapsed ?
              (<svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 12.9999V10.9999H15.4853L12.2427 7.75724L13.6569 6.34303L19.3137 11.9999L13.6569 17.6567L12.2427 16.2425L15.4853 12.9999H1Z"
                  fill="currentColor"
                />
                <path
                  d="M20.2877 6V18H22.2877V6H20.2877Z"
                  fill="currentColor"
                />
              </svg>) :
              (<svg
                style={{ minWidth: "24px", minHeight: "24px" }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.2877 11.0001V13.0001H7.80237L11.045 16.2428L9.63079 17.657L3.97394 12.0001L9.63079 6.34326L11.045 7.75748L7.80236 11.0001H22.2877Z"
                  fill="currentColor"
                />
                <path d="M3 18V6H1V18H3Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </Sidebar>
      </div>
  );
};

export default SidebarComponent;
