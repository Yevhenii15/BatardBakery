export default defineEventHandler((event) => {
  const html = `<!doctype html>
<html><head>
  <title>Batard API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
</head><body>
  <div id="swagger"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/docs-json',
      dom_id: '#swagger',
    });
  </script>
</body></html>`;

  setHeader(event, "content-type", "text/html; charset=utf-8");
  return html;
});
