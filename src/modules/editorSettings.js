import { convertToRaw } from 'draft-js'

export const html_export_options = {
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

export const convertToPlainText = contentState => {
  const rawState = convertToRaw(contentState)
  return rawState.blocks.reduce(
    (plaintText, block) => plaintText + block.text + '\n',
    ''
  ) 
}