

// 1. IMPORT REQUIRED SERVER ENGINE TOOLKITS
const express = require('express');
const path = require('path');

// 2. INITIALIZE THE EXPRESS APPLICATION COMPONENT OBJECT
const app = express();
const SYSTEM_PORT_PORTAL = process.env.PORT || 3000;

// 3. SECURE DATA PARSING INTERCEPT MIDDLEWARE
// Allows the backend server to read incoming text strings from forms cleanly
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. STATIC FILE ROUTING CONTROLLER
// Automatically serves all your custom HTML, CSS, images, and script.js files
// directly to any browser visit, using your current directory boundaries
app.use(express.static(path.join(__dirname, '/')));

// 5. MASTER CRAWLER FALLBACK ROUTE MAP
// Ensures that if a user directly types or navigates back to your root directory domain,
// the server responds by rendering your homepage skeleton index template file
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// 6. INITIALIZE SERVER PORT LISTENER HOOK
app.listen(SYSTEM_PORT_PORTAL, () => {
    console.log(`==========================================================================`);
    console.log(`EAZZYGLOBAL PLATFORM LOCAL BACKEND SERVER CORE ACTIVE`);
    console.log(`-> Server Portal Runtime Live Node Location: http://localhost:${SYSTEM_PORT_PORTAL}`);
    console.log(`-> Security Access Level Status: SECURE / PRIVATE OWNERSHIP PRIVILEGES`);
    console.log(`==========================================================================`);
});
