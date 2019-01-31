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
import {default as SevanovaHeadingEdit} from './overrides/heading-edit';
import {default as SevanovaParagraphEdit} from './overrides/paragraph-edit';
import {default as SevanovaButtonEdit} from './overrides/button-edit';

window.onload = () => {
	const {whitelistedBlocks} = sevanovaGutenbergSettings;
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
	'sevanova-gutenberg/remove-html-supports',
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
	'sevanova-gutenberg/add-class-names',
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
	'sevanova-gutenberg/override-heading',
	(BlockEdit) => {
		return (props) => {
			if ('core/heading' !== props.name) {
				return <BlockEdit {...props} />
			}

			return (
				<SevanovaHeadingEdit {...props} />
			);
		};
	}
);

// Overrides paragraph
addFilter(
	'editor.BlockEdit',
	'sevanova-gutenberg/override-paragraph',
	(BlockEdit) => {
		return (props) => {
			if ('core/paragraph' !== props.name) {
				return <BlockEdit {...props} />
			}

			return (
				<SevanovaParagraphEdit {...props} />
			);
		};
	}
);

// Overrides button
addFilter(
	'editor.BlockEdit',
	'sevanova-gutenberg/override-button',
	(BlockEdit) => {
		return (props) => {
			if ('core/button' !== props.name) {
				return <BlockEdit {...props} />
			}

			return (
				<SevanovaButtonEdit {...props} />
			);
		};
	}
);

// Re-add anchor settings
addFilter( 'blocks.registerBlockType', 'sevanova-gutenberg/anchor/attribute', anchorAddAttribute );
addFilter( 'editor.BlockEdit', 'sevanova-gutenberg/editor/anchor/with-inspector-control', anchorWithInspectorControl );
addFilter( 'blocks.getSaveContent.extraProps', 'sevanova-gutenberg/anchor/save-props', anchorAddSaveProps );

// Re-add additional CSS settings
addFilter( 'blocks.registerBlockType', 'sevanova-gutenberg/custom-class-name/attribute', classAddAttribute );
addFilter( 'editor.BlockEdit', 'sevanova-gutenberg/editor/custom-class-name/with-inspector-control', classWithInspectorControl );
addFilter( 'blocks.getSaveContent.extraProps', 'sevanova-gutenberg/custom-class-name/save-props', classAddSaveProps );
addFilter( 'blocks.getBlockAttributes', 'sevanova-gutenberg/custom-class-name/addParsedDifference', classAddParsedDifference );

