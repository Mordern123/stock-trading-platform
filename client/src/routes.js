// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import Notifications from "@material-ui/icons/Notifications";
// core components/views for Admin layout
import HomePage from "views/Home.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import Transaction from "views/Transaction";
import StockManage from "views/StockManage";
import StockStatus from "views/StockStatus";
import StockRank from "views/StockRank";

const dashboardRoutes = [
  {
    path: "/home",
    name: "首頁",
    icon: Dashboard,
    component: HomePage,
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
    path: "/stockBuy",
    name: "股票查詢/買入",
    icon: LibraryBooks,
    component: Transaction,
    layout: "/admin"
  },
  {
    path: "/stockSell",
    name: "股票管理/賣出",
    icon: "content_paste",
    component: StockManage,
    layout: "/admin"
  },
  {
    path: "/status",
    name: "交易狀態",
    icon: "content_paste",
    component: StockStatus,
    layout: "/admin"
  },
  {
    path: "/rank",
    name: "股票排名",
    icon: BubbleChart,
    component: StockRank,
    layout: "/admin"
  },
  
  {
    path: "/notifications",
    name: "聯繫我們",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/contact",
    name: "聯繫我們",
    icon: Notifications,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/test2",
    name: "股票排名",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/test3",
    name: "股票管理",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
];

export default dashboardRoutes;
