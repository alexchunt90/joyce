// The only module that drives Bootstrap for the reader's annotation modal.
// Show/hide are programmatic (the link anchors no longer carry data-bs-toggle) so that
// the URL, not Bootstrap, decides whether the modal is open.
import * as bootstrap from 'bootstrap'

const ANNOTATION_MODAL_ID = 'annotation_modal'

// Set when we hide the modal ourselves in response to a URL change. The component's
// hidden.bs.modal listener reads and resets it, so a hide we initiated does not get
// reported back as a user close (which would push yet another URL).
let selfInitiatedHide = false

const getElement = () => document.getElementById(ANNOTATION_MODAL_ID)

const getInstance = () => {
	const element = getElement()
	// getOrCreateInstance: without data-bs-toggle nothing else ever instantiates the modal
	return element ? bootstrap.Modal.getOrCreateInstance(element) : undefined
}

const modalControl = {
	isAnnotationModalOpen: () => {
		const element = getElement()
		return element ? element.classList.contains('show') : false
	},
	showAnnotationModal: () => {
		const instance = getInstance()
		if (instance) {
			instance.show()
		}
	},
	hideAnnotationModal: () => {
		// Only flag a hide that will actually fire hidden.bs.modal, otherwise the flag
		// would linger and swallow the next genuine user close
		if (modalControl.isAnnotationModalOpen()) {
			selfInitiatedHide = true
			getInstance().hide()
		}
	},
	// Read-and-reset: true if the hide that just completed was ours
	consumeSelfInitiatedHide: () => {
		const value = selfInitiatedHide
		selfInitiatedHide = false
		return value
	}
}

export default modalControl
