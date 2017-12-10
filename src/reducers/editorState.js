import React from 'react'
import { EditorState, Modifier, ContentState, CompositeDecorator, Entity } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

const blankEditor = EditorState.createEmpty(decorator)

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
      
const Link = (props) => {
	const url = props.contentState.getEntity(props.entityKey).getData()
	console.log(props)
    return (
      <a href={url}>
        {props.children}
      </a>
    )
}

const decorator = new CompositeDecorator([
	{
	  strategy: findLinkEntities,
	  component: Link,
	}
])

const editorState = (state=blankEditor, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentNote') {
				const editorState = EditorState.createWithContent(stateFromHTML(action.data.text), decorator)
				return editorState
			} else { return state }
		case 'CREATE_CHAPTER':
			return blankEditor
		case 'CREATE_NOTE':
			return blankEditor
		case 'UPDATE_EDITOR_STATE':
			return action.data
		case 'SUBMIT_ANNOTATION':
			const contentState = action.editorState.getCurrentContent()
			const contentStateWithEntity = contentState.createEntity(
  				'LINK',
  				'MUTABLE',
  				{url: action.annotationNote.id}
			)
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
			const contentStateWithLink = Modifier.applyEntity(
  				contentStateWithEntity,
  				action.selectionState,
  				entityKey
			)
			return EditorState.createWithContent(contentStateWithLink, decorator)
		default:
			return state
	}
}

export default editorState