import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'
import EditorReadModeContainer from '../containers/editorReadModeContainer'
import EditorAnnotateModeContainer from '../containers/editorAnnotateModeContainer'
import EditorPaginateModeContainer from '../containers/editorPaginateModeContainer'
import EditorEditModeContainer from '../containers/editorEditModeContainer'

const EditorContent = ({mode}) =>
	<div id='editor_container'>
		{mode === 'READ_MODE' &&
			<EditorReadModeContainer />
		}
		{mode === 'ANNOTATE_MODE' &&
			<EditorAnnotateModeContainer />
		}
		{mode === 'EDIT_MODE' &&
			<EditorEditModeContainer />
		}
		{mode === 'PAGINATE_MODE' &&
			<EditorPaginateModeContainer />
		}		
	</div>	

const mapStateToProps = (state, props) => {
	return {
		mode: state.mode,
	}
}

EditorContent.propTypes = {
	mode: PropTypes.string
}

const EditorContentContainer = connect(mapStateToProps)(EditorContent)

export default EditorContentContainer