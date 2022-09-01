// Consolidating any references to the draft-js or draft-convert libraries to this one module
import React from 'react'
import { EditorState, Modifier, RichUtils, convertToRaw, ContentState, CompositeDecorator } from 'draft-js'
import { convertFromHTML, convertToHTML } from 'draft-convert'

import LinkContainer from '../containers/linkContainer'
import ModalLinkContainer from '../containers/linkModalContainer'
import PageBreakContainer from '../containers/pageBreakContainer'

// _________________________________________________
// 
// State conversion functions using draft-convert library
// _________________________________________________

// Create contentState from HTML
export const stateFromHTML = html => {
  const blocksFromHTML = convertFromHTML({
    htmlToEntity: (nodeName, node, createEntity) => {
      if (nodeName === 'a') {        
          return createEntity(
            'LINK',
            'MUTABLE',
            {
              'url': node.getAttribute('href'),
              'color': node.getAttribute('data-color') || '05E4f0',
              'tag': node.getAttribute('data-tag') || ''
            }
          )
      }
      if (nodeName === 'span') {
        return createEntity(
          'PAGEBREAK',
          'MUTABLE',
          {
            edition: node.getAttribute('data-edition'),
            pageNumber: node.getAttribute('data-page')
          }
        )
      }
    },    
  })(html)
  return blocksFromHTML
}

export const stateToHTML = contentState => {
  const html = convertToHTML({
    blockToHTML: (block) => {
      if (block.type === 'PARAGRAPH') {
        return <p />;
      }
    },
    entityToHTML: (entity, originalText) => {
      if (entity.type === 'LINK') {
        return <a href={entity.data.url} data-color={entity.data.color} data-tag={entity.data.tag}>{originalText}</a>;
      }
      if (entity.type === 'PAGEBREAK') {
        return <span data-edition={entity.data.edition} data-page={entity.data.pageNumber}>{originalText}</span>;
      }
      return originalText;
    }
  })(contentState)
  return html
}

// _________________________________________________
// 
// Editor state functions for reducers & middleware
// _________________________________________________

// Return blank editor
export const returnNewEditorState = (decorator) => {
  const blankEditor = EditorState.createEmpty(decorator)
  return blankEditor
}

// Return editorState given a contentState
export const returnEditorStateFromContentState = (contentState, decorator) => {
  const editorState = EditorState.createWithContent(contentState, decorator)
  return editorState
}

// Return editorState from HTML using draft-convert
export const returnEditorStateFromHTML = (html, decorator) => {
  const contentState = stateFromHTML(html)
  const editorState = returnEditorStateFromContentState(contentState, decorator)
  return editorState
}

// When user submits a new annotation action, create an entity with the action details and apply it to the contentState
export const returnEditorStateWithNewAnnotation = (contentState, data) => {
  const contentStateWithEntity = contentState.createEntity(
    'LINK',
    'MUTABLE',
    {'url': data.annotationNote.id, 'data-color': data.annotationTag.color, 'data-tag': data.annotationTag.title}
  )  
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
  const contentStateWithLink = Modifier.applyEntity(
      contentStateWithEntity,
      data.selectionState,
      entityKey
  )
  const newEditorState = returnEditorStateFromContentState(contentStateWithLink, readerDecorator)
  return newEditorState
}

// When user submits a remove annotation action, create a new contentState with the entity
export const returnEditorStateWithoutAnnotation = (data) => {
  const contentStateWithoutLink = Modifier.applyEntity(
    data.editorState.getCurrentContent(),
    data.selectionState,
    null
  )
  const editorState = returnEditorStateFromContentState(contentStateWithoutLink, readerDecorator)
  return editorState
}

// Handle key commands in DraftJS editor with RichUtils
export const returnEditorStateFromKeyCommand = (editorState, command) => {
  const newEditorState = RichUtils.handleKeyCommand(editorState, command)
  // Null check to handle null editorState when backspacking empty editor
  if (newEditorState !== null) {
    return newEditorState
  } else { return editorState }  
}

// Handle toggling block types with DraftJS RichUtils
export const returnEditorStateWithInlineStyles = (style, editorState) => {
  const inlineStyles = ['BOLD', 'ITALIC', 'UNDERLINE']
  if (inlineStyles.indexOf(style) >= 0) {
    return RichUtils.toggleInlineStyle(editorState, style)
  } else if (style === 'header-two') {
    return RichUtils.toggleBlockType(editorState, 'header-two')
  }
}

// Convert DraftJS contentState to list of text blocks for Elasticsearch
export const convertToSearchText = contentState => {
  const rawState = convertToRaw(contentState)
  const searchText = rawState.blocks.reduce(
    (searchText, block) => ([...searchText, {key: block.key, text: block.text}]),
    []
  )
  return searchText
}

// _________________________________________________
// 
// Editor defaults
// _________________________________________________

export const defaultTagColors = [
  '307EE3',
  'CF2929',
  'AB59C2',
  '9C632A',
  'F59627',
  '40b324'
]

const findEntities = (contentBlock, callback, entityType) => {
  contentBlock.findEntityRanges(character => {
    const contentState = ContentState.createFromBlockArray([contentBlock])
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === entityType
    )
  },
  callback)}

const findLinkEntities = (contentBlock, callback) => {
  findEntities(contentBlock, callback, 'LINK')
}

const findPagebreakEntities = (contentBlock, callback) => {
  findEntities(contentBlock, callback, 'PAGEBREAK')
}


export const readerDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkContainer,
  },
  {
    strategy: findPagebreakEntities,
    component: PageBreakContainer,
  }
])

export const modalDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: ModalLinkContainer,
  }
])