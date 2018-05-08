import React from 'react'
import { EditorState, Modifier, ContentState, CompositeDecorator, RichUtils, Entity } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

import LinkContainer from '../containers/linkContainer'

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

const decorator = new CompositeDecorator([
	{
	  strategy: findLinkEntities,
	  component: LinkContainer,
	}
])

const editorState = (state=blankEditor, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				const editorState = EditorState.createWithContent(stateFromHTML(action.data.html_source), decorator)
				return editorState
			} else if (action.status === 'request' && action.state === 'currentDocument') {
				return blankEditor
			} else { return state }
		case 'CREATE_CHAPTER':
			return blankEditor
		case 'CREATE_DOCUMENT':
			return blankEditor
		case 'UPDATE_EDITOR_STATE':
			return action.data
		case 'HANDLE_EDITOR_KEY_COMMAND':
			const editorState = RichUtils.handleKeyCommand(action.editorState, action.command)
			// Null check to handle null editorState when backspacking empty editor
			if (editorState !== null) {
				return editorState
			} else { return state }
		case 'APPLY_INLINE_STYLE':
			let inlineStyles = ['BOLD', 'ITALIC', 'UNDERLINE']
			if (inlineStyles.indexOf(action.style) >= 0) {
				return RichUtils.toggleInlineStyle(action.editorState, action.style)
			} else if (action.style === 'header-two') {
				return RichUtils.toggleBlockType(action.editorState, 'header-two')
			}
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
		case 'REMOVE_ANNOTATION':
			const contentStateWithoutLink = Modifier.applyEntity(
  				action.editorState.getCurrentContent(),
  				action.selectionState,
  				null
			)
			return EditorState.createWithContent(contentStateWithoutLink, decorator)			
		default:
			return state
	}
}

export default editorState