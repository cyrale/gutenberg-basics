/**
 * WordPress dependencies
 */
const { addFilter } = wp.hooks;
const { unregisterBlockType, getBlockTypes } = wp.blocks;

/**
 * Overrides of WP blocks
 */
import { default as HeadingEdit } from './overrides/heading-edit';
import { default as ParagraphEdit } from './overrides/paragraph-edit';

window.onload = () => {
	const { whitelistedBlocks } = gutenbergBasicsSettings;
	const postType = wp.data.select( 'core/editor' ).getCurrentPost().type;

	if ( whitelistedBlocks[ postType ] !== undefined ) {
		getBlockTypes().forEach( block => {
			if ( whitelistedBlocks[ postType ].indexOf( block.name ) === -1 ) {
				unregisterBlockType( block.name );
			}
		} );
	}
};

addFilter( 'blocks.registerBlockType', 'gutenberg-basics/remove-html-supports', settings => {
	if ( settings.supports === undefined ) {
		settings.supports = {};
	}

	settings.supports.html = false;

	return settings;
} );

addFilter( 'editor.BlockEdit', 'gutenberg-basics/overrides', BlockEdit => {
	return props => {
		if ( 'core/paragraph' === props.name ) {
			return <ParagraphEdit { ...props } />;
		} else if ( 'core/heading' === props.name ) {
			return <HeadingEdit { ...props } />;
		}

		return <BlockEdit { ...props } />;
	};
} );
