import { ReadModeTopBar, EditModeTopBar, AnnotateModeTopBar }  from '../components/contentTopBar'
import { EditModeBottomBar } from '../components/contentBottomBar'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const EditorAnnotateMode = ({
	currentDocument,
	editorState,
	docType,
	loadingToggle,
	onChangeEditorState,
	onNewAnnotationClick,
	annotateKeyBindings,
	onRemoveAnnotationClick,
	cancelEdit,
	onSubmitClick,
	documentTitleInput
}) =>
	<div>
		<div id='editor_metadata'>
			{loadingToggle === true &&
				<LoadingSpinner />
			}
			<DocumentTitle docType={docType} currentDocument={currentDocument} />
		</div>
		<div id='editor_topbar'>
			<AnnotateModeTopBar 
				onNewAnnotationClick={onNewAnnotationClick}
				onRemoveAnnotationClick={onRemoveAnnotationClick}
				addDisabled={editorState.getSelection().isCollapsed() ? true : false}
				removeDisabled={(editorState.getSelection().isCollapsed() ) ? true : false}
			/>
		</div>	
		<div id='editor_content'>
			<Editor editorState={editorState} onChange={onChangeEditorState} keyBindingFn={annotateKeyBindings} />
		</div>
		<div id='editor_bottombar'>
			<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={onSubmitClick} />
		</div>
	</div>

export default EditorAnnotateMode