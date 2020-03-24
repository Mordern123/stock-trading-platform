// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "首頁",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "使用者管理",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "股票交易",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "股票管理",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "股票排名",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "聯繫我們",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin"
  },
];

export default dashboardRoutes;
