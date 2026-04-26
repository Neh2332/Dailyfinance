"""
Daily Finance — Python Data-Fetch Engine
==========================================
Fetches real market data using yfinance and Alpha Vantage (optional).
Simulates AWS operations locally via LocalStack.
"""

import json
import logging
from datetime import datetime
import yfinance as yf

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info(f"Event received: {json.dumps(event)}")
    action = event.get("action", "fetch_prices")

    handlers = {
        "fetch_prices": handle_fetch_prices,
        "fetch_news": handle_fetch_news,
    }

    handler = handlers.get(action, handle_fetch_prices)

    try:
        result = handler(event)
        return {
            "statusCode": 200,
            "body": json.dumps(result),
            "headers": {"Content-Type": "application/json"},
        }
    except Exception as e:
        logger.error(f"Lambda execution failed: {str(e)}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


def handle_fetch_prices(event):
    """
    Fetch real-time data using yfinance for Stocks & Crypto.
    """
    symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA", "BTC-USD", "ETH-USD"]
    prices = []
    
    try:
        tickers = yf.Tickers(" ".join(symbols))
        for sym in symbols:
            info = tickers.tickers[sym].info
            current_price = info.get('currentPrice') or info.get('regularMarketPrice') or 0.0
            previous_close = info.get('previousClose', current_price)
            
            if current_price > 0 and previous_close > 0:
                change = current_price - previous_close
                change_percent = (change / previous_close) * 100
                
                prices.append({
                    "symbol": sym.replace("-USD", ""),
                    "name": info.get('shortName', sym),
                    "type": "CRYPTO" if "-USD" in sym else "STOCK",
                    "price": round(current_price, 2),
                    "change": round(change, 2),
                    "changePercent": round(change_percent, 2),
                    "volume": info.get('volume', 0)
                })
        
        logger.info(f"Fetched real prices for {len(prices)} assets.")
        return {"status": "success", "prices": prices}

    except Exception as e:
        logger.error(f"yfinance failed: {e}")
        return {"status": "error", "message": "Failed to fetch real data"}

def handle_fetch_news(event):
    """
    Mocking NewsAPI format (since free tier requires an API key).
    In production, use requests.get("https://newsapi.org/v2/everything?q=finance&apiKey=YOUR_KEY")
    """
    return {
        "status": "success",
        "news": [
            {
                "source": "Bloomberg",
                "time": "10 mins ago",
                "title": "Tech Stocks Rally Following Strong Earnings Guidance",
                "url": "#"
            },
            {
                "source": "Reuters",
                "time": "1 hour ago",
                "title": "Federal Reserve Hints at Possible Rate Cuts Later This Year",
                "url": "#"
            },
            {
                "source": "CNBC",
                "time": "2 hours ago",
                "title": "Bitcoin Surges Past Key Resistance Level as Institutional Inflows Continue",
                "url": "#"
            },
            {
                "source": "Wall Street Journal",
                "time": "3 hours ago",
                "title": "Global Supply Chain Disruptions Ease, Boosting Retail Sector",
                "url": "#"
            },
            {
                "source": "Yahoo Finance",
                "time": "5 hours ago",
                "title": "Analysts Upgrade Mega-Cap Tech as AI Investments Pay Off",
                "url": "#"
            }
        ]
    }

if __name__ == "__main__":
    print(json.dumps(lambda_handler({"action": "fetch_prices"}, None), indent=2))
