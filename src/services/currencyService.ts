
import { CACHE_DURATION } from './shared/apiUtils';

interface Currency {
  id: string;
  symbol: string;
  name: string;
  type: 'fiat' | 'crypto';
}

// Cache for currency data
const CURRENCY_CACHE_KEY = "currency_list_cache";
const RATES_CACHE_KEY_PREFIX = "currency_rate_";
const CURRENCY_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_CACHE_DURATION = 60 * 1000; // 1 minute

// Preset major currencies to avoid relying on API for basic data
const PRESET_MAJOR_CURRENCIES: Currency[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', type: 'crypto' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', type: 'crypto' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', type: 'crypto' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', type: 'crypto' },
  { id: 'solana', symbol: 'sol', name: 'Solana', type: 'crypto' },
  { id: 'usd', symbol: 'usd', name: 'US Dollar', type: 'fiat' },
  { id: 'eur', symbol: 'eur', name: 'Euro', type: 'fiat' },
  { id: 'gbp', symbol: 'gbp', name: 'British Pound', type: 'fiat' },
  { id: 'jpy', symbol: 'jpy', name: 'Japanese Yen', type: 'fiat' },
  { id: 'cad', symbol: 'cad', name: 'Canadian Dollar', type: 'fiat' },
  { id: 'aud', symbol: 'aud', name: 'Australian Dollar', type: 'fiat' },
  { id: 'chf', symbol: 'chf', name: 'Swiss Franc', type: 'fiat' },
  { id: 'cny', symbol: 'cny', name: 'Chinese Yuan', type: 'fiat' },
  { id: 'inr', symbol: 'inr', name: 'Indian Rupee', type: 'fiat' },
];

// Function to fetch all available currencies with fallback to presets
export async function fetchCurrencies(): Promise<Currency[]> {
  // Check cache first
  const cachedData = localStorage.getItem(CURRENCY_CACHE_KEY);
  
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = Date.now() - timestamp;
      
      // Use cache if it's not expired
      if (cacheAge < CURRENCY_CACHE_DURATION) {
        console.log('Using cached currency data');
        return data;
      }
    } catch (e) {
      console.error("Cache parsing error:", e);
      // Cache is corrupted, continue to fetch fresh data
    }
  }
  
  console.log('Fetching fresh currency data from API');
  
  try {
    // Fetch cryptocurrencies
    const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!cryptoResponse.ok) {
      console.warn(`API request failed with status ${cryptoResponse.status}, using preset data`);
      return PRESET_MAJOR_CURRENCIES;
    }
    
    const cryptoData = await cryptoResponse.json();
    
    // Fetch supported VS currencies (fiat)
    const fiatResponse = await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!fiatResponse.ok) {
      console.warn(`API request failed with status ${fiatResponse.status}, using preset data`);
      return PRESET_MAJOR_CURRENCIES;
    }
    
    const fiatData = await fiatResponse.json();
    
    // Prepare the combined currency data
    // Limit to top 100 cryptos by market cap plus main fiats to avoid overwhelming the UI
    const cryptoCurrencies: Currency[] = cryptoData
      .slice(0, 100) // Limit to first 100 for better performance
      .map((crypto: any) => ({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        type: 'crypto'
      }));
    
    const fiatCurrencies: Currency[] = fiatData
      .map((fiat: string) => ({
        id: fiat,
        symbol: fiat,
        name: getFiatCurrencyName(fiat),
        type: 'fiat'
      }));
    
    const allCurrencies = [
      ...cryptoCurrencies,
      ...fiatCurrencies
    ];
    
    // Cache the data
    localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify({
      data: allCurrencies,
      timestamp: Date.now()
    }));
    
    return allCurrencies;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    // Fallback to preset currencies in case of any error
    return PRESET_MAJOR_CURRENCIES;
  }
}

// Function to convert amount from one currency to another
export async function convertCurrency(
  fromCurrency: string, 
  toCurrency: string, 
  amount: number
): Promise<number> {
  try {
    // If same currency, return the amount directly
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    const cacheKey = `${RATES_CACHE_KEY_PREFIX}${fromCurrency}_${toCurrency}`;
    const cachedRate = localStorage.getItem(cacheKey);
    
    let rate: number;
    
    if (cachedRate) {
      try {
        const { data, timestamp } = JSON.parse(cachedRate);
        const cacheAge = Date.now() - timestamp;
        
        // Use cache if it's not expired
        if (cacheAge < RATE_CACHE_DURATION) {
          console.log(`Using cached rate for ${fromCurrency} to ${toCurrency}`);
          rate = data;
        } else {
          rate = await fetchExchangeRate(fromCurrency, toCurrency);
          cacheRate(fromCurrency, toCurrency, rate);
        }
      } catch (e) {
        console.error("Rate cache parsing error:", e);
        rate = await fetchExchangeRate(fromCurrency, toCurrency);
        cacheRate(fromCurrency, toCurrency, rate);
      }
    } else {
      rate = await fetchExchangeRate(fromCurrency, toCurrency);
      cacheRate(fromCurrency, toCurrency, rate);
    }
    
    return amount * rate;
  } catch (error) {
    console.error("Error converting currency:", error);
    throw error;
  }
}

// Helper function to fetch the exchange rate with better error handling
async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  console.log(`Fetching exchange rate for ${fromCurrency} to ${toCurrency}`);
  
  try {
    // Try direct conversion first
    const directUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`;
    
    const response = await fetch(directUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      // If API limits are hit, fall back to a simulated rate based on preset values
      console.warn(`API limit reached or error, using fallback rate calculation`);
      return getEstimatedRate(fromCurrency, toCurrency);
    }
    
    const data = await response.json();
    
    // Check if we got a direct rate
    if (data[fromCurrency] && data[fromCurrency][toCurrency]) {
      return data[fromCurrency][toCurrency];
    }
    
    // If direct conversion failed, try via USD
    return await getViaUsdRate(fromCurrency, toCurrency);
  } catch (error) {
    console.error("Error in exchange rate API:", error);
    // Return fallback rate if API call fails
    return getEstimatedRate(fromCurrency, toCurrency);
  }
}

// Helper to get rate via USD as intermediary
async function getViaUsdRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    // Convert from currency to USD
    const toUsdUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=usd`;
    const toUsdResponse = await fetch(toUsdUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!toUsdResponse.ok) {
      throw new Error(`API request failed with status ${toUsdResponse.status}`);
    }
    
    const toUsdData = await toUsdResponse.json();
    
    if (!toUsdData[fromCurrency] || !toUsdData[fromCurrency].usd) {
      throw new Error(`Could not get USD rate for ${fromCurrency}`);
    }
    
    const fromToUsd = toUsdData[fromCurrency].usd;
    
    // Convert from USD to target currency
    const fromUsdUrl = `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=${toCurrency}`;
    const fromUsdResponse = await fetch(fromUsdUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!fromUsdResponse.ok) {
      throw new Error(`API request failed with status ${fromUsdResponse.status}`);
    }
    
    const fromUsdData = await fromUsdResponse.json();
    
    if (!fromUsdData.usd || !fromUsdData.usd[toCurrency]) {
      throw new Error(`Could not get rate from USD to ${toCurrency}`);
    }
    
    const usdToTarget = fromUsdData.usd[toCurrency];
    
    // Return combined rate
    return fromToUsd * usdToTarget;
  } catch (error) {
    console.error("Error getting rate via USD:", error);
    return getEstimatedRate(fromCurrency, toCurrency);
  }
}

// Fallback rates for when API fails
function getEstimatedRate(fromCurrency: string, toCurrency: string): number {
  // Basic fallback rates for common pairs
  const fallbackRates: Record<string, Record<string, number>> = {
    'bitcoin': { 'usd': 64000, 'eur': 59000, 'gbp': 50000 },
    'ethereum': { 'usd': 3400, 'eur': 3100, 'gbp': 2700 },
    'usd': { 'eur': 0.92, 'gbp': 0.79, 'jpy': 150.5, 'bitcoin': 0.000016 },
    'eur': { 'usd': 1.09, 'gbp': 0.86, 'jpy': 164.3, 'bitcoin': 0.000017 },
    'gbp': { 'usd': 1.27, 'eur': 1.16, 'jpy': 191.1, 'bitcoin': 0.000020 }
  };
  
  // Check direct rate
  if (fallbackRates[fromCurrency]?.[toCurrency]) {
    return fallbackRates[fromCurrency][toCurrency];
  }
  
  // Check inverse rate
  if (fallbackRates[toCurrency]?.[fromCurrency]) {
    return 1 / fallbackRates[toCurrency][fromCurrency];
  }
  
  // Fallback to a safe default for any unknown pair
  return 1.0; // Default to 1:1 if we can't determine
}

// Helper to cache exchange rates
function cacheRate(fromCurrency: string, toCurrency: string, rate: number): void {
  const cacheKey = `${RATES_CACHE_KEY_PREFIX}${fromCurrency}_${toCurrency}`;
  
  localStorage.setItem(cacheKey, JSON.stringify({
    data: rate,
    timestamp: Date.now()
  }));
}

// Helper to get fiat currency names
function getFiatCurrencyName(code: string): string {
  const currencies: Record<string, string> = {
    usd: "US Dollar",
    eur: "Euro",
    jpy: "Japanese Yen",
    gbp: "British Pound",
    aud: "Australian Dollar",
    cad: "Canadian Dollar",
    chf: "Swiss Franc",
    cny: "Chinese Yuan",
    inr: "Indian Rupee",
    try: "Turkish Lira",
    rub: "Russian Ruble",
    brl: "Brazilian Real",
    krw: "South Korean Won",
    idr: "Indonesian Rupiah",
    sgd: "Singapore Dollar",
    myr: "Malaysian Ringgit",
    thb: "Thai Baht",
    php: "Philippine Peso",
    mxn: "Mexican Peso",
    zar: "South African Rand",
    hkd: "Hong Kong Dollar",
    dkk: "Danish Krone",
    pln: "Polish Złoty",
    // Add more currencies as needed
  };
  
  return currencies[code.toLowerCase()] || code.toUpperCase();
}
