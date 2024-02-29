// Consolidating any references to the draft-js or draft-convert libraries to this one module
import React from 'react'
import { EditorState, Modifier, RichUtils, convertToRaw, ContentState, CompositeDecorator, SelectionState, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import Immutable from 'immutable'

import {stateFromHTML, stateToHTML} from './draftConversion'
import {PageBreak,VisiblePageBreak} from '../containers/pageBreakContainer'
import ModalLinkContainer from '../containers/linkModalContainer'
import LinkContainer from '../containers/linkContainer'
import EditorLink from '../components/editorLink'
import InlineImage from '../components/inlineImage'

// _________________________________________________
// 
// Editor defaults
// _________________________________________________

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
  },
])

export const editorDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: EditorLink,
  },
  {
    strategy: findPagebreakEntities,
    component: PageBreak,
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
  if (data.get('classes') && data.get('classes').length > 0) {
    blockStyles.push(data.get('classes').join(' '))
  }
  return blockStyles.join(' ')
}

export const blockRenderFn = (contentBlock) => {
  const type = contentBlock.getType()
  const data = contentBlock.getData()
  if (type === 'atomic') {
    return {
      component: InlineImage,
      editable: false,
      props: {
        src: data.get('url'),
        id: data.get('id')
      }
    }
  }
}

export const keyBindingFn = (e) => {
  if (e.keyCode === 9 ) { //Tab Key
    if (e.shiftKey === true) {
      return 'shift-tab-key'
    } else {
      return 'tab-key'
    }
  }
  return getDefaultKeyBinding(e)
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
    {'url': data.annotationNote.id, 'color': data.annotationTag.color, 'tag': data.annotationTag.title}
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





  //   var withAdjustment = adjustBlockDepthForContentState(content, selection, event.shiftKey ? -1 : 1, maxDepth);
  //   return EditorState.push(editorState, withAdjustment, 'adjust-depth');
  // },


// function adjustBlockDepthForContentState(contentState, selectionState, adjustment, maxDepth) {
//   var startKey = selectionState.getStartKey();
//   var endKey = selectionState.getEndKey();
//   var blockMap = contentState.getBlockMap();
//   var blocks = blockMap.toSeq().skipUntil(function (_, k) {
//     return k === startKey;
//   }).takeUntil(function (_, k) {
//     return k === endKey;
//   }).concat([[endKey, blockMap.get(endKey)]]).map(function (block) {
//     var depth = block.getDepth() + adjustment;
//     depth = Math.max(0, Math.min(depth, maxDepth));
//     return block.set('depth', depth);
//   });
//   blockMap = blockMap.merge(blocks);
//   return contentState.merge({
//     blockMap: blockMap,
//     selectionBefore: selectionState,
//     selectionAfter: selectionState
//   });
// }



// var Immutable = require("immutable");

// var Map = Immutable.Map;

// function modifyBlockForContentState(contentState, selectionState, operation) {
//   var startKey = selectionState.getStartKey();
//   var endKey = selectionState.getEndKey();
//   var blockMap = contentState.getBlockMap();
//   var newBlocks = blockMap.toSeq().skipUntil(function (_, k) {
//     return k === startKey;
//   }).takeUntil(function (_, k) {
//     return k === endKey;
//   }).concat(Map([[endKey, blockMap.get(endKey)]])).map(operation);
//   return contentState.merge({
//     blockMap: blockMap.merge(newBlocks),
//     selectionBefore: selectionState,
//     selectionAfter: selectionState
//   });
// }


const handleTabKeyCommand = (editorState, command) => {
    const blockType = RichUtils.getCurrentBlockType(editorState)
    if (blockType === 'unordered-list-item') {
      const decorator = editorState.getDecorator()
      const selection = editorState.getSelection()
      const startKey = selection.getStartKey()
      const endKey = selection.getEndKey()
      const content = editorState.getCurrentContent()
      const blockMap = content.getBlockMap()
      
      const blockAdjustment = command === 'tab-key' ? 1 : -1

      const Map = Immutable.Map
      // Lifted from DraftJS modifyBlockForContentState()
      const newBlockMap = blockMap.toSeq()
        .skipUntil(function (_, k) {
          return k === startKey
        }).takeUntil(function (_, k) {
          return k === endKey
        }).concat(Map([[endKey, blockMap.get(endKey)]])).map((block) => {
          const depth = block.getDepth() + blockAdjustment
          if (depth > 3 || depth < 0) {
            return block
          }
          return block.set('depth', depth)
        })

      const newContent = content.merge({
        blockMap: blockMap.merge(newBlockMap),
        selectionBefore: selection,
        selectionAfter: selection,
      })
      return EditorState.push(editorState, newContent, 'adjust-depth')
    } else { 
      return editorState 
    }
}






// Handle key commands in DraftJS editor with RichUtils
export const returnEditorStateFromKeyCommand = (editorState, command) => {
  if (['tab-key', 'shift-tab-key'].includes(command)) {
    return handleTabKeyCommand(editorState, command)
  }
  const newEditorState = RichUtils.handleKeyCommand(editorState, command)
  // Null check to handle null editorState when backspacking empty editor
  if (newEditorState !== null) {
    return newEditorState
  } else { return editorState }  
}

export const returnSelectionContentBlockClasses = (editorState) => {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()
  if (selectionState.isCollapsed()) {
    const blockKey = selectionState.getAnchorKey()
    const contentBlock = contentState.getBlockForKey(blockKey)
    const blockData = contentBlock.getData()
    if (blockData.get('classes')) {
      return blockData.get('classes')
    } else {
      return []
    }
  } else {
    return []
  }
}

export const returnEditorStateWithCustomClass = (editorState, className) => {
  const contentState = editorState.getCurrentContent()
  const decorator = editorState.getDecorator()
  const selection = editorState.getSelection()
  const blockKey = selection.getAnchorKey()
  const contentData = contentState.getBlockForKey(blockKey).getData()
  let customClassesArray = contentData.get('classes') || []
  if (!customClassesArray.includes(className)) {
    customClassesArray.push(className)
  } else {
    customClassesArray = customClassesArray.filter(c => c !== className)
  }
  const newContentState = Modifier.setBlockData(contentState, selection, contentData.set('classes', customClassesArray))
  const newEditorState = EditorState.createWithContent(newContentState, decorator)
  const newEditorStateWithSelection = EditorState.forceSelection(newEditorState, selection)
  return newEditorStateWithSelection
}

const applyCustomInlineStyles = (style, editorState) => {
  const contentState = editorState.getCurrentContent()
  const decorator = editorState.getDecorator()
  const selectionState = editorState.getSelection()
  const anchorBlockKey = selectionState.getAnchorKey()
  const contentBlock = contentState.getBlockForKey(anchorBlockKey)
  const blockData = contentBlock.getData()
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
  return editorState.forceSelection(selectionState)
}

// Handle toggling block types with DraftJS RichUtils
export const returnEditorStateWithInlineStyles = (style, editorState) => {
  const inlineStyles = ['BOLD', 'ITALIC', 'UNDERLINE']
  const blockTypes = ['header-one', 'header-two', 'header-three', 'blockquote', 'unordered-list-item']
  const customStyles = ['left-align', 'center-align', 'right-align', 'justify-align', 'no-indent', 'add-indent']
  if (inlineStyles.indexOf(style) >= 0) {
    return RichUtils.toggleInlineStyle(editorState, style)
  } else if (blockTypes.indexOf(style) >= 0) {
    return RichUtils.toggleBlockType(editorState, style)
  } else if (customStyles.indexOf(style) >= 0) {
    return applyCustomInlineStyles(style, editorState)
  } else return editorState
}

export const returnEditorStateWithInlineImage = (editorState, media) => {
  if (media.type !== 'img') {
    return editorState
  }
  const mediaURL = '/static/img/' + media.id + '/img.' + media.file_ext
  const selectionState = editorState.getSelection()
  const decorator = editorState.getDecorator()
  const contentState = editorState.getCurrentContent()
  const contentStateWithData = Modifier.setBlockData(contentState, selectionState, {
    url: mediaURL,
    id: media.id,
  })
  const contentStateWithAtomicBlock = Modifier.setBlockType(contentStateWithData, selectionState, 'atomic')
  const newEditorState = returnEditorStateFromContentState(contentStateWithAtomicBlock, decorator)
  return newEditorState
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