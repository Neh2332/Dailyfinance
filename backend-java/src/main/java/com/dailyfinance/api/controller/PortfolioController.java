package com.dailyfinance.api.controller;

import com.dailyfinance.api.dto.AssetDTO;
import com.dailyfinance.api.dto.PortfolioSummaryDTO;
import com.dailyfinance.api.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * REST Controller for portfolio operations.
 * Controllers coordinate — they parse requests, delegate to services, and format responses.
 * (backend-dev-guidelines: Controllers Coordinate, Services Decide)
 */
@RestController
@RequestMapping("/api/v1")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // ── Portfolio Summary ──────────────────────────────────────────

    @GetMapping("/portfolio/summary")
    public ResponseEntity<PortfolioSummaryDTO> getPortfolioSummary() {
        try {
            PortfolioSummaryDTO summary = portfolioService.getPortfolioSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── Asset CRUD ─────────────────────────────────────────────────

    @GetMapping("/assets")
    public ResponseEntity<List<AssetDTO>> getAllAssets() {
        try {
            List<AssetDTO> assets = portfolioService.getAllAssets();
            return ResponseEntity.ok(assets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assets/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable Long id) {
        try {
            AssetDTO asset = portfolioService.getAssetById(id);
            return ResponseEntity.ok(asset);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/assets")
    public ResponseEntity<?> createAsset(@Valid @RequestBody AssetDTO assetDTO) {
        try {
            AssetDTO created = portfolioService.createAsset(assetDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/assets/{id}")
    public ResponseEntity<?> updateAsset(@PathVariable Long id, @Valid @RequestBody AssetDTO assetDTO) {
        try {
            AssetDTO updated = portfolioService.updateAsset(id, assetDTO);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/assets/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id) {
        try {
            portfolioService.deleteAsset(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
