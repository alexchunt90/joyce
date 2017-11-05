import React from 'react'
import ReactDOM from 'react-dom'
import Redux from 'redux'
import ReactRedux from 'react-redux'
import axios from 'axios' // HTTP client
import objectAssign from 'object-assign' // Object.assign() polyfill for older browsers

// const readerApp = Redux.combineReducers({

// })


// // STORE

// let store = Redux.createStore()

// ReactDOM.render(
// 	<ReaderSidebar />,
//   	document.getElementById('sidebar')
// )

class ReaderSidebar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			chapters: []
		}
	}

	componentDidMount() {
		const chapters = axios.get('/api/chapters').then(res => {
			return res.data
		}).catch(error =>
			console.log(error)
		).then(chapters => this.setState({chapters}))
	}	

 	render() {
        return (
        	<div>
				<div id="highlight_button" className="text-center">
					<a href="#" className="btn btn-primary btn-lg">Highlight Notes</a>
				</div>
	        	<ChapterList chapters={this.state.chapters} />
        	</div>
      	);
  	}
}

const ChapterList = props =>
	<div>
    	{props.chapters.map(chapter => 
			<ChapterButton key={chapter.id} chapter={chapter}/>
    	)}
	</div>

const ChapterButton = props =>
	<div className ='text-center'>			
		<a href={props.chapter.id} className='chapter_button btn btn-default btn-lg'>{props.chapter.name}</a>
	</div>

ReactDOM.render(
	<ReaderSidebar />,
  	document.getElementById('sidebar')
)