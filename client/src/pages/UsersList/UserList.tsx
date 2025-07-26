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
  FormControl,
  Select,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
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
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { visuallyHidden } from "@mui/utils";

interface Data {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerification: string;
  adminVerification: string;
}

type OpenModal =
  | "adminStatus"
  | "selectedAdminStatus"
  | "confirmStatus"
  | "confirmDelete"
  | null;
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

interface FilterData {
  role: ("user" | "admin" | "product_manager")[];
  emailVerification: ("pending" | "verified")[];
  adminVerification: ("pending" | "approved" | "rejected")[];
}

const initialFilterData = {
  role: [],
  emailVerification: [],
  adminVerification: [],
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState<
    string | null
  >(null);
  const [modalHeadingText, setModalHeadingText] = useState<string | null>(null);
  const [filterValues, setFilterValues] =
    useState<FilterData>(initialFilterData);

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
    setSnackbarSuccessMessage(null);
  };

  const handleAdminStatusChange = (status: SelectedAdminStatus) => {
    setSelectAdminStatus(status);
  };

  const handleAdminVeificationClick = (
    event: React.MouseEvent | null,
    selectedRowData: Data | null
  ) => {
    if (event) {
      event.stopPropagation();
    }
    if (selectedRowData) {
      if (selectedRowData.role === "user") {
        setSnackbarErrorMessage("Admin approve is not required for user!");
        return;
      }
      if (selectedRowData.emailVerification === "pending") {
        setSnackbarErrorMessage("Email is not verified yet!");
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
      (showModal === "confirmStatus" && selectAdminStatus === buttonStatus) ||
      showModal === "selectedAdminStatus"
    );
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const newValue = event.target.value;
    const name = event.target.name;
    setFilterValues((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const showRender = (selectedValue: string[], label: string) => {
    const newValues = selectedValue.map((item) =>
      item === "product_manager" ? "Product Manager" : capitalize(item)
    );
    if (selectedValue.length === 0) {
      return label;
    }
    return newValues.join(", ");
  };

  const handleApproveIconClick = () => {
    const newArray = rows.filter((item) => selected.includes(item.id));
    if (newArray.length === 1) {
      handleAdminVeificationClick(null, newArray[0]);
      return;
    }
    const check = newArray.some(
      (item) => item.role === "user" || item.emailVerification === "pending"
    );
    if (check) {
      setSnackbarErrorMessage(
        "Admin approve not apply for user or pending email verification!"
      );
      return;
    } else {
      setShowModal("selectedAdminStatus");
      setModalHeadingText(consfigJSON.changeAdminApproveStatus);
    }
  };

  const handleModalConfirmClick = () => {
    if (showModal === "confirmStatus") {
      setSnackbarSuccessMessage(
        `Admin status changed to ${selectAdminStatus}!`
      );
    } else if (showModal === "confirmDelete") {
      setSnackbarSuccessMessage("Selected account deleted successfully!");
      setSelected([]);
    }
    handleModalClose();
  };

  const handleDeleteIconClick = () => {
    setModalHeadingText("Confirm Delete!");
    setShowModal("confirmDelete");
  };

  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
    return (
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { sm: 2 },
            pt: { xs: 2, sm: 1 },
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "10px",
          },
          numSelected > 0 && {
            bgcolor: () => alpha(extraLightPrimaryColor, 1),
          },
        ]}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%", maxWidth: "fit-content" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} {consfigJSON.selected}
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%", maxWidth: "fit-content", lineHeight: 1 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {consfigJSON.filter}
          </Typography>
        )}
        {numSelected > 0 ? (
          <Box display="flex">
            <Tooltip title="Delete">
              <IconButton onClick={handleDeleteIconClick}>
                <DeleteIcon style={{ color: primaryColor }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Admin Approve">
              <IconButton onClick={handleApproveIconClick}>
                <PendingActionsIcon style={{ color: primaryColor }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box
            style={{
              display: "flex",
              gap: "15px",
            }}
            sx={{
              "@media(max-width: 653px)": {
                marginBottom: "10px",
                flexWrap: "wrap",
              },
            }}
          >
            {renderSelect(
              ["user", "product_manager", "admin"],
              filterValues.role,
              "role",
              "Role"
            )}
            {renderSelect(
              ["pending", "verified"],
              filterValues.emailVerification,
              "emailVerification",
              "Email Verification"
            )}
            {renderSelect(
              ["pending", "approved", "rejected"],
              filterValues.adminVerification,
              "adminVerification",
              "Admin Verification"
            )}
          </Box>
        )}
      </Toolbar>
    );
  }

  const renderSelect = (
    options: string[],
    value: string[],
    name: keyof FilterData,
    label: string
  ) => {
    return (
      <FormControl
        sx={{
          width: 162,
          "@media(max-width: 428px)": {
            width: "100%",
          },
        }}
        size="small"
      >
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={value}
          name={name}
          onChange={handleSelectChange}
          renderValue={(selected) => showRender(selected, label)}
          MenuProps={MenuProps}
          displayEmpty
          sx={webStyle.selectStyle}
        >
          {options.map((item) => (
            <MenuItem key={item} value={item} sx={webStyle.selectOptionStyle}>
              <ListItemText
                primary={item === "product_manager" ? "Product Manager" : item}
                style={{ textTransform: "capitalize", fontSize: "14px" }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Box sx={webStyle.mainBox}>
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
                    sx={{ ...webStyle.tableBodyRowStyle, cursor: "pointer" }}
                    onClick={(event) => handleClick(event, row.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                        sx={webStyle.checkBoxCheckedColor}
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
                        onClick={(event) =>
                          handleAdminVeificationClick(event, row)
                        }
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
              <Box
                style={{
                  ...webStyle.sizeModalButtonBox,
                  justifyContent: "space-evenly",
                }}
              >
                {((selectedRow && showModal === "adminStatus") ||
                  (showModal === "selectedAdminStatus" &&
                    selected.length !== 0) ||
                  showModal === "confirmStatus") && (
                  <>
                    {handleModalAdminStatusButtonShow("pending") && (
                      <Button
                        sx={{
                          ...webStyle.modalAdminButtonStyle,
                          backgroundColor: handleStatusColor("pending"),
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
                          ...webStyle.modalAdminButtonStyle,
                          backgroundColor: handleStatusColor("approved"),
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
                          ...webStyle.modalAdminButtonStyle,
                          backgroundColor: handleStatusColor("rejected"),
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
                {showModal === "confirmDelete" && (
                  <Typography style={{ fontSize: "18px" }}>
                    {consfigJSON.deleteConfirmMsg}
                  </Typography>
                )}
              </Box>
              <Box style={webStyle.sizeModalButtonBox}>
                <ClearButton onClick={handleModalClose}>
                  {consfigJSON.cancel}
                </ClearButton>
                {showModal === "adminStatus" ||
                showModal === "selectedAdminStatus" ? (
                  <AddButton onClick={handleStatusChangeClick}>
                    {consfigJSON.change}
                  </AddButton>
                ) : (
                  <AddButton
                    onClick={handleModalConfirmClick}
                    style={{
                      background:
                        showModal === "confirmDelete"
                          ? rejectedColor
                          : primaryColor,
                    }}
                  >
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
      <Snackbar
        open={Boolean(snackbarSuccessMessage)}
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
          {snackbarSuccessMessage}
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
    "@media(max-width: 600px)": {
      padding: "15px",
    },
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
    whiteSpace: "nowrap",
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
  modalAdminButtonStyle: {
    background: primaryColor,
    color: "#fff",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    width: "100px",
    "@media(max-width: 430px)": {
      fontSize: "14px",
    },
  },
  paperStyle: {
    width: "100%",
    mb: 2,
    borderRadius: "8px",
    boxShadow: `0px 0px 16px 2px ${lightTextColor}`,
    overflow: "hidden",
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
  selectStyle: {
    height: "30px",
    fontSize: "14px",
    color: primaryColor,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: primaryColor,
      borderWidth: "1px",
    },
  },
  selectOptionStyle: {
    fontSize: "14px",
    textTransform: "capitalize",
    "&.Mui-selected": {
      backgroundColor: extraLightPrimaryColor,
    },
  },
};
