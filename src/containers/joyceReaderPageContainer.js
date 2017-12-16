import React from 'react'
import { connect } from 'react-redux'

import Navbar from '../components/navbar'
import Content from '../components/content'
import AnnotationModal from '../components/annotationModal'
import { ReaderWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import JoyceReaderSidebarContainer from '../containers/joyceReaderSidebarContainer'
import JoyceReaderContentContainer from '../containers/joyceReaderContentContainer'

const JoyceReaderPage = ({currentDocument, loadingToggle, annotationNote}) =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
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
		<AnnotationModal annotationNote={annotationNote} />
	</div>

const mapStateToProps = state => {
	return {
		loadingToggle: state.loadingToggle,
		currentDocument: state.currentDocument,
		annotationNote: state.annotationNote
	}
}

const JoyceReaderPageContainer = connect(mapStateToProps)(JoyceReaderPage)

export default JoyceReaderPageContainer