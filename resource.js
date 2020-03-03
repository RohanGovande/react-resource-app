import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import * as PXBThemes from "@pxblue/themes/react";
require("typeface-open-sans");
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon"
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Link from "@material-ui/core/Link";
import { data } from "./data";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Drawer, DrawerHeader, DrawerSubheader, DrawerBody, DrawerFooter } from '@pxblue/react-components';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import SettingsIcon from "@material-ui/icons/Settings";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";

const preventDefault = event => event.preventDefault();
const options = ["Delete"];

const ITEM_HEIGHT = 48;
const columns = [
  { id: "repository", label: "Repository", minWidth: 200 },
  { id: "npm", label: "NPM", minWidth: 200 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "issues", label: "Issues", minWidth: 120 }
];

export default function StickyHeadTable() {
  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    container: {
      maxHeight: 440
    },
    cursor: {
      cursor: "pointer"
    },
    spacing: {
      float: "right",
      padding: 0
    },
    paper: {
      position: "absolute",
      width: 500,
      backgroundColor: "white",
      padding: 10,
      height: 500
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: 240,
      width: `calc(100% - ${240}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: 36
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: 240,
      flexShrink: 0,
      whiteSpace: "nowrap"
      },
    drawerOpen: {
      width: 240,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: 120,
        "&:focus": {
          width: 200
        }
      }
    },
  }));

  const classes = useStyles();
  const theme = createMuiTheme(PXBThemes.blue);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState(data);
  const [menuposition, setMenuposition] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [activeMenu, setActiveMenu] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(JSON.stringify(data[0]));
  const [openSnackBar, setSnackBar] = React.useState(false);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const [inputvalue, setSearchValue] = React.useState("");
  const handleSearchChange = event => {
    let tempList = rows;
    if (event.target.value) {
      let newList = tempList.filter(item => {
        const lc = item.repository.name.toLowerCase();
        const filter = event.target.value.toLowerCase();
        return lc.includes(filter);
      });
      setRows(newList);
    } else {
      setRows(data);
    }
    setSearchValue(event.target.value);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleChange = event => {
    setValue(event.target.value);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSnackBar(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  function onAddItem() {
    if (value) {
      let templist = rows;
      templist.push(JSON.parse(value));
      setRows([...templist]);
      setOpen(false);
      setSnackBar(true);
    }
  }

  function onMenuClick(event, i) {
    setMenuposition(event.currentTarget);
    setActiveMenu(i);
  }
  function onMenuItemClick(option, i) {
    if (option === "Delete") {
      let templist = rows;
      templist.splice(i, 1);
      setRows(templist);
    }
    onMenuClose();
  }
  function onMenuClose() {
    setMenuposition(null);
    setActiveMenu(null);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
               
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer
          })}
        >
                        
          <Toolbar>
             {" "}
            <IconButton
              color="inherit"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: openDrawer
              })}
            >
              <MenuIcon />
            </IconButton>
                         
            <Typography ariant="h6" noWrap>
                Resources                 
            </Typography>
                        {" "}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Repository.."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearchChange}
                value={inputvalue}
              />
            </div>
          </Toolbar>
                      
        </AppBar>
        <Drawer
          variant="permanent"
          open = {openDrawer}
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: openDrawer,
              [classes.drawerClose]: !openDrawer
            })
          }}
        >
          <DrawerHeader icon={theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )} onIconClick={handleDrawerClose} >
          </DrawerHeader>
          <Divider />{" "}
          <DrawerBody>
          <List>
            {["Home", "Design Patterns", "Style Guides", "Resources"].map(
              (text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon >
                    {index % 2 === 0 ? <SettingsIcon /> : <CheckCircleIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              )
            )}
          </List>
          </DrawerBody>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Typography paragraph>
            Power Xpert Blue offers a number of resources for developers,
            available through{" "}
            <Link href="https://www.npmjs.com/org/pxblue">NPM</Link> and{" "}
            <Link href="https://github.com/pxblue">GitHub</Link>. These include
            utility packages as well as sample code/design pattern examples.
          </Typography>
          <Typography paragraph>
            The following table shows the current status for PX Blue resources
            available through NPM.
          </Typography>
          <Paper paragraph>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}{" "}
                        {column.id === "issues" ? (
                          <Tooltip title="Add Resource">
                            <IconButton
                              className={classes.spacing}
                              data-cy="toolbar-add"
                              color="inherit"
                              aria-label="add"
                              onClick={handleOpen}
                            >
                              <AddCircleIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {columns.map(column => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                key={row[column.id] + "_" + value.name}
                                align={column.align}
                              >
                                {!Array.isArray(value) ? (
                                  <Link
                                    key={value.name}
                                    href={value.url}
                                    onClick={preventDefault}
                                  >
                                    {column.id !== "status" ? (
                                      <span> {value.name} </span>
                                    ) : (
                                      <CheckCircleIcon
                                        href={value.url}
                                        onClick={preventDefault}
                                      />
                                    )}
                                  </Link>
                                ) : (
                                  <span>
                                    {value.map((val, i) => (
                                      <React.Fragment key={i}>
                                        {" "}
                                        <Link
                                          key={value.name}
                                          className={classes.cursor}
                                          href={value.url}
                                          onClick={preventDefault}
                                        >
                                          {val.name}
                                        </Link>
                                        {i === value.length - 1 ? null : <br />}
                                      </React.Fragment>
                                    ))}
                                  </span>
                                )}
                                {column.id === "issues" ? (
                                  <IconButton
                                    className={classes.spacing}
                                    data-cy="action-menu"
                                    aria-haspopup="true"
                                    onClick={evt => onMenuClick(evt, i)}
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                ) : null}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <Menu
              id="long-menu"
              anchorEl={menuposition}
              open={Boolean(menuposition)}
              onClose={onMenuClose.bind(this)}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200
                }
              }}
            >
              {options.map(option => (
                <MenuItem
                  key={option}
                  onClick={() => onMenuItemClick(option, activeMenu)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Paper>
        </main>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          <div style={modalStyle} className={classes.paper}>
            <AppBar position="static">
                           
              <Toolbar data-cy="pxb-toolbar">
                 
                <Typography style={{ flex: 1 }} variant="h6" color="inherit">
                    Add Resource               
                </Typography>
              </Toolbar>
                          
            </AppBar>
            <DialogContent>
              <DialogContentText>
                Just edit the below json for adding new resource .
              </DialogContentText>
              <TextareaAutosize
                style={{ height: 300, width: 450 }}
                rowsMax={8}
                placeholder="Maximum 8 rows"
                defaultValue={JSON.stringify(data[0])}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={onAddItem} color="primary">
                Add
              </Button>
            </DialogActions>
          </div>
        </Modal>
        <Snackbar open={openSnackBar} autoHideDuration={3000}>
          <Alert onClose={handleClose} severity="success">
            This is a success message!
          </Alert>
        </Snackbar>
      </MuiThemeProvider>
    </div>
  );
}
