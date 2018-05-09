import apiActions from './apiActions'
import userActions from './userActions'
import inputActions from './inputActions'
import editorStateActions from './editorStateActions'

const actions = {
	...apiActions,
	...userActions,
	...inputActions,
	...editorStateActions
}

export default actions