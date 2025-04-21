
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const AIRPORT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
export const AIRLINE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for airlines

export async function fetchWithCache(
  endpoint: string, 
  params: Record<string, string> = {},
  forceRefresh: boolean = false
): Promise<any> {
  const cacheKey = `aviation_${endpoint}_${JSON.stringify(params)}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  // Use cache if available and not forcing refresh
  if (cachedData && !forceRefresh) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = Date.now() - timestamp;
      
      // Use cache if it's not expired
      if (cacheAge < CACHE_DURATION) {
        console.log(`Using cached data for ${endpoint}`, params);
        return data;
      }
    } catch (e) {
      console.error("Cache parsing error:", e);
      // Cache is corrupted, continue to fetch fresh data
    }
  }
  
  console.log(`Fetching fresh data for ${endpoint}:`, params);
  
  try {
    // Build query string from params
    const queryString = new URLSearchParams(params).toString();
    const url = `https://littleboy-dun.vercel.app/api/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request for ${endpoint} failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the fresh data
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Function to get user's geolocation
export async function getUserPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
