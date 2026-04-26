package com.dailyfinance.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * JPA Entity representing a financial asset in the portfolio.
 * This is the persistence layer model — never returned directly to clients.
 * (backend-dev-guidelines: Repository layer encapsulates entity access)
 */
@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String symbol;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AssetType type;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double quantity;

    @NotNull
    @Positive
    @Column(name = "purchase_price", nullable = false)
    private Double purchasePrice;

    @Column(name = "current_price")
    private Double currentPrice;

    @Column(name = "user_id")
    private String userId;

    public enum AssetType {
        STOCK, CRYPTO, CASH, ETF, BOND
    }

    // Constructors
    public Asset() {}

    public Asset(String symbol, String name, AssetType type, Double quantity,
                 Double purchasePrice, Double currentPrice, String userId) {
        this.symbol = symbol;
        this.name = name;
        this.type = type;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.currentPrice = currentPrice;
        this.userId = userId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AssetType getType() { return type; }
    public void setType(AssetType type) { this.type = type; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Double getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(Double purchasePrice) { this.purchasePrice = purchasePrice; }

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
