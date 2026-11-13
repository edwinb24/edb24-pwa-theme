# edb24-pwa-theme

The WordPress theme for edwinbroce.com.

## Deploying

Pushing to `main` deploys the theme automatically. The GitHub Actions workflow in `.github/workflows/deploy.yml`:

1. checks that the required files exist and that every PHP file has valid syntax;
2. uploads the theme to the droplet as the `deployer` user, into `/home/deployer/releases/edb24-pwa-theme/`;
3. runs `sudo /usr/local/sbin/deploy-edb24-theme`, which copies the upload into `/var/www/html/wp-content/themes/edb24-pwa-theme/` and makes `www-data` the owner.

The workflow never runs gulp. Build the CSS and JS locally and commit the output before pushing.

The deploy leaves out the build files (`package.json`, `package-lock.json`, `gulpfile.js`, `.gitignore`, `.gitattributes`) and the Sass sources (`assets/preprocess/sass/`), because everything in the theme folder can be downloaded from the website. `assets/preprocess/scripts/` is deployed, because the home page loads `custom_corner.js` from there directly.

Changes to `README.md`, `LICENSE.md`, `.gitignore` or `deploy/` alone don't start a deploy.

### Running the deploy again without a new commit

On GitHub, open **Actions → Deploy theme to production → Run workflow**, choose `main`, and click **Run workflow**.

### Deploying by hand (without GitHub Actions)

Use this if GitHub Actions is down or the `deployer` key isn't working. It deploys the last commit on your local `main` branch. Uncommitted changes are not included, so commit first.

Run these in Git Bash from this repo's folder. They log in with your own account (`edwinbroce-droplet`), so the second command asks for your sudo password.

```bash
# 1. Upload the committed theme to a temporary folder on the droplet.
git archive main | ssh edwinbroce-droplet \
  "rm -rf /tmp/edb24-pwa-theme && mkdir /tmp/edb24-pwa-theme && tar -x -C /tmp/edb24-pwa-theme"

# 2. Move it into the release folder and install it with the same script the workflow uses.
ssh -t edwinbroce-droplet "sudo rsync -a --delete --delete-excluded \
    --exclude '.github/' --exclude 'deploy/' \
    --exclude '/package.json' --exclude '/package-lock.json' --exclude '/gulpfile.js' \
    --exclude '/.gitignore' --exclude '/.gitattributes' --exclude '/assets/preprocess/sass/' \
    /tmp/edb24-pwa-theme/ /home/deployer/releases/edb24-pwa-theme/ \
  && sudo chown -R deployer:deployer /home/deployer/releases/edb24-pwa-theme \
  && sudo /usr/local/sbin/deploy-edb24-theme \
  && rm -rf /tmp/edb24-pwa-theme"
```

If it worked, the last line printed is `Theme installed into /var/www/html/wp-content/themes/edb24-pwa-theme/`. If the script stops with "Upload is missing …" or a PHP syntax error, the live theme is left unchanged.

### Updating the install script

`deploy/install-theme.sh` is the source of `/usr/local/sbin/deploy-edb24-theme`. Editing it in the repo does not change the server. After changing it, install it again from your own account:

```bash
scp deploy/install-theme.sh edwinbroce-droplet:/tmp/
ssh -t edwinbroce-droplet "sudo install -o root -g root -m 755 /tmp/install-theme.sh /usr/local/sbin/deploy-edb24-theme && rm /tmp/install-theme.sh"
```
