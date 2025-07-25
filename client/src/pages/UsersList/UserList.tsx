import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Button,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  lightTextColor,
  primaryColor,
  extraLightPrimaryColor,
  pendingColor,
  approvedColor,
  rejectedColor,
} from "../../config/colors";
import consfigJSON from "./config";

import { useState, useMemo } from "react";
import { alpha, styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

interface Data {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerification: string;
  adminVerification: string;
}

type OpenModal = "adminStatus" | "confirmStatus" | "confirmDelete" | null;
type SelectedAdminStatus = "pending" | "approved" | "rejected" | null;

function createData(
  id: number,
  name: string,
  email: string,
  role: string,
  emailVerification: string,
  adminVerification: string
): Data {
  return {
    id,
    name,
    email,
    role,
    emailVerification,
    adminVerification,
  };
}

const rows = [
  createData(1, "Cupcake", "test@yopmail.com", "admin", "pending", "pending"),
  createData(2, "Donut", "test@yopmail.com", "admin", "verified", "pending"),
  createData(
    3,
    "Eclair",
    "test@yopmail.com",
    "product_manager",
    "pending",
    "approved"
  ),
  createData(
    4,
    "Frozen yoghurt",
    "test@yopmail.com",
    "user",
    "verified",
    "rejected"
  ),
  createData(
    5,
    "Gingerbread",
    "test@yopmail.com",
    "product_manager",
    "verified",
    "approved"
  ),
  createData(
    6,
    "Honeycomb",
    "test@yopmail.com",
    "product_manager",
    "verified",
    "approved"
  ),
  createData(
    7,
    "Ice cream sandwich",
    "test@yopmail.com",
    "user",
    "pending",
    "approved"
  ),
  createData(
    8,
    "Jelly Bean",
    "test@yopmail.com",
    "user",
    "verified",
    "rejected"
  ),
  createData(9, "KitKat", "test@yopmail.com", "user", "pending", "rejected"),
  createData(10, "Lollipop", "test@yopmail.com", "user", "pending", "pending"),
  createData(
    11,
    "Marshmallow",
    "test@yopmail.com",
    "admin",
    "verified",
    "pending"
  ),
  createData(12, "Nougat", "test@yopmail.com", "user", "verified", "approved"),
  createData(
    13,
    "Oreo",
    "test@yopmail.com",
    "product_manager",
    "pending",
    "approved"
  ),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "User",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "emailVerification",
    numeric: false,
    disablePadding: false,
    label: "Email Verification",
  },
  {
    id: "adminVerification",
    numeric: false,
    disablePadding: false,
    label: "Admin Approve",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow sx={{ background: lightTextColor }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "User",
            }}
            sx={webStyle.checkBoxCheckedColor}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={webStyle.tableHeadCell}
            colSpan={headCell.label === "Admin Approve" ? 2 : 1}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: () => alpha(extraLightPrimaryColor, 1),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Filter
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function UserList() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("name");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState<OpenModal>(null);
  const [selectAdminStatus, setSelectAdminStatus] =
    useState<SelectedAdminStatus>(null);
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState<
    string | null
  >(null);
  const [modalHeadingText, setModalHeadingText] = useState<string | null>(null);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  const handleStatusColor = (value: string) => {
    let color = pendingColor;
    if (value === "rejected") {
      color = rejectedColor;
    } else if (value === "approved" || value === "verified") {
      color = approvedColor;
    }
    return color;
  };

  const handleModalClose = () => {
    setShowModal(null);
    setSelectedRow(null);
    setSelectAdminStatus(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarErrorMessage(null);
  };

  const handleAdminStatusChange = (status: SelectedAdminStatus) => {
    setSelectAdminStatus(status);
  };

  const handleAdminVeificationClick = (selectedRowData: Data | null) => {
    if (selectedRowData) {
      if (selectedRowData.role === "user") {
        setSnackbarErrorMessage("Admin approve is not required for user");
        return;
      }
      setModalHeadingText(consfigJSON.changeAdminApproveStatus);
      setSelectedRow(selectedRowData);
      setShowModal("adminStatus");
    }
  };

  const handleStatusChangeClick = () => {
    if (selectAdminStatus === null) {
      setSnackbarErrorMessage("Please select status to change!");
      return;
    }
    setShowModal("confirmStatus");
    setModalHeadingText("Confirm to change:");
  };

  const handleModalAdminStatusButtonShow = (buttonStatus: string) => {
    return (
      (showModal === "adminStatus" &&
        selectedRow &&
        selectedRow.adminVerification !== buttonStatus) ||
      (showModal === "confirmStatus" && selectAdminStatus === buttonStatus)
    );
  };

  return (
    <Box style={webStyle.mainBox}>
      <Typography style={webStyle.addProductHeadingText}>
        {consfigJSON.users}
      </Typography>
      <Paper sx={webStyle.paperStyle}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={webStyle.tableBodyRowStyle}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                        sx={webStyle.checkBoxCheckedColor}
                        onClick={(event) => handleClick(event, row.id)}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.role === "product_manager"
                        ? "Product Manager"
                        : row.role}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        color: handleStatusColor(row.emailVerification),
                      }}
                    >
                      {row.emailVerification}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      <Button
                        sx={{
                          ...webStyle.buttonStyle,
                          backgroundColor: handleStatusColor(
                            row.adminVerification
                          ),
                          width: "100px",
                        }}
                        onClick={() => handleAdminVeificationClick(row)}
                      >
                        {row.adminVerification}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button sx={webStyle.buttonStyle}>
                        {consfigJSON.view}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal open={Boolean(showModal)} onClose={handleModalClose}>
        <Box style={webStyle.progressBox}>
          <Box style={webStyle.addSizeModalInnerBox}>
            <Typography style={webStyle.addQuantityText}>
              {modalHeadingText}
            </Typography>
            <Box p={1}>
              {(showModal === "adminStatus" ||
                showModal === "confirmStatus") && (
                <Box
                  style={{
                    ...webStyle.sizeModalButtonBox,
                    justifyContent: "space-evenly",
                  }}
                >
                  {selectedRow && (
                    <>
                      {handleModalAdminStatusButtonShow("pending") && (
                        <Button
                          sx={{
                            ...webStyle.buttonStyle,
                            backgroundColor: handleStatusColor("pending"),
                            width: "100px",
                            fontSize: "16px",
                            border:
                              selectAdminStatus === "pending"
                                ? `1px solid ${primaryColor}`
                                : "none",
                            boxShadow:
                              selectAdminStatus === "pending"
                                ? `0px 0px 4px 4px ${primaryColor}`
                                : "none",
                          }}
                          onClick={() => handleAdminStatusChange("pending")}
                        >
                          {consfigJSON.pending}
                        </Button>
                      )}
                      {handleModalAdminStatusButtonShow("approved") && (
                        <Button
                          sx={{
                            ...webStyle.buttonStyle,
                            backgroundColor: handleStatusColor("approved"),
                            width: "100px",
                            fontSize: "16px",
                            border:
                              selectAdminStatus === "approved"
                                ? `1px solid ${primaryColor}`
                                : "none",
                            boxShadow:
                              selectAdminStatus === "approved"
                                ? `0px 0px 4px 4px ${primaryColor}`
                                : "none",
                          }}
                          onClick={() => handleAdminStatusChange("approved")}
                        >
                          {consfigJSON.approve}
                        </Button>
                      )}
                      {handleModalAdminStatusButtonShow("rejected") && (
                        <Button
                          sx={{
                            ...webStyle.buttonStyle,
                            backgroundColor: handleStatusColor("rejected"),
                            width: "100px",
                            fontSize: "16px",
                            border:
                              selectAdminStatus === "rejected"
                                ? `1px solid ${primaryColor}`
                                : "none",
                            boxShadow:
                              selectAdminStatus === "rejected"
                                ? `0px 0px 4px 4px ${primaryColor}`
                                : "none",
                          }}
                          onClick={() => handleAdminStatusChange("rejected")}
                        >
                          {consfigJSON.reject}
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              )}
              <Box style={webStyle.sizeModalButtonBox}>
                <ClearButton onClick={handleModalClose}>
                  {consfigJSON.cancel}
                </ClearButton>
                {showModal === "adminStatus" ? (
                  <AddButton onClick={handleStatusChangeClick}>
                    {consfigJSON.change}
                  </AddButton>
                ) : (
                  <AddButton onClick={handleModalClose}>
                    {consfigJSON.confirm}
                  </AddButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={Boolean(snackbarErrorMessage)}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarErrorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const AddButton = styled(Button)({
  background: primaryColor,
  color: "#fff",
});

const ClearButton = styled(Button)({
  background: lightTextColor,
  color: primaryColor,
});

const webStyle = {
  mainBox: {
    padding: "25px",
  },
  addProductHeadingText: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "25px",
    color: primaryColor,
  } as React.CSSProperties,
  checkBoxCheckedColor: {
    color: primaryColor,
    "&.Mui-checked": {
      color: primaryColor,
    },
    "&.MuiCheckbox-indeterminate": {
      color: primaryColor,
    },
  },
  tableHeadCell: {
    color: primaryColor,
    fontSize: "16px",
    fontWeight: "bold",
  },
  tableBodyRowStyle: {
    "&.Mui-selected": {
      backgroundColor: extraLightPrimaryColor,
    },
    "&.Mui-selected:hover": {
      backgroundColor: extraLightPrimaryColor,
    },
    "& .MuiTableCell-root": {
      fontSize: "16px",
    },
  },
  buttonStyle: {
    background: primaryColor,
    color: "#fff",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  paperStyle: {
    width: "100%",
    mb: 2,
    borderRadius: "8px",
    boxShadow: `0px 0px 16px 2px ${lightTextColor}`,
  },
  progressBox: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addSizeModalInnerBox: {
    background: "#fff",
    width: "100%",
    maxWidth: "400px",
    minHeight: "150px",
    borderRadius: "8px",
    boxShadow: `0px 0px 16px 2px ${primaryColor}`,
    overflow: "hidden",
    margin: "0 10px",
  },
  addQuantityText: {
    background: "#000",
    color: lightTextColor,
    padding: "10px",
    fontSize: "20px",
  },
  sizeModalButtonBox: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    justifyContent: "space-between",
  },
};
