// Consolidating any references to the draft-js or draft-convert libraries to this one module
import React from 'react'
import { EditorState, Modifier, RichUtils, convertToRaw, ContentState, CompositeDecorator } from 'draft-js'
import { convertFromHTML, convertToHTML } from 'draft-convert'

import LinkContainer from '../containers/linkContainer'
import ModalLinkContainer from '../containers/linkModalContainer'

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
                  'data-color': node.getAttribute('data-color') || '05E4f0',
                  'data-tag': node.getAttribute('data-tag') || ''
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
        return <a href={entity.data.url}>{originalText}</a>;
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
  const newEditorState = returnEditorStateFromContentState(contentStateWithLink, linkDecorator)
  return newEditorState
}

// When user submits a remove annotation action, create a new contentState with the entity
export const returnEditorStateWithoutAnnotation = (data) => {
  const contentStateWithoutLink = Modifier.applyEntity(
    data.editorState.getCurrentContent(),
    data.selectionState,
    null
  )
  const editorState = returnEditorStateFromContentState(contentStateWithoutLink, linkDecorator)
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

export const linkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkContainer,
  }
])

export const modalLinkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: ModalLinkContainer,
  }
])