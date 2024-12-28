// _________________________________________________
// 
// State conversion functions using draft-convert library
// _________________________________________________

import React from 'react'
import { convertFromHTML, convertToHTML } from 'draft-convert'

// Create contentState from HTML
export const stateFromHTML = html => {

  const constructBlockData = (node) => {
    return {
      key: node.getAttribute('data-search-key'),
      align: node.getAttribute('data-align'),
      indent: node.getAttribute('data-indent'),   
      classes: node.getAttribute('data-custom-classes') ? node.getAttribute('data-custom-classes').split(' ') : [],
      url: node.getAttribute('src'),
      id: node.getAttribute('data-media-id')
    }
  }
  const blocksFromHTML = convertFromHTML({
    htmlToBlock: (nodeName, node) => {
      if (nodeName === 'p') {
        return {type: 'unstyled', data: constructBlockData(node)}
      }
      if (nodeName === 'blockquote') {
        return {type: 'blockquote', data: constructBlockData(node)}
      }
      if (nodeName === 'h1') {
        return {type: 'header-one', data: constructBlockData(node)}
      }
      if (nodeName === 'h2') {
        return {type: 'header-two', data: constructBlockData(node)}
      }
      if (nodeName === 'h3') {
        return {type: 'header-three', data: constructBlockData(node)}
      }
      if (nodeName === 'img') {
        return {type: 'atomic', data: constructBlockData(node)}
      }                   
    },
    htmlToEntity: (nodeName, node, createEntity) => {
      if (nodeName === 'a') {        
          if (node.getAttribute('data-type') === 'external_url') {
            return createEntity(
              'EXTERNAL_URL',
              'MUTABLE',
              {
                'url': node.getAttribute('href'),
              }
            )
          } else {
            return createEntity(
              'LINK',
              'MUTABLE',
              {
                'url': node.getAttribute('href'),
                'color': node.getAttribute('data-color') || '0000FF',
                'tag': node.getAttribute('data-tag') || ''
              }
            )
          }
      }
      if (nodeName === 'span') {
        return createEntity(
          'PAGEBREAK',
          'MUTABLE',
          {
            edition: node.getAttribute('data-edition'),
            pageNumber: node.getAttribute('data-page')
          }
        )
      }
    },    
  })(html)
  return blocksFromHTML
}

export const stateToHTML = contentState => {
  const html = convertToHTML({
    blockToHTML: (block) => {
      if (block.type === 'unstyled') {
        return <p data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} data-custom-classes={block.data.classes ? block.data.classes.join(' ') : undefined} />;
      }
      if (block.type === 'blockquote') {
        return <blockquote data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} data-custom-classes={block.data.classes ? block.data.classes.join(' ') : undefined} />
      }
      if (block.type === 'header-one') {
        return <h1 data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} data-custom-classes={block.data.classes ? block.data.classes.join(' ') : undefined} />
      }
      if (block.type === 'header-two') {
        return <h2 data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} data-custom-classes={block.data.classes ? block.data.classes.join(' ') : undefined} />
      }
      if (block.type === 'header-three') {
        return <h3 data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} data-custom-classes={block.data.classes ? block.data.classes.join(' ') : undefined} />
      }
      if (block.type === 'atomic') {
        return <img data-search-key={block.data.key || block.key} data-align={block.data.align || 'left'} data-indent={block.data.indent || undefined} data-custom-classes={block.data.classes ? block.data.classes.join(' ') : undefined} src={block.data.url} data-media-id={block.data.id}/>
      }        
    },
    entityToHTML: (entity, originalText) => {
      if (entity.type === 'LINK') {
        // Bandaid fix for HTML encoded chars in <a> tags being converted to text
        const cleanedText = originalText.replaceAll("&#x27;", "'").replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('<br>')
        return <a href={entity.data.url} data-color={entity.data.color} data-tag={entity.data.tag} data-type='annotation'>{cleanedText}</a>;
      }
      if (entity.type === 'EXTERNAL_URL') {
        const cleanedText = originalText.replaceAll("&#x27;", "'").replaceAll('&amp;', '&')
        return <a href={entity.data.url} data-type='external_url'>{cleanedText}</a>;
      }
      if (entity.type === 'PAGEBREAK') {
        return <span data-edition={entity.data.edition} data-page={entity.data.pageNumber}>{originalText}</span>;
      }
      return originalText;
    }
  })(contentState)

  return html
}