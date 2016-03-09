'use babel';

import OnSaveView from './on-save-view';
import { CompositeDisposable } from 'atom';

export default {

  onSaveView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.onSaveView = new OnSaveView(state.onSaveViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.onSaveView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'on-save:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.onSaveView.destroy();
  },

  serialize() {
    return {
      onSaveViewState: this.onSaveView.serialize()
    };
  },

  toggle() {
    console.log('OnSave was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
