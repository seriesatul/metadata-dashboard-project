// src/pages/DashboardPage.jsx
import React, { useState, useCallback } from "react";
// Make sure to import Container, Typography, and Paper
import { Box, Container, Typography, Paper } from "@mui/material";
import { useQuery } from "@apollo/client";
import { debounce } from "lodash";

import { GET_DATASETS } from "../graphql/queries";
import SearchBar from "../components/SearchBar";
import DatasetTable from "../components/DatasetTable";

const LazyDetailsDrawer = React.lazy(
  () => import("../components/DetailsDrawer"),
);

function DashboardPage() {
  // ... (all your state and handlers remain the same) ...
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);

  const [filters, setFilters] = useState({ search: "", updatedSince: null });

  const { loading, error, data } = useQuery(GET_DATASETS, {
    variables: {
      page: page + 1,
      limit: rowsPerPage,
      search: filters.search,
      updatedSince: filters.updatedSince, // Pass the new variable
    },
  });

  const debouncedSetSearch = useCallback(
    debounce((value) => setSearch(value), 300),
    [],
  );
  const handleSearchChange = (event) => debouncedSetSearch(event.target.value);
  const handleRowClick = (id) => setSelectedDatasetId(id);
  const handleDrawerClose = () => setSelectedDatasetId(null);

  const handleFilterChange = (newFilters) => {
    setPage(0); // Reset to first page on new filter
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    // The Container centers your content and adds padding
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* This is the Title and Subtitle block */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Metadata Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore, manage, and understand your data assets.
        </Typography>
      </Box>

      {/* This Paper component creates the main card effect */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <SearchBar onFilterChange={handleFilterChange} />
        <DatasetTable
          loading={loading}
          error={error}
          data={data}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          onRowClick={handleRowClick}
        />
      </Paper>

      <React.Suspense fallback={<div>Loading details...</div>}>
        {selectedDatasetId && (
          <LazyDetailsDrawer
            datasetId={selectedDatasetId}
            open={!!selectedDatasetId}
            onClose={handleDrawerClose}
          />
        )}
      </React.Suspense>
    </Container>
  );
}

export default DashboardPage;
