/**
 * External dependencies
 */
import range from "lodash/range";

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {Fragment} = wp.element;
const {PanelBody, Toolbar} = wp.components;
const {createBlock} = wp.blocks;
const {RichText, BlockControls, InspectorControls} = wp.editor;

const createLevelControl = (targetLevel, selectedLevel, onChange) => {
	return {
		icon: "heading",
		// translators: %s: heading level e.g: "1", "2", "3"
		title: sprintf(__("Heading %d"), targetLevel),
		isActive: targetLevel === selectedLevel,
		onClick: () => onChange(targetLevel),
		subscript: String(targetLevel),
	};
};

export default function HeadingEdit ({
										 attributes,
										 setAttributes,
										 mergeBlocks,
										 insertBlocksAfter,
										 onReplace,
									 }) {
	const {align, content, level, placeholder, className} = attributes;
	const {headings} = gutenbergBasicsSettings;

	const levels = headings.map((level) => Number(level.substr(1))).sort();
	const tagName = "h" + level;

	const onChange = (newLevel) => setAttributes({level: newLevel});
	const toolbar = (
		<Toolbar controls={range(levels[0], levels[levels.length - 1] + 1).map((index) => createLevelControl(index, level, onChange))}/>
	);

	return (
		<Fragment>
			<BlockControls>
				{toolbar}
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__("Heading Settings")}>
					<p>{__("Level")}</p>
					{toolbar}
				</PanelBody>
			</InspectorControls>
			<RichText
				identifier="content"
				wrapperClassName="wp-block-heading"
				tagName={tagName}
				value={content}
				onChange={(value) => setAttributes({content: value})}
				onMerge={mergeBlocks}
				unstableOnSplit={
					insertBlocksAfter ?
						(before, after, ...blocks) => {
							setAttributes({content: before});
							insertBlocksAfter([
								...blocks,
								createBlock("core/paragraph", {content: after}),
							]);
						} :
						undefined
				}
				onRemove={() => onReplace([])}
				style={{textAlign: align}}
				className={className}
				placeholder={placeholder || __("Write heading…")}
			/>
		</Fragment>
	);
}
