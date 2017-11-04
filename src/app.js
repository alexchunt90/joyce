import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class ChapterButton extends React.Component {

}


class ChapterList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			chapters: []
		}
	}

	componentDidMount() {
		const chapters = axios.get('/api/chapters').then(res => {
			const chapters = res.data.sort((a, b) => a.id - b.id)
			return chapters
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
				{console.log(this.state.chapters)}
	        	{this.state.chapters.map(chapter => 
	        		<div>
	        			<a className='btn btn-primary btn-lg' href={chapter.id}>{chapter.name}</a>
        			</div>
	        	)}
        	</div>
      	);
  	}
}

ReactDOM.render(
	<ChapterList chapter='Telemachus'/>,
  	document.getElementById('sidebar')
)