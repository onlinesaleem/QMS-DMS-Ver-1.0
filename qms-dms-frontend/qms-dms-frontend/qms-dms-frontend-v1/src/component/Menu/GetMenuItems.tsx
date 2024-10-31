import { useNavigate } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AddTaskTwoToneIcon from "@mui/icons-material/AddTaskTwoTone";
import PermDeviceInformationTwoToneIcon from "@mui/icons-material/PermDeviceInformationTwoTone";
import FeedTwoToneIcon from "@mui/icons-material/FeedTwoTone";
import GradingTwoToneIcon from "@mui/icons-material/GradingTwoTone";
import AssessmentTwoToneIcon from "@mui/icons-material/AssessmentTwoTone";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import { useEffect, useState } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { isAdminUser, isQualityUser, isRoleUser } from "../../service/AuthService";
import { findUserIdByUsernameAPI } from "../../service/UserService";
import { getUserPermissionApi } from "../../service/UserModulePermissionService";

interface MenuItem {
  label: string;
  icon: React.ReactElement;
  onClick?: () => void;
  items?: MenuItem[];
  visible?: boolean;
}

export const GetMenuItems = (): MenuItem[] => {
  const navigate = useNavigate();

  const [, setLoggedUserId] = useState<string>('');
  const [userPermissionModule, setUserPermissionModule] = useState<any[]>([]); // Assuming permissions are an array of objects

  useEffect(() => {
    const getModulePermission = async () => {
      try {
        const userIdResponse = await findUserIdByUsernameAPI();
        setLoggedUserId(userIdResponse.data);

        const permissionResponse = await getUserPermissionApi(userIdResponse.data);
        setUserPermissionModule(permissionResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    getModulePermission();
  }, []);

  // Create the Task submenu items based on user permissions
  const taskSubMenuItems: MenuItem[] = [
    ...userPermissionModule.map((userModuleAccess) => {
      if (userModuleAccess.id === 2) {
        return {
          label: "General-Task",
          icon: <AddTaskTwoToneIcon />,
          onClick: () => navigate("/general-task-list"),
          visible: true,
        };
      }
      return null;
    }).filter(Boolean),
    {
      label: "Task List",
      icon: <AddTaskTwoToneIcon />,
      onClick: () => navigate("/task-list"),
      visible: !isRoleUser(),
    }
  ];

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      icon: <HouseOutlinedIcon />,
      onClick: () => navigate("/"),
    },
    {
      label: "Dashboard",
      icon: <LeaderboardOutlinedIcon />,
      onClick: () => navigate("/dashboard-incident"),
    },
    {
      label: "Incident",
      icon: <PermDeviceInformationTwoToneIcon />,
      items: [
        {
          label: "Incident",
          icon: <FeedTwoToneIcon />,
          onClick: () => navigate("/incident-form"),
        },
        {
          label: "Incident View",
          icon: <GradingTwoToneIcon />,
          onClick: () => navigate("/incident-list"),
        },
        {
          label: "OVR-F",
          icon: <AssessmentTwoToneIcon />,
          onClick: () => navigate("/incident-response"),
          visible: isQualityUser(),
        }
      ],
    },
    {
      label: "Doc Management",
      icon: <PermDeviceInformationTwoToneIcon />,
      items: [
        {
          label: "Create Document",
          icon: <GradingTwoToneIcon />,
          onClick: () => navigate("/documents/new"),
        },
        {
          label: "Manage Documents",
          icon: <AssessmentTwoToneIcon />,
          onClick: () => navigate("/doc-management"),
        },
        {
          label: "View Documents",
          icon: <AssessmentTwoToneIcon />,
          onClick: () => navigate("/documents"),
        },
        {
          label: "Quality Templates",
          icon: <AssessmentTwoToneIcon />,
          onClick: () => navigate("/templates"),
        },
        {
          label: "Document Templates",
          icon: <FeedTwoToneIcon />,
          onClick: () => navigate("/templates"),
        },
        {
          label: "Document Approvals",
          icon: <AssessmentTwoToneIcon />,
          onClick: () => navigate("/documents/approval-list"),
        },
        {
          label: "Quality Standards",
          icon: <AssessmentTwoToneIcon />,
          onClick: () => navigate("/quality-standards"),
        },
      ],
    },
    {
      label: "Task",
      icon: <AddTaskTwoToneIcon />,
      items: taskSubMenuItems,
      visible: true,
    },
    {
      label: "Setting",
      icon: <SettingsOutlinedIcon />,
      items: [
        {
          label: "User Master",
          icon: <PersonAddAltTwoToneIcon />,
          onClick: () => navigate("/profile"),
          visible: isAdminUser(),
        },
        {
          label: "Doc-Approval",
          icon: <PersonAddAltTwoToneIcon />,
          onClick: () => navigate("/documents/user-approval-setting"),
          visible: isAdminUser(),
        }
      ],
      visible: isAdminUser(),
    },
  ];

  // Filter out sub-menu items based on visibility
  menuItems.forEach(item => {
    if (item.items) {
      item.items = item.items.filter(subItem => subItem.visible !== false);
    }
  });

  // Filter top-level menu items based on visibility
  const filteredMenuItems = menuItems.filter(item => item.visible !== false);

  return filteredMenuItems;
};

