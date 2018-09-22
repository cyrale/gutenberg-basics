<?php
/**
 * Gutenberg Basics Block Settings.
 *
 * @since   1.0.0
 * @package Gutenberg_Basics
 */

/**
 * Gutenberg Basics Block Settings.
 *
 * @since 1.0.0
 */
class GB_Block_Settings {

	/**
	 * Parent plugin class.
	 *
	 * @since 1.0.0
	 *
	 * @var   Gutenberg_Basics
	 */
	protected $plugin = null;

	/**
	 * Constructor.
	 *
	 * @since  1.0.0
	 *
	 * @param  Gutenberg_Basics $plugin Main plugin object.
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		$this->hooks();
	}

	/**
	 * Initiate our hooks.
	 *
	 * @since  1.0.0
	 */
	public function hooks() {

	}

	/**
	 * List of all supported blocks (Gutenberg blocks by default).
	 *
	 * @return array
	 */
	public function supported_blocks() {
		$allowed_blocks    = $this->default_blocks();
		$default_wp_blocks = [
			'core/paragraph',
			'core/image',
			'core/heading',
			'core/gallery',
			'core/list',
			'core/quote',
			'core/shortcode',
			'core/audio',
			'core/button',
			'core/categories',
			'core/code',
			'core/columns',
			'core/column',
			'core/cover-image',
			'core/embed',
			'core-embed/twitter',
			'core-embed/youtube',
			'core-embed/facebook',
			'core-embed/instagram',
			'core-embed/wordpress',
			'core-embed/soundcloud',
			'core-embed/spotify',
			'core-embed/flickr',
			'core-embed/vimeo',
			'core-embed/animoto',
			'core-embed/cloudup',
			'core-embed/collegehumor',
			'core-embed/dailymotion',
			'core-embed/funnyordie',
			'core-embed/hulu',
			'core-embed/imgur',
			'core-embed/issuu',
			'core-embed/kickstarter',
			'core-embed/meetup-com',
			'core-embed/mixcloud',
			'core-embed/photobucket',
			'core-embed/polldaddy',
			'core-embed/reddit',
			'core-embed/reverbnation',
			'core-embed/screencast',
			'core-embed/scribd',
			'core-embed/slideshare',
			'core-embed/smugmug',
			'core-embed/speaker',
			'core-embed/ted',
			'core-embed/tumblr',
			'core-embed/videopress',
			'core-embed/wordpress-tv',
			'core/freeform',
			'core/html',
			'core/latest-posts',
			'core/more',
			'core/nextpage',
			'core/preformatted',
			'core/pullquote',
			'core/separator',
			'core/block',
			'core/spacer',
			'core/subhead',
			'core/table',
			'core/text-columns',
			'core/verse',
			'core/video',
		];

		return array_unique( array_merge( $allowed_blocks, $default_wp_blocks ) );
	}

	/**
	 * List of authorized blocks.
	 *
	 * @return array
	 */
	public function default_blocks() {
	$blocks = apply_filters(
			'gutenberg_basics_default_blocks',
			[
				'core/gallery',
				'core/paragraph',
				'core/image',
				'core/heading',
				'core/list',
				'core/quote',
				'core/button',
				'core/columns',
				'core/column',
				'core/embed',
				'core-embed/youtube',
				'core-embed/vimeo',
				'core-embed/dailymotion',
				'core/block',
				'core/table',
				'core/text-columns',
				'core/separator', // DON'T REMOVE THIS!
			]
			);

		foreach ( [ 'core/paragraph', 'core/heading', 'core/separator', 'core/column' ] as $mandatory_block ) {
			if ( ! in_array( $mandatory_block, $blocks, true ) ) {
				$blocks[] = $mandatory_block;
			}
		}

		return $blocks;
	}

	/**
	 * List of authorized blocks by post type.
	 *
	 * @return array
	 */
	public function default_blocks_per_post_types() {
	$post_types = get_post_types(
			[
				'show_in_rest' => true,
			]
			);

		$default_blocks      = [];
		$excluded_post_types = apply_filters( 'gutenberg_basics_excluded_post_types', [ 'attachment', 'wp_block' ] );

		foreach ( $post_types as $post_type ) {
			if ( in_array( $post_type, $excluded_post_types, true ) ) {
				continue;
			}

			$default_blocks[ $post_type ] = apply_filters(
				"gutenberg_basics_default_blocks_{$post_type}",
				$this->default_blocks()
				);
		}

		return $default_blocks;
	}

	/**
	 * List of authorized headings.
	 *
	 * @return array
	 */
	public function get_headings() {
		return apply_filters( 'gutenberg_basics_headings', [ 'h2', 'h3' ] );
	}
}
