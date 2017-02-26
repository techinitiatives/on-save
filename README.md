<p align="center">
  <br />
  <br />
  <img src="https://s3.amazonaws.com/on-save/on-save-logo-with-tagline.svg" alt="on-save: Run a shell command when you save a file" width="451" height="65" />
  <br />
</p>

## Installation

```
apm install on-save
```

## Usage

Create an `.on-save.json` file at the root of your project (or anywhere in the path of the file you are saving).

For example, if you want to babelify every `.js` file from `src` to `dist`, the `.on-save.json` file content could be:

```javascript
[
  {
    "srcDir": "src",
    "destDir": "dist",
    "files": "**/*.js",
    "command": "babel ${srcFile} --out-file ${destFile}"
  }
]
```

In case your Babel CLI is local, maybe you would do something like this:

```javascript
[
  {
    "srcDir": "src",
    "destDir": "dist",
    "files": "**/*.js",
    "command": "./node_modules/.bin/babel ${srcFile} --out-file ${destFile}"
  }
]
```

## Configuration file

The content of the `.on-save.json` file must be an array containing objects with the following properties:

- `srcDir` *(default to `.on-save.json`'s directory)*: The source directory.
- `destDir` *(default to `srcDir`)*: The destination directory.
- `files`: The files you want to track. You can use a glob, see [minimatch](https://github.com/isaacs/minimatch).
- `command`: The command to execute. You can use these variables:
  - `${srcFile}`: The input file.
  - `${destFile}`: The output file.
  - `${destFileWithoutExtension}`: The output file without the extension.

## License

MIT
