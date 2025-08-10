// Advanced bot detection utility
export const detectBot = (userAgent = '', headers = {}) => {
  const ua = userAgent.toLowerCase()
  
  // Known bot patterns
  const botPatterns = [
    'wappalyzer', 'whatruns', 'builtwith', 'spider', 'bot', 'crawler',
    'scanner', 'detector', 'lighthouse', 'pagespeed', 'gtmetrix',
    'headless', 'phantom', 'puppeteer', 'selenium', 'webdriver',
    'scrapy', 'requests', 'curl', 'wget', 'python', 'node',
    'chrome-lighthouse', 'google-pagespeed', 'pingdom', 'monitis'
  ]
  
  // Headless browser detection
  const headlessPatterns = [
    'headlesschrome', 'phantomjs', 'htmlunit', 'electron'
  ]
  
  // Check for bot patterns
  const hasBotsPattern = botPatterns.some(pattern => ua.includes(pattern))
  const isHeadless = headlessPatterns.some(pattern => ua.includes(pattern))
  
  // Additional suspicious indicators
  const suspiciousIndicators = {
    emptyUserAgent: userAgent === '',
    commonBotUA: /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent),
    missingAcceptEncoding: !headers['accept-encoding'],
    suspiciousAccept: headers.accept === '*/*' || !headers.accept,
    automatedRequests: headers['x-requested-with'] === 'XMLHttpRequest' && !headers.referer,
    programmaticAccess: /python|requests|curl|wget|java|perl|ruby|go-http|okhttp/i.test(userAgent)
  }
  
  const suspiciousCount = Object.values(suspiciousIndicators).filter(Boolean).length
  
  return {
    isBot: hasBotsPattern || isHeadless || suspiciousCount >= 2,
    isHeadless,
    hasBotsPattern,
    suspiciousIndicators,
    suspiciousCount,
    confidence: Math.min((suspiciousCount / Object.keys(suspiciousIndicators).length) * 100, 100)
  }
}

// Client-side bot detection
export const clientSideBotDetection = () => {
  const checks = {
    webdriver: navigator.webdriver === true,
    languages: navigator.languages?.length === 0,
    plugins: navigator.plugins?.length === 0,
    noTouch: !('ontouchstart' in window) && !navigator.maxTouchPoints,
    headlessChrome: /HeadlessChrome/.test(navigator.userAgent),
    phantom: /PhantomJS/.test(navigator.userAgent),
    missingFeatures: typeof window.chrome === 'undefined' && /Chrome/.test(navigator.userAgent),
    automationFlags: window.navigator.webdriver || window.domAutomation || window.domAutomationController,
    suspiciousTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone === 'UTC'
  }
  
  const suspiciousCount = Object.values(checks).filter(Boolean).length
  
  return {
    isLikelyBot: suspiciousCount >= 2,
    checks,
    suspiciousCount
  }
}
