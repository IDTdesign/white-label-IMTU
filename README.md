# White Label International Mobile Top Up

## First run

Dependencies:

1. Install Node.js from http://nodejs.org
2. Install Bower globally with command `npm install -g bower`
3. Install Grunt-Cli globally `npm install -g grunt-cli`

Then do the next:

1. Clone this perository to any folder you want
2. In that folder run in console one after another:
    ```
    npm install
    bower install
    ```

3. To start project locally run in colsole
    ```
    docpad run
    ```

4. Open in browser [http://localhost:9778](http://localhost:9778)

## Development

`docpad run` — to start locally

`docpad run --env preview` — to preview optimized version

`docpad deploy-ghpages --env static` — publish to http://IDTdesign.github.io/white-label-IMTU

### Custom grunt tasks

`grunt lint --force` — check *.less files and *.html files for errors. Run when project fails to compile.

`grunt svgicons` — compile svg sprite. Run when icons edited or new added.

`grunt imageoptim` — compress images in img folder. Run when new assets added.

### About Docpad Environments

There are 3 environments in the project:

1. **Development** — default environment. No minification or concatenation on styles and scripts. Default Modernizr.js.
2. **Preview** — optimized for faster loading. All styles merged one file and minified. Same with scripts, output script uses custom Modernizr build. HTML minified and GZIPped.
3. **Static** — same as preview but generated site uses direct urls for http://IDTdesign.github.io/white-label-IMTU

## Publishing

Before first publishing run this command in GIT console
`git remote add deploy https://login:password@github.com/IDTdesign/white-label-IMTU.git`

Where *login* and *password* is your Github credentials.

Then run `docpad deploy-ghpages --env static` — publish to http://IDTdesign.github.io/white-label-IMTU

More info http://paulradzkov.com/2014/deploy_docpad_site_to_github_pages/
