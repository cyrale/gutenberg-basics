/**
 * External dependencies
 */
import assign from 'lodash/assign';

/**
 * WordPress dependencies
 */
const {
	addFilter,
} = wp.hooks;
const {
	unregisterBlockType,
	getBlockTypes,
} = wp.blocks;

/**
 * Advanced settings
 */
import {
	addAttribute as anchorAddAttribute,
	addSaveProps as anchorAddSaveProps,
	withInspectorControl as anchorWithInspectorControl,
} from './anchor';

import {
	addAttribute as classAddAttribute,
	addParsedDifference as classAddParsedDifference,
	addSaveProps as classAddSaveProps,
	withInspectorControl as classWithInspectorControl,
} from "./custom-class-name";

/**
 * Overrides of WP blocks
 */
import {default as HeadingEdit} from './overrides/heading-edit';
import {default as ParagraphEdit} from './overrides/paragraph-edit';
import {default as ButtonEdit} from './overrides/button-edit';

window.onload = () => {
	const {whitelistedBlocks} = gutenbergBasicsSettings;
	const posttype = wp.data.select('core/editor').getCurrentPost().type;

	if (whitelistedBlocks[posttype] !== undefined) {
		getBlockTypes().forEach(block => {
			if (Object.values(whitelistedBlocks[posttype]).indexOf(block.name) === -1) {
				unregisterBlockType(block.name);
			}
		});
	}
};

addFilter(
	'blocks.registerBlockType',
	'gutenberg-basics/remove-html-supports',
	settings => {
		return assign({}, settings, {
			supports: assign({}, settings.supports, {
				html: false,
			})
		});
	},
	999
);

addFilter(
	'blocks.registerBlockType',
	'gutenberg-basics/add-class-names',
	settings => {
		return assign({}, settings, {
			supports: assign({}, settings.supports, {
				className: true,
			})
		});
	},
	999
);

// Overrides headings
addFilter(
	'editor.BlockEdit',
	'gutenberg-basics/override-heading',
	(BlockEdit) => {
		return (props) => {
			if ('core/heading' !== props.name) {
				return <BlockEdit {...props} />
			}

			return (
				<HeadingEdit {...props} />
			);
		};
	}
);

// Overrides paragraph
addFilter(
	'editor.BlockEdit',
	'gutenberg-basics/override-paragraph',
	(BlockEdit) => {
		return (props) => {
			if ('core/paragraph' !== props.name) {
				return <BlockEdit {...props} />
			}

			return (
				<ParagraphEdit {...props} />
			);
		};
	}
);

// Overrides button
addFilter(
	'editor.BlockEdit',
	'gutenberg-basics/override-button',
	(BlockEdit) => {
		return (props) => {
			if ('core/button' !== props.name) {
				return <BlockEdit {...props} />
			}

			return (
				<ButtonEdit {...props} />
			);
		};
	}
);

// Re-add anchor settings
addFilter( 'blocks.registerBlockType', 'gutenberg-basics/anchor/attribute', anchorAddAttribute );
addFilter( 'editor.BlockEdit', 'gutenberg-basics/editor/anchor/with-inspector-control', anchorWithInspectorControl );
addFilter( 'blocks.getSaveContent.extraProps', 'gutenberg-basics/anchor/save-props', anchorAddSaveProps );

// Re-add additional CSS settings
addFilter( 'blocks.registerBlockType', 'gutenberg-basics/custom-class-name/attribute', classAddAttribute );
addFilter( 'editor.BlockEdit', 'gutenberg-basics/editor/custom-class-name/with-inspector-control', classWithInspectorControl );
addFilter( 'blocks.getSaveContent.extraProps', 'gutenberg-basics/custom-class-name/save-props', classAddSaveProps );
addFilter( 'blocks.getBlockAttributes', 'gutenberg-basics/custom-class-name/addParsedDifference', classAddParsedDifference );

