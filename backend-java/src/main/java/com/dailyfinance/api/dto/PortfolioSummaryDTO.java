package com.dailyfinance.api.dto;

import java.util.List;
import java.util.Map;

/**
 * DTO representing the full portfolio summary for the dashboard.
 */
public class PortfolioSummaryDTO {

    private Double totalNetWorth;
    private Double totalProfitLoss;
    private Double totalProfitLossPercentage;
    private Map<String, Double> allocationByType;
    private List<AssetDTO> assets;
    private List<PortfolioHistoryDTO> history;

    public PortfolioSummaryDTO() {}

    // Getters and Setters
    public Double getTotalNetWorth() { return totalNetWorth; }
    public void setTotalNetWorth(Double totalNetWorth) { this.totalNetWorth = totalNetWorth; }

    public Double getTotalProfitLoss() { return totalProfitLoss; }
    public void setTotalProfitLoss(Double totalProfitLoss) { this.totalProfitLoss = totalProfitLoss; }

    public Double getTotalProfitLossPercentage() { return totalProfitLossPercentage; }
    public void setTotalProfitLossPercentage(Double totalProfitLossPercentage) { this.totalProfitLossPercentage = totalProfitLossPercentage; }

    public Map<String, Double> getAllocationByType() { return allocationByType; }
    public void setAllocationByType(Map<String, Double> allocationByType) { this.allocationByType = allocationByType; }

    public List<AssetDTO> getAssets() { return assets; }
    public void setAssets(List<AssetDTO> assets) { this.assets = assets; }

    public List<PortfolioHistoryDTO> getHistory() { return history; }
    public void setHistory(List<PortfolioHistoryDTO> history) { this.history = history; }
}
