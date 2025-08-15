// src/components/DatasetTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

function DatasetTable({
  loading,
  error,
  data,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  onRowClick,
}) {
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const datasets = data?.datasets?.datasets || [];
  const totalCount = data?.datasets?.totalCount || 0;

  return (
    <>
      <TableContainer>
        <Table stickyHeader aria-label="datasets table">
          <TableHead>
            {/* Style the table header row */}
            <TableRow
              sx={{
                "& .MuiTableCell-head": {
                  backgroundColor: "background.default", // Darker background for header
                  fontWeight: "bold",
                },
              }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Freshness</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((row) => (
              <TableRow
                hover // This adds a hover effect
                key={row.id}
                onClick={() => onRowClick(row.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                <TableCell>{row.owner.name}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(row.lastUpdated), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {/* Map over the tags and render a Chip for each one */}
                  {row.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default DatasetTable;
