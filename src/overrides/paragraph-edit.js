/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __, _x } = wp.i18n;
const{
	Component,
	Fragment,
} = wp.element;
const {
	Toolbar,
} = wp.components;
const {
	AlignmentToolbar,
	BlockControls,
	RichText,
} = wp.editor;
const { createBlock } = wp.blocks;

const name = 'core/paragraph';

export default class ParagraphEdit extends Component {
	constructor() {
		super(...arguments);

		this.onReplace = this.onReplace.bind(this);
		this.splitBlock = this.splitBlock.bind( this );
	}

	onReplace( blocks ) {
		const { attributes, onReplace } = this.props;
		onReplace( blocks.map( ( block, index ) => (
			index === 0 && block.name === name ?
				{ ...block,
					attributes: {
						...attributes,
						...block.attributes,
					},
				} :
				block
		) ) );
	}

	/**
	 * Split handler for RichText value, namely when content is pasted or the
	 * user presses the Enter key.
	 *
	 * @param {?Array}     before Optional before value, to be used as content
	 *                            in place of what exists currently for the
	 *                            block. If undefined, the block is deleted.
	 * @param {?Array}     after  Optional after value, to be appended in a new
	 *                            paragraph block to the set of blocks passed
	 *                            as spread.
	 * @param {...WPBlock} blocks Optional blocks inserted between the before
	 *                            and after value blocks.
	 */
	splitBlock( before, after, ...blocks ) {
		const {
			attributes,
			insertBlocksAfter,
			setAttributes,
			onReplace,
		} = this.props;

		if ( after !== null ) {
			// Append "After" content as a new paragraph block to the end of
			// any other blocks being inserted after the current paragraph.
			blocks.push( createBlock( name, { content: after } ) );
		}

		if ( blocks.length && insertBlocksAfter ) {
			insertBlocksAfter( blocks );
		}

		const { content } = attributes;
		if ( before === null ) {
			// If before content is omitted, treat as intent to delete block.
			onReplace( [] );
		} else if ( content !== before ) {
			// Only update content if it has in-fact changed. In case that user
			// has created a new paragraph at end of an existing one, the value
			// of before will be strictly equal to the current content.
			setAttributes( { content: before } );
		}
	}

	render() {
		const {
			attributes,
			setAttributes,
			mergeBlocks,
			onReplace,
			isRTL,
		} = this.props;

		const {
			align,
			content,
			placeholder,
			direction,
			className,
		} = attributes;

		return (
			<Fragment>
				<BlockControls>
					<AlignmentToolbar
						value={align}
						onChange={(nextAlign) => {
							setAttributes({align: nextAlign});
						}}
					/>
					{ isRTL && (
						<Toolbar
							controls={ [
								{
									icon: 'editor-ltr',
									title: _x( 'Left to right', 'editor button' ),
									isActive: direction === 'ltr',
									onClick() {
										const nextDirection = direction === 'ltr' ? undefined : 'ltr';
										setAttributes( {
											direction: nextDirection,
										} );
									},
								},
							] }
						/>
					) }
				</BlockControls>
				<RichText
					identifier="content"
					tagName="p"
					className={ classnames( 'wp-block-paragraph', className ) }
					style={ {
						textAlign: align,
						direction,
					} }
					value={ content }
					onChange={ ( nextContent ) => {
						setAttributes( {
							content: nextContent,
						} );
					} }
					unstableOnSplit={ this.splitBlock }
					onMerge={ mergeBlocks }
					onReplace={ this.onReplace }
					onRemove={ () => onReplace( [] ) }
					aria-label={ content ? __( 'Paragraph block' ) : __( 'Empty block; start writing or type forward slash to choose a block' ) }
					placeholder={ placeholder || __( 'Start writing or type / to choose a block' ) }
				/>
			</Fragment>
		);
	}
}
