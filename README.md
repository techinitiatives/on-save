<p align="center">
  <img src="https://s3.amazonaws.com/on-save/on-save-logo-with-tagline.svg" alt="on-save: Run a shell command when you save a file" />
</p>

## Why?

Because it is a lot easier than using a watcher (`--watch`).

## Installation

```
apm install on-save
```

## Quick start

Create a `.on-save.json` file at the root of you project.

For example, if you want to babelify every `.js` files from `src` to `lib`:

```javascript
[
  {
    "srcDir": "src",
    "destDir": "lib",
    "files": "**/*.js",
    "command": "babel ${srcFile} --out-file ${destFile}"
  }
]
```

In case your Babel CLI is local, maybe you would prefer to do something like this:

```javascript
[
  {
    "srcDir": "src",
    "destDir": "lib",
    "files": "**/*.js",
    "command": "./node_modules/.bin/babel ${srcFile} --out-file ${destFile}"
  }
]
```

Finally, if you use `nvm` for your Node installation you would probably need something like [000-project-shell-env](https://atom.io/packages/000-project-shell-env).

## Configuration file

To use `on-save`, create a `on-save.json` file at the root of your project. The content should be an array containing objects with the following properties:

- `srcDir` *(default: `'.'`)*: Directory containing the files you want to track.
- `destDir` *(default: `'.'`)*: In case you want to output some files, the directory where files are written.
- `files`: The files you want to track. You would probably want to use a glob, we use [minimatch](https://github.com/isaacs/minimatch) to select the files.
- `command`: The command to execute. The project path will be the current working directory and you can use these variables:
  - `${srcFile}`: The input file path.
  - `${destFile}`: The output file path.
  - `${destFileWithoutExtension}`: The output file path without the extension.

## License

MIT
