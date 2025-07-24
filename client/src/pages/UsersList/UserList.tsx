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
} from "@mui/material";
import {
  lightTextColor,
  primaryColor,
  extraLightPrimaryColor,
} from "../../config/colors";
import consfigJSON from "./config";

import * as React from "react";
import { alpha } from "@mui/material/styles";
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
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("name");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
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

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );
  return (
    <Box style={webStyle.mainBox}>
      <Typography style={webStyle.addProductHeadingText}>
        {consfigJSON.users}
      </Typography>
      <Paper sx={{ width: "100%", mb: 2 }}>
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
                    onClick={(event) => handleClick(event, row.id)}
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
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.emailVerification}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.adminVerification}
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
    </Box>
  );
}

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
    fontSize: "18px",
    fontWeight: "bold",
  },
  tableBodyRowStyle: {
    cursor: "pointer",
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
};
