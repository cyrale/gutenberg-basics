/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const { PanelBody, Toolbar } = wp.components;
const { createBlock } = wp.blocks;
const { RichText, BlockControls, InspectorControls, AlignmentToolbar } = wp.editor;

export default class HeadingEdit extends Component {
	static getDerivedStateFromProps( props, state ) {
		if ( props.attributes.nodeName === undefined ) {
			props.attributes.nodeName = gutenbergBasicsSettings.headings[ 0 ].toUpperCase();
		}

		return state;
	}

	render() {
		const { attributes, setAttributes, mergeBlocks, insertBlocksAfter, onReplace, className } = this.props;
		const { align, content, level, placeholder } = attributes;
		const { headings } = gutenbergBasicsSettings;

		const levels = headings.map( targetLevel => Number( targetLevel.substr( 1 ) ) );
		const tagName = 'h' + level;

		const toolbar = (
			<Toolbar
				controls={ levels.map( targetLevel => ( {
					icon: 'heading',
					title: sprintf( __( 'Heading %s' ), targetLevel ),
					isActive: targetLevel === level,
					onClick: () => setAttributes( { level: targetLevel } ),
					subscript: targetLevel,
				} ) ) }
			/>
		);

		return (
			<Fragment>
				<BlockControls>{ toolbar }</BlockControls>
				<InspectorControls>
					<PanelBody title={ __( 'Heading Settings' ) }>
						<p>{ __( 'Level' ) }</p>
						{ toolbar }
						<p>{ __( 'Text Alignment' ) }</p>
						<AlignmentToolbar
							value={ align }
							onChange={ nextAlign => {
								setAttributes( { align: nextAlign } );
							} }
						/>
					</PanelBody>
				</InspectorControls>
				<RichText
					wrapperClassName="wp-block-heading"
					tagName={ tagName }
					value={ content }
					onChange={ value => setAttributes( { content: value } ) }
					onMerge={ mergeBlocks }
					onSplit={
						insertBlocksAfter ?
							( before, after, ...blocks ) => {
								setAttributes( { content: before } );
								insertBlocksAfter( [ ...blocks, createBlock( 'core/paragraph', { content: after } ) ] );
							} :
							undefined
					}
					onRemove={ () => onReplace( [] ) }
					style={ { textAlign: align } }
					className={ className }
					placeholder={ placeholder || __( 'Write heading…' ) }
				/>
			</Fragment>
		);
	}
}
