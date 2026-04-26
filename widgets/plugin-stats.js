/**
 * WP Desktop Mode Extensions — Plugin Stats widget.
 *
 * WidgetDef shape (from src/widgets/built-in.ts):
 *   id:          string
 *   label:       string
 *   description: string (optional)
 *   icon:        dashicons class
 *   mount(container): populates container, returns teardown fn
 *
 * wpdPluginStats is injected by PHP (wp_add_inline_script) before this runs.
 */
( () => {
    const injectStyles = () => {
        if ( document.getElementById( 'wpdext-plugin-stats-css' ) ) return;
        const s = document.createElement( 'style' );
        s.id = 'wpdext-plugin-stats-css';
        s.textContent = `
            .psw { padding: 10px 12px; display: flex; flex-direction: column; gap: 10px; }
            .psw__stats { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; }
            .psw__stat { flex: 1; text-align: center; padding: 8px 4px; border-radius: 7px;
                background: rgba(0,0,0,.07); display: flex; flex-direction: column;
                align-items: center; gap: 3px; }
            .psw__stat--alert { background: rgba(220,53,69,.13); }
            .psw__num { font-size: 22px; font-weight: 700; line-height: 1; }
            .psw__lbl { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; opacity: .65; }
            .psw__footer { display: flex; gap: 6px; flex-wrap: wrap; }
            .psw__btn { font-size: 11px; padding: 4px 9px; border-radius: 4px;
                border: 1px solid rgba(0,0,0,.15); text-decoration: none; color: inherit;
                background: rgba(255,255,255,.55); white-space: nowrap; }
            .psw__btn:hover { background: rgba(255,255,255,.85); text-decoration: none; }
            .psw__btn--warn { border-color: rgba(220,53,69,.4); background: rgba(220,53,69,.08); color: #a71d2a; }
            .psw__btn--warn:hover { background: rgba(220,53,69,.16); }
        `;
        document.head.appendChild( s );
    };

    const def = {
        id:          'plugin-stats',
        label:       'Plugin Stats',
        description: 'Installed, active, and pending-update plugin counts.',
        icon:        'dashicons-admin-plugins',

        mount( container ) {
            injectStyles();

            const { installed = 0, active = 0, updates = 0, manageUrl = '#', updatesUrl = '#' } = window.wpdPluginStats ?? {};

            const stat = ( num, lbl, alert = false ) => {
                const li = document.createElement( 'li' );
                li.className = `psw__stat${ alert ? ' psw__stat--alert' : '' }`;
                li.innerHTML = `<span class="psw__num">${ num }</span><span class="psw__lbl">${ lbl }</span>`;
                return li;
            };

            const list = document.createElement( 'ul' );
            list.className = 'psw__stats';
            list.append(
                stat( installed, 'Installed' ),
                stat( active,    'Active' ),
                stat( updates,   'Updates', updates > 0 ),
            );

            const footer = document.createElement( 'div' );
            footer.className = 'psw__footer';
            footer.innerHTML = `<a class="psw__btn" href="${ manageUrl }">Manage plugins</a>`;

            if ( updates > 0 ) {
                const label = updates === 1 ? '1 update available' : `${ updates } updates available`;
                footer.innerHTML += `<a class="psw__btn psw__btn--warn" href="${ updatesUrl }">${ label }</a>`;
            }

            const wrap = document.createElement( 'div' );
            wrap.className = 'psw';
            wrap.append( list, footer );
            container.appendChild( wrap );

            return () => { container.innerHTML = ''; };
        },
    };

    // Server-sync global — picked up by the shell's server-sync module
    // when the plugin is activated mid-session.
    window.wpDesktopWidgets ??= {};
    window.wpDesktopWidgets[ 'plugin-stats' ] = def;

    // Register immediately if the API is already up (script loaded after
    // shell init), otherwise wait for the init event.
    if ( typeof wp?.desktop?.registerWidget === 'function' ) {
        wp.desktop.registerWidget( def );
    } else {
        document.addEventListener( 'wp-desktop-init', () => wp.desktop.registerWidget( def ) );
    }
} )();
