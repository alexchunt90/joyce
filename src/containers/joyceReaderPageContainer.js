import React from 'react'
import { connect } from 'react-redux'

import Navbar from '../components/navbar'
import Content from '../components/content'
import AnnotationModel from '../components/annotationModal'
import JoyceReaderSidebarContainer from '../containers/joyceReaderSidebarContainer'
import JoyceReaderContentContainer from '../containers/joyceReaderContentContainer'

const JoyceReaderPage = ({annotationNote}) =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<JoyceReaderSidebarContainer />
				<Content>
					<JoyceReaderContentContainer />
				</Content>
			</div>
		</div>
		<AnnotationModel annotationNote={annotationNote} />
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes
	}
}

const JoyceReaderPageContainer = connect(mapStateToProps)(JoyceReaderPage)

export default JoyceReaderPageContainer