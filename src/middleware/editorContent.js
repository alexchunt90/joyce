// Consolidating any references to the draft-js or draft-convert libraries to this one module
import { EditorState, Modifier, convertToRaw, ContentState, CompositeDecorator } from 'draft-js'
import { convertFromHTML, convertToHTML } from 'draft-convert'

import LinkContainer from '../containers/linkContainer'
import ModalLinkContainer from '../containers/linkModalContainer'

export const html_export_options = {
  blockStyleFn: (block) => {
    const key = block.getKey()
    return {
      attributes: {
        id: key
      }
    }
  },
  entityStyleFn: (entity) => {
    const entityType = entity.get('type').toUpperCase()
    if (entityType === 'LINK') {
      const data = entity.getData()
      console.log('data when saving is:', data['data-color'])
      return {
        element: 'a',
        attributes: {
    		  'href': data['url'],
        	'data-target': '#annotation_modal',
        	'data-toggle': 'modal',
          'data-color': data['data-color'],
          'data-tag': data['data-tag']
        }
      }
    }
  }
}

const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(character => {
    const contentState = ContentState.createFromBlockArray([contentBlock])
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    )
  },
  callback)
}


// Function for converting DraftJS editor state to list of text blocks for Elasticsearch
export const convertToSearchText = contentState => {
  const rawState = convertToRaw(contentState)
  const searchText = rawState.blocks.reduce(
    (searchText, block) => ([...searchText, {key: block.key, text: block.text}]),
    []
  )
  return searchText
}

export const stateFromHTML = html => {
  const blocksFromHTML = convertFromHTML({
    htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'a') {        
            console.log('WHOOOOYEEE!')
            console.log(node.href)
            return createEntity(
                'LINK',
                'MUTABLE',
                {url: node.href}
            )
        }
    },    
  })(html)
  return blocksFromHTML
}




// joyceInterface.js
  // case 'SUBMIT_DOCUMENT_EDIT':
        const data = { 
          title: action.inputs.documentTitle, 
          html_source: stateToHTML(textContent, html_export_options), 
          search_text: convertToSearchText(textContent),
        }

        const contentStateWithLink = Modifier.applyEntity(
            contentStateWithEntity,
            action.selectionState,
            entityKey
        )
        const newEditorState = EditorState.createWithContent(contentStateWithLink, linkDecorator)
        store.dispatch(actions.annotationCreated(newEditorState))
        // This feels like a hacky way of closing the modal only after validating input
        // But seemed more idiomatic than writing jQuery
        document.getElementById('select_annotation_modal_close').click()
      }        

// modalEditorState.js
EditorState.createWithContent(stateFromHTML(action.data.html_source), modalLinkDecorator)
const blankEditor = EditorState.createEmpty(modalLinkDecorator)

// editorState.js
        RichUtils.handleKeyCommand(action.editorState, action.command)
        RichUtils.toggleInlineStyle(action.editorState, action.style)
        RichUtils.toggleBlockType(action.editorState, 'header-two')

        const editorState = EditorState.createWithContent(stateFromHTML(action.data.html_source), modalLinkDecorator)
      const contentStateWithoutLink = Modifier.applyEntity(
          action.editorState.getCurrentContent(),
          action.selectionState,
          null
      )
      return EditorState.createWithContent(contentStateWithoutLink, linkDecorator)             