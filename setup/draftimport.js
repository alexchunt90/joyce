// This is a one-time setup script 
// designed to take the HTML processed by beautifulsoup in the Python setup process
// run the HTML through DraftJS, create search text, and post the result to Elasticsearch

import React from 'react'
import { EditorState, ContentState } from 'draft-js'
import { convertFromHTML, convertToHTML } from 'draft-convert'
// import { stateToHTML } from 'draft-js-export-html'
import axios from 'axios'

import { convertToSearchText, linkDecorator } from '../src/modules/editorSettings'
import api from '../src/modules/api'

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

axios.defaults.baseURL = 'http://127.0.0.1:5000';

// DraftJS assumes access to the DOM, solution for server-side processing found here:
// https://github.com/facebook/draft-js/issues/1361
const { window } = (new JSDOM(`<!DOCTYPE html>`))
global.Node = {TEXT_NODE: 3}
global.window = window
global.document = window.document
global.HTMLElement = window.HTMLElement
global.HTMLAnchorElement = window.HTMLAnchorElement

function stateFromHTML (html) {
  const blocksFromHTML = convertFromHTML({
    htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'a') {
            return createEntity(
                'LINK',
                'MUTABLE',
                {url: node.href}
            )
        }
    },  	
  })(html)
  return blocksFromHTML
}
function stateToHTML(html) {
	const htmlFromBlocks = convertToHTML({
	  entityToHTML: (entity, originalText) => {
	    if (entity.type.toUpperCase() === 'LINK') {
	      return <a href={entity.data.url} data-target='#annotation_modal' data-toggle='modal'>{originalText}</a>
	    }
	    return originalText;
  }})(html)
	return htmlFromBlocks
}

const processHTMLForElasticsearch = (doc, docType) => {
	const editorState = EditorState.createWithContent(stateFromHTML(doc.html_source), linkDecorator)
	const textContent = editorState.getCurrentContent()
	const data = { 
		id: doc.id,
		title: doc.title,
		file_name: doc.file_name,
		html_source: doc.html_source, 
		search_text: convertToSearchText(textContent),
	}
	if (docType == 'chapters') {
		data.number = doc.number
		data.html_source = stateToHTML(textContent)
	}
	return data
}

async function importDocumentsThruDraftJS() {
	const getDocList = (docType) => {
		const docs = api.HTTPGetDocumentList(docType)
		return docs
	}

	const getDocText = (id, docType) => {
		const doc = api.HTTPGetDocumentText(id, docType, 'request')
		return doc
	}

	const postDocUpdate = (id, docType, data) => {
		const doc = api.HTTPPostWriteDocument(id, docType, data)
		return doc
	}	

	// Process chapters
	const chapter_list_response = await getDocList('chapters')
	const chapter_list = chapter_list_response.data

	for (const c in chapter_list) {
		const chapter_id = chapter_list[c].id
		const chapter_response = await getDocText(chapter_id, 'chapters')
		const chapter = chapter_response.data
		console.log('Processing chapter file:', chapter.file_name)
		const payload = processHTMLForElasticsearch(chapter, 'chapters')			
		await postDocUpdate(chapter.id, 'chapters', payload)
	}

	// // Process notes
	const note_list_response = await getDocList('notes')
	const note_list = note_list_response.data

	for (const n in note_list) {
		const note_id = note_list[n].id
		const note_response = await getDocText(note_id, 'notes')
		const note = note_response.data
		console.log('Processing note file', n, 'out of', note_list.length,': ', note.file_name)
		const payload = processHTMLForElasticsearch(note, 'notes')
		await postDocUpdate(note.id, 'notes', payload)
	}

}

importDocumentsThruDraftJS()
console.log('Done!')