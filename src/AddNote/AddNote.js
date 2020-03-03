import React, { Component } from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import ValidationError from '../AddFolder/ValidationError';
import '../AddFolder/AddFolder.css';


export class AddNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      note_name: '',
      content: '',
      selectedFolder: '',
      folder: 1,
      titleTouched: false,
      contentTouched: false
    };
  }

  static contextType = ApiContext;

  updateName(note_name) {
    this.setState({
      note_name: note_name,
      titleTouched: true
    });
  }

  updateContent(content) {
    this.setState({
      content: content,
      contentTouched: true
    });
  }

  updateSelectedFolder(select) {
    const id = parseInt(select[select.selectedIndex].id);
    const name = select[select.selectedIndex].value;
    
    this.setState({
      selectedFolder: name,
      folder: id
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const date = new Date();
    const { note_name, content, folder } = this.state;
 
    const data = {
      note_name: note_name,
      modified: date,
      content: content,
      folder: folder
    };

    fetch(`${config.API_ENDPOINT}/api/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
      if (!res.ok) {
        throw new Error('there was an error');
      }
      return res.json();
    })
    .then((data) => {
      
      this.context.addNote(data)
      this.props.history.push('/')
    })
    .catch(err => {
      
    })
  }

  validateTitle() {
    const title = this.state.note_name.trim();
    if (title.length === 0) {
      return 'please enter a title';
    } else if (title.length > 20) {
      return 'please keep title under 20 characters';
    }
  }

  validateContent() {
    const content = this.state.content;
    if (content.length === 0) {
      return 'please enter content';
    } else if (content.length > 200) {
      return 'please keep content under 200 characters';
    }
  }

  generateFolderOptions() {
    const { folders = [] } = this.context;
    return folders.map(folder => {
      return (
        <option key={folder.id} id={folder.id} value={folder.folder_name}>
          {folder.folder_name}
        </option>
      );
    });
  }

  render() {
    const titleError = this.validateTitle();
    const contentError = this.validateContent();
    return (
      <form className="add-note-form" onSubmit={e => this.handleSubmit(e)}>
        <h2>Add New Note</h2>
        <div className="form-group">
          <div>
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              className="registration__control"
              name="note_name"
              id="title"
              onChange={e => this.updateName(e.target.value)}
              required
            />
            {this.state.titleTouched && (
              <ValidationError message={titleError} />
            )}
          </div>
          <div>
            <label htmlFor="content">Content *</label>
            <input
              type="text"
              className="registration__control"
              name="content"
              id="content"
              onChange={e => this.updateContent(e.target.value)}
              required
            />
            {this.state.contentTouched && (
              <ValidationError message={contentError} />
            )}
          </div>
          <div>
            <label>Folder:</label>
            <select
              value={this.state.selectedFolder}
              onChange={e => {
                
                this.updateSelectedFolder(e.target)}}>
              {this.generateFolderOptions()}
            </select>
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={this.validateTitle()}
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default AddNote;
