'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');
function runServer() {
  const app = express();
  app.listen(2001, () => {
    console.log('start server');
  });
}
runServer();
//# sourceMappingURL=app.js.map
