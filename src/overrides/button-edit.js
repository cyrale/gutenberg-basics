/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const { compose } = wp.compose;
const {
	Dashicon,
	IconButton,
	withFallbackStyles,
} = wp.components;
const {
	URLInput,
	RichText,
	InspectorControls,
	withColors,
	PanelColorSettings,
} = wp.editor;

const { getComputedStyle } = window;

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { backgroundColor } = ownProps;
	const backgroundColorValue = backgroundColor && backgroundColor.color;
	//avoid the use of querySelector if textColor color is known and verify if node is available.
	return {
		fallbackBackgroundColor: backgroundColorValue || ! node ? undefined : getComputedStyle( node ).backgroundColor,
	};
} );

class ButtonEdit extends Component {
	constructor() {
		super( ...arguments );
		this.nodeRef = null;
		this.bindRef = this.bindRef.bind( this );
	}

	bindRef( node ) {
		if ( ! node ) {
			return;
		}
		this.nodeRef = node;
	}

	render() {
		const {
			attributes,
			backgroundColor,
			setBackgroundColor,
			setAttributes,
			isSelected,
		} = this.props;

		const {
			text,
			url,
			title,
			className,
		} = attributes;

		return (
			<Fragment>
				<div
					className={ classnames( 'wp-block-button', className ) }
					title={ title }
					ref={ this.bindRef }
				>
					<RichText
						placeholder={ __( 'Add text…' ) }
						value={ text }
						onChange={ ( value ) => setAttributes( { text: value } ) }
						formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
						className={ classnames(
							'wp-block-button__link', {
								'has-background': backgroundColor.color,
								[ backgroundColor.class ]: backgroundColor.class,
							}
						) }
						style={ {
							backgroundColor: backgroundColor.color,
						} }
						keepPlaceholderOnFocus
					/>
					<InspectorControls>
						<PanelColorSettings
							title={ __( 'Color Settings' ) }
							colorSettings={ [
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Background Color' ),
								},
							] }
						/>
					</InspectorControls>
				</div>
				{ isSelected && (
					<form
						className="block-library-button__inline-link"
						onSubmit={ ( event ) => event.preventDefault() }>
						<Dashicon icon="admin-links" />
						<URLInput
							value={ url }
							onChange={ ( value ) => setAttributes( { url: value } ) }
						/>
						<IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
					</form>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor' ),
	applyFallbackStyles,
] )( ButtonEdit );
