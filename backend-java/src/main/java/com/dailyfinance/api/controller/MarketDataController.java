package com.dailyfinance.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/v1/market")
public class MarketDataController {

    @GetMapping("/prices")
    public ResponseEntity<List<Map<String, Object>>> getMarketPrices() {
        // In production, this data would be fetched directly from DynamoDB (populated by the Python Lambda)
        // or fetched via an internal API call. For local emulation, we serve realistic static data to match yfinance.
        List<Map<String, Object>> prices = new ArrayList<>();
        prices.add(createPriceEntry("AAPL", "Apple Inc.", "STOCK", 189.84, -0.45));
        prices.add(createPriceEntry("GOOGL", "Alphabet Inc.", "STOCK", 141.80, 1.23));
        prices.add(createPriceEntry("MSFT", "Microsoft Corp.", "STOCK", 378.91, 0.89));
        prices.add(createPriceEntry("AMZN", "Amazon.com", "STOCK", 178.25, 2.15));
        prices.add(createPriceEntry("NVDA", "NVIDIA Corp.", "STOCK", 824.18, 3.42));
        prices.add(createPriceEntry("BTC", "Bitcoin", "CRYPTO", 67240.50, 1.87));
        prices.add(createPriceEntry("ETH", "Ethereum", "CRYPTO", 3245.30, -0.92));
        return ResponseEntity.ok(prices);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Map<String, Object>>> getTrending() {
        List<Map<String, Object>> trending = new ArrayList<>();
        trending.add(Map.of("symbol", "NVDA", "name", "NVIDIA Corp.", "change", 3.42, "volume", "82.5M"));
        trending.add(Map.of("symbol", "SOL", "name", "Solana", "change", 4.56, "volume", "1.2B"));
        trending.add(Map.of("symbol", "TSLA", "name", "Tesla Inc.", "change", -1.89, "volume", "112.7M"));
        return ResponseEntity.ok(trending);
    }

    @GetMapping("/news")
    public ResponseEntity<List<Map<String, String>>> getNews() {
        List<Map<String, String>> news = new ArrayList<>();
        news.add(Map.of("source", "Bloomberg", "time", "10 mins ago", "title", "Tech Stocks Rally Following Strong Earnings Guidance", "url", "#"));
        news.add(Map.of("source", "Reuters", "time", "1 hour ago", "title", "Federal Reserve Hints at Possible Rate Cuts Later This Year", "url", "#"));
        news.add(Map.of("source", "CNBC", "time", "2 hours ago", "title", "Bitcoin Surges Past Key Resistance Level as Institutional Inflows Continue", "url", "#"));
        news.add(Map.of("source", "Wall Street Journal", "time", "3 hours ago", "title", "Global Supply Chain Disruptions Ease, Boosting Retail Sector", "url", "#"));
        news.add(Map.of("source", "Yahoo Finance", "time", "5 hours ago", "title", "Analysts Upgrade Mega-Cap Tech as AI Investments Pay Off", "url", "#"));
        return ResponseEntity.ok(news);
    }

    private Map<String, Object> createPriceEntry(String symbol, String name, String type, double price, double changePercent) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("symbol", symbol);
        entry.put("name", name);
        entry.put("type", type);
        entry.put("price", price);
        entry.put("changePercent", changePercent);
        entry.put("change", Math.round(price * changePercent / 100.0 * 100.0) / 100.0);
        return entry;
    }
}
