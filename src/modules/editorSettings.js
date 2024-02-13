// Consolidating any references to the draft-js or draft-convert libraries to this one module
import React from 'react'
import { EditorState, Modifier, RichUtils, convertToRaw, ContentState, CompositeDecorator, SelectionState } from 'draft-js'
import { convertFromHTML, convertToHTML } from 'draft-convert'

import {PageBreak,VisiblePageBreak} from '../containers/pageBreakContainer'
import ModalLinkContainer from '../containers/linkModalContainer'
import LinkContainer from '../containers/linkContainer'
import EditorLink from '../components/editorLink'

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
    component: PageBreak,
  }
])

export const editorDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: EditorLink,
  },
])

export const modalDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: ModalLinkContainer,
  }
])

export const editPaginateDecorator = new CompositeDecorator([
  {
    strategy: findPagebreakEntities,
    component: VisiblePageBreak,
  }
])

export const blockStyleFn = (contentBlock) => {
  const blockStyles = []
  const data = contentBlock.getData();
  if (data.get('align')) {
    blockStyles.push(data.get('align').concat('_align_block'))
  }
  if (data.get('indent') === 'none') {
    blockStyles.push('no_indent_block')
  }
  return blockStyles.join(' ')
}


// _________________________________________________
// 
// State conversion functions using draft-convert library
// _________________________________________________

// Create contentState from HTML
export const stateFromHTML = html => {
  
  const constructBlockData = (node) => {
    return {
      key: node.getAttribute('data-search-key'),
      align: node.getAttribute('data-align'),
      indent: node.getAttribute('data-indent'),      
    }
  }
  const blocksFromHTML = convertFromHTML({
    htmlToBlock: (nodeName, node) => {
      const blockData = constructBlockData(node)
      if (nodeName === 'p') {
        return {type: 'unstyled', data: blockData}
      }
      if (nodeName === 'blockquote') {
        return {type: 'blockquote', data: blockData}
      }
      if (nodeName === 'h1') {
        return {type: 'header-one', data: blockData}
      }
      if (nodeName === 'h2') {
        return {type: 'header-two', data: blockData}
      }
      if (nodeName === 'h3') {
        return {type: 'header-three', data: blockData}
      }                        
    },
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
      if (block.type === 'unstyled') {
        return <p data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined}/>;
      }
      if (block.type === 'blockquote') {
        return <blockquote data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} />
      }
      if (block.type === 'header-one') {
        return <h1 data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} />
      }
      if (block.type === 'header-two') {
        return <h2 data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} />
      }
      if (block.type === 'header-three') {
        return <h3 data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} />
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
export const returnNewEditorState = (decorator=readerDecorator) => {
  const blankEditor = EditorState.createEmpty(decorator)
  return blankEditor
}

export const returnEditorStateWithNewDecorator = (editorState, decorator) => {
  const newEditorState = EditorState.set(editorState, {decorator: decorator})
  return newEditorState
}

// Return editorState given a contentState
export const returnEditorStateFromContentState = (contentState, decorator=readerDecorator) => {
  const editorState = EditorState.createWithContent(contentState, decorator)
  return editorState
}

// Return editorState given an array of blocks and an entityMap
export const returnEditorStateFromBlocksArray = (blocksArray, entityMap, decorator=readerDecorator) => {
  const contentState = ContentState.createFromBlockArray(blocksArray, entityMap)
  const editorState = returnEditorStateFromContentState(contentState, decorator)
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

// When user submits a new page break, create an entity with the action details and apply it to the contentState
export const returnEditorStateWithNewPageBreak = (contentState, data, decorator) => {
  const textString = data.year + '#' + data.number
  const contentStateWithEntity = contentState.createEntity(
    'PAGEBREAK',
    'MUTABLE',
    {'edition': data.year, 'pageNumber': data.number}
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
  const contentStateWithPageBreak = Modifier.insertText(
    contentStateWithEntity,
    data.selectionState,
    textString,
    null, // No inlineStyle
    entityKey,
  )
  const newEditorState = returnEditorStateFromContentState(contentStateWithPageBreak, decorator)
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




const applyCustomInlineStyles = (style, editorState) => {
  const contentState = editorState.getCurrentContent()
  const decorator = editorState.getDecorator()
  const selectionState = editorState.getSelection()
  const anchorBlockKey = selectionState.getAnchorKey()
  const contentBlock = contentState.getBlockForKey(anchorBlockKey)
  const blockData = contentBlock.getData()
  console.log(blockData)
  const setBlockCustomStyle = (blockData) => {
      const newContentState = Modifier.setBlockData(contentState, selectionState, blockData.set(''))
      return EditorState.createWithContent(newContentState, decorator)
  }

  if (style === 'left-align') {
    return setBlockCustomStyle(blockData.remove('align'))
  }
  if (style === 'center-align') {
    return setBlockCustomStyle(blockData.set('align', 'center'))
  }
  if (style === 'right-align') {
    return setBlockCustomStyle(blockData.set('align', 'right'))
  }
  if (style === 'justify-align') {
    return setBlockCustomStyle(blockData.set('align', 'justify'))
  }
  if (style === 'no-indent') {
    return setBlockCustomStyle(blockData.set('indent', 'none'))
  }
  if (style === 'add-indent') {
    return setBlockCustomStyle(blockData.remove('indent'))
  }  

  return editorState
}

// Handle toggling block types with DraftJS RichUtils
export const returnEditorStateWithInlineStyles = (style, editorState) => {
  const inlineStyles = ['BOLD', 'ITALIC', 'UNDERLINE']
  const blockTypes = ['header-one', 'header-two', 'header-three', 'blockquote']
  const customStyles = ['left-align', 'center-align', 'right-align', 'justify-align', 'no-indent', 'add-indent']
  if (inlineStyles.indexOf(style) >= 0) {
    return RichUtils.toggleInlineStyle(editorState, style)
  } else if (blockTypes.indexOf(style) >= 0) {
    return RichUtils.toggleBlockType(editorState, style)
  } else if (customStyles.indexOf(style) >= 0) {
    return applyCustomInlineStyles(style, editorState)
  } else return editorState
}


// 
// Search Key 
// 

export const returnEditorStateWithSearchTextFocus = (editorState, searchKey) => {
  const contentState = editorState.getCurrentContent()
  const findBlockKeyForSearchKey = (contentState, searchKey) => {
    let searchBlockKey = undefined
    editorState.getCurrentContent().getBlockMap().forEach(block => {
      const blockKey = block.key
      block.data.forEach(blockSearchKey => {
        if (searchKey === blockSearchKey) {
          searchBlockKey = blockKey
        }
      })
    })
    return searchBlockKey
  }

  const searchBlockKey = findBlockKeyForSearchKey(contentState, searchKey)
  if (searchBlockKey) {
    // Select block after our intended block, to ensure DraftJS moves it on screen
    const searchContentBlock = contentState.getBlockForKey(searchBlockKey)
    const textLength = searchContentBlock.getText().length
    const newSelection = SelectionState.createEmpty(searchBlockKey).set('anchorOffset', 0).set('focusOffset', textLength)
    const newEditorState = EditorState.forceSelection(editorState, newSelection)
    return newEditorState
  } else {
    return editorState
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

// Takes in an editorState, and if the selectionState is a cursor within a pagebreak entity,
// force the selection of the entire entity. Used in editor paginate mode.
export const returnEditorStateWithExpandedPageBreakSelection = editorState => {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()
  // Check that the selectionState is collapsed
  let returnValue = undefined
  if (selectionState.isCollapsed()) {
    // Check if the cursor selectionState falls within a pagebreak entity
    const blockKey = selectionState.getStartKey()
    const offset = selectionState.getStartOffset()
    const contentBlock = contentState.getBlockForKey(blockKey)
    const cursorEntityKey = contentBlock.getEntityAt(offset)
    if(cursorEntityKey) {
      const cursorEntity = contentState.getEntity(cursorEntityKey)
      if (cursorEntity.getType() === 'PAGEBREAK') {
        // If so, use findEntityRanges to return the range of that entity
        contentBlock.findEntityRanges(character => {
          const characterEntityKey = character.getEntity()
          if (cursorEntityKey === characterEntityKey) {
            return true
          } else { return false }         
        },
        (start, end) => {
          // Entities can apply to multiple parts of the text, so check that
          // offset falls within range
          if (offset >= start && offset <= end) {
            const emptySelection = SelectionState.createEmpty(blockKey)
            const entitySelectionState = emptySelection
              .set('focusOffset', end)
              .set('anchorOffset', start)
            const newEditorState = EditorState.forceSelection(editorState, entitySelectionState)
            returnValue = newEditorState
          }
        })
      }
    }
  }
  return returnValue
}