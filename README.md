## Qohash Assignment ###

This is an electron application that allows the user to display their local file system.  It requires
a NodeJS installation to build and run (see: https://nodejs.org/en/download/)

### Installing And Running The App ##

Verify that you have NodeJS installed, then run: 
```
npm install
```

from the application directory.  Next, run:
```
npm run package
```

to build and package up the application.  It will deposit the build artifacts 
in the `out` subdirectory. Finally, you can run the application by running:
```
./out/qohash-assignment-linux-x64/qohash-assignment
```

The appliction allows you to click on directories to drill in as well as use
the back button to go up a level.  You can also type in a directory to display
it.

The command-line mode can be run by specifying an optional directory parameter:
```
./out/qohash-assignment-linux-x64/qohash-assignment --dir=/bin
```

### Production Readiness

There are many things to be done in order to productionalize this application.  The following is
my best effort to enumerate them.

- Build and release management (including proper distributables for each platform)
- Improved styling and graphics
- Improved error handling
- Thumbnail support
- Shell integration / improved file status information
- Help menu and improved documentation
- Filesystem permissions handling and user management
- Product website and CDN
- License agreement
- Marketing (including SEO)
- Internationalization and Accessibility support
- Community management and Customer support (email, phone, chat, etc.)
- Pricing model and payment infrastructure
- User data opt-in for continuous feedback and product improvement
- Further monetization (in-app purchases, advertisements, etc.)
