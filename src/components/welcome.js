import React from 'react'
import {bookDetails} from '../config'

export const ReaderWelcome = () =>
	<div id='reader_container'>
		<h1 className='text-center my-5' style={{'fontFamily': 'serif'}}>{bookDetails.title}</h1>
		<h4 style={{'fontFamily': 'serif'}} className='my-5'>– by –</h4>
		<h3 style={{'fontFamily': 'serif'}} className='my-5'>{bookDetails.author}</h3>
	</div>

export const EditorWelcome = () =>
	<div id='reader_container' className='editor_welcome'>
		<h5>Welcome to the Editor.</h5>
		<p>This is where you can modify the documents seen by users. This web application supports the following types of documents:</p>
		<ul>
			<li>
				<b>Chapters: </b>
				These represent sections of the main text itself. Each chapter contains annotation data, linking it to Notes, and pagebreak data, paginating it for an Edition.
			</li>
			<li>
				<b>Notes: </b>
				These represent thoughts and essays about the main text. Each note can appear in multiple annotations with different Tags.
			</li>
			<li>
				<b>Info Pages: </b>
				These represent writings not related to the main text, providing supplemental information about the text or the project.
			</li>												
			<li>
				<b>Tags: </b>
				These represent the range of topics for annotations, and correspond to the color coding of the highlighted annotations.
			</li>
			<li>
				<b>Editions: </b>
				These represent print editions of the main text, allowing the chapter to be paginated in multiple ways.
			</li>
			<li>
				<b>Media: </b>
				These are supplemental images and other media that can be attached to notes or inserted directly into documents. The application currently support images, with plans to add audio and video support.
			</li>
		</ul>
		<br />
		<p>The Editor supports the following modes of interaction:</p>
		<ul>
			<li>
				<b>Edit Mode: </b>
				This is for formatting the text itself. The editor supports the following rich-text styles:
				<ul>
					<li>Headers 1-3</li>
					<li>Bold, Italic, Underline</li>
					<li>Left, Right, Center and Jusfified Alignment</li>
					<li>Text Indent</li>
					<li>Quoteblocks</li>
					<li>Images</li>
					<li>Custom CSS Tags</li>
				</ul>				
			</li>
			<li>
				<b>Annotation Mode: </b>
				This is where you can annotate documents with links to Notes, with a color determined by the assigned Tag.

				Select a portion of the text using your cursor, then click "New Annotation" to open a model where you'll select the Note and Tag to apply. "Remove Annotation" will clear any annotations present in your highlighted selection.
			</li>
			<li>
				<b>Pagination Mode: </b>
				This is where you can set page breaks for a specific Edition of the the text.

				First create a new Edition, then select a Chapter and enter Pagination Mode. Select the right Edition from the dropdown, and enter the page number you'd like to appear at the bottom of the page. Use your cursor to select the exact location for the pagebreak in the text, then click "Set".
			</li>						
		</ul>

	</div>	