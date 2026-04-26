# WP Desktop Mode Extensions

A personal sandbox for figuring out how [WP Desktop Mode](https://github.com/WordPress/desktop-mode) works — a WordPress plugin that turns `/wp-admin` into a desktop OS interface with draggable windows, a dock, and widgets.

## What's here

### Plugin Stats widget (`widgets/plugin-stats.js`)

A desktop widget showing:

- Total installed plugins
- Active plugins
- Pending plugin updates

## Structure

```
wpd-extensions-webstage/
  wpd-extensions-webstage.php   ← bootstrap: enqueues widget scripts
  widgets/
    plugin-stats.js             ← widget definition
```

## Requirements

- WordPress 6.0+
- PHP 7.4+
- [WP Desktop Mode](https://github.com/WordPress/desktop-mode) 0.5+

## Author

Ivan Arnaudov / [webstage.dev](https://webstage.dev)
