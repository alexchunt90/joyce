import { convertToRaw } from 'draft-js'

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
    		  'href': data.url,
        	'data-target': '#annotation_modal',
        	'data-toggle': 'modal'
        }
      }
    }
  }
}

export const convertToSearchText = contentState => {
  const rawState = convertToRaw(contentState)
  const searchText = rawState.blocks.reduce(
    (searchText, block) => ([...searchText, {key: block.key, text: block.text}]),
    []
  )
  console.log('Search text result:', searchText)
  return searchText
}