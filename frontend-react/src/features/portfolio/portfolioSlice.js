import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1';

/**
 * Async thunk: Fetch portfolio summary from Spring Boot API.
 */
export const fetchPortfolioSummary = createAsyncThunk(
  'portfolio/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/portfolio/summary`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch portfolio');
    }
  }
);

/**
 * Async thunk: Create a new asset.
 */
export const createAsset = createAsyncThunk(
  'portfolio/createAsset',
  async (assetData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/assets`, assetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create asset');
    }
  }
);

/**
 * Async thunk: Delete an asset.
 */
export const deleteAsset = createAsyncThunk(
  'portfolio/deleteAsset',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/assets/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete asset');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    summary: null,
    assets: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Summary
      .addCase(fetchPortfolioSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
        state.assets = action.payload.assets || [];
      })
      .addCase(fetchPortfolioSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Asset
      .addCase(createAsset.fulfilled, (state, action) => {
        state.assets.push(action.payload);
      })
      // Delete Asset
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
