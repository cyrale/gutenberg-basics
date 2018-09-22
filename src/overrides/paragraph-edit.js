/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { createBlock } = wp.blocks;
const { AlignmentToolbar, BlockControls, RichText } = wp.editor;

/**
 * External dependencies
 */
import classnames from 'classnames';

export default class ParagraphEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onReplace = this.onReplace.bind( this );
	}

	onReplace( blocks ) {
		const { attributes, onReplace } = this.props;

		onReplace(
			blocks.map(
				( block, index ) =>
					index === 0 && block.name === 'core/paragraph' ?
						{
							...block,
							attributes: {
								...attributes,
								...block.attributes,
							},
						} :
						block
			)
		);
	}

	render() {
		const { attributes, setAttributes, insertBlocksAfter, mergeBlocks, onReplace, className } = this.props;
		const { align, content, placeholder } = attributes;

		return (
			<Fragment>
				<BlockControls>
					<AlignmentToolbar
						value={ align }
						onChange={ nextAlign => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>
				<div>
					<RichText
						tagName="p"
						className={ classnames( 'wp-block-paragraph', className ) }
						style={ {
							textAlign: align,
						} }
						value={ content }
						onChange={ nextContent => {
							setAttributes( {
								content: nextContent,
							} );
						} }
						onSplit={
							insertBlocksAfter ?
								( before, after, ...blocks ) => {
									if ( after ) {
										blocks.push( createBlock( 'core/paragraph', { content: after } ) );
									}

									insertBlocksAfter( blocks );

									if ( before ) {
										setAttributes( { content: before } );
									} else {
										onReplace( [] );
									}
								} :
								undefined
						}
						onMerge={ mergeBlocks }
						onReplace={ this.onReplace }
						onRemove={ () => onReplace( [] ) }
						placeholder={ placeholder || __( 'Add text or type / to add content' ) }
					/>
				</div>
			</Fragment>
		);
	}
}
