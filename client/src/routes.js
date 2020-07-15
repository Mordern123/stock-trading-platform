// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import Notifications from "@material-ui/icons/Notifications";
import Icons from "views/Icons/Icons.js";
// core components/views for Admin layout
import { Home } from "views/Home";
import { UserProfile } from "views/UserProfile";
import { StockYesterday } from "views/StockYesterday";
import { StockBuy } from "views/StockBuy";
import { StockSell } from "views/StockSell";
import { StockStatus } from 'views/StockStatus';
import { StockRank } from "views/StockRank";
import { StockTrack } from "views/StockTrack";

const dashboardRoutes = [
  {
    path: "/home",
    name: "首頁",
    icon: Dashboard,
    component: Home,
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
    path: "/stockRealTime",
    name: "即時股價/買入",
    icon: "content_paste",
    component: StockBuy,
    layout: "/admin"
  },
  {
    path: "/stockSell",
    name: "擁有股票/賣出",
    icon: "content_paste",
    component: StockSell,
    layout: "/admin"
  },
  {
    path: "/stockInfo",
    name: "昨日收盤資訊",
    icon: LibraryBooks,
    component: StockYesterday,
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
    path: "/track",
    name: "股票追蹤管理",
    icon: "content_paste",
    component: StockTrack,
    layout: "/admin"
  },
  {
    path: "/rank",
    name: "股票排名",
    icon: BubbleChart,
    component: StockRank,
    layout: "/admin"
  }, 
];

export default dashboardRoutes;
