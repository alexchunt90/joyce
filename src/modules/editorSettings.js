// Consolidating any references to the draft-js or draft-convert libraries to this one module
import { ContentState, CompositeDecorator, getDefaultKeyBinding, KeyBindingUtil, convertToRaw } from 'draft-js'

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

// Convert DraftJS contentState to list of text blocks for Elasticsearch
export const convertToSearchText = contentState => {
  const rawState = convertToRaw(contentState)
  const searchText = rawState.blocks.reduce(
    (searchText, block) => ([...searchText, {key: block.key, text: block.text}]),
    []
  )
  return searchText
}