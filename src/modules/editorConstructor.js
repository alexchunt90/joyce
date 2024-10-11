import { EditorState, Modifier, RichUtils, ContentState, SelectionState } from 'draft-js'
import {stateFromHTML, stateToHTML} from './draftConversion'
import Immutable from 'immutable'

import {readerDecorator, convertToSearchText} from './editorSettings'

// _________________________________________________
// 
// Transformation functions for editor constructors
// _________________________________________________

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
    return setBlockCustomStyle(blockData.set('indent', 'false'))
  }
  if (style === 'add-indent') {
    return setBlockCustomStyle(blockData.set('indent', 'true'))
  }  
  return editorState.forceSelection(selectionState)
}

// _________________________________________________
// 
// Functions to construct and manipulate editorState
// _________________________________________________

const editorConstructor = {
  // Return blank editor
  returnNewEditorState: (decorator=readerDecorator) => {
    const blankEditor = EditorState.createEmpty(decorator)
    return blankEditor
  },
  // Return editor with a specified decorator
  returnEditorStateWithNewDecorator: (editorState, decorator) => {
    const newEditorState = EditorState.set(editorState, {decorator: decorator})
    return newEditorState
  },
  // Return editorState given a contentState
  returnEditorStateFromContentState: (contentState, decorator=readerDecorator) => {
    const editorState = EditorState.createWithContent(contentState, decorator)
    return editorState
  },
  // Return editorState given an array of blocks and an entityMap
  returnEditorStateFromBlocksArray: (blocksArray, entityMap, decorator=readerDecorator) => {
    const contentState = ContentState.createFromBlockArray(blocksArray, entityMap)
    const editorState = editorConstructor.returnEditorStateFromContentState(contentState, decorator)
    return editorState
  },
  // Return editorState from HTML using draft-convert
  returnEditorStateFromHTML: (html, decorator) => {
    const contentState = stateFromHTML(html)
    const editorState = editorConstructor.returnEditorStateFromContentState(contentState, decorator)
    return editorState
  },
  // When user submits a new annotation action, create an entity with the action details and apply it to the contentState
  returnEditorStateWithNewAnnotation: (contentState, data) => {
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
    const newEditorState = editorConstructor.returnEditorStateFromContentState(contentStateWithLink, readerDecorator)
    return newEditorState
  },
  // When user submits a new page break, create an entity with the action details and apply it to the contentState
  returnEditorStateWithNewPageBreak: (contentState, data, decorator) => {
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
    const newEditorState = editorConstructor.returnEditorStateFromContentState(contentStateWithPageBreak, decorator)
    return newEditorState
  },
  // When user submits a remove annotation action, create a new contentState with the entity
  returnEditorStateWithoutAnnotation: (data) => {
    const contentStateWithoutLink = Modifier.applyEntity(
      data.editorState.getCurrentContent(),
      data.selectionState,
      null
    )
    const editorState = editorConstructor.returnEditorStateFromContentState(contentStateWithoutLink, readerDecorator)
    return editorState
  },
  // Handle key commands in DraftJS editor with RichUtils
  returnEditorStateFromKeyCommand: (editorState, command) => {
    if (['tab-key', 'shift-tab-key'].includes(command)) {
      return handleTabKeyCommand(editorState, command)
    }
    const newEditorState = RichUtils.handleKeyCommand(editorState, command)
    // Null check to handle null editorState when backspacking empty editor
    if (newEditorState !== null) {
      return newEditorState
    } else { return editorState }  
  },
  returnSelectionContentBlockClasses: (editorState) => {
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
  },
  returnEditorStateWithCustomClass: (editorState, className) => {
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
  },
  // Handle toggling block types with DraftJS RichUtils
  returnEditorStateWithInlineStyles: (style, editorState) => {
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
  },
  returnEditorStateWithInlineImage: (editorState, media) => {
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
    const newEditorState = editorConstructor.returnEditorStateFromContentState(contentStateWithAtomicBlock, decorator)
    return newEditorState
  },
  returnEditorStateWithSearchTextFocus: (editorState, searchKey) => {
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
  },
  // Takes in an editorState, and if the selectionState is a cursor within a pagebreak entity,
  // force the selection of the entire entity. Used in editor paginate mode.
  returnEditorStateWithExpandedPageBreakSelection: editorState => {
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
  },
}

export default editorConstructor