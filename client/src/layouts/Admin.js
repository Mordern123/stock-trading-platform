import React from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import routes from "routes.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import { WindowScroller } from "react-virtualized";
import { useSnackbar } from 'notistack';
import { check_cookie } from '../tools'
import { apiUser_logout } from '../api'

let ps;

const useStyles = makeStyles(styles);

function Admin({ ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const switchRoutes = (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === "/admin") {
          const Component = prop.component
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => (
                <Component {...props} /> 
              )}
              key={key}
            />
          );
        }
        return null;
      })}
      <Redirect from="/admin" to="/admin/home" />
    </Switch>
  );

  const handleImageClick = image => {
    setImage(image);
  };
  const handleColorClick = color => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  
  const logout = async() => {
    await apiUser_logout()
    history.replace("/login")
  }

  // initialize and destroy the PerfectScrollbar plugin
  // React.useEffect(() => {
  //   if (navigator.platform.indexOf("Win") > -1) {
  //     ps = new PerfectScrollbar(mainPanel.current, {
  //       suppressScrollX: true,
  //       suppressScrollY: false
  //     });
  //     document.body.style.overflow = "hidden";
  //   }
  //   window.addEventListener("resize", resizeFunction);
  //   // Specify how to clean up after this effect:
  //   return function cleanup() {
  //     if (navigator.platform.indexOf("Win") > -1) {
  //       ps.destroy();
  //     }
  //     window.removeEventListener("resize", resizeFunction);
  //   };
  // }, [mainPanel]);

  //初始執行
  React.useEffect(() => {
    var timeout; 
    var interval;

    document.onmousemove = function(){
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout() //30分鐘沒移動登出
      }, 1000 * 60 * 30);
    }
    interval = setInterval(() => {
      const user_token = check_cookie('user_token')
      if(!user_token) logout()
    }, 1000 * 60 * 5);

    const comeBack = localStorage.getItem("comeBack")
    if(JSON.parse(comeBack)) {
      addSnack()
      localStorage.setItem("comeBack", false)
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval)
    }
  }, [])

  const addSnack = () => {
    enqueueSnackbar("歡迎回來股票交易", {
      variant :'success',
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
      autoHideDuration: 2000,
      ContentProps: {
        style: {
          backgroundColor: "#4caf50",
          color: "white"
        },
        className: "ch_font",
      },
    })
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"股票交易模擬平台"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and container classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
        {getRoute() ? <Footer /> : null}
        {/* <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        /> */}
      </div>
    </div>
  );
}

export default Admin
