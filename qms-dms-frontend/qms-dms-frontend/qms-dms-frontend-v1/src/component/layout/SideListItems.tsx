import  { useState } from "react";
import { List,  ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";


import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { GetMenuItems } from "../Menu/GetMenuItems";
// Import menu items dynamically based on user roles

const SideListItems = () => {
  
  const [openMenus, setOpenMenus] = useState({});

  const handleToggleMenu = (menuKey) => {
    setOpenMenus({ ...openMenus, [menuKey]: !openMenus[menuKey] });
  };

  const renderMenuItem = (menuItem) => (
    <ListItemButton key={menuItem.label} onClick={menuItem.onClick}>
      <ListItemIcon>{menuItem.icon}</ListItemIcon>
      <ListItemText primary={menuItem.label} />
    </ListItemButton>
  );

  const renderSubMenu = (subMenu) => (
    <div key={subMenu.label}>
      <ListItemButton onClick={() => handleToggleMenu(subMenu.label)}>
        <ListItemIcon>{subMenu.icon}</ListItemIcon>
        <ListItemText primary={subMenu.label} />
        {openMenus[subMenu.label] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openMenus[subMenu.label]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subMenu.items.map((item) => renderMenuItem(item))}
        </List>
      </Collapse>
    </div>
  );

  return (
    <List>
      {GetMenuItems().map((menuItem) => (
        <div key={menuItem.label}>
          {menuItem.items ? renderSubMenu(menuItem) : renderMenuItem(menuItem)}
        </div>
      ))}
    </List>
  );
};

export default SideListItems;
