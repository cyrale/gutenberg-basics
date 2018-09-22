<?php
/**
 * Plugin Name: Gutenberg basics
 * Plugin URI:  https://github.com/cyrale/gutenberg-basics
 * Description: Modifications on Gutenberg.
 * Version:     1.0.0
 * Author:      Cyrale
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: gutenber-basics
 * Domain Path: /languages
 *
 * @package Gutenberg_Basics
 * @version 1.0.0
 *
 * Built using generator-plugin-wp (https://github.com/WebDevStudios/generator-plugin-wp)
 */

/**
 * Copyright (c) 2018 Cyrale (email : cyril@jacquesson.me)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

// Use composer autoload.
require 'vendor/autoload.php';

/**
 * Main initiation class.
 *
 * @since  1.0.0
 */
final class Gutenberg_Basics {

	/**
	 * Current version.
	 *
	 * @var    string
	 * @since  1.0.0
	 */
	const VERSION = '1.0.0';

	/**
	 * URL of plugin directory.
	 *
	 * @var    string
	 * @since  1.0.0
	 */
	protected $url = '';

	/**
	 * Path of plugin directory.
	 *
	 * @var    string
	 * @since  1.0.0
	 */
	protected $path = '';

	/**
	 * Plugin basename.
	 *
	 * @var    string
	 * @since  1.0.0
	 */
	protected $basename = '';

	/**
	 * Detailed activation error messages.
	 *
	 * @var    array
	 * @since  1.0.0
	 */
	protected $activation_errors = [];

	/**
	 * Singleton instance of plugin.
	 *
	 * @var    Gutenberg_Basics
	 * @since  1.0.0
	 */
	protected static $single_instance = null;

	/**
	 * Instance of CG_Admin
	 *
	 * @since0.0.0
	 * @var CG_Admin
	 */
	protected $admin;

	/**
	 * Instance of CG_Public
	 *
	 * @since0.0.0
	 * @var CG_Public
	 */
	protected $public;

	/**
	 * Instance of CG_Block_Settings
	 *
	 * @since0.0.0
	 * @var CG_Block_Settings
	 */
	protected $block_settings;

	/**
	 * Instance of CG_Block_Colors
	 *
	 * @since0.0.0
	 * @var CG_Block_Colors
	 */
	protected $block_colors;

	/**
	 * Creates or returns an instance of this class.
	 *
	 * @since   0.0.0
	 * @return  Gutenberg_Basics A single instance of this class.
	 */
	public static function get_instance() {
		if ( null === self::$single_instance ) {
			self::$single_instance = new self();
		}

		return self::$single_instance;
	}

	/**
	 * Sets up our plugin.
	 *
	 * @since  1.0.0
	 */
	protected function __construct() {
		$this->basename = plugin_basename( __FILE__ );
		$this->url      = plugin_dir_url( __FILE__ );
		$this->path     = plugin_dir_path( __FILE__ );

		$this->block_settings = new GB_Block_Settings( $this );

		Puc_v4_Factory::buildUpdateChecker(
			'https://github.com/cyrale/gutenberg-basics',
			__FILE__,
			'gutenberg-basics'
		);
	}

	/**
	 * Attach other plugin classes to the base plugin class.
	 *
	 * @since  1.0.0
	 */
	public function plugin_classes() {
		$this->admin  = new GB_Admin( $this );
	} // END OF PLUGIN CLASSES FUNCTION

	/**
	 * Add hooks and filters.
	 * Priority needs to be
	 * < 10 for CPT_Core,
	 * < 5 for Taxonomy_Core,
	 * and 0 for Widgets because widgets_init runs at init priority 1.
	 *
	 * @since  1.0.0
	 */
	public function hooks() {
		add_action( 'init', [ $this, 'init' ], 0 );
	}

	/**
	 * Activate the plugin.
	 *
	 * @since  1.0.0
	 */
	public function plugin_activate() {
		// Bail early if requirements aren't met.
		if ( ! $this->check_requirements() ) {
			return;
		}

		// Make sure any rewrite functionality has been loaded.
		flush_rewrite_rules();
	}

	/**
	 * Deactivate the plugin.
	 * Uninstall routines should be in uninstall.php.
	 *
	 * @since  1.0.0
	 */
	public function plugin_deactivate() {
		// Add deactivation cleanup functionality here.
	}

	/**
	 * Init hooks
	 *
	 * @since  1.0.0
	 */
	public function init() {
		// Bail early if requirements aren't met.
		if ( ! $this->check_requirements() ) {
			return;
		}

		// Load translated strings for plugin.
		load_plugin_textdomain( 'gutenberg-basics', false, dirname( $this->basename ) . '/languages/' );

		// Initialize plugin classes.
		$this->plugin_classes();
	}

	/**
	 * Check if the plugin meets requirements and
	 * disable it if they are not present.
	 *
	 * @since  1.0.0
	 *
	 * @return boolean True if requirements met, false if not.
	 */
	public function check_requirements() {
		// Bail early if plugin meets requirements.
		if ( $this->meets_requirements() ) {
			return true;
		}

		// Add a dashboard notice.
		add_action( 'all_admin_notices', [ $this, 'requirements_not_met_notice' ] );

		// Deactivate our plugin.
		add_action( 'admin_init', [ $this, 'deactivate_me' ] );

		// Didn't meet the requirements.
		return false;
	}

	/**
	 * Deactivates this plugin, hook this function on admin_init.
	 *
	 * @since  1.0.0
	 */
	public function deactivate_me() {
		// We do a check for deactivate_plugins before calling it, to protect
		// any developers from accidentally calling it too early and breaking things.
		if ( function_exists( 'deactivate_plugins' ) ) {
			deactivate_plugins( $this->basename );
		}
	}

	/**
	 * Check that all plugin requirements are met.
	 *
	 * @since  1.0.0
	 *
	 * @return boolean True if requirements are met.
	 */
	public function meets_requirements() {
		// Do checks for required classes / functions or similar.
		// Add detailed messages to $this->activation_errors array.
		return true;
	}

	/**
	 * Adds a notice to the dashboard if the plugin requirements are not met.
	 *
	 * @since  1.0.0
	 */
	public function requirements_not_met_notice() {
		// Compile default message.
		// translators: link to the list of all plugins.
		$default_message = __(
			'Gutenberg basics is missing requirements and has been <a href="%s">deactivated</a>. Please make sure all requirements are available.',
			'gutenberg-basics'
		);
		$default_message = sprintf( $default_message, admin_url( 'plugins.php' ) );

		// Default details to null.
		$details = null;

		// Add details if any exist.
		if ( $this->activation_errors && is_array( $this->activation_errors ) ) {
			$details = '<small>' . implode( '</small><br /><small>', $this->activation_errors ) . '</small>';
		}

		// Output errors.
		?>
		<div id="message" class="error">
			<p><?php echo wp_kses_post( $default_message ); ?></p>
			<?php echo wp_kses_post( $details ); ?>
		</div>
		<?php
	}

	/**
	 * Magic getter for our object.
	 *
	 * @since  1.0.0
	 *
	 * @param  string $field Field to get.
	 * @throws Exception     Throws an exception if the field is invalid.
	 * @return mixed         Value of the field.
	 */
	public function __get( $field ) {
		switch ( $field ) {
			case 'version':
				return self::VERSION;
			case 'basename':
			case 'url':
			case 'path':
			case 'admin':
			case 'block_settings':
				return $this->$field;
			default:
				throw new Exception( 'Invalid ' . __CLASS__ . ' property: ' . $field );
		}
	}
}

/**
 * Grab the Gutenberg_Basics object and return it.
 * Wrapper for Gutenberg_Basics::get_instance().
 *
 * @since  1.0.0
 * @return Gutenberg_Basics  Singleton instance of plugin class.
 */
function gutenberg_basics() {
	return Gutenberg_Basics::get_instance();
}

// Kick it off.
add_action( 'plugins_loaded', [ gutenberg_basics(), 'hooks' ] );

// Activation and deactivation.
register_activation_hook( __FILE__, [ gutenberg_basics(), 'plugin_activate' ] );
register_deactivation_hook( __FILE__, [ gutenberg_basics(), 'plugin_deactivate' ] );
