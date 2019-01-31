<?php
/**
 * Gutenberg Basics Admin.
 *
 * @since   1.0.0
 * @package Gutenberg_Basics
 */

namespace Gutenberg_Basics;

/**
 * Gutenberg Basics Admin.
 *
 * @since 1.0.0
 */
class Admin {

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
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
	}

	/**
	 * Enqueue scripts and styles.
	 */
	public function enqueue_block_editor_assets() {
		$default_blocks = $this->plugin->block_settings->default_blocks_per_post_types();
		$current_screen = get_current_screen();

		if ( !empty( $current_screen )
			 && $current_screen->base === 'post'
			 && ! empty( $default_blocks[ $current_screen->post_type ] )
			 && ! in_array( 'formidable/simple-form', $default_blocks[ $current_screen->post_type ], true )
		) {
			remove_action( 'enqueue_block_editor_assets', 'FrmSimpleBlocksController::block_editor_assets' );
		}

		wp_enqueue_script(
			'gutenberg-basics',
			$this->plugin->url . 'dist/js/app.js',
			[ 'wp-blocks' ],
			sha1( filemtime( $this->plugin->path . 'dist/js/app.js' ) ),
			true
		);
		wp_localize_script(
			'gutenberg-basics',
			'gutenbergBasicsSettings',
			[
				'whitelistedBlocks' => $default_blocks,
				'headings'          => $this->plugin->block_settings->get_headings(),
			]
		);
	}
}
