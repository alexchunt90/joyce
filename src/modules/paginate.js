// PAGINATION MODULE
// 
// DraftJS doesn't natively support paginating an existing contentState,
// so this is a custom implementation. It takes a contentState object and a
// an edition object from Elasticsearch. It then scans through the contentState,
// block by block, searching for span tag entities representing page breaks. These
// entities are tagged with an edition and a page number. The contentState is then 
// divided into a set of ordered arrays containing contentBlocks that can used to 
// generate a contentState from a single "page". Page breaks in the middle of a block
// result in that block being split.



import regex from '../modules/regex'
import { SelectionState, Modifier, convertToRaw } from 'draft-js'

// This function returns a template object for a paginated document
// with an array which contains the text broken up into page objects
const newPaginatedDoc = (edition) => {
	return {
		year: edition.year,
		title: edition.title,
		doc: []
	}}
// Returns a template object for a page of the paginated documenty
// with an array which contains the contentBlocks for a given page
// Page number is undefinded because it's set upon reaching the next page break
const newPage = () => {
	return {
		number: undefined,
		blocks: []
	}
}

// Trying to implement this as a recursive funciton, let's see how it goes
const recursivePagination = (contentState, edition, block=undefined, page=undefined, resultDoc=undefined) => {
	// The initial call to this function doesn't receive a resultDoc argument, so the first call initalizes a paginatedDoc
	const paginatedDoc = resultDoc ? resultDoc : newPaginatedDoc(edition)
	// The initial call to this function doesn't receive a currentBlock argument
	// so we take the first block from the contentState
	const currentBlock = block ? block : contentState.getFirstBlock()	
	const blockEntities = []
	// This function is called without a page argument, so the first call initializes a page
	let currentPage = page ? page : newPage()
	let contentStateWithSplitBlock = undefined
	let selectedEntity = undefined

	// Iterate through the content block checking for PageBreak entities
	// Push any hits to the blockEntities Array
	currentBlock.findEntityRanges(character => {
		const entityKey = character.getEntity()
		if (entityKey) {
			const entity = contentState.getEntity(entityKey)
			if (
				entity.type === 'PAGEBREAK'
				// TODO: REMOVE SHIM
				&& entity.data.edition ==='ed1932'
				// && contentState.getEntity(entityKey).data.edition === edition.year)
			) {
				selectedEntity = {
					blockKey: currentBlock.getKey(),
					entityKey: entityKey,
					edition: entity.data.edition,
					number: entity.data.pageNumber
				}
				return true
			} else {return false}
		} else {
			return false
		}},
		(start, end) => {
			blockEntities.push({
				...selectedEntity,
				start: start,
				end: end,
			})
		}
	)

	// Check if the search for PageBreak entities returned hits
	// If no, push this content block to the current page
	if (blockEntities.length === 0) {
		currentPage.blocks.push(currentBlock)
	} 
	// If yes, split the content block at any breakpoints, and 
	// push anything before the first break to the current page
	else {
		// Iterate through the breakpoints
		for (const e in blockEntities) {
			const pageBreak = blockEntities[e]

			// If the span tag doesn't fall at the end of the contentBlock,
			// we need to create a new contentState with that block split in two
			if (currentBlock.getLength() !== pageBreak.end) {
				// Create selectionState for this contentBlock which will represent the pageBreak
				const emptySelection = SelectionState.createEmpty(currentBlock.getKey())
				// Set selectionState cursor to the end of the pageBreak span tag
				const entitySelectionState = emptySelection
					.set('focusOffset', pageBreak.end)
					.set('anchorOffset', pageBreak.end)
				// Split the block at the selection
				contentStateWithSplitBlock = Modifier.splitBlock(contentState, entitySelectionState)		
			}

			// Split block based on the entity range
				// Used Modifier.splitBlock(contentSate, selectionState)

			// Get the page number from the entity
			currentPage = {...currentPage, number: pageBreak.number}
			// Push the currentPage to the entity and instantiate a new one
			paginatedDoc.doc.push(currentPage)
			currentPage = newPage()
		}
	}

	// Check if we created a new contentState when splitting the current block
	const nextContentState = contentStateWithSplitBlock ? contentStateWithSplitBlock : contentState
	
	// Select the subsequent contentBlock to be passed into the next function call
	const nextBlock = nextContentState.getBlockAfter(currentBlock.getKey())


		// console.log('Current block:', currentBlock.key, currentBlock.text)
	if (contentStateWithSplitBlock) {
	}

	// If this is the last contentBlock in the contentState, nextBlock will be null
	if (nextBlock) {
		recursivePagination(nextContentState, edition, nextBlock, currentPage, paginatedDoc)
	} else {
		return paginatedDoc
	}
}

const paginate = {
	testPaginate: (editorState, edition) => {
		console.log('TESTING PAGINATION:')
		console.log('PAGINATING THIS EDITION:', edition)
		const contentState = editorState.getCurrentContent()
		const paginatedEditionDocument = recursivePagination(contentState, edition)
		console.log('RESULT DOC:', paginatedEditionDocument)
	}
}

export default paginate