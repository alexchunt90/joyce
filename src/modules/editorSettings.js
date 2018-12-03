import { convertToRaw, ContentState, CompositeDecorator } from 'draft-js'

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

export const convertToSearchText = contentState => {
  const rawState = convertToRaw(contentState)
  const searchText = rawState.blocks.reduce(
    (searchText, block) => ([...searchText, {key: block.key, text: block.text}]),
    []
  )
  return searchText
}

export const defaultTagColors = [
  '307EE3',
  'CF2929',
  'AB59C2',
  '9C632A',
  'F59627',
  '40b324'
]