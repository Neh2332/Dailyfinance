package com.dailyfinance.api.dto;

/**
 * DTO for portfolio value history points (used in charts).
 */
public class PortfolioHistoryDTO {

    private String date;
    private Double value;

    public PortfolioHistoryDTO() {}

    public PortfolioHistoryDTO(String date, Double value) {
        this.date = date;
        this.value = value;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
}
