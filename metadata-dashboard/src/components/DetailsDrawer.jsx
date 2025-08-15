// src/components/DetailsDrawer.jsx
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Grid,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GET_DATASET_DETAILS } from "../graphql/queries";
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
  Bar,
  ResponsiveContainer,
} from "recharts";

// For better readability, we create small components for each tab's content.

const SchemaView = ({ schema }) => (
  <Box sx={{ mt: 3, p: 1 }}>
    {schema.map((col) => (
      <Box
        key={col.name}
        sx={{
          mb: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          pb: 2,
        }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{ fontWeight: "bold" }}
        >
          {col.name}
        </Typography>
        <Chip
          label={col.type}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ ml: 1.5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {col.description}
        </Typography>
      </Box>
    ))}
  </Box>
);

const LineageView = ({ lineage, datasetName }) => (
  <Box
    sx={{
      mt: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 3,
      gap: 2,
      flexWrap: "wrap",
    }}
  >
    <Box
      sx={{
        p: 2,
        border: "1px solid grey",
        borderRadius: 1,
        textAlign: "center",
      }}
    >
      <Typography variant="h6">Upstream</Typography>
      {lineage.upstream.map((u) => (
        <Chip key={u.name} label={u.name} sx={{ mt: 1 }} />
      ))}
    </Box>
    <Typography variant="h4">➡️</Typography>
    <Box
      sx={{
        p: 2,
        border: "1px solid #7e57c2",
        borderRadius: 1,
        bgcolor: "rgba(126, 87, 194, 0.2)",
        textAlign: "center",
      }}
    >
      <Typography variant="h6">{datasetName}</Typography>
      <Typography variant="caption" color="text.secondary">
        (Current)
      </Typography>
    </Box>
    <Typography variant="h4">➡️</Typography>
    <Box
      sx={{
        p: 2,
        border: "1px solid grey",
        borderRadius: 1,
        textAlign: "center",
      }}
    >
      <Typography variant="h6">Downstream</Typography>
      {lineage.downstream.map((d) => (
        <Chip key={d.name} label={d.name} sx={{ mt: 1 }} />
      ))}
    </Box>
  </Box>
);

const UsageCharts = ({ usage, freshness }) => (
  <Box sx={{ mt: 3, width: "100%" }}>
    <Grid container spacing={4}>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Usage (Queries per day)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={usage}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
            />
            <Legend />
            <Bar dataKey="queries" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Freshness Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={freshness}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) =>
                `Week of ${new Date(tick).toLocaleDateString()}`
              }
            />
            <YAxis hide={true} />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              formatter={(value) => [
                `Updated: ${new Date(value).toLocaleString()}`,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="lastUpdated"
              name="Last Updated Time"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  </Box>
);

function DetailsDrawer({ datasetId, open, onClose }) {
  const { data, loading, error } = useQuery(GET_DATASET_DETAILS, {
    variables: { id: datasetId },
    skip: !datasetId, // Don't run the query if no dataset is selected
  });
  const [tabIndex, setTabIndex] = useState(0);
  const dataset = data?.dataset;

  // Reset tab to 0 when a new dataset is opened
  React.useEffect(() => {
    if (open) {
      setTabIndex(0);
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", md: "65%", lg: "50%" } } }}
    >
      <Box
        sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}
      >
        {loading && <CircularProgress sx={{ m: "auto" }} />}
        {error && (
          <Typography color="error" sx={{ m: "auto" }}>
            Error loading details.
          </Typography>
        )}
        {dataset && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h5">{dataset.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Owned by {dataset.owner.name} ({dataset.owner.email})
                </Typography>
              </Box>
              <IconButton onClick={onClose} aria-label="Close dataset details">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ my: 2 }}>
              {dataset.description}
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabIndex}
                onChange={(e, newValue) => setTabIndex(newValue)}
                aria-label="Dataset details tabs"
              >
                <Tab label="Schema" />
                <Tab label="Lineage" />
                <Tab label="Usage & Analytics" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
              {tabIndex === 0 && <SchemaView schema={dataset.schema} />}
              {tabIndex === 1 && (
                <LineageView
                  lineage={dataset.lineage}
                  datasetName={dataset.name}
                />
              )}
              {tabIndex === 2 && (
                <UsageCharts
                  usage={dataset.usage}
                  freshness={dataset.freshness}
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}

export default DetailsDrawer;
