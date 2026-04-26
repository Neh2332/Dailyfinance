package com.dailyfinance.api.repository;

import com.dailyfinance.api.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository layer for Asset entity.
 * Encapsulates all data access — controllers never touch this directly.
 * (backend-dev-guidelines: Repository layer with intent-based methods)
 */
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByUserId(String userId);

    List<Asset> findByType(Asset.AssetType type);

    List<Asset> findBySymbolIgnoreCase(String symbol);

    @Query("SELECT a FROM Asset a WHERE a.currentPrice < a.purchasePrice")
    List<Asset> findUnderperformingAssets();

    @Query("SELECT a.type, SUM(a.currentPrice * a.quantity) FROM Asset a GROUP BY a.type")
    List<Object[]> getPortfolioAllocationByType();
}
