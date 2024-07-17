Fast Token Browser
========
Fast Token Browser provides an improved interface for browsing and inserting
Tokens. It resolves excessive memory usage and an unresponsive interface when
using the token browser on a site with a large number of tokens, for example,
when using [Entity Tokens](https://backdropcms.org/project/entity_token).

Installation
------------

- Install this module using [the official Backdrop CMS instructions](https://docs.backdropcms.org/documentation/extend-with-modules).

Usage
-----

Fast Token Browser is a drop-in replacement to the default browser provided by
Backdrop.

You can either select the field first and click on a token to insert at the
cursor, or you can select the token first and then click in a field to insert
at the cursor.

The modal window can be resized and moved so you can keep the browser open
while you insert the token. This helps if you want to insert multiple tokens.

Fast Token Browser will also replace the token browser provided by [Token Help](https://backdropcms.org/project/token_help)
at admin/reports/tokens.

Issues
------

Bugs and feature requests should be reported in [the issue queue](https://github.com/backdrop-contrib/fast_token_browser/issues).

Current Maintainers
-------------------

- [Martin Price](https://github.com/yorkshire-pudding) - [System Horizons Ltd](https://www.systemhorizons.co.uk)
- Seeking additional maintainer(s). Specifically, this module needs a
maintainer who understands the Javascript and jQuery that powers this module.

Credits
-------

- Ported to Backdrop CMS by [Martin Price](https://github.com/yorkshire-pudding) - [System Horizons Ltd](https://www.systemhorizons.co.uk).
- Port sponsored by [System Horizons Ltd](https://www.systemhorizons.co.uk).
- Originally written for Drupal by [Nigel Packer](https://www.drupal.org/u/npacker).

License
-------

This project is GPL v2 software.
See the LICENSE.txt file in this directory for complete text.
