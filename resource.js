import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Link from "@material-ui/core/Link";
import { data } from './data';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


const preventDefault = event => event.preventDefault();
const br = `\n`;
const options = [
  'Delete'
];

const ITEM_HEIGHT = 48;
const columns = [
  { id: "repository", label: "Repository", minWidth: 200 },
  { id: "npm", label: "NPM", minWidth: 200 },
  { id: "status", label: "Status", minWidth: 170 },
  { id: "issues", label: "Issues", minWidth: 170 }
];



function createData(repository, npm, status, issues) {
  return { repository, npm, status, issues };
}


const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  },
  spacing:{
float: "right",
padding: 0
      },
   paper: {
    position: "absolute",
    width: 500,
    backgroundColor: "white",
    padding: 10,
    height:500
  }
});



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
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const[rows,setRows] =React.useState(data);
  const [menuposition, setMenuposition] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [activeMenu, setActiveMenu] = React.useState(null);
   const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(JSON.stringify(data[0]));

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
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function onAddItem() {
    if(value){
    let templist = rows;
    templist.push(JSON.parse(value));
    console.log("templist",[...templist])
    setRows([...templist]);
    setOpen(false);
    }
  }

  function onMenuClick(event, i) {
    setMenuposition(event.currentTarget);
    setActiveMenu(i);
  };
  function onMenuItemClick(option, i) {
    if (option === 'Delete') {
      let templist = rows;
      templist.splice(i, 1);
      setRows(templist);
    }
    onMenuClose()
  }
  function onMenuClose() {
    setMenuposition(null);
    setActiveMenu(null);  }

  return (
    <MuiThemeProvider theme={createMuiTheme(PXBThemes.blue)}>
              
      <Container
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
                  {" "}
                  
        <div>
                      
          <AppBar position="static">
                          
            <Toolbar data-cy="pxb-toolbar">
                 
          <div style={{display:"contents"}}>             
              <Typography style={{flex: 1}} variant="h6" color="inherit">
                  Resources                 
              </Typography>
             
            
                                   
              <IconButton 
                data-cy="toolbar-add"
                color="inherit"
                aria-label="add"
                onClick={handleOpen}
              >
                                  
                <AddIcon />
                                
              </IconButton>
                     </div>       
            </Toolbar>
                        
          </AppBar>
                      
          <Typography>
            Power Xpert Blue offers a number of resources for developers,
            available through <Link href="https://www.npmjs.com/org/pxblue">NPM</Link> and <Link href="https://github.com/pxblue">GitHub</Link>. These include utility packages as
            well as sample code/design pattern examples.
          </Typography>
                    
        </div>
                  {" "}
        <Paper className={classes.root}>
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
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row,i) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map(column => {
                          const value = row[column.id];
                          console.log(value);
                          return (
                            <TableCell key={row[column.id]+'_'+value.name} align={column.align}>
                              {!Array.isArray(value) ?
                              <Link key={value.name} href={value.url} onClick={preventDefault}>
                                <span>{value.name}</span>
                              </Link> : 
                            <span>{value.map((val,i) =>  <React.Fragment key={i}> <Link key={value.name} href={value.url} onClick={preventDefault}>{val.name}</Link>{i === value.length - 1 ? null :  <br />}</React.Fragment>)}</span>
                              }
                        {column.id === 'issues' ? <IconButton className={classes.spacing} data-cy="action-menu"
                          aria-label='More'
                          aria-owns={}
                          aria-haspopup="true"
                          onClick={(evt) => onMenuClick(evt, i)}>
                          <MoreVertIcon />
                        </IconButton>:null}
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
              width: 200,
            },
          }}>
          {options.map((option) => (
            <MenuItem key={option} onClick={() => onMenuItemClick(option, activeMenu)}>
              {option}
          </MenuItem>
          ))}
        </Menu>
        </Paper>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
         <AppBar position="static">             
            <Toolbar data-cy="pxb-toolbar"> 
              <Typography style={{flex: 1}} variant="h6" color="inherit">
                  Add Resource               
              </Typography>
           </Toolbar>
                        
          </AppBar>
          <DialogContent>
          <DialogContentText>
          Just edit the below json for adding new resource .
          </DialogContentText>
          <TextareaAutosize
         style={{height:300,width:450}}
          rowsMax={8}
          placeholder="Maximum 8 rows"
          defaultValue= {JSON.stringify(data[0])}
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
      </Container>
    </MuiThemeProvider>
  );

       
}
