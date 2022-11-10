# Basic Node Webserver Template

This is the starter template I use whenever I create a new webserver for a node server. This creates a basic webserver wrapper around the standard express server functionality. This lets you get up and running with a basic static website in seconds, with easy customizations to the specific functionality you need, such as Authorization.

## Basic usage

```
const BasicWebServer = require("./BasicWebServer");

new BasicWebServer().start();
```

This listens on port 8080 by default. If you want to listen on a different port, just pass it to the BasicWebServer constructor:
```
new BasicWebServer(9000).start();
```
