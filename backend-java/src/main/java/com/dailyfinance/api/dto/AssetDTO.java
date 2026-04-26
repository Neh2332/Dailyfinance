package com.dailyfinance.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Data Transfer Object for financial assets.
 * All API communication uses DTOs — never expose entities directly.
 * (backend-dev-guidelines: DTO enforcement)
 */
public class AssetDTO {

    private Long id;

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Asset type is required (STOCK, CRYPTO, CASH)")
    private String type;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    @NotNull(message = "Purchase price is required")
    @Positive(message = "Purchase price must be positive")
    private Double purchasePrice;

    private Double currentPrice;
    private Double totalValue;
    private Double profitLoss;
    private Double profitLossPercentage;

    // Constructors
    public AssetDTO() {}

    public AssetDTO(Long id, String symbol, String name, String type,
                    Double quantity, Double purchasePrice, Double currentPrice) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
        this.type = type;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.currentPrice = currentPrice;
        this.totalValue = currentPrice != null ? currentPrice * quantity : 0.0;
        this.profitLoss = currentPrice != null ? (currentPrice - purchasePrice) * quantity : 0.0;
        this.profitLossPercentage = purchasePrice != 0 && currentPrice != null
            ? ((currentPrice - purchasePrice) / purchasePrice) * 100.0
            : 0.0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Double getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(Double purchasePrice) { this.purchasePrice = purchasePrice; }

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public Double getTotalValue() { return totalValue; }
    public void setTotalValue(Double totalValue) { this.totalValue = totalValue; }

    public Double getProfitLoss() { return profitLoss; }
    public void setProfitLoss(Double profitLoss) { this.profitLoss = profitLoss; }

    public Double getProfitLossPercentage() { return profitLossPercentage; }
    public void setProfitLossPercentage(Double profitLossPercentage) { this.profitLossPercentage = profitLossPercentage; }
}
