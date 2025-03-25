import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Routing from "../AllRouting/Routing";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify

const drawerWidth = 270;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      marginLeft: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const API_URL = "http://147.93.107.44:5000";

export default function MainLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [greeting, setGreeting] = useState("");
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate(); // Initialize useNavigate

  const viewData = () => {
    let AdminName = localStorage.getItem("name");
    setAdminName(AdminName);
    axios
      .get(`${API_URL}/admin_view`)
      .then((res) => {
        setAdminData(res.data.data);
        // console.log("new data", res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  useEffect(() => {
    viewData();
  }, []);

  useEffect(() => {
    if (window.innerWidth > 700) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning 🌅");
    } else if (currentHour < 17) {
      setGreeting("Good Afternoon 🌞");
    } else {
      setGreeting("Good Evening 🌇");
    }
  }, []);

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    toast.success("Logout Successful!", {
      position: "top-right",
      autoClose: 3000, // Close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate("/Login_Page"); // Navigate to the login page after the toast closes
      window.location.reload(); // Reload the window
    }, 2000); // Wait for 3 seconds before redirecting
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "rgba(28, 116, 188, 1)",
        overflowX: "hidden",
      }}
    >
      <CssBaseline />

      {/* ToastContainer must be included in the component */}
      <ToastContainer />

      <AppBar
        position="fixed"
        open={open}
        sx={{
          paddingTop: { xs: "0px", sm: "0px" },
          backgroundColor: "rgba(28, 116, 188, 1)",
          color: "#F8F8F8",
          boxShadow: "none",
          zIndex: 999,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F2F7F8",
            borderRadius: { xs: "0px", sm: "5px 0px 0px 0px" },
          }}
        >
          <Toolbar>
            <IconButton
              color="black"
              aria-label="open drawer"
              onClick={handleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <h2
              style={{
                color: "#17609b",
                fontSize: "18px ",
                display: "flex",
                alignItems: "center",
                marginTop: "8px",
                cursor: "pointer",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.36)",
              }}
              onClick={handleClick}
            >
              {greeting.toUpperCase() + "," + " "}
              <span style={{ color: "black" }}>
                {adminName
                  ? adminName.replace(/^"|"$/g, "").toUpperCase() || "N/A"
                  : "N/A"}
              </span>
            </h2>
          </Toolbar>
        </Box>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <i className="bi bi-person-circle" style={{ fontSize: "20px" }}></i>
          </ListItemIcon>
          {adminName
            ? adminName.replace(/^"|"$/g, "").toUpperCase() || "N/A"
            : "N/A"}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ backgroundColor: "rgba(28, 116, 188, 1)", height: "100vh" }}>
          <DrawerHeader sx={{ backgroundColor: "rgba(28, 116, 188, 1)" }} />
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                bgcolor: "white",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              <Link to="/Dashboard">
                <Box
                  component="img"
                  src={require("./Images/daynamic_logo.png")}
                  sx={{
                    width: "80%",
                    display: "block",
                    margin: "20px auto 22px", // Adjusted margin for centering
                    backgroundColor: "white",
                  }}
                />
              </Link>
            </Box>
          </div>
          <Sidebar />
        </Box>
      </Drawer>

      <Main open={open} sx={{ padding: { xs: "0px", sm: "0px 0px 0px 0px" } }}>
        <Box
          sx={{
            backgroundColor: "#F2F7F8",
            height: "100vh",
            overflowX: "hidden",
            borderRadius: { xs: "0px", sm: "0px 0px 0px 5px" },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <>
              <Routing />
            </>
          </Box>
        </Box>
      </Main>
    </Box>
  );
}
