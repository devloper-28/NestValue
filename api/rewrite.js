export default function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Map paths to HTML files
  const pathMap = {
    '/about': '/about.html',
    '/privacy': '/privacy.html',
    '/contact': '/contact.html',
    '/terms': '/terms.html',
    '/input': '/input.html',
    '/results': '/results.html',
    '/expert': '/expert.html'
  };
  
  const htmlFile = pathMap[pathname];
  
  if (htmlFile) {
    // Serve the specific HTML file
    res.setHeader('Content-Type', 'text/html');
    res.status(200).sendFile(htmlFile);
  } else {
    // Fallback to index.html for other routes
    res.setHeader('Content-Type', 'text/html');
    res.status(200).sendFile('/index.html');
  }
}
