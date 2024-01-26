const { join, extname } = require('path');
const { readFileSync, existsSync } = require('fs')

  // TODO: replace by mime-types
function getContentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  return 'text/plain';
}

module.exports.handler = async (event) => {
  const fileName = event.path || 'index.html'
  const filePath = fileName.includes('.') && existsSync(join(__dirname, 'dist', fileName))
    ? join(__dirname, 'dist', fileName)
    : join(__dirname, 'dist', 'index.html');

  try {
    const fileContent = readFileSync(filePath, { encoding: 'utf8' })
    const fileContentType = getContentType(extname(filePath))

    return {
      statusCode: 200,
      headers: { 'Content-Type': fileContentType },
      body: fileContent
    }
  } catch (err) {
    
    return {
      statusCode: 500,
      body: 'Internal server error: ' + err.message + ' ' + filePath + ' ' + fileName
    }
  }
}
