#!/usr/bin/env bash
#
# Installs the theme into the live WordPress site on the droplet.
#
# The GitHub deploy (.github/workflows/deploy.yml) uploads the theme to
# /home/deployer/releases/edb24-pwa-theme/ as the `deployer` user, then runs
# this script with sudo. The script copies the upload into the theme folder
# and gives the files back to www-data.
#
# Install on the server (as your own account):
#   sudo install -o root -g root -m 755 install-theme.sh /usr/local/sbin/deploy-edb24-theme
#
# This file is not copied into the theme folder (the workflow excludes deploy/).

set -euo pipefail

SRC=/home/deployer/releases/edb24-pwa-theme/
DEST=/var/www/html/wp-content/themes/edb24-pwa-theme/

# Stop if the upload is missing files the site needs.
for f in style.css functions.php header.php front-page.php \
	assets/preprocess/scripts/custom_corner.js; do
	if [ ! -f "$SRC$f" ]; then
		echo "Upload is missing $f. Nothing was changed." >&2
		exit 1
	fi
done

# Stop on PHP syntax errors, which would take the whole site down.
if command -v php > /dev/null; then
	find "$SRC" -name '*.php' -not -path '*/node_modules/*' -print0 \
		| xargs -0 -n1 php -l > /dev/null
fi

rsync -a --delete --safe-links --exclude 'node_modules/' "$SRC" "$DEST"

chown -R www-data:www-data "$DEST"
find "$DEST" -path "${DEST}node_modules" -prune \
	-o -type d -exec chmod 755 {} + \
	-o -type f -exec chmod 644 {} +

echo "Theme installed into $DEST"
