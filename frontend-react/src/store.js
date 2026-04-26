import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './features/portfolio/portfolioSlice';
import marketReducer from './features/market/marketSlice';

/**
 * Redux store configuration.
 * Feature-based organization: each feature owns its own slice.
 */
const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    market: marketReducer,
  },
});

export default store;
