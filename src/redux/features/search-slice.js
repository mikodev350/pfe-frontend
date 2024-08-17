import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../util/authUtils";
import { fetchFromIndexedDB } from "../../api/fetchFromIndexedDB";

export const fetchAdvancedSearch = createAsyncThunk(
  "search/fetchAdvancedSearch",
  async (params, { rejectWithValue }) => {
    try {
      const token = getToken();
      const online = navigator.onLine;

      if (online) {
        // Recherche en ligne
        const { data } = await axios.get(
          `http://localhost:1337/api/custom-search/advanced`,
          {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(
          "data --------------------------------------------------------------"
        );
        console.log(data);
        console.log(
          "data --------------------------------------------------------------"
        );

        return data;
      } else {
        // Recherche hors ligne depuis IndexedDB
        const data = await fetchFromIndexedDB(params);
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserSearch = createAsyncThunk(
  "search/fetchUserSearch",
  async (params, { rejectWithValue }) => {
    try {
      const token = getToken();
      const { data } = await axios.get(
        `http://localhost:1337/api/custom-search/users`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    status: "idle",
    error: null,
    filterType: "resource", // default filter type
  },
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.status = "idle";
      state.filterType = "resource"; // reset filter type
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvancedSearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdvancedSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload || [];
      })
      .addCase(fetchAdvancedSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUserSearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload || [];
      })
      .addCase(fetchUserSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setFilterType, clearResults } = searchSlice.actions;

export default searchSlice.reducer;
