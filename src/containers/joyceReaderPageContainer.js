import React from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import Content from '../components/content'
import { ReaderWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import JoyceReaderSidebarContainer from '../containers/joyceReaderSidebarContainer'
import JoyceReaderContentContainer from '../containers/joyceReaderContentContainer'

const JoyceReaderPage = ({currentDocument, loadingToggle}) =>
	<div id='joyce_reader' className='container-fluid'>
		<div id='content_window' className='row'>
			<JoyceReaderSidebarContainer />
			<Content>
				{loadingToggle === true &&
					<LoadingSpinner size={4} />
				}				
				{(Object.keys(currentDocument).length > 0 && loadingToggle === false) &&
					<JoyceReaderContentContainer />
				}
				{(Object.keys(currentDocument).length === 0 && loadingToggle === false) &&
					<ReaderWelcome />
				}				
			</Content>
		</div>
	</div>

const mapStateToProps = state => {
	return {
		currentDocument: state.currentDocument,
		loadingToggle: state.loadingToggle
	}
}

const JoyceReaderPageContainer = connect(mapStateToProps)(JoyceReaderPage)

export default JoyceReaderPageContainer