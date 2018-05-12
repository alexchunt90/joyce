import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import Content from '../components/content'
import { ReaderWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import ReaderSidebarContainer from '../containers/readerSidebarContainer'
import ReaderContentContainer from '../containers/readerContentContainer'
import AnnotationModal from '../components/annotationModal'

const ReaderPage = ({
	currentDocument, 
	annotationNote,
	loadingToggle,
}) =>
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
		<AnnotationModal annotationNote={annotationNote} />
	</div>

const mapStateToProps = state => {
	return {
		currentDocument: state.currentDocument,
		annotationNote: state.annotationNote,
		loadingToggle: state.loadingToggle,
	}
}

ReaderPage.propTypes = {
	currentDocument: PropTypes.object, 
	annotationNote: PropTypes.object,
	loadingToggle: PropTypes.bool,
}

const ReaderPageContainer = connect(mapStateToProps)(ReaderPage)

export default ReaderPageContainer