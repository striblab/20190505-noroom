# Files and directories

The following describes the files and directories used in the project.

- `build/`: All the supporting files get compiled into this directory and this is what gets published. This should not be versioned.
- `config.json`: Non-content config for application.
  - Use this to add non-local JS or CSS assets, such as from a CDN.
  - This can be overridden with a `config.custom.json` if there is a need to add configuration that should not be put into revision history.
- `content.json`: This is the default way to manage content values. See the [application data](./application-data.md) section for more ways to hook up other data sources.
- `data.js`: An optional file to provide [application data](./application-data.md) to the application.
- `templates/`: Holds HTML-like [Svelte](https://svelte.technology/) templates. Any files in here will get run through Svelte templating and passed any [application data](./application-data.md), such as `config.json`, `content.json`, and `package.json` will be available.
  - `templates/index.ejs.html`: The default page for the application.
  - `templates/_*.ejs.html`: Includes for other templates.
  - `templates/shared/*.ejs.html`: For any templates used across multiple .
  - `templates/*.ejs.html`: Any templates without a `_` prefix will be rendered into an full HTML page.
- `styles/`: Styles in [SASS](http://sass-lang.com/) syntax.
  - `styles/index.scss`: Main point of entry for styles.
  - `styles/*.scss`: Other main point of entry for styles. These could be used for separate page styles.
  - `styles/_*.scss`: Any includes should be prefixed with an underscore.
- `app/`: Where JS logic goes. This supports ES6+ JS syntax with [Babel](https://babeljs.io/) and gets compiled with [Webpack](https://webpack.js.org/).
  - `app/index.js`: Main entry point of application.
  - `app/*.js`: Other entry points of application, usually used for separate pages.
  - `app/shared/*_.js`: Any shared files.
- `assets/`: Various media files. This gets copied directly to the build.
- `sources/`: Directory is for all non-data source material, such as wireframes or original images. Note that if there are materials that should not be made public, consider using Dropbox and make a note in this file about how to access, and make sure to update the `.gitignore` file.
- `lib/`: Modules used in building or other non-data tasks.
- `tests/`: Tests for app; see Testing section below.
- `docs/`: Holds documentation files.

Other files are for configuration or meta-information.
