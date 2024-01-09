import React, { useState,useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { request } from "../../util/fetchApi.js";

const Transactions = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    // console.log("initial");
    const fetchFeatured = async () => {
      try {
        const data = await request("/client/find/", "GET");
        setFeaturedProperties(data);
        console.log("ttttttttttttttttttttt ", data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeatured();
  }, []);

  const [searchInput, setSearchInput] = useState("");

  const {  isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "currentOwner",
      headerName: "Owner",
      flex: 1,
    },

    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => `${Number(params.value).toFixed(5)} eth`,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.5,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "desc",
      headerName: "Description",
      flex: 0.5,
      // sortable: false,
      // renderCell: (params) => params.value.length,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Properties List" subtitle="Entire list of Properties" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !featuredProperties}
          getRowId={(row) => row._id}
          rows={(featuredProperties) || []}
          columns={columns}
          rowCount={(featuredProperties && featuredProperties.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
