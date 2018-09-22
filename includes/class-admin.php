<?php
/**
 * Gutenberg Basics Admin.
 *
 * @since   1.0.0
 * @package Gutenberg_Basics
 */

/**
 * Gutenberg Basics Admin.
 *
 * @since 1.0.0
 */
class GB_Admin {

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
		wp_enqueue_script(
			'gutenberg-basics-admin',
			$this->plugin->url . 'dist/js/admin.js',
			[ 'wp-blocks' ],
			sha1( filemtime( $this->plugin->path . 'dist/js/admin.js' ) ),
			true
		);
		wp_localize_script(
			'gutenberg-basics-admin',
			'gutenbergBasicsSettings',
			[
				'whitelistedBlocks' => $this->plugin->block_settings->default_blocks_per_post_types(),
				'headings'          => $this->plugin->block_settings->get_headings(),
			]
		);

		wp_enqueue_style(
			'gutenberg-basics-admin',
			$this->plugin->url . 'dist/css/admin.css',
			[ 'wp-blocks' ],
			sha1( filemtime( $this->plugin->path . 'dist/css/admin.css' ) )
		);
	}
}
