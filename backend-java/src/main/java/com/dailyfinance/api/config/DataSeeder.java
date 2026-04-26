package com.dailyfinance.api.config;

import com.dailyfinance.api.model.Asset;
import com.dailyfinance.api.repository.AssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Seeds the H2 database with sample portfolio data on startup.
 * This ensures the dashboard has data to render immediately.
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(AssetRepository assetRepository) {
        return args -> {
            if (assetRepository.count() == 0) {
                assetRepository.save(new Asset("AAPL", "Apple Inc.", Asset.AssetType.STOCK,
                    15.0, 142.50, 189.84, "default-user"));
                assetRepository.save(new Asset("GOOGL", "Alphabet Inc.", Asset.AssetType.STOCK,
                    8.0, 118.20, 141.80, "default-user"));
                assetRepository.save(new Asset("MSFT", "Microsoft Corp.", Asset.AssetType.STOCK,
                    12.0, 310.00, 378.91, "default-user"));
                assetRepository.save(new Asset("NVDA", "NVIDIA Corp.", Asset.AssetType.STOCK,
                    5.0, 450.00, 824.18, "default-user"));
                assetRepository.save(new Asset("BTC", "Bitcoin", Asset.AssetType.CRYPTO,
                    0.5, 42000.00, 67240.50, "default-user"));
                assetRepository.save(new Asset("ETH", "Ethereum", Asset.AssetType.CRYPTO,
                    4.0, 2200.00, 3245.30, "default-user"));
                assetRepository.save(new Asset("SOL", "Solana", Asset.AssetType.CRYPTO,
                    25.0, 95.00, 142.75, "default-user"));
                assetRepository.save(new Asset("SAVINGS", "High-Yield Savings", Asset.AssetType.CASH,
                    1.0, 15000.00, 15000.00, "default-user"));
                assetRepository.save(new Asset("CHECKING", "Checking Account", Asset.AssetType.CASH,
                    1.0, 5200.00, 5200.00, "default-user"));

                System.out.println("✅ Database seeded with 9 sample assets.");
            }
        };
    }
}
