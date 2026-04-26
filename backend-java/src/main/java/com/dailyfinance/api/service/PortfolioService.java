package com.dailyfinance.api.service;

import com.dailyfinance.api.dto.AssetDTO;
import com.dailyfinance.api.dto.PortfolioHistoryDTO;
import com.dailyfinance.api.dto.PortfolioSummaryDTO;
import com.dailyfinance.api.model.Asset;
import com.dailyfinance.api.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service layer containing all business logic for portfolio management.
 * Framework-agnostic, unit-testable, receives dependencies via constructor.
 * (backend-dev-guidelines: Services Decide, Controllers Coordinate)
 */
@Service
public class PortfolioService {

    private final AssetRepository assetRepository;

    public PortfolioService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    /**
     * Get a full portfolio summary including net worth, allocations, and history.
     */
    public PortfolioSummaryDTO getPortfolioSummary() {
        List<Asset> assets = assetRepository.findAll();
        List<AssetDTO> assetDTOs = assets.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());

        double totalNetWorth = assetDTOs.stream()
            .mapToDouble(a -> a.getTotalValue() != null ? a.getTotalValue() : 0.0)
            .sum();

        double totalCost = assets.stream()
            .mapToDouble(a -> a.getPurchasePrice() * a.getQuantity())
            .sum();

        double totalProfitLoss = totalNetWorth - totalCost;
        double totalProfitLossPercentage = totalCost != 0 ? (totalProfitLoss / totalCost) * 100.0 : 0.0;

        // Calculate allocation by type
        Map<String, Double> allocation = assetDTOs.stream()
            .collect(Collectors.groupingBy(
                AssetDTO::getType,
                Collectors.summingDouble(a -> a.getTotalValue() != null ? a.getTotalValue() : 0.0)
            ));

        // Generate simulated history for demo
        List<PortfolioHistoryDTO> history = generatePortfolioHistory(totalNetWorth);

        PortfolioSummaryDTO summary = new PortfolioSummaryDTO();
        summary.setTotalNetWorth(totalNetWorth);
        summary.setTotalProfitLoss(totalProfitLoss);
        summary.setTotalProfitLossPercentage(totalProfitLossPercentage);
        summary.setAllocationByType(allocation);
        summary.setAssets(assetDTOs);
        summary.setHistory(history);

        return summary;
    }

    /**
     * Get all assets.
     */
    public List<AssetDTO> getAllAssets() {
        return assetRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get a single asset by ID.
     */
    public AssetDTO getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Asset not found with ID: " + id));
        return toDTO(asset);
    }

    /**
     * Create a new asset.
     */
    public AssetDTO createAsset(AssetDTO dto) {
        Asset asset = toEntity(dto);
        Asset saved = assetRepository.save(asset);
        return toDTO(saved);
    }

    /**
     * Update an existing asset.
     */
    public AssetDTO updateAsset(Long id, AssetDTO dto) {
        Asset existing = assetRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Asset not found with ID: " + id));

        existing.setSymbol(dto.getSymbol());
        existing.setName(dto.getName());
        existing.setType(Asset.AssetType.valueOf(dto.getType()));
        existing.setQuantity(dto.getQuantity());
        existing.setPurchasePrice(dto.getPurchasePrice());
        if (dto.getCurrentPrice() != null) {
            existing.setCurrentPrice(dto.getCurrentPrice());
        }

        Asset saved = assetRepository.save(existing);
        return toDTO(saved);
    }

    /**
     * Delete an asset by ID.
     */
    public void deleteAsset(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new NoSuchElementException("Asset not found with ID: " + id);
        }
        assetRepository.deleteById(id);
    }

    // ── Mapper Methods (Entity ↔ DTO) ────────────────────────────

    private AssetDTO toDTO(Asset asset) {
        return new AssetDTO(
            asset.getId(),
            asset.getSymbol(),
            asset.getName(),
            asset.getType().name(),
            asset.getQuantity(),
            asset.getPurchasePrice(),
            asset.getCurrentPrice()
        );
    }

    private Asset toEntity(AssetDTO dto) {
        return new Asset(
            dto.getSymbol(),
            dto.getName(),
            Asset.AssetType.valueOf(dto.getType()),
            dto.getQuantity(),
            dto.getPurchasePrice(),
            dto.getCurrentPrice(),
            "default-user"
        );
    }

    /**
     * Generate simulated portfolio history for the last 30 days.
     * In production, this would read from DynamoDB or a time-series table.
     */
    private List<PortfolioHistoryDTO> generatePortfolioHistory(double currentValue) {
        List<PortfolioHistoryDTO> history = new ArrayList<>();
        Random random = new Random(42);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        for (int i = 29; i >= 0; i--) {
            String date = LocalDate.now().minusDays(i).format(formatter);
            double fluctuation = 1.0 + (random.nextDouble() * 0.1 - 0.05);
            double value = currentValue * fluctuation * (0.85 + (0.15 * (30 - i) / 30.0));
            history.add(new PortfolioHistoryDTO(date, Math.round(value * 100.0) / 100.0));
        }

        return history;
    }
}
