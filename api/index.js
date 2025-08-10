// Advanced bot detection utility (server-side)
const detectBot = (userAgent = '', headers = {}) => {
  const ua = userAgent.toLowerCase()
  
  const botPatterns = [
    'wappalyzer', 'whatruns', 'builtwith', 'spider', 'bot', 'crawler',
    'scanner', 'detector', 'lighthouse', 'pagespeed', 'gtmetrix',
    'headless', 'phantom', 'puppeteer', 'selenium', 'webdriver',
    'scrapy', 'requests', 'curl', 'wget', 'python', 'node',
    'chrome-lighthouse', 'google-pagespeed', 'pingdom', 'monitis'
  ]
  
  const headlessPatterns = [
    'headlesschrome', 'phantomjs', 'htmlunit', 'electron'
  ]
  
  const hasBotsPattern = botPatterns.some(pattern => ua.includes(pattern))
  const isHeadless = headlessPatterns.some(pattern => ua.includes(pattern))
  
  const suspiciousIndicators = {
    emptyUserAgent: userAgent === '',
    missingAcceptEncoding: !headers['accept-encoding'],
    suspiciousAccept: headers.accept === '*/*' || !headers.accept,
    programmaticAccess: /python|requests|curl|wget|java|perl|ruby|go-http|okhttp/i.test(userAgent)
  }
  
  const suspiciousCount = Object.values(suspiciousIndicators).filter(Boolean).length
  
  return {
    isBot: hasBotsPattern || isHeadless || suspiciousCount >= 2,
    isHeadless,
    hasBotsPattern,
    suspiciousCount
  }
}

// Anti-fingerprinting API route for bot detection
export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || ''
  const botDetection = detectBot(userAgent, req.headers)

  if (botDetection.isBot) {
    // Return fake static HTML for bots/scanners
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple HTML Page</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .container { max-width: 600px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome</h1>
          <p>This is a simple HTML website.</p>
          <p>Built with standard web technologies.</p>
          <div id="content">
            <h2>About</h2>
            <p>A basic web page with static content.</p>
          </div>
        </div>
        <script>
          // Simple vanilla JavaScript
          document.addEventListener('DOMContentLoaded', function() {
            console.log('Page loaded');
          });
        </script>
      </body>
      </html>
    `)
  }

  // For legitimate users, return a redirect to the main app
  res.setHeader('Location', '/')
  res.status(302).end()
}
