<?php
/**
 * Plugin Name: WP Desktop Extensions by Ivan Arnaudov
 * Description: WP Desktop Mode extensions — widgets and more — by Ivan Arnaudov / webstage.dev. Requires WP Desktop Mode 0.5+.
 * Version:     1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author:      BVI Ltd
 * Text Domain: wpd-extensions-webstage
 */

defined( 'ABSPATH' ) || exit;

// -------------------------------------------------------------------------
// Script enqueue + per-widget data injection.
// Only runs inside the desktop shell and only for capable users.
// -------------------------------------------------------------------------
add_action( 'admin_enqueue_scripts', 'wpdext_enqueue' );

function wpdext_enqueue(): void {
    if ( ! function_exists( 'wpdm_is_enabled' ) || ! wpdm_is_enabled() ) {
        return;
    }

    // -- Plugin Stats -------------------------------------------------------
    if ( current_user_can( 'activate_plugins' ) ) {
        wp_enqueue_script(
            'wpdext-plugin-stats',
            plugin_dir_url( __FILE__ ) . 'widgets/plugin-stats.js',
            array( 'wp-desktop' ),
            '1.0.0',
            true
        );
        wp_add_inline_script(
            'wpdext-plugin-stats',
            'var wpdPluginStats = ' . wp_json_encode( wpdext_plugin_stats_data() ) . ';',
            'before'
        );
    }

    // Enqueue additional widget scripts here:
    // wp_enqueue_script( 'wpdext-site-health', plugin_dir_url( __FILE__ ) . 'widgets/site-health.js', ... );
}

// -------------------------------------------------------------------------
// Data callbacks — one per widget, called only when the widget is enqueued.
// -------------------------------------------------------------------------

function wpdext_plugin_stats_data(): array {
    if ( ! function_exists( 'get_plugins' ) ) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    $all     = get_plugins();
    $active  = (array) get_option( 'active_plugins', array() );
    $updates = get_site_transient( 'update_plugins' );
    $pending = ! empty( $updates->response ) ? count( $updates->response ) : 0;

    return array(
        'installed'  => count( $all ),
        'active'     => count( $active ),
        'updates'    => $pending,
        'manageUrl'  => admin_url( 'plugins.php' ),
        'updatesUrl' => admin_url( 'plugins.php?plugin_status=upgrade' ),
    );
}
