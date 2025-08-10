// Honeypot API route - attracts and identifies scanning tools
export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || ''
  const referer = req.headers['referer'] || ''
  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown'
  
  // Log potential scanning attempts
  console.log('Potential scanner detected:', {
    userAgent,
    referer,
    ip,
    timestamp: new Date().toISOString()
  })

  // Return misleading technology information
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('X-Powered-By', 'Express')
  res.setHeader('Server', 'Apache/2.4.41')
  
  return res.status(200).json({
    framework: 'vanilla-js',
    version: '1.0.0',
    server: 'apache',
    database: 'mysql',
    cms: 'custom',
    analytics: 'none',
    libraries: ['jquery', 'bootstrap'],
    build_tool: 'webpack',
    hosting: 'shared-hosting',
    technologies: {
      frontend: ['html', 'css', 'javascript'],
      backend: ['php', 'mysql'],
      server: ['apache'],
      tools: ['webpack', 'babel']
    }
  })
}
