![on-save](https://s3.amazonaws.com/on-save/on-save-logo-with-tagline.svg)

## Why?

Because it is easier than using a watcher (`--watch`).

## Installation

```
apm install on-save
```

## Quick start

Create a '.on-save.json' file at the root of you project.

For example, if you want to babelify every .js files from 'src' to 'lib':

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

In case your Babel CLI is local, maybe you would like to do something like this:

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

Finally, if you use `nvm` for your your node goodness you would probably need something like [000-project-shell-env](...);

## Configuration file

To use `on-save`, just create a `on-save.json` file at the root of your project. The content should be an array of object with the following properties:

- `srcDir` *(default: '.')*: Directory containing the files you want to track.
- `destDir` *(default: '.')*: In case you want to output some files, the directory where files are written.
- `files`: The files you want to track. You would probably want to use a glob, we use [minimatch](...) to select the files.
- `command`: The command to execute when you save a file matching the `files` property. The command runs with the project path as the current working directory and the following variables are available:
  - srcFile: Input file path.
  - destFile: Output file path.

## License

MIT
