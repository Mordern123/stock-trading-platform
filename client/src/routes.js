// icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import BarChartRoundedIcon from '@material-ui/icons/BarChartRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import HistoryRoundedIcon from '@material-ui/icons/HistoryRounded';
import SyncAltRoundedIcon from '@material-ui/icons/SyncAltRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';

// views
import { Home } from "views/Home";
import { UserProfile } from "views/UserProfile";
import { StockYesterday } from "views/StockYesterday";
import { StockBuy } from "views/StockBuy";
import { StockSell } from "views/StockSell";
import { StockStatus } from 'views/StockStatus';
import { StockRank } from "views/StockRank";
import { StockTrack } from "views/StockTrack";
import { Discussion } from 'views/Discussion';

const dashboardRoutes = [
  {
    path: "/home",
    name: "首頁",
    icon: HomeRoundedIcon,
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
    icon: SearchRoundedIcon,
    component: StockBuy,
    layout: "/admin"
  },
  {
    path: "/stockSell",
    name: "擁有股票/賣出",
    icon: StarRoundedIcon,
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
    icon: SyncAltRoundedIcon,
    component: StockStatus,
    layout: "/admin"
  },
  {
    path: "/track",
    name: "股票追蹤管理",
    icon: FavoriteRoundedIcon,
    component: StockTrack,
    layout: "/admin"
  },
  {
    path: "/rank",
    name: "股票排名",
    icon: BarChartRoundedIcon,
    component: StockRank,
    layout: "/admin"
  },
  {
    path: "/discussion",
    name: "班級討論版",
    icon: PeopleAltRoundedIcon,
    component: Discussion,
    layout: "/admin"
  }, 
];

export default dashboardRoutes;
