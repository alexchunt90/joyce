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
		doc: [],
		entityMap: undefined
	}}
// Returns a template object for a page of the paginated documenty
// with an array which contains the contentBlocks for a given page
// Page number is undefinded because it's set upon reaching the next page break
const newPage = () => {
	return {
		number: undefined,
		blocks: [],
	}
}

// Trying to implement this as a recursive funciton, let's see how it goes
const recursivePagination = (contentState, edition, block=undefined, page=undefined, resultDoc=undefined, number=1) => {

	const recursionLimit = 500

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
				&& entity.data.edition === edition.year.toString()
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
				// Split the block at the selection. Key for currentBlock will remain the same,
				// and the other half of the block will be returned by getBlockAfer()
				contentStateWithSplitBlock = Modifier.splitBlock(contentState, entitySelectionState)		
			}

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
	if (nextBlock && number < recursionLimit) {
		// If we're under the recursion limit, proceed with recursion
		return recursivePagination(nextContentState, edition, nextBlock, currentPage, paginatedDoc, number + 1)
	} else if (nextBlock && number === recursionLimit) {
		// If we're at the recursion limit, return an object to break the loop
		return {
			status: 'in_progress',
			nextContentState: nextContentState,
			edition: edition,
			nextBlock: nextBlock,
			currentPage: currentPage,
			paginatedDoc: paginatedDoc,
			number: 1}
	// If this is the last contentBlock in the contentState, nextBlock will be null
	} else {
		// When we're done recursing, export the final entityMap for the contentState, as
		// we'll need to construct page-scoped contentBlocks from the arrays later
		const entityMap = nextContentState.getEntityMap()
		const finalDocument = {...paginatedDoc, entityMap: entityMap, status: 'complete'}
		return finalDocument
	}
}

// So, you ignored all the SO posts telling you to use a `while` loop instead, and 
// you wrote a big clever recursive function. Here's why you shouldn't have:
// 1. Debugging is a pain and 2. Big documents max out the browser's call stack
// Unfortunately now the big clever recursive function works, so I'm not rewriting it
// This limitRecursion() function exists to reset the call stack after 500 calls, preventing browser errors
const limitRecursion = (contentState, edition, block=undefined, page=undefined, resultDoc=undefined, number=undefined) => {
  let constructor = () => {return null}
  while (typeof constructor === 'function') { 
  	constructor = recursivePagination(contentState, edition, block, page, resultDoc, number)
  }
  if (constructor.status === 'in_progress') {
  	constructor = limitRecursion(constructor.nextContentState, constructor.edition, constructor.nextBlock, constructor.currentPage, constructor.paginatedDoc, 1)
  }
  return constructor
}

const paginate = (editorState, edition) => {
	const contentState = editorState.getCurrentContent()
	const paginatedEditionDocument = limitRecursion(contentState, edition)
	return paginatedEditionDocument
}

export default paginate