import React from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import Content from '../components/content'
import { ReaderWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import ReaderSidebarContainer from '../containers/readerSidebarContainer'
import ReaderContentContainer from '../containers/readerContentContainer'

const ReaderPage = ({currentDocument, loadingToggle}) =>
	<div id='joyce_reader' className='container-fluid'>
		<div id='content_window' className='row'>
			<ReaderSidebarContainer />
			<Content>
				{loadingToggle === true &&
					<LoadingSpinner size={4} />
				}				
				{(Object.keys(currentDocument).length > 0 && loadingToggle === false) &&
					<ReaderContentContainer />
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

const ReaderPageContainer = connect(mapStateToProps)(ReaderPage)

export default ReaderPageContainer