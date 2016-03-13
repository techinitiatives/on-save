'use babel';

import fs from 'fs';
import pathModule from 'path';
import { exec } from 'child_process';
import { CompositeDisposable } from 'atom';
import minimatch from 'minimatch';
import mkdirp from 'mkdirp';

const CONFIGS_FILENAME = '.on-save.json';
const EXEC_TIMEOUT = 60 * 1000; // 1 minute

export default {
  activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.workspace.observeTextEditors((textEditor) => {
      this.subscriptions.add(textEditor.onDidSave(this.handleDidSave.bind(this)));
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  handleDidSave(event) {
    let savedFilePath = event.path;
    let projectPath = this.getProjectPath(savedFilePath);
    if (!projectPath) {
      console.error('on-save: Unable to find the project path');
      return;
    }
    savedFilePath = pathModule.relative(projectPath, savedFilePath);
    let configs = this.loadConfigs(projectPath);
    if (!configs) return;
    for (let config of configs) {
      this.run({ projectPath, config, savedFilePath });
    }
  },

  getProjectPath(path) {
    let directories = atom.project.getDirectories();
    for (let directory of directories) {
      if (directory.contains(path)) return directory.getPath();
    }
  },

  loadConfigs(projectPath) {
    let path = pathModule.join(projectPath, CONFIGS_FILENAME);
    if (!fs.existsSync(path)) return;
    let configs = fs.readFileSync(path, 'utf8');
    configs = JSON.parse(configs);
    if (!Array.isArray(configs)) configs = [configs];
    configs = configs.map((config) => this.normalizeConfig(config));
    return configs;
  },

  normalizeConfig({ srcDir, destDir, files, command }) {
    if (!srcDir) srcDir = '';
    if (!destDir) destDir = '';
    if (!files) throw new Error('on-save: \'files\' property is missing in \'.on-save.json\' configuration file');
    if (!Array.isArray(files)) files = [files];
    if (!command) throw new Error('on-save: \'command\' property is missing in \'.on-save.json\' configuration file');
    return { srcDir, destDir, files, command };
  },

  run({ projectPath, savedFilePath, config }) {
    let matched = config.files.find((glob) => {
      glob = pathModule.join(config.srcDir, glob);
      return minimatch(savedFilePath, glob);
    });
    if (!matched) return;

    mkdirp.sync(pathModule.join(projectPath, config.destDir));

    let srcFile = savedFilePath;

    let destFile = pathModule.relative(config.srcDir, savedFilePath);
    destFile = pathModule.join(config.destDir, destFile);
    let extension = pathModule.extname(destFile);
    let destFileWithoutExtension = destFile.substr(0, destFile.length - extension.length);

    let command = this.resolveCommand(config.command, {
      srcFile,
      destFile,
      destFileWithoutExtension
    });
    let options = { cwd: projectPath, timeout: EXEC_TIMEOUT };
    exec(command, options, (err, stdout, stderr) => {
      if (!err) {
        if (stdout) console.log(stdout.trim());
      } else {
        let message = `on-save: An error occurred while running the command: ${command}`;
        atom.notifications.addError(message, { detail: stderr, dismissable: true });
      }
    });
  },

  resolveCommand(command, vars) {
    for (let key of Object.keys(vars)) {
      let value = vars[key];
      let regExp = new RegExp(`\\$\\{${key}\\}`, 'g');
      command = command.replace(regExp, value);
    }
    return command;
  }
}
