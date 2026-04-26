import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1';

export const fetchMarketPrices = createAsyncThunk(
  'market/fetchPrices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/market/prices`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch market data');
    }
  }
);

export const fetchTrending = createAsyncThunk(
  'market/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/market/trending`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch trending');
    }
  }
);

export const fetchNews = createAsyncThunk(
  'market/fetchNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/market/news`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch news');
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    prices: [],
    trending: [],
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketPrices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarketPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
      })
      .addCase(fetchMarketPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.news = action.payload;
      });
  },
});

export default marketSlice.reducer;
