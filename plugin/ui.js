true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
            fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
            fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (script.crossorigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}
function append(target, node) {
    target.appendChild(node);
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_empty_stylesheet(node) {
    const style_element = element('style');
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
const managed_styles = new Map();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
        rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        managed_styles.forEach(info => {
            const { ownerNode } = info.stylesheet;
            // there is no ownerNode if it runs on jsdom.
            if (ownerNode)
                detach(ownerNode);
        });
        managed_styles.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
/**
 * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
 *
 * Component events created with `createEventDispatcher` create a
 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
 * property and can contain any type of data.
 *
 * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
 */
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail, { cancelable });
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
            return !event.defaultPrevented;
        }
        return true;
    };
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
const null_transition = { duration: 0 };
function create_out_transition(node, fn, params) {
    const options = { direction: 'out' };
    let config = fn(node, params, options);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config(options);
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: 'both' };
    let config = fn(node, params, options);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = (program.b - t);
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program || pending_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config(options);
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function bind(component, name, callback, value) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        if (value === undefined) {
            callback(component.$$.ctx[index]);
        }
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

const app = '';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var jszip_minExports = {};
var jszip_min = {
  get exports(){ return jszip_minExports; },
  set exports(v){ jszip_minExports = v; },
};

/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/

(function (module, exports) {
	!function(e){module.exports=e();}(function(){return function s(a,o,h){function u(r,e){if(!o[r]){if(!a[r]){var t="function"==typeof commonjsRequire&&commonjsRequire;if(!e&&t)return t(r,!0);if(l)return l(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return u(t||e)},i,i.exports,s,a,o,h);}return o[r].exports}for(var l="function"==typeof commonjsRequire&&commonjsRequire,e=0;e<h.length;e++)u(h[e]);return u}({1:[function(e,t,r){var d=e("./utils"),c=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,h=[],u=0,l=e.length,f=l,c="string"!==d.getTypeOf(e);u<e.length;)f=l-u,n=c?(t=e[u++],r=u<l?e[u++]:0,u<l?e[u++]:0):(t=e.charCodeAt(u++),r=u<l?e.charCodeAt(u++):0,u<l?e.charCodeAt(u++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<f?(15&r)<<2|n>>6:64,o=2<f?63&n:64,h.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,h=0,u="data:";if(e.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=c.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),l[h++]=t,64!==s&&(l[h++]=r),64!==a&&(l[h++]=n);return l};},{"./support":30,"./utils":32}],2:[function(e,t,r){var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i;}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o;},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate");},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){var n=e("./utils");var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return -1^e}(0|t,e,e.length,0):function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t.charCodeAt(a))];return -1^e}(0|t,e,e.length,0):0};},{"./utils":32}],5:[function(e,t,r){r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null;},{}],6:[function(e,t,r){var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n};},{lie:37}],7:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function h(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={};}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1);},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0);},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null;},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta});};},r.compressWorker=function(e){return new h("Deflate",e)},r.uncompressWorker=function(){return new h("Inflate",{})};},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){function A(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function n(e,t,r,n,i,s){var a,o,h=e.file,u=e.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),c=I.transformTo("string",O.utf8encode(h.name)),d=h.comment,p=I.transformTo("string",s(d)),m=I.transformTo("string",O.utf8encode(d)),_=c.length!==h.name.length,g=m.length!==d.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===i?(C=798,z|=function(e,t){var r=e;return e||(r=t?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(e){return 63&(e||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+c,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(n,4)+f+b+p}}var I=e("../utils"),i=e("../stream/GenericWorker"),O=e("../utf8"),B=e("../crc32"),R=e("../signature");function s(e,t,r,n){i.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[];}I.inherits(s,i),s.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,i.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}));},s.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=n(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}});}else this.accumulate=!0;},s.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=n(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),t)this.push({data:function(e){return R.DATA_DESCRIPTOR+A(e.crc32,4)+A(e.compressedSize,4)+A(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null;},s.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,n=function(e,t,r,n,i){var s=I.transformTo("string",i(n));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(e,2)+A(e,2)+A(t,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,e,this.zipComment,this.encodeFileName);this.push({data:n,meta:{percent:100}});},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume();},s.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end();}),e.on("error",function(e){t.error(e);}),this},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(e){var t=this._sources;if(!i.prototype.error.call(this,e))return !1;for(var r=0;r<t.length;r++)try{t[r].error(e);}catch(e){}return !0},s.prototype.lock=function(){i.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock();},t.exports=s;},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){var u=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),h=0;try{e.forEach(function(e,t){h++;var r=function(e,t){var r=e||t,n=u[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o);}),o.entriesCount=h;}catch(e){o.error(e);}return o};},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e};}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.1",n.loadAsync=function(e,t){return (new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n;},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){var u=e("./utils"),i=e("./external"),n=e("./utf8"),s=e("./zipEntries"),a=e("./stream/Crc32Probe"),l=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new a);r.on("error",function(e){t(e);}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e();}).resume();})}t.exports=function(e,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:n.utf8decode}),l.isNode&&l.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",e,!0,o.optimizedBinaryString,o.base64).then(function(e){var t=new s(o);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(o.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n],s=i.fileNameStr,a=u.resolve(i.fileNameStr);h.file(a,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:o.createFolders}),i.dir||(h.file(a).unsafeOriginalName=s);}return t.zipComment.length&&(h.comment=t.zipComment),h})};},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t);}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}});}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e);}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end();});},s.prototype.pause=function(){return !!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s;},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t);}).on("error",function(e){n.emit("error",e);}).on("end",function(){n.push(null);});}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume();},t.exports=n;},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}};},{}],15:[function(e,t,r){function s(e,t,r){var n,i=u.getTypeOf(t),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=g(e)),s.createFolders&&(n=_(e))&&b.call(this,n,!0);var a="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string");var o=null;o=t instanceof c||t instanceof l?t:p.isNode&&p.isStream(t)?new m(e,t):u.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var h=new d(e,o,s);this.files[e]=h;}var i=e("./utf8"),u=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),f=e("./defaults"),c=e("./compressedObject"),d=e("./zipObject"),o=e("./generate"),p=e("./nodejsUtils"),m=e("./nodejs/NodejsStreamInputAdapter"),_=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},g=function(e){return "/"!==e.slice(-1)&&(e+="/"),e},b=function(e,t){return t=void 0!==t?t:f.createFolders,e=g(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function h(e){return "[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n);},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t);}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(h(e)){var n=e;return this.filter(function(e,t){return !t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=b.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=u.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n);}catch(e){(t=new l("error")).error(e);}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return (e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n;},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){t.exports=e("stream");},{stream:void 0}],17:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t];}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return -1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return [];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0;}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e);},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e;},skip:function(e){this.setIndex(this.index+e);},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i;},{"../utils":32}],19:[function(e,t,r){var n=e("./Uint8ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){var n=e("./ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),h=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new h(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)};},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b";},{}],24:[function(e,t,r){var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e;}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta});},t.exports=s;},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0);}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e);},t.exports=s;},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0);}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length;}i.prototype.processChunk.call(this,e);},t.exports=s;},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat();},function(e){t.error(e);});}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null;},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0));},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return !1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t);}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s;},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null;}n.prototype={push:function(e){this.emit("data",e);},end:function(){if(this.isFinished)return !1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0;}catch(e){this.emit("error",e);}return !0},error:function(e){return !this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[];},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t);},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.end();}),e.on("error",function(e){t.error(e);}),this},pause:function(){return !this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return !1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e);},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e]);},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock();},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n;},{}],29:[function(e,t,r){var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),u=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter");}catch(e){}function l(e,o){return new a.Promise(function(t,r){var n=[],i=e._internalType,s=e._outputType,a=e._mimeType;e.on("data",function(e,t){n.push(e),o&&o(t);}).on("error",function(e){n=[],r(e);}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return u.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e);}catch(e){r(e);}n=[];}).resume();})}function f(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string";}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock();}catch(e){this._worker=new s("error"),this._worker.error(e);}}f.prototype={accumulate:function(e){return l(this,e)},on:function(e,t){var r=this;return "data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta);}):this._worker.on(e,function(){h.delay(t,arguments,r);}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=f;},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else {var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size;}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size;}catch(e){r.blob=!1;}}}try{r.nodestream=!!e("readable-stream").Readable;}catch(e){r.nodestream=!1;}},{"readable-stream":16}],31:[function(e,t,s){for(var o=e("./utils"),h=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),u=new Array(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;u[254]=u[254]=1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null;}function l(){n.call(this,"utf-8 encode");}s.utf8encode=function(e){return h.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=h.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return h.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=u[n]))a[r++]=65533,t+=i-1;else {for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n);}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(h.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(h.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length);}else t=this.leftOver.concat(t);this.leftOver=null;}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}(t),i=t;n!==t.length&&(h.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta});},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null);},s.Utf8DecodeWorker=a,o.inherits(l,n),l.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta});},s.Utf8EncodeWorker=l;},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,a){var o=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),u=e("./external");function n(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),a.newBlob=function(t,r){a.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var i={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return !1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return !1}}()}};function s(e){var t=65536,r=a.getTypeOf(e),n=!0;if("uint8array"===r?n=i.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=i.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return i.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2);}return i.stringifyByChar(e)}function f(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}a.applyFromCharCode=s;var c={};c.string={string:n,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:s,array:n,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return s(new Uint8Array(e))},array:function(e){return f(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:n,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:n,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return f(e,new Uint8Array(e.length))},nodebuffer:n},a.transformTo=function(e,t){if(t=t||"",!e)return t;a.checkSupport(e);var r=a.getTypeOf(t);return c[r][e](t)},a.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var i=t[n];"."===i||""===i&&0!==n&&n!==t.length-1||(".."===i?r.pop():r.push(i));}return r.join("/")},a.getTypeOf=function(e){return "string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":o.nodebuffer&&r.isBuffer(e)?"nodebuffer":o.uint8array&&e instanceof Uint8Array?"uint8array":o.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(e){if(!o[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},a.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[]);});},a.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r;},a.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},a.prepareContent=function(r,e,n,i,s){return u.Promise.resolve(e).then(function(n){return o.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new u.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result);},e.onerror=function(e){r(e.target.error);},e.readAsArrayBuffer(n);}):n}).then(function(e){var t=a.getTypeOf(e);return t?("arraybuffer"===t?e=a.transformTo("uint8array",e):"string"===t&&(s?e=h.decode(e):n&&!0!==i&&(e=function(e){return l(e,o.uint8array?new Uint8Array(e.length):new Array(e.length))}(e))),e):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})};},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=e("./support");function h(e){this.files=[],this.loadOptions=e;}h.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r);},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r};},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes();},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw !this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral();}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e);},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles();}},t.exports=h;},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),h=e("./compressions"),u=e("./support");function l(e,t){this.options=e,this.loadOptions=t;}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in h)if(Object.prototype.hasOwnProperty.call(h,t)&&h[t].magic===e)return h[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize));},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength);},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0);},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4));}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i);},handleUTF8:function(){var e=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else {var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else {var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r);}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else {var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i);}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=l;},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions};}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),h=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker));}catch(e){(t=new h("error")).error(e);}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new i(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)n.prototype[u[f]]=l;t.exports=n;},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,l,t){(function(t){var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(u),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2;};}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){u(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null;},t.document.documentElement.appendChild(e);}:function(){setTimeout(u,0);};else {var o=new t.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0);};}var h=[];function u(){var e,t;n=!0;for(var r=h.length;r;){for(t=h,h=[],e=-1;++e<r;)t[e]();r=h.length;}n=!1;}l.exports=function(e){1!==h.push(e)||n||r();};}).call(this,"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],37:[function(e,t,r){var i=e("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==u&&d(this,e);}function h(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected);}function f(t,r,n){i(function(){var e;try{e=r(n);}catch(e){return l.reject(t,e)}e===t?l.reject(t,new TypeError("Cannot resolve promise with itself")):l.resolve(t,e);});}function c(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments);}}function d(t,e){var r=!1;function n(e){r||(r=!0,l.reject(t,e));}function i(e){r||(r=!0,l.resolve(t,e));}var s=p(function(){e(i,n);});"error"===s.status&&n(s.value);}function p(e,t){var r={};try{r.value=e(t),r.status="success";}catch(e){r.status="error",r.value=e;}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(u);this.state!==n?f(r,this.state===a?e:t,this.outcome):this.queue.push(new h(r,e,t));return r},h.prototype.callFulfilled=function(e){l.resolve(this.promise,e);},h.prototype.otherCallFulfilled=function(e){f(this.promise,this.onFulfilled,e);},h.prototype.callRejected=function(e){l.reject(this.promise,e);},h.prototype.otherCallRejected=function(e){f(this.promise,this.onRejected,e);},l.resolve=function(e,t){var r=p(c,t);if("error"===r.status)return l.reject(e,r.value);var n=r.value;if(n)d(e,n);else {e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t);}return e},l.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){if(e instanceof this)return e;return l.resolve(new this(u),e)},o.reject=function(e){var t=new this(u);return l.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);var s=new Array(n),a=0,t=-1,o=new this(u);for(;++t<n;)h(e[t],t);return o;function h(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,l.resolve(o,s));},function(e){i||(i=!0,l.reject(o,e));});}},o.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);var i=-1,s=new this(u);for(;++i<r;)a=e[i],t.resolve(a).then(function(e){n||(n=!0,l.resolve(s,e));},function(e){n||(n=!0,l.reject(s,e));});var a;return s};},{immediate:36}],38:[function(e,t,r){var n={};(0, e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n;},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){var a=e("./zlib/deflate"),o=e("./utils/common"),h=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,c=0,d=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:f,method:d,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==l)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?h.string2buf(t.dictionary):"[object ArrayBuffer]"===u.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==l)throw new Error(i[r]);this._dict_set=!0;}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return !1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=h.string2buf(e):"[object ArrayBuffer]"===u.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)));}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==n||(this.onEnd(l),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e);},p.prototype.onEnd=function(e){e===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return (t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return (t=t||{}).gzip=!0,n(e,t)};},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){var c=e("./zlib/inflate"),d=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=c.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,c.inflateGetHeader(this.strm,this.header);}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return !1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?h.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new d.Buf8(u),h.next_out=0,h.avail_out=u),(r=c.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=c.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(h.output,h.next_out),s=h.next_out-i,a=p.buf2string(h.output,i),h.next_out=s,h.avail_out=u-s,s&&d.arraySet(h.output,h.output,i,s,0),this.onData(a)):this.onData(d.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0);}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=c.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e);},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return (t=t||{}).raw=!0,o(e,t)},r.ungzip=o;},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n]);}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){return [].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s));},r.setTyped(n);},{}],42:[function(e,t,r){var h=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0]);}catch(e){i=!1;}try{String.fromCharCode.apply(null,new Uint8Array(1));}catch(e){s=!1;}for(var u=new h.Buf8(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function l(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,h.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}u[254]=u[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new h.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return l(e,e.length)},r.binstring2buf=function(e){for(var t=new h.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=u[i]))o[n++]=65533,r+=s-1;else {for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i);}return l(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t};},{"./common":41}],43:[function(e,t,r){t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521;}return i|s<<16|0};},{}],44:[function(e,t,r){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};},{}],45:[function(e,t,r){var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return -1^e};},{}],46:[function(e,t,r){var h,c=e("../utils/common"),u=e("./trees"),d=e("./adler32"),p=e("./crc32"),n=e("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,i=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(e,t){return e.msg=n[t],t}function T(e){return (e<<1)-(4<e?9:0)}function D(e){for(var t=e.length;0<=--t;)e[t]=0;}function F(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(c.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0));}function N(e,t){u._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm);}function U(e,t){e.pending_buf[e.pending++]=t;}function P(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t;}function L(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,h=e.strstart>e.w_size-z?e.strstart-(e.w_size-z):0,u=e.window,l=e.w_mask,f=e.prev,c=e.strstart+S,d=u[s+a-1],p=u[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(u[(r=t)+a]===p&&u[r+a-1]===d&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<c);if(n=S-(c-s),s=c-S,a<n){if(e.match_start=t,o<=(a=n))break;d=u[s+a-1],p=u[s+a];}}}while((t=f[t&l])>h&&0!=--i);return a<=e.lookahead?a:e.lookahead}function j(e){var t,r,n,i,s,a,o,h,u,l,f=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-z)){for(c.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);i+=f;}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,h=e.strstart+e.lookahead,u=i,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,c.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=d(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),e.lookahead+=r,e.lookahead+e.insert>=x)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+x-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<x)););}while(e.lookahead<z&&0!==e.strm.avail_in)}function Z(e,t){for(var r,n;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r)),e.match_length>=x)if(n=u._tr_tally(e,e.strstart-e.match_start,e.match_length-x),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=x){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++;}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function W(e,t){for(var r,n,i;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=x-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===x&&4096<e.strstart-e.match_start)&&(e.match_length=x-1)),e.prev_length>=x&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-x,n=u._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-x),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=x-1,e.strstart++,n&&(N(e,!1),0===e.strm.avail_out))return A}else if(e.match_available){if((n=u._tr_tally(e,0,e.window[e.strstart-1]))&&N(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return A}else e.match_available=1,e.strstart++,e.lookahead--;}return e.match_available&&(n=u._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function M(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i;}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new c.Buf16(2*w),this.dyn_dtree=new c.Buf16(2*(2*a+1)),this.bl_tree=new c.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new c.Buf16(k+1),this.heap=new c.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new c.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0;}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?C:E,e.adler=2===t.wrap?0:1,t.last_flush=l,u._tr_init(t),m):R(e,_)}function K(e){var t=G(e);return t===m&&function(e){e.window_size=2*e.w_size,D(e.head),e.max_lazy_match=h[e.level].max_lazy,e.good_match=h[e.level].good_length,e.nice_match=h[e.level].nice_length,e.max_chain_length=h[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0;}(e.state),t}function Y(e,t,r,n,i,s){if(!e)return _;var a=1;if(t===g&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||y<i||r!==v||n<8||15<n||t<0||9<t||s<0||b<s)return R(e,_);8===n&&(n=9);var o=new H;return (e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new c.Buf8(2*o.w_size),o.head=new c.Buf16(o.hash_size),o.prev=new c.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new c.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,K(e)}h=[new M(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(j(e),0===e.lookahead&&t===l)return A;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,N(e,!1),0===e.strm.avail_out))return A;if(e.strstart-e.block_start>=e.w_size-z&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):(e.strstart>e.block_start&&(N(e,!1),e.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(e,t){return Y(e,t,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?_:(e.state.gzhead=t,m):_},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?R(e,_):_;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&t!==f)return R(e,0===e.avail_out?-5:_);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===C)if(2===n.wrap)e.adler=0,U(n,31),U(n,139),U(n,8),n.gzhead?(U(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),U(n,255&n.gzhead.time),U(n,n.gzhead.time>>8&255),U(n,n.gzhead.time>>16&255),U(n,n.gzhead.time>>24&255),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(U(n,255&n.gzhead.extra.length),U(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(U(n,0),U(n,0),U(n,0),U(n,0),U(n,0),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,3),n.status=E);else {var a=v+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=E,P(n,a),0!==n.strstart&&(P(n,e.adler>>>16),P(n,65535&e.adler)),e.adler=1;}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending!==n.pending_buf_size));)U(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73);}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,U(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91);}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,U(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103);}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&F(e),n.pending+2<=n.pending_buf_size&&(U(n,255&e.adler),U(n,e.adler>>8&255),e.adler=0,n.status=E)):n.status=E),0!==n.pending){if(F(e),0===e.avail_out)return n.last_flush=-1,m}else if(0===e.avail_in&&T(t)<=T(r)&&t!==f)return R(e,-5);if(666===n.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==l&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(j(e),0===e.lookahead)){if(t===l)return A;break}if(e.match_length=0,r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=S){if(j(e),e.lookahead<=S&&t===l)return A;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=x&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+S;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=S-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead);}if(e.match_length>=x?(r=u._tr_tally(e,1,e.match_length-x),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):h[n.level].func(n,t);if(o!==O&&o!==B||(n.status=666),o===A||o===O)return 0===e.avail_out&&(n.last_flush=-1),m;if(o===I&&(1===t?u._tr_align(n):5!==t&&(u._tr_stored_block(n,0,0,!1),3===t&&(D(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),F(e),0===e.avail_out))return n.last_flush=-1,m}return t!==f?m:n.wrap<=0?1:(2===n.wrap?(U(n,255&e.adler),U(n,e.adler>>8&255),U(n,e.adler>>16&255),U(n,e.adler>>24&255),U(n,255&e.total_in),U(n,e.total_in>>8&255),U(n,e.total_in>>16&255),U(n,e.total_in>>24&255)):(P(n,e.adler>>>16),P(n,65535&e.adler)),F(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?m:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==C&&69!==t&&73!==t&&91!==t&&103!==t&&t!==E&&666!==t?R(e,_):(e.state=null,t===E?R(e,-3):m):_},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,h,u,l=t.length;if(!e||!e.state)return _;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(e.adler=d(e.adler,t,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new c.Buf8(r.w_size),c.arraySet(u,t,l-r.w_size,r.w_size,0),t=u,l=r.w_size),a=e.avail_in,o=e.next_in,h=e.input,e.avail_in=l,e.next_in=0,e.input=t,j(r);r.lookahead>=x;){for(n=r.strstart,i=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+x-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=x-1,j(r);}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,e.next_in=o,e.input=h,e.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1;};},{}],48:[function(e,t,r){t.exports=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,c=r.window,d=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;e:do{p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=m[d&g];t:for(;;){if(d>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else {if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(d&(1<<y)-1)];continue t}if(32&y){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}w=65535&v,(y&=15)&&(p<y&&(d+=z[n++]<<p,p+=8),w+=d&(1<<y)-1,d>>>=y,p-=y),p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=_[d&b];r:for(;;){if(d>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(d&(1<<y)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&v,p<(y&=15)&&(d+=z[n++]<<p,(p+=8)<y&&(d+=z[n++]<<p,p+=8)),h<(k+=d&(1<<y)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(d>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=c,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C;}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=c[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=c[x++],--y;);x=s-k,S=C;}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C;}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]));}else {for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]));}break}}break}}while(n<i&&s<o);n-=w=p>>3,d&=(1<<(p-=w<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=d,r.bits=p;};},{}],49:[function(e,t,r){var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return (e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0;}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function h(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function u(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=h(e,t))!==N&&(e.state=null),r):U}var l,f,c=!0;function j(e){if(c){var t;for(l=new I.Buf32(512),f=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,l,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,f,0,e.work,{bits:5}),c=!1;}e.lencode=l,e.lenbits=9,e.distcode=f,e.distbits=5;}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(e){return u(e,15)},r.inflateInit2=u,r.inflate=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,f=o,c=h,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0;}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(d=r.length)&&(d=o),d&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,d,k)),512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,r.length-=d),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}l=u=0;}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}e.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;u>>>=2,l-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30;}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(d=r.length){if(o<d&&(d=o),h<d&&(d=h),0===d)break e;I.arraySet(i,n,s,d,a),o-=d,s+=d,h-=d,a+=d,r.length-=d;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3;}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else {if(16===b){for(z=_+2;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u>>>=_,l-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],d=3+(3&u),u>>>=2,l-=2;}else if(17===b){for(z=_+3;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}l-=_,k=0,d=3+(7&(u>>>=_)),u>>>=3,l-=3;}else {for(z=_+7;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}l-=_,k=0,d=11+(127&(u>>>=_)),u>>>=7,l-=7;}if(r.have+d>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;d--;)r.lens[r.have++]=k;}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=h){e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,R(e,c),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}u>>>=v,l-=v,r.back+=v;}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra;}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}u>>>=v,l-=v,r.back+=v;}if(u>>>=_,l-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra;}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break e;if(d=c-h,r.offset>d){if((d=r.offset-d)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=d>r.wnext?(d-=r.wnext,r.wsize-d):r.wnext-d,d>r.length&&(d=r.length),m=r.window;}else m=i,p=a-r.offset,d=r.length;for(h<d&&(d=h),h-=d,r.length-=d;i[a++]=m[p++],--d;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break e;i[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break e;o--,u|=n[s++]<<l,l+=8;}if(c-=h,e.total_out+=c,r.total+=c,c&&(e.adler=r.check=r.flags?B(r.check,i,c,a-c):O(r.check,i,c,a-c)),c=h,(r.flags?u:L(u))!==r.check){e.msg="incorrect data check",r.mode=30;break}l=u=0;}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8;}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}l=u=0;}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return -4;case 32:default:return U}return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,(r.wsize||c!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,c-e.avail_out)?(r.mode=31,-4):(f-=e.avail_in,c-=e.avail_out,e.total_in+=f,e.total_out+=c,r.total+=c,r.wrap&&c&&(e.adler=r.check=r.flags?B(r.check,i,c,e.next_out-c):O(r.check,i,c,e.next_out-c)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===c||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var h,u,l,f,c,d,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<n;v++)O[t[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return -1;if(0<z&&(0===e||1!==w))return -1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<n;v++)0!==t[r+v]&&(a[B[t[r+v]]++]=v);if(d=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,c=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<d?(m=0,a[v]):a[v]>d?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;i[c+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=t[r+a[v]];}if(k<b&&(E&f)!==l){for(0===S&&(S=k),c+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[l=E&f]=k<<24|x<<16|c-s|0;}}return 0!==E&&(i[c+E]=b-S<<24|64<<16|0),o.bits=k,0};},{"../utils/common":41}],51:[function(e,t,r){t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};},{}],52:[function(e,t,r){var i=e("../utils/common"),o=0,h=1;function n(e){for(var t=e.length;0<=--t;)e[t]=0;}var s=0,a=29,u=256,l=u+1+a,f=30,c=19,_=2*l+1,g=15,d=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));n(z);var C=new Array(2*f);n(C);var E=new Array(512);n(E);var A=new Array(256);n(A);var I=new Array(a);n(I);var O,B,R,T=new Array(f);function D(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length;}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t;}function N(e){return e<256?E[e]:E[256+(e>>>7)]}function U(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255;}function P(e,t,r){e.bi_valid>d-r?(e.bi_buf|=t<<e.bi_valid&65535,U(e,e.bi_buf),e.bi_buf=t>>d-e.bi_valid,e.bi_valid+=r-d):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r);}function L(e,t,r){P(e,r[2*t],r[2*t+1]);}function j(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function Z(e,t,r){var n,i,s=new Array(g+1),a=0;for(n=1;n<=g;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=j(s[o]++,o));}}function W(e){var t;for(t=0;t<l;t++)e.dyn_ltree[2*t]=0;for(t=0;t<f;t++)e.dyn_dtree[2*t]=0;for(t=0;t<c;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*m]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0;}function M(e){8<e.bi_valid?U(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0;}function H(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&H(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!H(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n;}function K(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?L(e,i,t):(L(e,(s=A[i])+u+1,t),0!==(a=w[s])&&P(e,i-=I[s],a),L(e,s=N(--n),r),0!==(a=k[s])&&P(e,n-=T[s],a)),o<e.last_lit;);L(e,m,t);}function Y(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,h=t.stat_desc.elems,u=-1;for(e.heap_len=0,e.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(e.heap[++e.heap_len]=u=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=u<2?++u:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=u,r=e.heap_len>>1;1<=r;r--)G(e,s,r);for(i=h;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,G(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,h=t.dyn_tree,u=t.max_code,l=t.stat_desc.static_tree,f=t.stat_desc.has_stree,c=t.stat_desc.extra_bits,d=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=g;s++)e.bl_count[s]=0;for(h[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<_;r++)p<(s=h[2*h[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),h[2*n+1]=s,u<n||(e.bl_count[s]++,a=0,d<=n&&(a=c[n-d]),o=h[2*n],e.opt_len+=o*(s+a),f&&(e.static_len+=o*(l[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2;}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)u<(i=e.heap[--r])||(h[2*i+1]!==s&&(e.opt_len+=(s-h[2*i+1])*h[2*i],h[2*i+1]=s),n--);}}(e,t),Z(s,u,e.bl_count);}function X(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<h&&i===a||(o<u?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[2*b]++):o<=10?e.bl_tree[2*v]++:e.bl_tree[2*y]++,s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4));}function V(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<h&&i===a)){if(o<u)for(;L(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(L(e,i,e.bl_tree),o--),L(e,b,e.bl_tree),P(e,o-3,2)):o<=10?(L(e,v,e.bl_tree),P(e,o-3,3)):(L(e,y,e.bl_tree),P(e,o-11,7));s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4);}}n(T);var q=!1;function J(e,t,r,n){P(e,(s<<1)+(n?1:0),3),function(e,t,r,n){M(e),n&&(U(e,r),U(e,~r)),i.arraySet(e.pending_buf,e.window,t,r,e.pending),e.pending+=r;}(e,t,r,!0);}r._tr_init=function(e){q||(function(){var e,t,r,n,i,s=new Array(g+1);for(n=r=0;n<a-1;n++)for(I[n]=r,e=0;e<1<<w[n];e++)A[r++]=n;for(A[r-1]=n,n=i=0;n<16;n++)for(T[n]=i,e=0;e<1<<k[n];e++)E[i++]=n;for(i>>=7;n<f;n++)for(T[n]=i<<7,e=0;e<1<<k[n]-7;e++)E[256+i++]=n;for(t=0;t<=g;t++)s[t]=0;for(e=0;e<=143;)z[2*e+1]=8,e++,s[8]++;for(;e<=255;)z[2*e+1]=9,e++,s[9]++;for(;e<=279;)z[2*e+1]=7,e++,s[7]++;for(;e<=287;)z[2*e+1]=8,e++,s[8]++;for(Z(z,l+1,s),e=0;e<f;e++)C[2*e+1]=5,C[2*e]=j(e,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,c,p);}(),q=!0),e.l_desc=new F(e.dyn_ltree,O),e.d_desc=new F(e.dyn_dtree,B),e.bl_desc=new F(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,W(e);},r._tr_stored_block=J,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return o;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return h;for(t=32;t<u;t++)if(0!==e.dyn_ltree[2*t])return h;return o}(e)),Y(e,e.l_desc),Y(e,e.d_desc),a=function(e){var t;for(X(e,e.dyn_ltree,e.l_desc.max_code),X(e,e.dyn_dtree,e.d_desc.max_code),Y(e,e.bl_desc),t=c-1;3<=t&&0===e.bl_tree[2*S[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?J(e,t,r,n):4===e.strategy||s===i?(P(e,2+(n?1:0),3),K(e,z,C)):(P(e,4+(n?1:0),3),function(e,t,r,n){var i;for(P(e,t-257,5),P(e,r-1,5),P(e,n-4,4),i=0;i<n;i++)P(e,e.bl_tree[2*S[i]+1],3);V(e,e.dyn_ltree,t-1),V(e,e.dyn_dtree,r-1);}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),K(e,e.dyn_ltree,e.dyn_dtree)),W(e),n&&M(e);},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(A[r]+u+1)]++,e.dyn_dtree[2*N(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){P(e,2,3),L(e,m,z),function(e){16===e.bi_valid?(U(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8);}(e);};},{"../utils/common":41}],53:[function(e,t,r){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0;};},{}],54:[function(e,t,r){(function(e){!function(r,n){if(!r.setImmediate){var i,s,t,a,o=1,h={},u=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,i="[object process]"==={}.toString.call(r.process)?function(e){process.nextTick(function(){c(e);});}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1;},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*");}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){c(e.data);},function(e){t.port2.postMessage(e);}):l&&"onreadystatechange"in l.createElement("script")?(s=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){c(e),t.onreadystatechange=null,s.removeChild(t),t=null;},s.appendChild(t);}):function(e){setTimeout(c,0,e);},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var n={callback:e,args:t};return h[o]=n,i(o),o++},e.clearImmediate=f;}function f(e){delete h[e];}function c(e){if(u)setTimeout(c,0,e);else {var t=h[e];if(t){u=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r);}}(t);}finally{f(e),u=!1;}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&c(+e.data.slice(a.length));}}("undefined"==typeof self?void 0===e?this:e:self);}).call(this,"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}]},{},[10])(10)});
} (jszip_min));

const JSZip = jszip_minExports;

const HoverIcon_svelte_svelte_type_style_lang = '';

/* src/ui/components/Inputs/HoverIcon.svelte generated by Svelte v3.55.0 */

function create_fragment$j(ctx) {
	let div;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	return {
		c() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr(div, "class", "flex items-center justify-center py-4 px-[11px] cursor-pointer h-4 transition-all rounded-full svelte-2r33ho");
			toggle_class(div, "aspect-square", !/*text*/ ctx[0]);
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;

			if (!mounted) {
				dispose = listen(div, "click", /*onClick*/ ctx[1]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*text*/ 1) {
				toggle_class(div, "aspect-square", !/*text*/ ctx[0]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$h($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { text = false } = $$props;
	const dispatch = createEventDispatcher();

	const onClick = () => {
		dispatch("onClick");
	};

	$$self.$$set = $$props => {
		if ('text' in $$props) $$invalidate(0, text = $$props.text);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [text, onClick, $$scope, slots];
}

class HoverIcon extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$h, create_fragment$j, safe_not_equal, { text: 0 });
	}
}

const Panel_svelte_svelte_type_style_lang = '';

/* src/ui/components/Layout/Panel.svelte generated by Svelte v3.55.0 */
const get_button_slot_changes = dirty => ({});
const get_button_slot_context = ctx => ({});

// (20:3) {:else}
function create_else_block$2(ctx) {
	let hovericon;
	let current;

	hovericon = new HoverIcon({
			props: {
				$$slots: { default: [create_default_slot_1$3] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			create_component(hovericon.$$.fragment);
		},
		m(target, anchor) {
			mount_component(hovericon, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(hovericon.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hovericon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(hovericon, detaching);
		}
	};
}

// (16:3) {#if expanded}
function create_if_block_1$4(ctx) {
	let hovericon;
	let current;

	hovericon = new HoverIcon({
			props: {
				$$slots: { default: [create_default_slot$4] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			create_component(hovericon.$$.fragment);
		},
		m(target, anchor) {
			mount_component(hovericon, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(hovericon.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hovericon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(hovericon, detaching);
		}
	};
}

// (21:4) <HoverIcon>
function create_default_slot_1$3(ctx) {
	let i;

	return {
		c() {
			i = element("i");
			attr(i, "class", "fa-sharp fa-solid fa-caret-right");
		},
		m(target, anchor) {
			insert(target, i, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(i);
		}
	};
}

// (17:4) <HoverIcon>
function create_default_slot$4(ctx) {
	let i;

	return {
		c() {
			i = element("i");
			attr(i, "class", "fa-sharp fa-solid fa-caret-down");
		},
		m(target, anchor) {
			insert(target, i, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(i);
		}
	};
}

// (30:1) {#if expanded}
function create_if_block$b(ctx) {
	let div;
	let current;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

	return {
		c() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr(div, "class", "mt-4");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function create_fragment$i(ctx) {
	let div2;
	let div1;
	let div0;
	let current_block_type_index;
	let if_block0;
	let t0;
	let h3;
	let t1;
	let t2;
	let t3;
	let current;
	let mounted;
	let dispose;
	const if_block_creators = [create_if_block_1$4, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*expanded*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	const button_slot_template = /*#slots*/ ctx[4].button;
	const button_slot = create_slot(button_slot_template, ctx, /*$$scope*/ ctx[5], get_button_slot_context);
	let if_block1 = /*expanded*/ ctx[0] && create_if_block$b(ctx);

	return {
		c() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			if_block0.c();
			t0 = space();
			h3 = element("h3");
			t1 = text(/*title*/ ctx[2]);
			t2 = space();
			if (button_slot) button_slot.c();
			t3 = space();
			if (if_block1) if_block1.c();
			attr(h3, "class", "text-base font-bold");
			attr(div0, "class", "flex items-center gap-4");
			attr(div1, "class", "flex items-center justify-between transition-all cursor-pointer hover:opacity-80");
			attr(div2, "class", "w-full p-4 svelte-1cl0f7l");
			toggle_class(div2, "panel", /*border*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div1);
			append(div1, div0);
			if_blocks[current_block_type_index].m(div0, null);
			append(div0, t0);
			append(div0, h3);
			append(h3, t1);
			append(div1, t2);

			if (button_slot) {
				button_slot.m(div1, null);
			}

			append(div2, t3);
			if (if_block1) if_block1.m(div2, null);
			current = true;

			if (!mounted) {
				dispose = listen(div0, "click", /*toggleExpanded*/ ctx[3]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index !== previous_block_index) {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block0 = if_blocks[current_block_type_index];

				if (!if_block0) {
					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block0.c();
				}

				transition_in(if_block0, 1);
				if_block0.m(div0, t0);
			}

			if (!current || dirty & /*title*/ 4) set_data(t1, /*title*/ ctx[2]);

			if (button_slot) {
				if (button_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						button_slot,
						button_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(button_slot_template, /*$$scope*/ ctx[5], dirty, get_button_slot_changes),
						get_button_slot_context
					);
				}
			}

			if (/*expanded*/ ctx[0]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*expanded*/ 1) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block$b(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div2, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*border*/ 2) {
				toggle_class(div2, "panel", /*border*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(button_slot, local);
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(button_slot, local);
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			if_blocks[current_block_type_index].d();
			if (button_slot) button_slot.d(detaching);
			if (if_block1) if_block1.d();
			mounted = false;
			dispose();
		}
	};
}

function instance$g($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	const dispatch = createEventDispatcher();
	let { border = true } = $$props;
	let { expanded = false } = $$props;
	let { title } = $$props;

	const toggleExpanded = () => {
		$$invalidate(0, expanded = !expanded);
		dispatch('changeView');
	};

	$$self.$$set = $$props => {
		if ('border' in $$props) $$invalidate(1, border = $$props.border);
		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
		if ('title' in $$props) $$invalidate(2, title = $$props.title);
		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
	};

	return [expanded, border, title, toggleExpanded, slots, $$scope];
}

class Panel extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$g, create_fragment$i, safe_not_equal, { border: 1, expanded: 0, title: 2 });
	}
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
        delay,
        duration,
        easing,
        css: t => `opacity: ${t * o}`
    };
}
function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const padding_top = parseFloat(style.paddingTop);
    const padding_bottom = parseFloat(style.paddingBottom);
    const margin_top = parseFloat(style.marginTop);
    const margin_bottom = parseFloat(style.marginBottom);
    const border_top_width = parseFloat(style.borderTopWidth);
    const border_bottom_width = parseFloat(style.borderBottomWidth);
    return {
        delay,
        duration,
        easing,
        css: t => 'overflow: hidden;' +
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            `height: ${t * height}px;` +
            `padding-top: ${t * padding_top}px;` +
            `padding-bottom: ${t * padding_bottom}px;` +
            `margin-top: ${t * margin_top}px;` +
            `margin-bottom: ${t * margin_bottom}px;` +
            `border-top-width: ${t * border_top_width}px;` +
            `border-bottom-width: ${t * border_bottom_width}px;`
    };
}

const global$1 = '';

const index_svelte_svelte_type_style_lang$g = '';

const index_svelte_svelte_type_style_lang$f = '';

const index_svelte_svelte_type_style_lang$e = '';

const index_svelte_svelte_type_style_lang$d = '';

const index_svelte_svelte_type_style_lang$c = '';

const index_svelte_svelte_type_style_lang$b = '';

const index_svelte_svelte_type_style_lang$a = '';

const index_svelte_svelte_type_style_lang$9 = '';

const index_svelte_svelte_type_style_lang$8 = '';

const index_svelte_svelte_type_style_lang$7 = '';

const index_svelte_svelte_type_style_lang$6 = '';

const index_svelte_svelte_type_style_lang$5 = '';

const index_svelte_svelte_type_style_lang$4 = '';

/* node_modules/svelte-click-outside/src/index.svelte generated by Svelte v3.55.0 */

function create_fragment$h(ctx) {
	let t;
	let div;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	return {
		c() {
			t = space();
			div = element("div");
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			insert(target, t, anchor);
			insert(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			/*div_binding*/ ctx[5](div);
			current = true;

			if (!mounted) {
				dispose = listen(document.body, "click", /*onClickOutside*/ ctx[1]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
						null
					);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(t);
			if (detaching) detach(div);
			if (default_slot) default_slot.d(detaching);
			/*div_binding*/ ctx[5](null);
			mounted = false;
			dispose();
		}
	};
}

function instance$f($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { exclude = [] } = $$props;
	let child;
	const dispatch = createEventDispatcher();

	function isExcluded(target) {
		var parent = target;

		while (parent) {
			if (exclude.indexOf(parent) >= 0 || parent === child) {
				return true;
			}

			parent = parent.parentNode;
		}

		return false;
	}

	function onClickOutside(event) {
		if (!isExcluded(event.target)) {
			dispatch('clickoutside');
		}
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			child = $$value;
			$$invalidate(0, child);
		});
	}

	$$self.$$set = $$props => {
		if ('exclude' in $$props) $$invalidate(2, exclude = $$props.exclude);
		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [child, onClickOutside, exclude, $$scope, slots, div_binding];
}

class Src extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$f, create_fragment$h, safe_not_equal, { exclude: 2 });
	}
}

const index_svelte_svelte_type_style_lang$3 = '';

const index_svelte_svelte_type_style_lang$2 = '';

const index_svelte_svelte_type_style_lang$1 = '';

const index_svelte_svelte_type_style_lang = '';

const ErrorMessage_svelte_svelte_type_style_lang = '';

/* src/ui/components/ErrorMessage.svelte generated by Svelte v3.55.0 */

function create_fragment$g(ctx) {
	let div;
	let i;
	let t0;
	let t1;
	let div_transition;
	let current;

	return {
		c() {
			div = element("div");
			i = element("i");
			t0 = space();
			t1 = text(/*errorMessage*/ ctx[0]);
			attr(i, "class", "fa-sharp fa-solid fa-triangle-exclamation");
			attr(div, "class", "error-message flex items-center gap-2 svelte-1dwpkya");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, i);
			append(div, t0);
			append(div, t1);
			current = true;
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*errorMessage*/ 1) set_data(t1, /*errorMessage*/ ctx[0]);
		},
		i(local) {
			if (current) return;

			add_render_callback(() => {
				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
				div_transition.run(1);
			});

			current = true;
		},
		o(local) {
			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
			div_transition.run(0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (detaching && div_transition) div_transition.end();
		}
	};
}

function instance$e($$self, $$props, $$invalidate) {
	let { errorMessage } = $$props;

	$$self.$$set = $$props => {
		if ('errorMessage' in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
	};

	return [errorMessage];
}

class ErrorMessage extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$e, create_fragment$g, safe_not_equal, { errorMessage: 0 });
	}
}

const Menu_svelte_svelte_type_style_lang = '';

/* src/ui/components/Menu.svelte generated by Svelte v3.55.0 */

function create_fragment$f(ctx) {
	let div2;
	let div2_transition;
	let current;

	return {
		c() {
			div2 = element("div");

			div2.innerHTML = `<a href="https://github.com/the-dataface/figma2html" target="_blank"><div class="menu-row svelte-6sazum"><i class="mr-2 text-xs fa-sharp fa-solid fa-location-question"></i>
      About</div></a> 
  <a href="https://github.com/the-dataface/figma2html/issues" target="_blank"><div class="menu-row svelte-6sazum"><i class="mr-2 text-xs fa-sharp fa-solid fa-triangle-exclamation"></i>
      Report Issue</div></a>`;

			attr(div2, "class", "menu-pane svelte-6sazum");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;

			add_render_callback(() => {
				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, {}, true);
				div2_transition.run(1);
			});

			current = true;
		},
		o(local) {
			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, {}, false);
			div2_transition.run(0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			if (detaching && div2_transition) div2_transition.end();
		}
	};
}

class Menu extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$f, safe_not_equal, {});
	}
}

const Footer_svelte_svelte_type_style_lang = '';

/* src/ui/components/Footer.svelte generated by Svelte v3.55.0 */

function create_default_slot_2$2(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");

			button.innerHTML = `<i class="mr-2 fa-sharp fa-solid fa-rotate"></i> 
        <p class="m-0 svelte-10vufbj">Reset to defaults</p>`;

			attr(button, "class", "secondary svelte-10vufbj");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*onReset*/ ctx[6]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (32:4) <HoverIcon text={true} on:click={onSave}>
function create_default_slot_1$2(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");

			button.innerHTML = `<i class="mr-2 fa-sharp fa-solid fa-floppy-disk"></i> 
        <p class="m-0 svelte-10vufbj">Save settings</p>`;

			attr(button, "class", "secondary svelte-10vufbj");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*onSave*/ ctx[4]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (39:4) <HoverIcon text={true} on:click={onLoad}>
function create_default_slot$3(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");

			button.innerHTML = `<i class="mr-2 fa-sharp fa-solid fa-file-import"></i> 
        <p class="m-0 svelte-10vufbj">Load settings</p>`;

			attr(button, "class", "secondary svelte-10vufbj");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*onLoad*/ ctx[5]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (51:0) {#if menuOpen}
function create_if_block$a(ctx) {
	let menu;
	let current;
	menu = new Menu({});

	return {
		c() {
			create_component(menu.$$.fragment);
		},
		m(target, anchor) {
			mount_component(menu, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(menu.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(menu.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(menu, detaching);
		}
	};
}

function create_fragment$e(ctx) {
	let div1;
	let div0;
	let button0;
	let t0;
	let t1_value = (/*nodeCount*/ ctx[0] > 0 ? /*nodeCount*/ ctx[0] + 1 : 0) + "";
	let t1;
	let t2;
	let button0_disabled_value;
	let t3;
	let hovericon0;
	let t4;
	let hovericon1;
	let t5;
	let hovericon2;
	let t6;
	let button1;
	let t7;
	let if_block_anchor;
	let current;
	let mounted;
	let dispose;

	hovericon0 = new HoverIcon({
			props: {
				text: true,
				$$slots: { default: [create_default_slot_2$2] },
				$$scope: { ctx }
			}
		});

	hovericon0.$on("click", /*onReset*/ ctx[6]);

	hovericon1 = new HoverIcon({
			props: {
				text: true,
				$$slots: { default: [create_default_slot_1$2] },
				$$scope: { ctx }
			}
		});

	hovericon1.$on("click", /*onSave*/ ctx[4]);

	hovericon2 = new HoverIcon({
			props: {
				text: true,
				$$slots: { default: [create_default_slot$3] },
				$$scope: { ctx }
			}
		});

	hovericon2.$on("click", /*onLoad*/ ctx[5]);
	let if_block = /*menuOpen*/ ctx[1] && create_if_block$a();

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			button0 = element("button");
			t0 = text("Export ");
			t1 = text(t1_value);
			t2 = text(" assets");
			t3 = space();
			create_component(hovericon0.$$.fragment);
			t4 = space();
			create_component(hovericon1.$$.fragment);
			t5 = space();
			create_component(hovericon2.$$.fragment);
			t6 = space();
			button1 = element("button");
			button1.innerHTML = `<i class="mx-2 fa-sharp fa-solid fa-ellipsis"></i>`;
			t7 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(button0, "class", "primary svelte-10vufbj");
			button0.disabled = button0_disabled_value = /*nodeCount*/ ctx[0] === 0;
			attr(div0, "class", "h-full flex items-center gap-2");
			attr(button1, "class", "ellipses svelte-10vufbj");
			attr(div1, "class", "footer fixed bottom-0 left-0 w-full h-12 flex justify-between items-center z-20 svelte-10vufbj");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, button0);
			append(button0, t0);
			append(button0, t1);
			append(button0, t2);
			append(div0, t3);
			mount_component(hovericon0, div0, null);
			append(div0, t4);
			mount_component(hovericon1, div0, null);
			append(div0, t5);
			mount_component(hovericon2, div0, null);
			append(div1, t6);
			append(div1, button1);
			insert(target, t7, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*onExport*/ ctx[3]),
					listen(button1, "click", /*onToggleMenu*/ ctx[2])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if ((!current || dirty & /*nodeCount*/ 1) && t1_value !== (t1_value = (/*nodeCount*/ ctx[0] > 0 ? /*nodeCount*/ ctx[0] + 1 : 0) + "")) set_data(t1, t1_value);

			if (!current || dirty & /*nodeCount*/ 1 && button0_disabled_value !== (button0_disabled_value = /*nodeCount*/ ctx[0] === 0)) {
				button0.disabled = button0_disabled_value;
			}

			const hovericon0_changes = {};

			if (dirty & /*$$scope*/ 256) {
				hovericon0_changes.$$scope = { dirty, ctx };
			}

			hovericon0.$set(hovericon0_changes);
			const hovericon1_changes = {};

			if (dirty & /*$$scope*/ 256) {
				hovericon1_changes.$$scope = { dirty, ctx };
			}

			hovericon1.$set(hovericon1_changes);
			const hovericon2_changes = {};

			if (dirty & /*$$scope*/ 256) {
				hovericon2_changes.$$scope = { dirty, ctx };
			}

			hovericon2.$set(hovericon2_changes);

			if (/*menuOpen*/ ctx[1]) {
				if (if_block) {
					if (dirty & /*menuOpen*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$a();
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(hovericon0.$$.fragment, local);
			transition_in(hovericon1.$$.fragment, local);
			transition_in(hovericon2.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(hovericon0.$$.fragment, local);
			transition_out(hovericon1.$$.fragment, local);
			transition_out(hovericon2.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(hovericon0);
			destroy_component(hovericon1);
			destroy_component(hovericon2);
			if (detaching) detach(t7);
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$d($$self, $$props, $$invalidate) {
	let { nodeCount = 0 } = $$props;
	const dispatch = createEventDispatcher();
	let menuOpen = false;
	const onToggleMenu = () => $$invalidate(1, menuOpen = !menuOpen);
	const onExport = () => dispatch("export");
	const onSave = () => dispatch("save");
	const onLoad = () => dispatch("load");
	const onReset = () => dispatch("reset");

	$$self.$$set = $$props => {
		if ('nodeCount' in $$props) $$invalidate(0, nodeCount = $$props.nodeCount);
	};

	return [nodeCount, menuOpen, onToggleMenu, onExport, onSave, onLoad, onReset];
}

class Footer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$d, create_fragment$e, safe_not_equal, { nodeCount: 0 });
	}
}

var slugifyExports = {};
var slugify$1 = {
  get exports(){ return slugifyExports; },
  set exports(v){ slugifyExports = v; },
};

(function (module, exports) {
(function (name, root, factory) {
	  {
	    module.exports = factory();
	    module.exports['default'] = factory();
	  }
	}('slugify', commonjsGlobal, function () {
	  var charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","„":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"}');
	  var locales = JSON.parse('{"bg":{"Й":"Y","Ц":"Ts","Щ":"Sht","Ъ":"A","Ь":"Y","й":"y","ц":"ts","щ":"sht","ъ":"a","ь":"y"},"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","ß":"ss","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","¢":"centavos","£":"libras","¤":"moneda","₣":"francos","∑":"suma","∞":"infinito","♥":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","¢":"centavo","∑":"soma","£":"libra","∞":"infinito","♥":"amor"},"uk":{"И":"Y","и":"y","Й":"Y","й":"y","Ц":"Ts","ц":"ts","Х":"Kh","х":"kh","Щ":"Shch","щ":"shch","Г":"H","г":"h"},"vi":{"Đ":"D","đ":"d"},"da":{"Ø":"OE","ø":"oe","Å":"AA","å":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"større end"},"nb":{"&":"og","Å":"AA","Æ":"AE","Ø":"OE","å":"aa","æ":"ae","ø":"oe"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och","Å":"AA","Ä":"AE","Ö":"OE","å":"aa","ä":"ae","ö":"oe"}}');

	  function replace (string, options) {
	    if (typeof string !== 'string') {
	      throw new Error('slugify: string argument expected')
	    }

	    options = (typeof options === 'string')
	      ? {replacement: options}
	      : options || {};

	    var locale = locales[options.locale] || {};

	    var replacement = options.replacement === undefined ? '-' : options.replacement;

	    var trim = options.trim === undefined ? true : options.trim;

	    var slug = string.normalize().split('')
	      // replace characters based on charMap
	      .reduce(function (result, ch) {
	        var appendChar = locale[ch] || charMap[ch] || ch;
	        if (appendChar === replacement) {
	          appendChar = ' ';
	        }
	        return result + appendChar
	          // remove not allowed characters
	          .replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '')
	      }, '');

	    if (options.strict) {
	      slug = slug.replace(/[^A-Za-z0-9\s]/g, '');
	    }

	    if (trim) {
	      slug = slug.trim();
	    }

	    // Replace spaces with replacement character, treating multiple consecutive
	    // spaces as a single space.
	    slug = slug.replace(/\s+/g, replacement);

	    if (options.lower) {
	      slug = slug.toLowerCase();
	    }

	    return slug
	  }

	  replace.extend = function (customMap) {
	    Object.assign(charMap, customMap);
	  };

	  return replace
	}));
} (slugify$1));

const slugify = slugifyExports;

const Checkbox_svelte_svelte_type_style_lang = '';

/* src/ui/components/Inputs/Checkbox.svelte generated by Svelte v3.55.0 */

function create_if_block$9(ctx) {
	let i;
	let i_transition;
	let current;

	return {
		c() {
			i = element("i");
			attr(i, "class", "fas fa-check text-xs");
		},
		m(target, anchor) {
			insert(target, i, anchor);
			current = true;
		},
		i(local) {
			if (current) return;

			add_render_callback(() => {
				if (!i_transition) i_transition = create_bidirectional_transition(i, fade, {}, true);
				i_transition.run(1);
			});

			current = true;
		},
		o(local) {
			if (!i_transition) i_transition = create_bidirectional_transition(i, fade, {}, false);
			i_transition.run(0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(i);
			if (detaching && i_transition) i_transition.end();
		}
	};
}

function create_fragment$d(ctx) {
	let div1;
	let input;
	let t0;
	let div0;
	let t1;
	let label_1;
	let h5;
	let t2;
	let current;
	let mounted;
	let dispose;
	let if_block = /*checked*/ ctx[0] && create_if_block$9();

	return {
		c() {
			div1 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			if (if_block) if_block.c();
			t1 = space();
			label_1 = element("label");
			h5 = element("h5");
			t2 = text(/*label*/ ctx[2]);
			attr(input, "type", "checkbox");
			attr(input, "id", /*uniqueId*/ ctx[3]);
			attr(input, "onclick", "this.blur();");
			attr(input, "class", "svelte-enq7e9");
			attr(div0, "class", "checkmark w-6 h-6 rounded-full pointer-events-none flex items-center justify-center transition-all svelte-enq7e9");
			toggle_class(div0, "checked", /*checked*/ ctx[0]);
			attr(h5, "class", "m-0 text-xs");
			attr(label_1, "for", /*uniqueId*/ ctx[3]);
			attr(label_1, "class", "pointer-events-none");
			attr(div1, "class", "container flex gap-2 relative items-center cursor-pointer svelte-enq7e9");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, input);
			input.checked = /*checked*/ ctx[0];
			set_input_value(input, /*value*/ ctx[1]);
			append(div1, t0);
			append(div1, div0);
			if (if_block) if_block.m(div0, null);
			append(div1, t1);
			append(div1, label_1);
			append(label_1, h5);
			append(h5, t2);
			current = true;

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_handler*/ ctx[8]),
					listen(input, "change", /*change_handler*/ ctx[5]),
					listen(input, "focus", /*focus_handler*/ ctx[6]),
					listen(input, "blur", /*blur_handler*/ ctx[7]),
					listen(div1, "click", /*toggle*/ ctx[4])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*checked*/ 1) {
				input.checked = /*checked*/ ctx[0];
			}

			if (dirty & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}

			if (/*checked*/ ctx[0]) {
				if (if_block) {
					if (dirty & /*checked*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$9();
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div0, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (!current || dirty & /*checked*/ 1) {
				toggle_class(div0, "checked", /*checked*/ ctx[0]);
			}

			if (!current || dirty & /*label*/ 4) set_data(t2, /*label*/ ctx[2]);
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$c($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { checked } = $$props;
	let { label } = $$props;
	let { value } = $$props;
	let uniqueId = 'checkbox--' + (Math.random() * 10000000).toFixed(0).toString();

	const toggle = () => {
		$$invalidate(0, checked = !checked);
		dispatch("change");
	};

	function change_handler(event) {
		bubble.call(this, $$self, event);
	}

	function focus_handler(event) {
		bubble.call(this, $$self, event);
	}

	function blur_handler(event) {
		bubble.call(this, $$self, event);
	}

	function input_change_handler() {
		checked = this.checked;
		value = this.value;
		$$invalidate(0, checked);
		$$invalidate(1, value);
	}

	$$self.$$set = $$props => {
		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
		if ('label' in $$props) $$invalidate(2, label = $$props.label);
		if ('value' in $$props) $$invalidate(1, value = $$props.value);
	};

	return [
		checked,
		value,
		label,
		uniqueId,
		toggle,
		change_handler,
		focus_handler,
		blur_handler,
		input_change_handler
	];
}

class Checkbox extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$c, create_fragment$d, safe_not_equal, { checked: 0, label: 2, value: 1 });
	}
}

const Input_svelte_svelte_type_style_lang = '';

/* src/ui/components/Inputs/Input.svelte generated by Svelte v3.55.0 */

function create_if_block$8(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*errorMessage*/ ctx[7]);
			attr(div, "class", "error svelte-19bbbiu");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*errorMessage*/ 128) set_data(t, /*errorMessage*/ ctx[7]);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$c(ctx) {
	let div;
	let input;
	let t;
	let div_class_value;
	let mounted;
	let dispose;
	let if_block = /*invalid*/ ctx[6] && create_if_block$8(ctx);

	return {
		c() {
			div = element("div");
			input = element("input");
			t = space();
			if (if_block) if_block.c();
			attr(input, "type", "input");
			attr(input, "id", /*id*/ ctx[2]);
			attr(input, "name", /*name*/ ctx[3]);
			input.disabled = /*disabled*/ ctx[5];
			attr(input, "placeholder", /*placeholder*/ ctx[8]);
			attr(input, "errormessage", /*errorMessage*/ ctx[7]);
			attr(input, "class", "svelte-19bbbiu");
			toggle_class(input, "borders", /*borders*/ ctx[4]);
			toggle_class(input, "invalid", /*invalid*/ ctx[6]);
			attr(div, "class", div_class_value = "input " + /*className*/ ctx[9] + " svelte-19bbbiu");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input);
			set_input_value(input, /*value*/ ctx[0]);
			/*input_binding*/ ctx[16](input);
			append(div, t);
			if (if_block) if_block.m(div, null);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_handler*/ ctx[10]),
					listen(input, "change", /*change_handler*/ ctx[11]),
					listen(input, "keydown", /*keydown_handler*/ ctx[12]),
					listen(input, "focus", /*focus_handler*/ ctx[13]),
					listen(input, "blur", /*blur_handler*/ ctx[14]),
					listen(input, "input", /*input_input_handler*/ ctx[15])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*id*/ 4) {
				attr(input, "id", /*id*/ ctx[2]);
			}

			if (dirty & /*name*/ 8) {
				attr(input, "name", /*name*/ ctx[3]);
			}

			if (dirty & /*disabled*/ 32) {
				input.disabled = /*disabled*/ ctx[5];
			}

			if (dirty & /*placeholder*/ 256) {
				attr(input, "placeholder", /*placeholder*/ ctx[8]);
			}

			if (dirty & /*errorMessage*/ 128) {
				attr(input, "errormessage", /*errorMessage*/ ctx[7]);
			}

			if (dirty & /*value*/ 1) {
				set_input_value(input, /*value*/ ctx[0]);
			}

			if (dirty & /*borders*/ 16) {
				toggle_class(input, "borders", /*borders*/ ctx[4]);
			}

			if (dirty & /*invalid*/ 64) {
				toggle_class(input, "invalid", /*invalid*/ ctx[6]);
			}

			if (/*invalid*/ ctx[6]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$8(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*className*/ 512 && div_class_value !== (div_class_value = "input " + /*className*/ ctx[9] + " svelte-19bbbiu")) {
				attr(div, "class", div_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*input_binding*/ ctx[16](null);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$b($$self, $$props, $$invalidate) {
	let { id = null } = $$props;
	let { value = null } = $$props;
	let { name = null } = $$props;
	let { borders = false } = $$props;
	let { disabled = false } = $$props;
	let { invalid = false } = $$props;
	let { errorMessage = "Error message" } = $$props;
	let { placeholder = "Input something here..." } = $$props;
	let { ref = null } = $$props;
	let { className = undefined } = $$props;

	function input_handler(event) {
		bubble.call(this, $$self, event);
	}

	function change_handler(event) {
		bubble.call(this, $$self, event);
	}

	function keydown_handler(event) {
		bubble.call(this, $$self, event);
	}

	function focus_handler(event) {
		bubble.call(this, $$self, event);
	}

	function blur_handler(event) {
		bubble.call(this, $$self, event);
	}

	function input_input_handler() {
		value = this.value;
		$$invalidate(0, value);
	}

	function input_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			ref = $$value;
			$$invalidate(1, ref);
		});
	}

	$$self.$$set = $$props => {
		if ('id' in $$props) $$invalidate(2, id = $$props.id);
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('name' in $$props) $$invalidate(3, name = $$props.name);
		if ('borders' in $$props) $$invalidate(4, borders = $$props.borders);
		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
		if ('invalid' in $$props) $$invalidate(6, invalid = $$props.invalid);
		if ('errorMessage' in $$props) $$invalidate(7, errorMessage = $$props.errorMessage);
		if ('placeholder' in $$props) $$invalidate(8, placeholder = $$props.placeholder);
		if ('ref' in $$props) $$invalidate(1, ref = $$props.ref);
		if ('className' in $$props) $$invalidate(9, className = $$props.className);
	};

	return [
		value,
		ref,
		id,
		name,
		borders,
		disabled,
		invalid,
		errorMessage,
		placeholder,
		className,
		input_handler,
		change_handler,
		keydown_handler,
		focus_handler,
		blur_handler,
		input_input_handler,
		input_binding
	];
}

class Input extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$b, create_fragment$c, safe_not_equal, {
			id: 2,
			value: 0,
			name: 3,
			borders: 4,
			disabled: 5,
			invalid: 6,
			errorMessage: 7,
			placeholder: 8,
			ref: 1,
			className: 9
		});
	}
}

const SelectItem_svelte_svelte_type_style_lang = '';

/* src/ui/components/Inputs/SelectItem.svelte generated by Svelte v3.55.0 */

function create_fragment$b(ctx) {
	let li;
	let div0;
	let t;
	let div1;
	let li_tabindex_value;
	let li_class_value;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

	return {
		c() {
			li = element("li");
			div0 = element("div");
			t = space();
			div1 = element("div");
			if (default_slot) default_slot.c();
			attr(div0, "class", "icon svelte-19o7pkq");
			toggle_class(div0, "selected", /*selected*/ ctx[1]);
			attr(div1, "class", "label svelte-19o7pkq");
			attr(li, "itemid", /*itemId*/ ctx[0]);
			attr(li, "tabindex", li_tabindex_value = /*itemId*/ ctx[0] + 1);
			attr(li, "class", li_class_value = "" + (null_to_empty(/*className*/ ctx[2]) + " svelte-19o7pkq"));
			toggle_class(li, "highlight", /*selected*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, div0);
			append(li, t);
			append(li, div1);

			if (default_slot) {
				default_slot.m(div1, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					listen(li, "mouseenter", /*mouseenter_handler*/ ctx[5]),
					listen(li, "click", /*click_handler*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*selected*/ 2) {
				toggle_class(div0, "selected", /*selected*/ ctx[1]);
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*itemId*/ 1) {
				attr(li, "itemid", /*itemId*/ ctx[0]);
			}

			if (!current || dirty & /*itemId*/ 1 && li_tabindex_value !== (li_tabindex_value = /*itemId*/ ctx[0] + 1)) {
				attr(li, "tabindex", li_tabindex_value);
			}

			if (!current || dirty & /*className*/ 4 && li_class_value !== (li_class_value = "" + (null_to_empty(/*className*/ ctx[2]) + " svelte-19o7pkq"))) {
				attr(li, "class", li_class_value);
			}

			if (!current || dirty & /*className, selected*/ 6) {
				toggle_class(li, "highlight", /*selected*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(li);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$a($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { itemId } = $$props;
	let { selected = false } = $$props;
	let { class: className = "" } = $$props;

	function mouseenter_handler(event) {
		bubble.call(this, $$self, event);
	}

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('itemId' in $$props) $$invalidate(0, itemId = $$props.itemId);
		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
		if ('class' in $$props) $$invalidate(2, className = $$props.class);
		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [itemId, selected, className, $$scope, slots, mouseenter_handler, click_handler];
}

class SelectItem extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$a, create_fragment$b, safe_not_equal, { itemId: 0, selected: 1, class: 2 });
	}
}

const SelectDivider_svelte_svelte_type_style_lang = '';

/* src/ui/components/Inputs/SelectDivider.svelte generated by Svelte v3.55.0 */

function create_else_block$1(ctx) {
	let li;

	return {
		c() {
			li = element("li");
			attr(li, "class", "divider svelte-1be3cwr");
		},
		m(target, anchor) {
			insert(target, li, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(li);
		}
	};
}

// (5:0) {#if label === true}
function create_if_block$7(ctx) {
	let li;
	let current;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

	return {
		c() {
			li = element("li");
			if (default_slot) default_slot.c();
			attr(li, "class", "label svelte-1be3cwr");
		},
		m(target, anchor) {
			insert(target, li, anchor);

			if (default_slot) {
				default_slot.m(li, null);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[1],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
						null
					);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(li);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function create_fragment$a(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$7, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*label*/ ctx[0] === true) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function instance$9($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { label = false } = $$props;

	$$self.$$set = $$props => {
		if ('label' in $$props) $$invalidate(0, label = $$props.label);
		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	return [label, $$scope, slots];
}

class SelectDivider extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$9, create_fragment$a, safe_not_equal, { label: 0 });
	}
}

const SelectMenu_svelte_svelte_type_style_lang = '';

/* src/ui/components/Inputs/SelectMenu.svelte generated by Svelte v3.55.0 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[25] = list[i];
	child_ctx[26] = list;
	child_ctx[27] = i;
	return child_ctx;
}

// (199:6) {#if iconName}
function create_if_block_7(ctx) {
	let i;
	let i_class_value;

	return {
		c() {
			i = element("i");
			attr(i, "class", i_class_value = "text-xs ml-1 mr-0 fa-sharp fa-solid fa-" + /*iconName*/ ctx[4] + " svelte-c6u09q");
		},
		m(target, anchor) {
			insert(target, i, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*iconName*/ 16 && i_class_value !== (i_class_value = "text-xs ml-1 mr-0 fa-sharp fa-solid fa-" + /*iconName*/ ctx[4] + " svelte-c6u09q")) {
				attr(i, "class", i_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(i);
		}
	};
}

// (205:6) {:else}
function create_else_block_1(ctx) {
	let span;
	let t;

	return {
		c() {
			span = element("span");
			t = text(/*placeholder*/ ctx[2]);
			attr(span, "class", "placeholder svelte-c6u09q");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty & /*placeholder*/ 4) set_data(t, /*placeholder*/ ctx[2]);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (203:6) {#if value}
function create_if_block_6(ctx) {
	let span;
	let t_value = /*value*/ ctx[3].label + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", "label svelte-c6u09q");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty & /*value*/ 8 && t_value !== (t_value = /*value*/ ctx[3].label + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (209:6) {#if !disabled}
function create_if_block_5(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.innerHTML = `<i class="fa-sharp fa-solid fa-chevron-down fa-sm svelte-c6u09q"></i>`;
			attr(span, "class", "caret svelte-c6u09q");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (217:6) {#if menuItems && menuItems.length > 0}
function create_if_block$6(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*menuItems*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*menuItems, menuClick, removeHighlight, showGroupLabels*/ 2113) {
				each_value = /*menuItems*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (223:80) 
function create_if_block_3$1(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_4, create_else_block];
	const if_blocks = [];

	function select_block_type_2(ctx, dirty) {
		if (/*showGroupLabels*/ ctx[6]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_2(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_2(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (219:10) {#if i === 0}
function create_if_block_1$3(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*item*/ ctx[25].group && /*showGroupLabels*/ ctx[6] && create_if_block_2$2(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*item*/ ctx[25].group && /*showGroupLabels*/ ctx[6]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*menuItems, showGroupLabels*/ 65) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_2$2(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (227:12) {:else}
function create_else_block(ctx) {
	let selectdivider;
	let current;
	selectdivider = new SelectDivider({});

	return {
		c() {
			create_component(selectdivider.$$.fragment);
		},
		m(target, anchor) {
			mount_component(selectdivider, target, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(selectdivider.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(selectdivider.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(selectdivider, detaching);
		}
	};
}

// (224:12) {#if showGroupLabels}
function create_if_block_4(ctx) {
	let selectdivider0;
	let t;
	let selectdivider1;
	let current;
	selectdivider0 = new SelectDivider({});

	selectdivider1 = new SelectDivider({
			props: {
				label: true,
				$$slots: { default: [create_default_slot_3$1] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			create_component(selectdivider0.$$.fragment);
			t = space();
			create_component(selectdivider1.$$.fragment);
		},
		m(target, anchor) {
			mount_component(selectdivider0, target, anchor);
			insert(target, t, anchor);
			mount_component(selectdivider1, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const selectdivider1_changes = {};

			if (dirty & /*$$scope, menuItems*/ 268435457) {
				selectdivider1_changes.$$scope = { dirty, ctx };
			}

			selectdivider1.$set(selectdivider1_changes);
		},
		i(local) {
			if (current) return;
			transition_in(selectdivider0.$$.fragment, local);
			transition_in(selectdivider1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(selectdivider0.$$.fragment, local);
			transition_out(selectdivider1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(selectdivider0, detaching);
			if (detaching) detach(t);
			destroy_component(selectdivider1, detaching);
		}
	};
}

// (226:14) <SelectDivider label>
function create_default_slot_3$1(ctx) {
	let t_value = /*item*/ ctx[25].group + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*menuItems*/ 1 && t_value !== (t_value = /*item*/ ctx[25].group + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (220:12) {#if item.group && showGroupLabels}
function create_if_block_2$2(ctx) {
	let selectdivider;
	let current;

	selectdivider = new SelectDivider({
			props: {
				label: true,
				$$slots: { default: [create_default_slot_2$1] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			create_component(selectdivider.$$.fragment);
		},
		m(target, anchor) {
			mount_component(selectdivider, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const selectdivider_changes = {};

			if (dirty & /*$$scope, menuItems*/ 268435457) {
				selectdivider_changes.$$scope = { dirty, ctx };
			}

			selectdivider.$set(selectdivider_changes);
		},
		i(local) {
			if (current) return;
			transition_in(selectdivider.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(selectdivider.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(selectdivider, detaching);
		}
	};
}

// (221:14) <SelectDivider label>
function create_default_slot_2$1(ctx) {
	let t_value = /*item*/ ctx[25].group + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*menuItems*/ 1 && t_value !== (t_value = /*item*/ ctx[25].group + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (231:10) <SelectItem             on:click={menuClick}             on:mouseenter={removeHighlight}             itemId={item.id}             bind:selected={item.selected}>
function create_default_slot_1$1(ctx) {
	let t_value = /*item*/ ctx[25].label + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*menuItems*/ 1 && t_value !== (t_value = /*item*/ ctx[25].label + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (218:8) {#each menuItems as item, i}
function create_each_block$1(ctx) {
	let current_block_type_index;
	let if_block;
	let t;
	let selectitem;
	let updating_selected;
	let current;
	const if_block_creators = [create_if_block_1$3, create_if_block_3$1];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*i*/ ctx[27] === 0) return 0;
		if (/*i*/ ctx[27] > 0 && /*item*/ ctx[25].group && /*menuItems*/ ctx[0][/*i*/ ctx[27] - 1].group != /*item*/ ctx[25].group) return 1;
		return -1;
	}

	if (~(current_block_type_index = select_block_type_1(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	function selectitem_selected_binding(value) {
		/*selectitem_selected_binding*/ ctx[16](value, /*item*/ ctx[25]);
	}

	let selectitem_props = {
		itemId: /*item*/ ctx[25].id,
		$$slots: { default: [create_default_slot_1$1] },
		$$scope: { ctx }
	};

	if (/*item*/ ctx[25].selected !== void 0) {
		selectitem_props.selected = /*item*/ ctx[25].selected;
	}

	selectitem = new SelectItem({ props: selectitem_props });
	binding_callbacks.push(() => bind(selectitem, 'selected', selectitem_selected_binding, /*item*/ ctx[25].selected));
	selectitem.$on("click", /*menuClick*/ ctx[11]);
	selectitem.$on("mouseenter", removeHighlight);

	return {
		c() {
			if (if_block) if_block.c();
			t = space();
			create_component(selectitem.$$.fragment);
		},
		m(target, anchor) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(target, anchor);
			}

			insert(target, t, anchor);
			mount_component(selectitem, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(t.parentNode, t);
				} else {
					if_block = null;
				}
			}

			const selectitem_changes = {};
			if (dirty & /*menuItems*/ 1) selectitem_changes.itemId = /*item*/ ctx[25].id;

			if (dirty & /*$$scope, menuItems*/ 268435457) {
				selectitem_changes.$$scope = { dirty, ctx };
			}

			if (!updating_selected && dirty & /*menuItems*/ 1) {
				updating_selected = true;
				selectitem_changes.selected = /*item*/ ctx[25].selected;
				add_flush_callback(() => updating_selected = false);
			}

			selectitem.$set(selectitem_changes);
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			transition_in(selectitem.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			transition_out(selectitem.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d(detaching);
			}

			if (detaching) detach(t);
			destroy_component(selectitem, detaching);
		}
	};
}

// (186:0) <ClickOutside on:clickoutside={menuClick}>
function create_default_slot$2(ctx) {
	let div;
	let button;
	let t0;
	let t1;
	let t2;
	let ul;
	let div_class_value;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*iconName*/ ctx[4] && create_if_block_7(ctx);

	function select_block_type(ctx, dirty) {
		if (/*value*/ ctx[3]) return create_if_block_6;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);
	let if_block2 = !/*disabled*/ ctx[1] && create_if_block_5();
	let if_block3 = /*menuItems*/ ctx[0] && /*menuItems*/ ctx[0].length > 0 && create_if_block$6(ctx);

	return {
		c() {
			div = element("div");
			button = element("button");
			if (if_block0) if_block0.c();
			t0 = space();
			if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			t2 = space();
			ul = element("ul");
			if (if_block3) if_block3.c();
			button.disabled = /*disabled*/ ctx[1];
			attr(button, "class", "svelte-c6u09q");
			attr(ul, "class", "hidden menu svelte-c6u09q");
			attr(div, "disabled", /*disabled*/ ctx[1]);
			attr(div, "placeholder", /*placeholder*/ ctx[2]);
			attr(div, "showgrouplabels", /*showGroupLabels*/ ctx[6]);
			attr(div, "macosblink", /*macOSBlink*/ ctx[5]);
			attr(div, "class", div_class_value = "wrapper " + /*className*/ ctx[7] + " svelte-c6u09q");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button);
			if (if_block0) if_block0.m(button, null);
			append(button, t0);
			if_block1.m(button, null);
			append(button, t1);
			if (if_block2) if_block2.m(button, null);
			/*button_binding*/ ctx[15](button);
			append(div, t2);
			append(div, ul);
			if (if_block3) if_block3.m(ul, null);
			/*ul_binding*/ ctx[17](ul);
			/*div_binding*/ ctx[18](div);
			current = true;

			if (!mounted) {
				dispose = [
					listen(button, "click", /*menuClick*/ ctx[11]),
					listen(div, "change", /*change_handler*/ ctx[12]),
					listen(div, "focus", /*focus_handler*/ ctx[13]),
					listen(div, "blur", /*blur_handler*/ ctx[14])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*iconName*/ ctx[4]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_7(ctx);
					if_block0.c();
					if_block0.m(button, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(button, t1);
				}
			}

			if (!/*disabled*/ ctx[1]) {
				if (if_block2) ; else {
					if_block2 = create_if_block_5();
					if_block2.c();
					if_block2.m(button, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (!current || dirty & /*disabled*/ 2) {
				button.disabled = /*disabled*/ ctx[1];
			}

			if (/*menuItems*/ ctx[0] && /*menuItems*/ ctx[0].length > 0) {
				if (if_block3) {
					if_block3.p(ctx, dirty);

					if (dirty & /*menuItems*/ 1) {
						transition_in(if_block3, 1);
					}
				} else {
					if_block3 = create_if_block$6(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(ul, null);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*disabled*/ 2) {
				attr(div, "disabled", /*disabled*/ ctx[1]);
			}

			if (!current || dirty & /*placeholder*/ 4) {
				attr(div, "placeholder", /*placeholder*/ ctx[2]);
			}

			if (!current || dirty & /*showGroupLabels*/ 64) {
				attr(div, "showgrouplabels", /*showGroupLabels*/ ctx[6]);
			}

			if (!current || dirty & /*macOSBlink*/ 32) {
				attr(div, "macosblink", /*macOSBlink*/ ctx[5]);
			}

			if (!current || dirty & /*className*/ 128 && div_class_value !== (div_class_value = "wrapper " + /*className*/ ctx[7] + " svelte-c6u09q")) {
				attr(div, "class", div_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block3);
			current = true;
		},
		o(local) {
			transition_out(if_block3);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (if_block0) if_block0.d();
			if_block1.d();
			if (if_block2) if_block2.d();
			/*button_binding*/ ctx[15](null);
			if (if_block3) if_block3.d();
			/*ul_binding*/ ctx[17](null);
			/*div_binding*/ ctx[18](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$9(ctx) {
	let clickoutside;
	let current;

	clickoutside = new Src({
			props: {
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			}
		});

	clickoutside.$on("clickoutside", /*menuClick*/ ctx[11]);

	return {
		c() {
			create_component(clickoutside.$$.fragment);
		},
		m(target, anchor) {
			mount_component(clickoutside, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const clickoutside_changes = {};

			if (dirty & /*$$scope, disabled, placeholder, showGroupLabels, macOSBlink, className, menuWrapper, menuList, menuItems, menuButton, value, iconName*/ 268437503) {
				clickoutside_changes.$$scope = { dirty, ctx };
			}

			clickoutside.$set(clickoutside_changes);
		},
		i(local) {
			if (current) return;
			transition_in(clickoutside.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(clickoutside.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(clickoutside, detaching);
		}
	};
}

function removeHighlight(event) {
	let items = Array.from(event.target.parentNode.children);

	items.forEach(item => {
		item.blur();
		item.classList.remove("highlight");
	});
}

function instance$8($$self, $$props, $$invalidate) {
	let { iconName = null } = $$props;
	let { disabled = false } = $$props;
	let { macOSBlink = false } = $$props;
	let { menuItems = [] } = $$props;
	let { placeholder = "Please make a selection." } = $$props;
	let { value = null } = $$props;
	let { showGroupLabels = false } = $$props;
	const dispatch = createEventDispatcher();
	let { class: className = "" } = $$props;
	checkGroups();
	let menuWrapper, menuButton, menuList;

	//FUNCTIONS
	//assign id's to the input array
	onMount(async () => {
		updateSelectedAndIds();
	});

	// this function runs everytime the menuItems array os updated
	// it will auto assign ids and keep the value var updated
	function updateSelectedAndIds() {
		if (menuItems) {
			menuItems.forEach((item, index) => {
				//update id
				item["id"] = index;

				//update selection
				if (item.selected === true) {
					$$invalidate(3, value = item);
				}
			});
		}

		//set placeholder
		if (menuItems.length <= 0) {
			$$invalidate(2, placeholder = "There are no items to select");
			$$invalidate(1, disabled = true);
		} else {
			$$invalidate(1, disabled = false);
		}
	}

	//determine if option groups are present
	function checkGroups() {
		let groupCount = 0;

		if (menuItems) {
			menuItems.forEach(item => {
				if (item.group != null) {
					groupCount++;
				}
			});

			if (groupCount === menuItems.length) {
				return true;
			} else {
				return false;
			}
		}

		return false;
	}

	//run for all menu click events
	//this opens/closes the menu
	function menuClick(event) {
		resetMenuProperties();

		if (!event.target) {
			menuList.classList.add("hidden");
		} else if (event.target.contains(menuButton)) {

			if (value) {
				//toggle menu
				menuList.classList.remove("hidden");

				let id = value.id;
				let selectedItem = menuList.querySelector('[itemId="' + id + '"]') || menuList.querySelector('[itemId="0"]');
				selectedItem.focus(); //set focus to the currently selected item

				// calculate distance from top so that we can position the dropdown menu
				let parentTop = menuList.getBoundingClientRect().top;

				let itemTop = selectedItem.getBoundingClientRect().top;
				let topPos = itemTop - parentTop - 3;
				$$invalidate(10, menuList.style.top = -Math.abs(topPos) + "px", menuList);

				//update size and position based on plugin UI
				resizeAndPosition();
			} else {
				menuList.classList.remove("hidden");
				$$invalidate(10, menuList.style.top = "0px", menuList);
				let firstItem = menuList.querySelector('[itemId="0"]');
				firstItem.focus();

				//update size and position based on plugin UI
				resizeAndPosition();
			}
		} else if (menuList.contains(event.target)) {
			//find selected item in array
			let itemId = parseInt(event.target.getAttribute("itemId"));

			//remove current selection if there is one
			if (typeof value === "object" && value && menuItems[value.id]) {
				$$invalidate(0, menuItems[value.id].selected = false, menuItems);
			}

			$$invalidate(0, menuItems[itemId].selected = true, menuItems); //select current item
			updateSelectedAndIds();
			dispatch("change", menuItems[itemId]);

			if (macOSBlink) {
				var x = 4;
				var interval = 70;

				//blink the background
				for (var i = 0; i < x; i++) {
					setTimeout(
						function () {
							event.target.classList.toggle("blink");
						},
						i * interval
					);
				}

				//delay closing the menu
				setTimeout(
					function () {
						menuList.classList.add("hidden"); //hide the menu
					},
					interval * x + 40
				);
			} else {
				menuList.classList.add("hidden"); //hide the menu
				menuButton.classList.remove("selected"); //remove selected state from button
			}
		}
	}

	// this function ensures that the select menu
	// fits inside the plugin viewport
	// if its too big, it will resize it and enable a scrollbar
	// if its off screen it will shift the position
	function resizeAndPosition() {
		//set the max height of the menu based on plugin/iframe window
		let maxMenuHeight = window.innerHeight - 16;

		let menuHeight = menuList.offsetHeight;
		let menuResized = false;

		if (menuHeight > maxMenuHeight) {
			$$invalidate(10, menuList.style.height = maxMenuHeight + "px", menuList);
			menuResized = true;
		}

		//lets adjust the position of the menu if its cut off from viewport
		let bounding = menuList.getBoundingClientRect();

		let parentBounding = menuButton.getBoundingClientRect();

		if (bounding.top < 0) {
			$$invalidate(10, menuList.style.top = -Math.abs(parentBounding.top - 8) + "px", menuList);
		}

		if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
			let minTop = -Math.abs(parentBounding.top - (window.innerHeight - menuHeight - 8));
			let newTop = -Math.abs(bounding.bottom - window.innerHeight + 16);

			if (menuResized) {
				$$invalidate(10, menuList.style.top = -Math.abs(parentBounding.top - 8) + "px", menuList);
			} else if (newTop > minTop) {
				$$invalidate(10, menuList.style.top = minTop + "px", menuList);
			} else {
				$$invalidate(10, menuList.style.top = newTop + "px", menuList);
			}
		}
	}

	function resetMenuProperties() {
		$$invalidate(10, menuList.style.height = "auto", menuList);
		$$invalidate(10, menuList.style.top = "0px", menuList);
	}

	function change_handler(event) {
		bubble.call(this, $$self, event);
	}

	function focus_handler(event) {
		bubble.call(this, $$self, event);
	}

	function blur_handler(event) {
		bubble.call(this, $$self, event);
	}

	function button_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			menuButton = $$value;
			$$invalidate(9, menuButton);
		});
	}

	function selectitem_selected_binding(value, item) {
		if ($$self.$$.not_equal(item.selected, value)) {
			item.selected = value;
			$$invalidate(0, menuItems);
		}
	}

	function ul_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			menuList = $$value;
			$$invalidate(10, menuList);
		});
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			menuWrapper = $$value;
			$$invalidate(8, menuWrapper);
		});
	}

	$$self.$$set = $$props => {
		if ('iconName' in $$props) $$invalidate(4, iconName = $$props.iconName);
		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
		if ('macOSBlink' in $$props) $$invalidate(5, macOSBlink = $$props.macOSBlink);
		if ('menuItems' in $$props) $$invalidate(0, menuItems = $$props.menuItems);
		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
		if ('value' in $$props) $$invalidate(3, value = $$props.value);
		if ('showGroupLabels' in $$props) $$invalidate(6, showGroupLabels = $$props.showGroupLabels);
		if ('class' in $$props) $$invalidate(7, className = $$props.class);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*menuItems*/ 1) {
			(updateSelectedAndIds());
		}
	};

	return [
		menuItems,
		disabled,
		placeholder,
		value,
		iconName,
		macOSBlink,
		showGroupLabels,
		className,
		menuWrapper,
		menuButton,
		menuList,
		menuClick,
		change_handler,
		focus_handler,
		blur_handler,
		button_binding,
		selectitem_selected_binding,
		ul_binding,
		div_binding
	];
}

class SelectMenu extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$8, create_fragment$9, safe_not_equal, {
			iconName: 4,
			disabled: 1,
			macOSBlink: 5,
			menuItems: 0,
			placeholder: 2,
			value: 3,
			showGroupLabels: 6,
			class: 7
		});
	}
}

const File_svelte_svelte_type_style_lang = '';

/* src/ui/components/Controls/File.svelte generated by Svelte v3.55.0 */

function create_if_block$5(ctx) {
	let div;

	return {
		c() {
			div = element("div");

			div.innerHTML = `<i class="fa-sharp fa-solid fa-circle-exclamation"></i> 
          <p class="text-xs">Required</p>`;

			attr(div, "class", "flex items-center gap-1 text-red-600 text-xs");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$8(ctx) {
	let div9;
	let div3;
	let div0;
	let h50;
	let t1;
	let t2;
	let div2;
	let div1;
	let input;
	let updating_value;
	let t3;
	let div7;
	let div4;
	let t5;
	let div6;
	let div5;
	let selectmenu;
	let updating_menuItems;
	let updating_value_1;
	let t6;
	let div8;
	let checkbox;
	let updating_value_2;
	let updating_checked;
	let current;
	let if_block = (!/*syntax*/ ctx[2] || /*syntax*/ ctx[2] === "") && create_if_block$5();

	function input_value_binding(value) {
		/*input_value_binding*/ ctx[7](value);
	}

	let input_props = {
		placeholder: "Enter a file name",
		className: /*syntax*/ ctx[2] === "" ? "required" : ""
	};

	if (/*syntax*/ ctx[2] !== void 0) {
		input_props.value = /*syntax*/ ctx[2];
	}

	input = new Input({ props: input_props });
	binding_callbacks.push(() => bind(input, 'value', input_value_binding, /*syntax*/ ctx[2]));
	input.$on("change", /*change_handler*/ ctx[8]);

	function selectmenu_menuItems_binding(value) {
		/*selectmenu_menuItems_binding*/ ctx[9](value);
	}

	function selectmenu_value_binding(value) {
		/*selectmenu_value_binding*/ ctx[10](value);
	}

	let selectmenu_props = {};

	if (/*menuItems*/ ctx[1] !== void 0) {
		selectmenu_props.menuItems = /*menuItems*/ ctx[1];
	}

	if (/*fileType*/ ctx[0] !== void 0) {
		selectmenu_props.value = /*fileType*/ ctx[0];
	}

	selectmenu = new SelectMenu({ props: selectmenu_props });
	binding_callbacks.push(() => bind(selectmenu, 'menuItems', selectmenu_menuItems_binding, /*menuItems*/ ctx[1]));
	binding_callbacks.push(() => bind(selectmenu, 'value', selectmenu_value_binding, /*fileType*/ ctx[0]));
	selectmenu.$on("change", /*change_handler_1*/ ctx[11]);

	function checkbox_value_binding(value) {
		/*checkbox_value_binding*/ ctx[12](value);
	}

	function checkbox_checked_binding(value) {
		/*checkbox_checked_binding*/ ctx[13](value);
	}

	let checkbox_props = { label: "Testing mode" };

	if (/*testingMode*/ ctx[3] !== void 0) {
		checkbox_props.value = /*testingMode*/ ctx[3];
	}

	if (/*testingMode*/ ctx[3] !== void 0) {
		checkbox_props.checked = /*testingMode*/ ctx[3];
	}

	checkbox = new Checkbox({ props: checkbox_props });
	binding_callbacks.push(() => bind(checkbox, 'value', checkbox_value_binding, /*testingMode*/ ctx[3]));
	binding_callbacks.push(() => bind(checkbox, 'checked', checkbox_checked_binding, /*testingMode*/ ctx[3]));
	checkbox.$on("change", /*change_handler_2*/ ctx[14]);

	return {
		c() {
			div9 = element("div");
			div3 = element("div");
			div0 = element("div");
			h50 = element("h5");
			h50.textContent = "File name";
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			div2 = element("div");
			div1 = element("div");
			create_component(input.$$.fragment);
			t3 = space();
			div7 = element("div");
			div4 = element("div");
			div4.innerHTML = `<h5 class="m-0 text-xs">File type</h5>`;
			t5 = space();
			div6 = element("div");
			div5 = element("div");
			create_component(selectmenu.$$.fragment);
			t6 = space();
			div8 = element("div");
			create_component(checkbox.$$.fragment);
			attr(h50, "class", "m-0 text-xs");
			attr(div0, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div1, "class", "w-full");
			attr(div2, "class", "input-row svelte-af3kmn");
			attr(div4, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div5, "class", "w-full");
			attr(div6, "class", "input-row svelte-af3kmn");
			attr(div8, "class", "mt-2");
			attr(div9, "class", "w-full flex flex-col gap-2");
		},
		m(target, anchor) {
			insert(target, div9, anchor);
			append(div9, div3);
			append(div3, div0);
			append(div0, h50);
			append(div0, t1);
			if (if_block) if_block.m(div0, null);
			append(div3, t2);
			append(div3, div2);
			append(div2, div1);
			mount_component(input, div1, null);
			append(div9, t3);
			append(div9, div7);
			append(div7, div4);
			append(div7, t5);
			append(div7, div6);
			append(div6, div5);
			mount_component(selectmenu, div5, null);
			append(div9, t6);
			append(div9, div8);
			mount_component(checkbox, div8, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (!/*syntax*/ ctx[2] || /*syntax*/ ctx[2] === "") {
				if (if_block) ; else {
					if_block = create_if_block$5();
					if_block.c();
					if_block.m(div0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const input_changes = {};
			if (dirty & /*syntax*/ 4) input_changes.className = /*syntax*/ ctx[2] === "" ? "required" : "";

			if (!updating_value && dirty & /*syntax*/ 4) {
				updating_value = true;
				input_changes.value = /*syntax*/ ctx[2];
				add_flush_callback(() => updating_value = false);
			}

			input.$set(input_changes);
			const selectmenu_changes = {};

			if (!updating_menuItems && dirty & /*menuItems*/ 2) {
				updating_menuItems = true;
				selectmenu_changes.menuItems = /*menuItems*/ ctx[1];
				add_flush_callback(() => updating_menuItems = false);
			}

			if (!updating_value_1 && dirty & /*fileType*/ 1) {
				updating_value_1 = true;
				selectmenu_changes.value = /*fileType*/ ctx[0];
				add_flush_callback(() => updating_value_1 = false);
			}

			selectmenu.$set(selectmenu_changes);
			const checkbox_changes = {};

			if (!updating_value_2 && dirty & /*testingMode*/ 8) {
				updating_value_2 = true;
				checkbox_changes.value = /*testingMode*/ ctx[3];
				add_flush_callback(() => updating_value_2 = false);
			}

			if (!updating_checked && dirty & /*testingMode*/ 8) {
				updating_checked = true;
				checkbox_changes.checked = /*testingMode*/ ctx[3];
				add_flush_callback(() => updating_checked = false);
			}

			checkbox.$set(checkbox_changes);
		},
		i(local) {
			if (current) return;
			transition_in(input.$$.fragment, local);
			transition_in(selectmenu.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(input.$$.fragment, local);
			transition_out(selectmenu.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div9);
			if (if_block) if_block.d();
			destroy_component(input);
			destroy_component(selectmenu);
			destroy_component(checkbox);
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { fileType = undefined } = $$props;
	let { menuItems = [] } = $$props;
	let { syntax = undefined } = $$props;
	let { testingMode = false } = $$props;
	let { errorMessage = "" } = $$props;

	const validateFileName = fileName => {
		if (fileName === "") {
			$$invalidate(6, errorMessage = "File name cannot be empty");
			dispatch("sendError");
			return;
		}

		// if (fileName.includes("/")) {
		//   errorMessage = "File name cannot contain '/'";
		//   dispatch("sendError");
		//   return;
		// }
		$$invalidate(2, syntax = slugify(fileName, {
			lower: true,
			strict: true,
			remove: /[*+~.()'"!:@]/g
		}));

		dispatch("changeConfig");
		return;
	};

	function input_value_binding(value) {
		syntax = value;
		$$invalidate(2, syntax);
	}

	const change_handler = () => validateFileName(syntax);

	function selectmenu_menuItems_binding(value) {
		menuItems = value;
		$$invalidate(1, menuItems);
	}

	function selectmenu_value_binding(value) {
		fileType = value;
		$$invalidate(0, fileType);
	}

	const change_handler_1 = () => dispatch("changeConfig");

	function checkbox_value_binding(value) {
		testingMode = value;
		$$invalidate(3, testingMode);
	}

	function checkbox_checked_binding(value) {
		testingMode = value;
		$$invalidate(3, testingMode);
	}

	const change_handler_2 = () => dispatch("changeConfig");

	$$self.$$set = $$props => {
		if ('fileType' in $$props) $$invalidate(0, fileType = $$props.fileType);
		if ('menuItems' in $$props) $$invalidate(1, menuItems = $$props.menuItems);
		if ('syntax' in $$props) $$invalidate(2, syntax = $$props.syntax);
		if ('testingMode' in $$props) $$invalidate(3, testingMode = $$props.testingMode);
		if ('errorMessage' in $$props) $$invalidate(6, errorMessage = $$props.errorMessage);
	};

	return [
		fileType,
		menuItems,
		syntax,
		testingMode,
		dispatch,
		validateFileName,
		errorMessage,
		input_value_binding,
		change_handler,
		selectmenu_menuItems_binding,
		selectmenu_value_binding,
		change_handler_1,
		checkbox_value_binding,
		checkbox_checked_binding,
		change_handler_2
	];
}

class File extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$7, create_fragment$8, safe_not_equal, {
			fileType: 0,
			menuItems: 1,
			syntax: 2,
			testingMode: 3,
			errorMessage: 6
		});
	}
}

const TextArea_svelte_svelte_type_style_lang = '';

/* src/ui/components/Inputs/TextArea.svelte generated by Svelte v3.55.0 */

function create_fragment$7(ctx) {
	let div;
	let textarea;
	let div_class_value;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			textarea = element("textarea");
			attr(textarea, "type", "input");
			attr(textarea, "id", /*id*/ ctx[1]);
			attr(textarea, "name", /*name*/ ctx[3]);
			attr(textarea, "rows", /*rows*/ ctx[2]);
			textarea.disabled = /*disabled*/ ctx[4];
			attr(textarea, "placeholder", /*placeholder*/ ctx[5]);
			attr(textarea, "class", "svelte-10e8rn0");
			attr(div, "class", div_class_value = "textarea " + /*className*/ ctx[6] + " svelte-10e8rn0");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, textarea);
			set_input_value(textarea, /*value*/ ctx[0]);

			if (!mounted) {
				dispose = [
					listen(textarea, "input", /*input_handler*/ ctx[7]),
					listen(textarea, "change", /*change_handler*/ ctx[8]),
					listen(textarea, "keydown", /*keydown_handler*/ ctx[9]),
					listen(textarea, "focus", /*focus_handler*/ ctx[10]),
					listen(textarea, "blur", /*blur_handler*/ ctx[11]),
					listen(textarea, "input", /*textarea_input_handler*/ ctx[12])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*id*/ 2) {
				attr(textarea, "id", /*id*/ ctx[1]);
			}

			if (dirty & /*name*/ 8) {
				attr(textarea, "name", /*name*/ ctx[3]);
			}

			if (dirty & /*rows*/ 4) {
				attr(textarea, "rows", /*rows*/ ctx[2]);
			}

			if (dirty & /*disabled*/ 16) {
				textarea.disabled = /*disabled*/ ctx[4];
			}

			if (dirty & /*placeholder*/ 32) {
				attr(textarea, "placeholder", /*placeholder*/ ctx[5]);
			}

			if (dirty & /*value*/ 1) {
				set_input_value(textarea, /*value*/ ctx[0]);
			}

			if (dirty & /*className*/ 64 && div_class_value !== (div_class_value = "textarea " + /*className*/ ctx[6] + " svelte-10e8rn0")) {
				attr(div, "class", div_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$6($$self, $$props, $$invalidate) {
	let { id = null } = $$props;
	let { value = null } = $$props;
	let { rows = 2 } = $$props;
	let { name = null } = $$props;
	let { disabled = false } = $$props;
	let { placeholder = "Input something here..." } = $$props;
	let { className = undefined } = $$props;

	function input_handler(event) {
		bubble.call(this, $$self, event);
	}

	function change_handler(event) {
		bubble.call(this, $$self, event);
	}

	function keydown_handler(event) {
		bubble.call(this, $$self, event);
	}

	function focus_handler(event) {
		bubble.call(this, $$self, event);
	}

	function blur_handler(event) {
		bubble.call(this, $$self, event);
	}

	function textarea_input_handler() {
		value = this.value;
		$$invalidate(0, value);
	}

	$$self.$$set = $$props => {
		if ('id' in $$props) $$invalidate(1, id = $$props.id);
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('rows' in $$props) $$invalidate(2, rows = $$props.rows);
		if ('name' in $$props) $$invalidate(3, name = $$props.name);
		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ('placeholder' in $$props) $$invalidate(5, placeholder = $$props.placeholder);
		if ('className' in $$props) $$invalidate(6, className = $$props.className);
	};

	return [
		value,
		id,
		rows,
		name,
		disabled,
		placeholder,
		className,
		input_handler,
		change_handler,
		keydown_handler,
		focus_handler,
		blur_handler,
		textarea_input_handler
	];
}

class TextArea extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$6, create_fragment$7, safe_not_equal, {
			id: 1,
			value: 0,
			rows: 2,
			name: 3,
			disabled: 4,
			placeholder: 5,
			className: 6
		});
	}
}

const Images_svelte_svelte_type_style_lang = '';

/* src/ui/components/Controls/Images.svelte generated by Svelte v3.55.0 */

function create_if_block$4(ctx) {
	let div;

	return {
		c() {
			div = element("div");

			div.innerHTML = `<i class="fa-sharp fa-solid fa-circle-exclamation"></i> 
          <p class="text-xs">Required</p>`;

			attr(div, "class", "flex items-center gap-1 text-red-600 text-xs");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$6(ctx) {
	let div17;
	let div8;
	let div3;
	let div0;
	let t1;
	let div2;
	let div1;
	let selectmenu0;
	let updating_value;
	let t2;
	let div7;
	let div4;
	let t4;
	let div6;
	let div5;
	let selectmenu1;
	let updating_value_1;
	let t5;
	let div12;
	let div9;
	let t7;
	let div11;
	let div10;
	let input;
	let updating_value_2;
	let t8;
	let div16;
	let div13;
	let h53;
	let t10;
	let t11;
	let div15;
	let div14;
	let textarea;
	let updating_value_3;
	let current;

	function selectmenu0_value_binding(value) {
		/*selectmenu0_value_binding*/ ctx[7](value);
	}

	let selectmenu0_props = {
		menuItems: /*scaleOptions*/ ctx[5],
		disabled: /*extension*/ ctx[1].value === "SVG"
	};

	if (/*scale*/ ctx[3] !== void 0) {
		selectmenu0_props.value = /*scale*/ ctx[3];
	}

	selectmenu0 = new SelectMenu({ props: selectmenu0_props });
	binding_callbacks.push(() => bind(selectmenu0, 'value', selectmenu0_value_binding, /*scale*/ ctx[3]));
	selectmenu0.$on("change", /*change_handler*/ ctx[8]);

	function selectmenu1_value_binding(value) {
		/*selectmenu1_value_binding*/ ctx[9](value);
	}

	let selectmenu1_props = { menuItems: /*extensionOptions*/ ctx[4] };

	if (/*extension*/ ctx[1] !== void 0) {
		selectmenu1_props.value = /*extension*/ ctx[1];
	}

	selectmenu1 = new SelectMenu({ props: selectmenu1_props });
	binding_callbacks.push(() => bind(selectmenu1, 'value', selectmenu1_value_binding, /*extension*/ ctx[1]));
	selectmenu1.$on("change", /*change_handler_1*/ ctx[10]);

	function input_value_binding(value) {
		/*input_value_binding*/ ctx[11](value);
	}

	let input_props = {
		placeholder: "Enter an image path to include in your export."
	};

	if (/*imagePath*/ ctx[2] !== void 0) {
		input_props.value = /*imagePath*/ ctx[2];
	}

	input = new Input({ props: input_props });
	binding_callbacks.push(() => bind(input, 'value', input_value_binding, /*imagePath*/ ctx[2]));
	input.$on("change", /*change_handler_2*/ ctx[12]);
	let if_block = (!/*altText*/ ctx[0] || /*altText*/ ctx[0] === "") && create_if_block$4();

	function textarea_value_binding(value) {
		/*textarea_value_binding*/ ctx[13](value);
	}

	let textarea_props = {
		placeholder: "Enter alternate text to apply to your images.",
		className: /*altText*/ ctx[0] === "" ? "required" : ""
	};

	if (/*altText*/ ctx[0] !== void 0) {
		textarea_props.value = /*altText*/ ctx[0];
	}

	textarea = new TextArea({ props: textarea_props });
	binding_callbacks.push(() => bind(textarea, 'value', textarea_value_binding, /*altText*/ ctx[0]));
	textarea.$on("change", /*change_handler_3*/ ctx[14]);

	return {
		c() {
			div17 = element("div");
			div8 = element("div");
			div3 = element("div");
			div0 = element("div");
			div0.innerHTML = `<h5 class="m-0 text-xs">Scale</h5>`;
			t1 = space();
			div2 = element("div");
			div1 = element("div");
			create_component(selectmenu0.$$.fragment);
			t2 = space();
			div7 = element("div");
			div4 = element("div");
			div4.innerHTML = `<h5 class="m-0 text-xs">Format</h5>`;
			t4 = space();
			div6 = element("div");
			div5 = element("div");
			create_component(selectmenu1.$$.fragment);
			t5 = space();
			div12 = element("div");
			div9 = element("div");
			div9.innerHTML = `<h5 class="m-0 text-xs">Path</h5>`;
			t7 = space();
			div11 = element("div");
			div10 = element("div");
			create_component(input.$$.fragment);
			t8 = space();
			div16 = element("div");
			div13 = element("div");
			h53 = element("h5");
			h53.textContent = "Alt text";
			t10 = space();
			if (if_block) if_block.c();
			t11 = space();
			div15 = element("div");
			div14 = element("div");
			create_component(textarea.$$.fragment);
			attr(div0, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div1, "class", "w-full svelte-wyukch");
			toggle_class(div1, "disabled", /*extension*/ ctx[1].value === "SVG");
			attr(div2, "class", "input-row svelte-wyukch");
			attr(div3, "class", "flex-grow");
			attr(div4, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div5, "class", "w-full");
			attr(div6, "class", "input-row svelte-wyukch");
			attr(div7, "class", "flex-grow");
			attr(div8, "class", "flex gap-2");
			attr(div9, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div10, "class", "w-full");
			attr(div11, "class", "input-row svelte-wyukch");
			attr(h53, "class", "m-0 text-xs");
			attr(div13, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div14, "class", "w-full");
			attr(div15, "class", "input-row svelte-wyukch");
			attr(div17, "class", "w-full flex flex-col gap-2");
		},
		m(target, anchor) {
			insert(target, div17, anchor);
			append(div17, div8);
			append(div8, div3);
			append(div3, div0);
			append(div3, t1);
			append(div3, div2);
			append(div2, div1);
			mount_component(selectmenu0, div1, null);
			append(div8, t2);
			append(div8, div7);
			append(div7, div4);
			append(div7, t4);
			append(div7, div6);
			append(div6, div5);
			mount_component(selectmenu1, div5, null);
			append(div17, t5);
			append(div17, div12);
			append(div12, div9);
			append(div12, t7);
			append(div12, div11);
			append(div11, div10);
			mount_component(input, div10, null);
			append(div17, t8);
			append(div17, div16);
			append(div16, div13);
			append(div13, h53);
			append(div13, t10);
			if (if_block) if_block.m(div13, null);
			append(div16, t11);
			append(div16, div15);
			append(div15, div14);
			mount_component(textarea, div14, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const selectmenu0_changes = {};
			if (dirty & /*scaleOptions*/ 32) selectmenu0_changes.menuItems = /*scaleOptions*/ ctx[5];
			if (dirty & /*extension*/ 2) selectmenu0_changes.disabled = /*extension*/ ctx[1].value === "SVG";

			if (!updating_value && dirty & /*scale*/ 8) {
				updating_value = true;
				selectmenu0_changes.value = /*scale*/ ctx[3];
				add_flush_callback(() => updating_value = false);
			}

			selectmenu0.$set(selectmenu0_changes);

			if (!current || dirty & /*extension*/ 2) {
				toggle_class(div1, "disabled", /*extension*/ ctx[1].value === "SVG");
			}

			const selectmenu1_changes = {};
			if (dirty & /*extensionOptions*/ 16) selectmenu1_changes.menuItems = /*extensionOptions*/ ctx[4];

			if (!updating_value_1 && dirty & /*extension*/ 2) {
				updating_value_1 = true;
				selectmenu1_changes.value = /*extension*/ ctx[1];
				add_flush_callback(() => updating_value_1 = false);
			}

			selectmenu1.$set(selectmenu1_changes);
			const input_changes = {};

			if (!updating_value_2 && dirty & /*imagePath*/ 4) {
				updating_value_2 = true;
				input_changes.value = /*imagePath*/ ctx[2];
				add_flush_callback(() => updating_value_2 = false);
			}

			input.$set(input_changes);

			if (!/*altText*/ ctx[0] || /*altText*/ ctx[0] === "") {
				if (if_block) ; else {
					if_block = create_if_block$4();
					if_block.c();
					if_block.m(div13, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const textarea_changes = {};
			if (dirty & /*altText*/ 1) textarea_changes.className = /*altText*/ ctx[0] === "" ? "required" : "";

			if (!updating_value_3 && dirty & /*altText*/ 1) {
				updating_value_3 = true;
				textarea_changes.value = /*altText*/ ctx[0];
				add_flush_callback(() => updating_value_3 = false);
			}

			textarea.$set(textarea_changes);
		},
		i(local) {
			if (current) return;
			transition_in(selectmenu0.$$.fragment, local);
			transition_in(selectmenu1.$$.fragment, local);
			transition_in(input.$$.fragment, local);
			transition_in(textarea.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(selectmenu0.$$.fragment, local);
			transition_out(selectmenu1.$$.fragment, local);
			transition_out(input.$$.fragment, local);
			transition_out(textarea.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div17);
			destroy_component(selectmenu0);
			destroy_component(selectmenu1);
			destroy_component(input);
			if (if_block) if_block.d();
			destroy_component(textarea);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { altText = undefined } = $$props;
	let { extension = undefined } = $$props;
	let { extensionOptions = [] } = $$props;
	let { imagePath = undefined } = $$props;
	let { scale = undefined } = $$props;
	let { scaleOptions = [] } = $$props;

	function selectmenu0_value_binding(value) {
		scale = value;
		$$invalidate(3, scale);
	}

	const change_handler = () => dispatch("changeConfig");

	function selectmenu1_value_binding(value) {
		extension = value;
		$$invalidate(1, extension);
	}

	const change_handler_1 = () => dispatch("changeConfig");

	function input_value_binding(value) {
		imagePath = value;
		$$invalidate(2, imagePath);
	}

	const change_handler_2 = () => dispatch("changeConfig");

	function textarea_value_binding(value) {
		altText = value;
		$$invalidate(0, altText);
	}

	const change_handler_3 = () => dispatch("changeConfig");

	$$self.$$set = $$props => {
		if ('altText' in $$props) $$invalidate(0, altText = $$props.altText);
		if ('extension' in $$props) $$invalidate(1, extension = $$props.extension);
		if ('extensionOptions' in $$props) $$invalidate(4, extensionOptions = $$props.extensionOptions);
		if ('imagePath' in $$props) $$invalidate(2, imagePath = $$props.imagePath);
		if ('scale' in $$props) $$invalidate(3, scale = $$props.scale);
		if ('scaleOptions' in $$props) $$invalidate(5, scaleOptions = $$props.scaleOptions);
	};

	return [
		altText,
		extension,
		imagePath,
		scale,
		extensionOptions,
		scaleOptions,
		dispatch,
		selectmenu0_value_binding,
		change_handler,
		selectmenu1_value_binding,
		change_handler_1,
		input_value_binding,
		change_handler_2,
		textarea_value_binding,
		change_handler_3
	];
}

class Images extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$5, create_fragment$6, safe_not_equal, {
			altText: 0,
			extension: 1,
			extensionOptions: 4,
			imagePath: 2,
			scale: 3,
			scaleOptions: 5
		});
	}
}

const Page_svelte_svelte_type_style_lang = '';

/* src/ui/components/Controls/Page.svelte generated by Svelte v3.55.0 */

function create_fragment$5(ctx) {
	let div9;
	let checkbox0;
	let updating_value;
	let updating_checked;
	let t0;
	let checkbox1;
	let updating_value_1;
	let updating_checked_1;
	let t1;
	let checkbox2;
	let updating_value_2;
	let updating_checked_2;
	let t2;
	let div4;
	let div3;
	let div0;
	let t4;
	let div2;
	let div1;
	let input;
	let updating_value_3;
	let t5;
	let div8;
	let div5;
	let t7;
	let div7;
	let div6;
	let textarea;
	let updating_value_4;
	let current;

	function checkbox0_value_binding(value) {
		/*checkbox0_value_binding*/ ctx[6](value);
	}

	function checkbox0_checked_binding(value) {
		/*checkbox0_checked_binding*/ ctx[7](value);
	}

	let checkbox0_props = { label: "Include resizer script" };

	if (/*includeResizer*/ ctx[3] !== void 0) {
		checkbox0_props.value = /*includeResizer*/ ctx[3];
	}

	if (/*includeResizer*/ ctx[3] !== void 0) {
		checkbox0_props.checked = /*includeResizer*/ ctx[3];
	}

	checkbox0 = new Checkbox({ props: checkbox0_props });
	binding_callbacks.push(() => bind(checkbox0, 'value', checkbox0_value_binding, /*includeResizer*/ ctx[3]));
	binding_callbacks.push(() => bind(checkbox0, 'checked', checkbox0_checked_binding, /*includeResizer*/ ctx[3]));
	checkbox0.$on("change", /*change_handler*/ ctx[8]);

	function checkbox1_value_binding(value) {
		/*checkbox1_value_binding*/ ctx[9](value);
	}

	function checkbox1_checked_binding(value) {
		/*checkbox1_checked_binding*/ ctx[10](value);
	}

	let checkbox1_props = { label: "Center HTML output" };

	if (/*centerHtmlOutput*/ ctx[1] !== void 0) {
		checkbox1_props.value = /*centerHtmlOutput*/ ctx[1];
	}

	if (/*centerHtmlOutput*/ ctx[1] !== void 0) {
		checkbox1_props.checked = /*centerHtmlOutput*/ ctx[1];
	}

	checkbox1 = new Checkbox({ props: checkbox1_props });
	binding_callbacks.push(() => bind(checkbox1, 'value', checkbox1_value_binding, /*centerHtmlOutput*/ ctx[1]));
	binding_callbacks.push(() => bind(checkbox1, 'checked', checkbox1_checked_binding, /*centerHtmlOutput*/ ctx[1]));
	checkbox1.$on("change", /*change_handler_1*/ ctx[11]);

	function checkbox2_value_binding(value) {
		/*checkbox2_value_binding*/ ctx[12](value);
	}

	function checkbox2_checked_binding(value) {
		/*checkbox2_checked_binding*/ ctx[13](value);
	}

	let checkbox2_props = { label: "Fluid container width" };

	if (/*fluid*/ ctx[2] !== void 0) {
		checkbox2_props.value = /*fluid*/ ctx[2];
	}

	if (/*fluid*/ ctx[2] !== void 0) {
		checkbox2_props.checked = /*fluid*/ ctx[2];
	}

	checkbox2 = new Checkbox({ props: checkbox2_props });
	binding_callbacks.push(() => bind(checkbox2, 'value', checkbox2_value_binding, /*fluid*/ ctx[2]));
	binding_callbacks.push(() => bind(checkbox2, 'checked', checkbox2_checked_binding, /*fluid*/ ctx[2]));
	checkbox2.$on("change", /*change_handler_2*/ ctx[14]);

	function input_value_binding(value) {
		/*input_value_binding*/ ctx[15](value);
	}

	let input_props = {
		placeholder: "Enter a max width for the images."
	};

	if (/*maxWidth*/ ctx[4] !== void 0) {
		input_props.value = /*maxWidth*/ ctx[4];
	}

	input = new Input({ props: input_props });
	binding_callbacks.push(() => bind(input, 'value', input_value_binding, /*maxWidth*/ ctx[4]));
	input.$on("change", /*change_handler_3*/ ctx[16]);

	function textarea_value_binding(value) {
		/*textarea_value_binding*/ ctx[17](value);
	}

	let textarea_props = {
		placeholder: "Enter a custom script to be included in the exported HTML file here."
	};

	if (/*customScript*/ ctx[0] !== void 0) {
		textarea_props.value = /*customScript*/ ctx[0];
	}

	textarea = new TextArea({ props: textarea_props });
	binding_callbacks.push(() => bind(textarea, 'value', textarea_value_binding, /*customScript*/ ctx[0]));
	textarea.$on("change", /*change_handler_4*/ ctx[18]);

	return {
		c() {
			div9 = element("div");
			create_component(checkbox0.$$.fragment);
			t0 = space();
			create_component(checkbox1.$$.fragment);
			t1 = space();
			create_component(checkbox2.$$.fragment);
			t2 = space();
			div4 = element("div");
			div3 = element("div");
			div0 = element("div");
			div0.innerHTML = `<h5 class="m-0 text-xs">Add max width (px)</h5>`;
			t4 = space();
			div2 = element("div");
			div1 = element("div");
			create_component(input.$$.fragment);
			t5 = space();
			div8 = element("div");
			div5 = element("div");
			div5.innerHTML = `<h5 class="m-0 text-xs">Custom script</h5>`;
			t7 = space();
			div7 = element("div");
			div6 = element("div");
			create_component(textarea.$$.fragment);
			attr(div0, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div1, "class", "w-full");
			attr(div2, "class", "input-row svelte-af3kmn");
			attr(div3, "class", "flex-grow");
			attr(div4, "class", "flex gap-2");
			attr(div5, "class", "flex justify-between items-center text-[10px] mt-2 mb-2.5");
			attr(div6, "class", "w-full");
			attr(div7, "class", "input-row svelte-af3kmn");
			attr(div9, "class", "w-full flex flex-col gap-2");
		},
		m(target, anchor) {
			insert(target, div9, anchor);
			mount_component(checkbox0, div9, null);
			append(div9, t0);
			mount_component(checkbox1, div9, null);
			append(div9, t1);
			mount_component(checkbox2, div9, null);
			append(div9, t2);
			append(div9, div4);
			append(div4, div3);
			append(div3, div0);
			append(div3, t4);
			append(div3, div2);
			append(div2, div1);
			mount_component(input, div1, null);
			append(div9, t5);
			append(div9, div8);
			append(div8, div5);
			append(div8, t7);
			append(div8, div7);
			append(div7, div6);
			mount_component(textarea, div6, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const checkbox0_changes = {};

			if (!updating_value && dirty & /*includeResizer*/ 8) {
				updating_value = true;
				checkbox0_changes.value = /*includeResizer*/ ctx[3];
				add_flush_callback(() => updating_value = false);
			}

			if (!updating_checked && dirty & /*includeResizer*/ 8) {
				updating_checked = true;
				checkbox0_changes.checked = /*includeResizer*/ ctx[3];
				add_flush_callback(() => updating_checked = false);
			}

			checkbox0.$set(checkbox0_changes);
			const checkbox1_changes = {};

			if (!updating_value_1 && dirty & /*centerHtmlOutput*/ 2) {
				updating_value_1 = true;
				checkbox1_changes.value = /*centerHtmlOutput*/ ctx[1];
				add_flush_callback(() => updating_value_1 = false);
			}

			if (!updating_checked_1 && dirty & /*centerHtmlOutput*/ 2) {
				updating_checked_1 = true;
				checkbox1_changes.checked = /*centerHtmlOutput*/ ctx[1];
				add_flush_callback(() => updating_checked_1 = false);
			}

			checkbox1.$set(checkbox1_changes);
			const checkbox2_changes = {};

			if (!updating_value_2 && dirty & /*fluid*/ 4) {
				updating_value_2 = true;
				checkbox2_changes.value = /*fluid*/ ctx[2];
				add_flush_callback(() => updating_value_2 = false);
			}

			if (!updating_checked_2 && dirty & /*fluid*/ 4) {
				updating_checked_2 = true;
				checkbox2_changes.checked = /*fluid*/ ctx[2];
				add_flush_callback(() => updating_checked_2 = false);
			}

			checkbox2.$set(checkbox2_changes);
			const input_changes = {};

			if (!updating_value_3 && dirty & /*maxWidth*/ 16) {
				updating_value_3 = true;
				input_changes.value = /*maxWidth*/ ctx[4];
				add_flush_callback(() => updating_value_3 = false);
			}

			input.$set(input_changes);
			const textarea_changes = {};

			if (!updating_value_4 && dirty & /*customScript*/ 1) {
				updating_value_4 = true;
				textarea_changes.value = /*customScript*/ ctx[0];
				add_flush_callback(() => updating_value_4 = false);
			}

			textarea.$set(textarea_changes);
		},
		i(local) {
			if (current) return;
			transition_in(checkbox0.$$.fragment, local);
			transition_in(checkbox1.$$.fragment, local);
			transition_in(checkbox2.$$.fragment, local);
			transition_in(input.$$.fragment, local);
			transition_in(textarea.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(checkbox0.$$.fragment, local);
			transition_out(checkbox1.$$.fragment, local);
			transition_out(checkbox2.$$.fragment, local);
			transition_out(input.$$.fragment, local);
			transition_out(textarea.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div9);
			destroy_component(checkbox0);
			destroy_component(checkbox1);
			destroy_component(checkbox2);
			destroy_component(input);
			destroy_component(textarea);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { centerHtmlOutput = false } = $$props;
	let { customScript = undefined } = $$props;
	let { fluid = false } = $$props;
	let { includeResizer = false } = $$props;
	let { maxWidth = undefined } = $$props;

	function checkbox0_value_binding(value) {
		includeResizer = value;
		$$invalidate(3, includeResizer);
	}

	function checkbox0_checked_binding(value) {
		includeResizer = value;
		$$invalidate(3, includeResizer);
	}

	const change_handler = () => dispatch("changeConfig");

	function checkbox1_value_binding(value) {
		centerHtmlOutput = value;
		$$invalidate(1, centerHtmlOutput);
	}

	function checkbox1_checked_binding(value) {
		centerHtmlOutput = value;
		$$invalidate(1, centerHtmlOutput);
	}

	const change_handler_1 = () => dispatch("changeConfig");

	function checkbox2_value_binding(value) {
		fluid = value;
		$$invalidate(2, fluid);
	}

	function checkbox2_checked_binding(value) {
		fluid = value;
		$$invalidate(2, fluid);
	}

	const change_handler_2 = () => dispatch("changeConfig");

	function input_value_binding(value) {
		maxWidth = value;
		$$invalidate(4, maxWidth);
	}

	const change_handler_3 = () => dispatch("changeConfig");

	function textarea_value_binding(value) {
		customScript = value;
		$$invalidate(0, customScript);
	}

	const change_handler_4 = () => dispatch("changeConfig");

	$$self.$$set = $$props => {
		if ('centerHtmlOutput' in $$props) $$invalidate(1, centerHtmlOutput = $$props.centerHtmlOutput);
		if ('customScript' in $$props) $$invalidate(0, customScript = $$props.customScript);
		if ('fluid' in $$props) $$invalidate(2, fluid = $$props.fluid);
		if ('includeResizer' in $$props) $$invalidate(3, includeResizer = $$props.includeResizer);
		if ('maxWidth' in $$props) $$invalidate(4, maxWidth = $$props.maxWidth);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*customScript*/ 1) {
			console.log(customScript);
		}
	};

	return [
		customScript,
		centerHtmlOutput,
		fluid,
		includeResizer,
		maxWidth,
		dispatch,
		checkbox0_value_binding,
		checkbox0_checked_binding,
		change_handler,
		checkbox1_value_binding,
		checkbox1_checked_binding,
		change_handler_1,
		checkbox2_value_binding,
		checkbox2_checked_binding,
		change_handler_2,
		input_value_binding,
		change_handler_3,
		textarea_value_binding,
		change_handler_4
	];
}

class Page extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$4, create_fragment$5, safe_not_equal, {
			centerHtmlOutput: 1,
			customScript: 0,
			fluid: 2,
			includeResizer: 3,
			maxWidth: 4
		});
	}
}

const PreviewCard_svelte_svelte_type_style_lang = '';

/* src/ui/components/Layout/PreviewCard.svelte generated by Svelte v3.55.0 */

function create_if_block_3(ctx) {
	let i;
	let i_class_value;

	return {
		c() {
			i = element("i");
			attr(i, "class", i_class_value = "text-base fa-sharp fa-solid fa-" + /*icon*/ ctx[1] + " svelte-16x82zp");
		},
		m(target, anchor) {
			insert(target, i, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*icon*/ 2 && i_class_value !== (i_class_value = "text-base fa-sharp fa-solid fa-" + /*icon*/ ctx[1] + " svelte-16x82zp")) {
				attr(i, "class", i_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(i);
		}
	};
}

// (24:4) {#if src}
function create_if_block_2$1(ctx) {
	let img;
	let img_src_value;

	return {
		c() {
			img = element("img");
			attr(img, "class", "w-full h-full");
			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[4])) attr(img, "src", img_src_value);
			attr(img, "alt", "asset thumbnail");
		},
		m(target, anchor) {
			insert(target, img, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*src*/ 16 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[4])) {
				attr(img, "src", img_src_value);
			}
		},
		d(detaching) {
			if (detaching) detach(img);
		}
	};
}

// (29:4) {#if title}
function create_if_block_1$2(ctx) {
	let h5;
	let t0;
	let t1;
	let t2_value = /*extension*/ ctx[0].toLowerCase() + "";
	let t2;

	return {
		c() {
			h5 = element("h5");
			t0 = text(/*title*/ ctx[5]);
			t1 = text(".");
			t2 = text(t2_value);
			attr(h5, "class", "m-0 text-xs font-bold");
		},
		m(target, anchor) {
			insert(target, h5, anchor);
			append(h5, t0);
			append(h5, t1);
			append(h5, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*title*/ 32) set_data(t0, /*title*/ ctx[5]);
			if (dirty & /*extension*/ 1 && t2_value !== (t2_value = /*extension*/ ctx[0].toLowerCase() + "")) set_data(t2, t2_value);
		},
		d(detaching) {
			if (detaching) detach(h5);
		}
	};
}

// (32:4) {#if size}
function create_if_block$3(ctx) {
	let h5;
	let t0_value = /*displaySize*/ ctx[6](/*size*/ ctx[3]) + "";
	let t0;
	let t1;

	let t2_value = (/*extension*/ ctx[0] === "SVG"
	? ""
	: `(${/*scale*/ ctx[2]}x)`) + "";

	let t2;

	return {
		c() {
			h5 = element("h5");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			attr(h5, "class", "m-0 text-xs");
		},
		m(target, anchor) {
			insert(target, h5, anchor);
			append(h5, t0);
			append(h5, t1);
			append(h5, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*size*/ 8 && t0_value !== (t0_value = /*displaySize*/ ctx[6](/*size*/ ctx[3]) + "")) set_data(t0, t0_value);

			if (dirty & /*extension, scale*/ 5 && t2_value !== (t2_value = (/*extension*/ ctx[0] === "SVG"
			? ""
			: `(${/*scale*/ ctx[2]}x)`) + "")) set_data(t2, t2_value);
		},
		d(detaching) {
			if (detaching) detach(h5);
		}
	};
}

function create_fragment$4(ctx) {
	let div2;
	let div0;
	let t0;
	let t1;
	let div1;
	let t2;
	let if_block0 = /*icon*/ ctx[1] && create_if_block_3(ctx);
	let if_block1 = /*src*/ ctx[4] && create_if_block_2$1(ctx);
	let if_block2 = /*title*/ ctx[5] && create_if_block_1$2(ctx);
	let if_block3 = /*size*/ ctx[3] && create_if_block$3(ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			div1 = element("div");
			if (if_block2) if_block2.c();
			t2 = space();
			if (if_block3) if_block3.c();
			attr(div0, "class", "w-16 h-16 rounded-md flex items-center justify-center");
			attr(div1, "class", "flex-grow flex-col gap-1");
			attr(div2, "class", "container w-full flex gap-2 p-2 rounded-lg items-center svelte-16x82zp");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			if (if_block0) if_block0.m(div0, null);
			append(div0, t0);
			if (if_block1) if_block1.m(div0, null);
			append(div2, t1);
			append(div2, div1);
			if (if_block2) if_block2.m(div1, null);
			append(div1, t2);
			if (if_block3) if_block3.m(div1, null);
		},
		p(ctx, [dirty]) {
			if (/*icon*/ ctx[1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(div0, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*src*/ ctx[4]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_2$1(ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*title*/ ctx[5]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_1$2(ctx);
					if_block2.c();
					if_block2.m(div1, t2);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*size*/ ctx[3]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block$3(ctx);
					if_block3.c();
					if_block3.m(div1, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div2);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { extension = undefined } = $$props;
	let { icon = undefined } = $$props;
	let { scale = undefined } = $$props;
	let { size = undefined } = $$props;
	let { src = undefined } = $$props;
	let { title = undefined } = $$props;

	const displaySize = size => {
		const rounded = {
			width: Math.round(size.width),
			height: Math.round(size.height)
		};

		return `${rounded.width}x${rounded.height}`;
	};

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(0, extension = $$props.extension);
		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
		if ('scale' in $$props) $$invalidate(2, scale = $$props.scale);
		if ('size' in $$props) $$invalidate(3, size = $$props.size);
		if ('src' in $$props) $$invalidate(4, src = $$props.src);
		if ('title' in $$props) $$invalidate(5, title = $$props.title);
	};

	return [extension, icon, scale, size, src, title, displaySize];
}

class PreviewCard extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$3, create_fragment$4, safe_not_equal, {
			extension: 0,
			icon: 1,
			scale: 2,
			size: 3,
			src: 4,
			title: 5
		});
	}
}

const Overlay_svelte_svelte_type_style_lang = '';

/* src/ui/components/Overlay.svelte generated by Svelte v3.55.0 */

function create_fragment$3(ctx) {
	let div1;
	let div1_outro;
	let current;

	return {
		c() {
			div1 = element("div");
			div1.innerHTML = `<div class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"><i class="mr-2 text-xl fa-sharp fa-solid fa-spin fa-spinner-third"></i></div>`;
			attr(div1, "class", "overlay absolute top-0 left-0 w-full h-full min-h-[200px] bg-white z-[999] svelte-g32ljl");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			if (div1_outro) div1_outro.end(1);
			current = true;
		},
		o(local) {
			div1_outro = create_out_transition(div1, fade, {});
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (detaching && div1_outro) div1_outro.end();
		}
	};
}

class Overlay extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$3, safe_not_equal, {});
	}
}

/* src/ui/components/Controls/Preview.svelte generated by Svelte v3.55.0 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (12:4) {#if showLoader === true || showLoader === undefined}
function create_if_block_2(ctx) {
	let overlay;
	let current;
	overlay = new Overlay({});

	return {
		c() {
			create_component(overlay.$$.fragment);
		},
		m(target, anchor) {
			mount_component(overlay, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(overlay.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(overlay.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(overlay, detaching);
		}
	};
}

// (15:4) {#if exampleAssets.length > 0}
function create_if_block$2(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*exampleFile*/ ctx[1] && create_if_block_1$1(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*exampleFile*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*exampleFile*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (16:8) {#if exampleFile}
function create_if_block_1$1(ctx) {
	let previewcard;
	let current;

	previewcard = new PreviewCard({
			props: {
				icon: "file",
				title: /*exampleFile*/ ctx[1].filename,
				extension: /*exampleFile*/ ctx[1].extension.value
			}
		});

	return {
		c() {
			create_component(previewcard.$$.fragment);
		},
		m(target, anchor) {
			mount_component(previewcard, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const previewcard_changes = {};
			if (dirty & /*exampleFile*/ 2) previewcard_changes.title = /*exampleFile*/ ctx[1].filename;
			if (dirty & /*exampleFile*/ 2) previewcard_changes.extension = /*exampleFile*/ ctx[1].extension.value;
			previewcard.$set(previewcard_changes);
		},
		i(local) {
			if (current) return;
			transition_in(previewcard.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(previewcard.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(previewcard, detaching);
		}
	};
}

// (20:4) {#each exampleAssets as asset}
function create_each_block(ctx) {
	let previewcard;
	let current;

	previewcard = new PreviewCard({
			props: {
				title: /*asset*/ ctx[4].filename,
				extension: /*asset*/ ctx[4].extension.value,
				size: /*asset*/ ctx[4].size,
				scale: /*scale*/ ctx[2].value,
				src: /*asset*/ ctx[4].url
			}
		});

	return {
		c() {
			create_component(previewcard.$$.fragment);
		},
		m(target, anchor) {
			mount_component(previewcard, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const previewcard_changes = {};
			if (dirty & /*exampleAssets*/ 1) previewcard_changes.title = /*asset*/ ctx[4].filename;
			if (dirty & /*exampleAssets*/ 1) previewcard_changes.extension = /*asset*/ ctx[4].extension.value;
			if (dirty & /*exampleAssets*/ 1) previewcard_changes.size = /*asset*/ ctx[4].size;
			if (dirty & /*scale*/ 4) previewcard_changes.scale = /*scale*/ ctx[2].value;
			if (dirty & /*exampleAssets*/ 1) previewcard_changes.src = /*asset*/ ctx[4].url;
			previewcard.$set(previewcard_changes);
		},
		i(local) {
			if (current) return;
			transition_in(previewcard.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(previewcard.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(previewcard, detaching);
		}
	};
}

function create_fragment$2(ctx) {
	let div;
	let t0;
	let t1;
	let current;
	let if_block0 = (/*showLoader*/ ctx[3] === true || /*showLoader*/ ctx[3] === undefined) && create_if_block_2();
	let if_block1 = /*exampleAssets*/ ctx[0].length > 0 && create_if_block$2(ctx);
	let each_value = /*exampleAssets*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "w-full flex flex-wrap gap-2 relative");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if (if_block0) if_block0.m(div, null);
			append(div, t0);
			if (if_block1) if_block1.m(div, null);
			append(div, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (/*showLoader*/ ctx[3] === true || /*showLoader*/ ctx[3] === undefined) {
				if (if_block0) {
					if (dirty & /*showLoader*/ 8) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_2();
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div, t0);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*exampleAssets*/ ctx[0].length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*exampleAssets*/ 1) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block$2(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div, t1);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (dirty & /*exampleAssets, scale*/ 5) {
				each_value = /*exampleAssets*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { exampleAssets = [] } = $$props;
	let { exampleFile = undefined } = $$props;
	let { scale = undefined } = $$props;
	let { showLoader } = $$props;

	$$self.$$set = $$props => {
		if ('exampleAssets' in $$props) $$invalidate(0, exampleAssets = $$props.exampleAssets);
		if ('exampleFile' in $$props) $$invalidate(1, exampleFile = $$props.exampleFile);
		if ('scale' in $$props) $$invalidate(2, scale = $$props.scale);
		if ('showLoader' in $$props) $$invalidate(3, showLoader = $$props.showLoader);
	};

	return [exampleAssets, exampleFile, scale, showLoader];
}

class Preview extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			exampleAssets: 0,
			exampleFile: 1,
			scale: 2,
			showLoader: 3
		});
	}
}

/* src/ui/components/Controls/Text.svelte generated by Svelte v3.55.0 */

function create_if_block$1(ctx) {
	let hovericon;
	let current;

	hovericon = new HoverIcon({
			props: {
				text: true,
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			}
		});

	hovericon.$on("onClick", /*onClick_handler*/ ctx[18]);

	return {
		c() {
			create_component(hovericon.$$.fragment);
		},
		m(target, anchor) {
			mount_component(hovericon, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const hovericon_changes = {};

			if (dirty & /*$$scope*/ 524288) {
				hovericon_changes.$$scope = { dirty, ctx };
			}

			hovericon.$set(hovericon_changes);
		},
		i(local) {
			if (current) return;
			transition_in(hovericon.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hovericon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(hovericon, detaching);
		}
	};
}

// (22:4) <HoverIcon text={true} on:onClick={() => dispatch("writeVariables")}>
function create_default_slot$1(ctx) {
	let i;
	let t0;
	let p;

	return {
		c() {
			i = element("i");
			t0 = space();
			p = element("p");
			p.textContent = "Generate variable text";
			attr(i, "class", "mr-2 text-xs fa-sharp fa-solid fa-text");
			attr(p, "class", "m-0 text-xs");
		},
		m(target, anchor) {
			insert(target, i, anchor);
			insert(target, t0, anchor);
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(i);
			if (detaching) detach(t0);
			if (detaching) detach(p);
		}
	};
}

function create_fragment$1(ctx) {
	let div;
	let checkbox0;
	let updating_value;
	let updating_checked;
	let t0;
	let checkbox1;
	let updating_value_1;
	let updating_checked_1;
	let t1;
	let checkbox2;
	let updating_value_2;
	let updating_checked_2;
	let t2;
	let checkbox3;
	let updating_value_3;
	let updating_checked_3;
	let t3;
	let current;

	function checkbox0_value_binding(value) {
		/*checkbox0_value_binding*/ ctx[6](value);
	}

	function checkbox0_checked_binding(value) {
		/*checkbox0_checked_binding*/ ctx[7](value);
	}

	let checkbox0_props = { label: "Style text segments" };

	if (/*styleTextSegments*/ ctx[3] !== void 0) {
		checkbox0_props.value = /*styleTextSegments*/ ctx[3];
	}

	if (/*styleTextSegments*/ ctx[3] !== void 0) {
		checkbox0_props.checked = /*styleTextSegments*/ ctx[3];
	}

	checkbox0 = new Checkbox({ props: checkbox0_props });
	binding_callbacks.push(() => bind(checkbox0, 'value', checkbox0_value_binding, /*styleTextSegments*/ ctx[3]));
	binding_callbacks.push(() => bind(checkbox0, 'checked', checkbox0_checked_binding, /*styleTextSegments*/ ctx[3]));
	checkbox0.$on("change", /*change_handler*/ ctx[8]);

	function checkbox1_value_binding(value) {
		/*checkbox1_value_binding*/ ctx[9](value);
	}

	function checkbox1_checked_binding(value) {
		/*checkbox1_checked_binding*/ ctx[10](value);
	}

	let checkbox1_props = { label: "Include Figma styles as classes" };

	if (/*applyStyleNames*/ ctx[1] !== void 0) {
		checkbox1_props.value = /*applyStyleNames*/ ctx[1];
	}

	if (/*applyStyleNames*/ ctx[1] !== void 0) {
		checkbox1_props.checked = /*applyStyleNames*/ ctx[1];
	}

	checkbox1 = new Checkbox({ props: checkbox1_props });
	binding_callbacks.push(() => bind(checkbox1, 'value', checkbox1_value_binding, /*applyStyleNames*/ ctx[1]));
	binding_callbacks.push(() => bind(checkbox1, 'checked', checkbox1_checked_binding, /*applyStyleNames*/ ctx[1]));
	checkbox1.$on("change", /*change_handler_1*/ ctx[11]);

	function checkbox2_value_binding(value) {
		/*checkbox2_value_binding*/ ctx[12](value);
	}

	function checkbox2_checked_binding(value) {
		/*checkbox2_checked_binding*/ ctx[13](value);
	}

	let checkbox2_props = {
		label: "Convert header styles to <h> tags"
	};

	if (/*applyHtags*/ ctx[0] !== void 0) {
		checkbox2_props.value = /*applyHtags*/ ctx[0];
	}

	if (/*applyHtags*/ ctx[0] !== void 0) {
		checkbox2_props.checked = /*applyHtags*/ ctx[0];
	}

	checkbox2 = new Checkbox({ props: checkbox2_props });
	binding_callbacks.push(() => bind(checkbox2, 'value', checkbox2_value_binding, /*applyHtags*/ ctx[0]));
	binding_callbacks.push(() => bind(checkbox2, 'checked', checkbox2_checked_binding, /*applyHtags*/ ctx[0]));
	checkbox2.$on("change", /*change_handler_2*/ ctx[14]);

	function checkbox3_value_binding(value) {
		/*checkbox3_value_binding*/ ctx[15](value);
	}

	function checkbox3_checked_binding(value) {
		/*checkbox3_checked_binding*/ ctx[16](value);
	}

	let checkbox3_props = { label: "Include Google fonts" };

	if (/*includeGoogleFonts*/ ctx[2] !== void 0) {
		checkbox3_props.value = /*includeGoogleFonts*/ ctx[2];
	}

	if (/*includeGoogleFonts*/ ctx[2] !== void 0) {
		checkbox3_props.checked = /*includeGoogleFonts*/ ctx[2];
	}

	checkbox3 = new Checkbox({ props: checkbox3_props });
	binding_callbacks.push(() => bind(checkbox3, 'value', checkbox3_value_binding, /*includeGoogleFonts*/ ctx[2]));
	binding_callbacks.push(() => bind(checkbox3, 'checked', checkbox3_checked_binding, /*includeGoogleFonts*/ ctx[2]));
	checkbox3.$on("change", /*change_handler_3*/ ctx[17]);
	let if_block = /*showVariablesButton*/ ctx[4] && create_if_block$1(ctx);

	return {
		c() {
			div = element("div");
			create_component(checkbox0.$$.fragment);
			t0 = space();
			create_component(checkbox1.$$.fragment);
			t1 = space();
			create_component(checkbox2.$$.fragment);
			t2 = space();
			create_component(checkbox3.$$.fragment);
			t3 = space();
			if (if_block) if_block.c();
			attr(div, "class", "w-full flex flex-col gap-2");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(checkbox0, div, null);
			append(div, t0);
			mount_component(checkbox1, div, null);
			append(div, t1);
			mount_component(checkbox2, div, null);
			append(div, t2);
			mount_component(checkbox3, div, null);
			append(div, t3);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const checkbox0_changes = {};

			if (!updating_value && dirty & /*styleTextSegments*/ 8) {
				updating_value = true;
				checkbox0_changes.value = /*styleTextSegments*/ ctx[3];
				add_flush_callback(() => updating_value = false);
			}

			if (!updating_checked && dirty & /*styleTextSegments*/ 8) {
				updating_checked = true;
				checkbox0_changes.checked = /*styleTextSegments*/ ctx[3];
				add_flush_callback(() => updating_checked = false);
			}

			checkbox0.$set(checkbox0_changes);
			const checkbox1_changes = {};

			if (!updating_value_1 && dirty & /*applyStyleNames*/ 2) {
				updating_value_1 = true;
				checkbox1_changes.value = /*applyStyleNames*/ ctx[1];
				add_flush_callback(() => updating_value_1 = false);
			}

			if (!updating_checked_1 && dirty & /*applyStyleNames*/ 2) {
				updating_checked_1 = true;
				checkbox1_changes.checked = /*applyStyleNames*/ ctx[1];
				add_flush_callback(() => updating_checked_1 = false);
			}

			checkbox1.$set(checkbox1_changes);
			const checkbox2_changes = {};

			if (!updating_value_2 && dirty & /*applyHtags*/ 1) {
				updating_value_2 = true;
				checkbox2_changes.value = /*applyHtags*/ ctx[0];
				add_flush_callback(() => updating_value_2 = false);
			}

			if (!updating_checked_2 && dirty & /*applyHtags*/ 1) {
				updating_checked_2 = true;
				checkbox2_changes.checked = /*applyHtags*/ ctx[0];
				add_flush_callback(() => updating_checked_2 = false);
			}

			checkbox2.$set(checkbox2_changes);
			const checkbox3_changes = {};

			if (!updating_value_3 && dirty & /*includeGoogleFonts*/ 4) {
				updating_value_3 = true;
				checkbox3_changes.value = /*includeGoogleFonts*/ ctx[2];
				add_flush_callback(() => updating_value_3 = false);
			}

			if (!updating_checked_3 && dirty & /*includeGoogleFonts*/ 4) {
				updating_checked_3 = true;
				checkbox3_changes.checked = /*includeGoogleFonts*/ ctx[2];
				add_flush_callback(() => updating_checked_3 = false);
			}

			checkbox3.$set(checkbox3_changes);

			if (/*showVariablesButton*/ ctx[4]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*showVariablesButton*/ 16) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(checkbox0.$$.fragment, local);
			transition_in(checkbox1.$$.fragment, local);
			transition_in(checkbox2.$$.fragment, local);
			transition_in(checkbox3.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(checkbox0.$$.fragment, local);
			transition_out(checkbox1.$$.fragment, local);
			transition_out(checkbox2.$$.fragment, local);
			transition_out(checkbox3.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(checkbox0);
			destroy_component(checkbox1);
			destroy_component(checkbox2);
			destroy_component(checkbox3);
			if (if_block) if_block.d();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { applyHtags = false } = $$props;
	let { applyStyleNames = false } = $$props;
	let { includeGoogleFonts = false } = $$props;
	let { showVariablesButton = false } = $$props;
	let { styleTextSegments = false } = $$props;

	function checkbox0_value_binding(value) {
		styleTextSegments = value;
		$$invalidate(3, styleTextSegments);
	}

	function checkbox0_checked_binding(value) {
		styleTextSegments = value;
		$$invalidate(3, styleTextSegments);
	}

	const change_handler = () => dispatch("changeConfig");

	function checkbox1_value_binding(value) {
		applyStyleNames = value;
		$$invalidate(1, applyStyleNames);
	}

	function checkbox1_checked_binding(value) {
		applyStyleNames = value;
		$$invalidate(1, applyStyleNames);
	}

	const change_handler_1 = () => dispatch("changeConfig");

	function checkbox2_value_binding(value) {
		applyHtags = value;
		$$invalidate(0, applyHtags);
	}

	function checkbox2_checked_binding(value) {
		applyHtags = value;
		$$invalidate(0, applyHtags);
	}

	const change_handler_2 = () => dispatch("changeConfig");

	function checkbox3_value_binding(value) {
		includeGoogleFonts = value;
		$$invalidate(2, includeGoogleFonts);
	}

	function checkbox3_checked_binding(value) {
		includeGoogleFonts = value;
		$$invalidate(2, includeGoogleFonts);
	}

	const change_handler_3 = () => dispatch("changeConfig");
	const onClick_handler = () => dispatch("writeVariables");

	$$self.$$set = $$props => {
		if ('applyHtags' in $$props) $$invalidate(0, applyHtags = $$props.applyHtags);
		if ('applyStyleNames' in $$props) $$invalidate(1, applyStyleNames = $$props.applyStyleNames);
		if ('includeGoogleFonts' in $$props) $$invalidate(2, includeGoogleFonts = $$props.includeGoogleFonts);
		if ('showVariablesButton' in $$props) $$invalidate(4, showVariablesButton = $$props.showVariablesButton);
		if ('styleTextSegments' in $$props) $$invalidate(3, styleTextSegments = $$props.styleTextSegments);
	};

	return [
		applyHtags,
		applyStyleNames,
		includeGoogleFonts,
		styleTextSegments,
		showVariablesButton,
		dispatch,
		checkbox0_value_binding,
		checkbox0_checked_binding,
		change_handler,
		checkbox1_value_binding,
		checkbox1_checked_binding,
		change_handler_1,
		checkbox2_value_binding,
		checkbox2_checked_binding,
		change_handler_2,
		checkbox3_value_binding,
		checkbox3_checked_binding,
		change_handler_3,
		onClick_handler
	];
}

class Text extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			applyHtags: 0,
			applyStyleNames: 1,
			includeGoogleFonts: 2,
			showVariablesButton: 4,
			styleTextSegments: 3
		});
	}
}

const App_svelte_svelte_type_style_lang = '';

/* src/ui/App.svelte generated by Svelte v3.55.0 */

function create_if_block_1(ctx) {
	let panel0;
	let updating_expanded;
	let t0;
	let panel1;
	let updating_expanded_1;
	let t1;
	let panel2;
	let updating_expanded_2;
	let t2;
	let panel3;
	let updating_expanded_3;
	let current;

	function panel0_expanded_binding(value) {
		/*panel0_expanded_binding*/ ctx[42](value);
	}

	let panel0_props = {
		title: "File settings",
		$$slots: { default: [create_default_slot_4] },
		$$scope: { ctx }
	};

	if (/*views*/ ctx[7].file !== void 0) {
		panel0_props.expanded = /*views*/ ctx[7].file;
	}

	panel0 = new Panel({ props: panel0_props });
	binding_callbacks.push(() => bind(panel0, 'expanded', panel0_expanded_binding, /*views*/ ctx[7].file));
	panel0.$on("changeView", /*onChangeView*/ ctx[29]);

	function panel1_expanded_binding(value) {
		/*panel1_expanded_binding*/ ctx[49](value);
	}

	let panel1_props = {
		title: "Image settings",
		$$slots: { default: [create_default_slot_3] },
		$$scope: { ctx }
	};

	if (/*views*/ ctx[7].images !== void 0) {
		panel1_props.expanded = /*views*/ ctx[7].images;
	}

	panel1 = new Panel({ props: panel1_props });
	binding_callbacks.push(() => bind(panel1, 'expanded', panel1_expanded_binding, /*views*/ ctx[7].images));
	panel1.$on("changeView", /*onChangeView*/ ctx[29]);

	function panel2_expanded_binding(value) {
		/*panel2_expanded_binding*/ ctx[55](value);
	}

	let panel2_props = {
		title: "Page settings",
		$$slots: { default: [create_default_slot_2] },
		$$scope: { ctx }
	};

	if (/*views*/ ctx[7].page !== void 0) {
		panel2_props.expanded = /*views*/ ctx[7].page;
	}

	panel2 = new Panel({ props: panel2_props });
	binding_callbacks.push(() => bind(panel2, 'expanded', panel2_expanded_binding, /*views*/ ctx[7].page));
	panel2.$on("changeView", /*onChangeView*/ ctx[29]);

	function panel3_expanded_binding(value) {
		/*panel3_expanded_binding*/ ctx[61](value);
	}

	let panel3_props = {
		title: "Text settings",
		$$slots: { default: [create_default_slot_1] },
		$$scope: { ctx }
	};

	if (/*views*/ ctx[7].text !== void 0) {
		panel3_props.expanded = /*views*/ ctx[7].text;
	}

	panel3 = new Panel({ props: panel3_props });
	binding_callbacks.push(() => bind(panel3, 'expanded', panel3_expanded_binding, /*views*/ ctx[7].text));
	panel3.$on("changeView", /*onChangeView*/ ctx[29]);

	return {
		c() {
			create_component(panel0.$$.fragment);
			t0 = space();
			create_component(panel1.$$.fragment);
			t1 = space();
			create_component(panel2.$$.fragment);
			t2 = space();
			create_component(panel3.$$.fragment);
		},
		m(target, anchor) {
			mount_component(panel0, target, anchor);
			insert(target, t0, anchor);
			mount_component(panel1, target, anchor);
			insert(target, t1, anchor);
			mount_component(panel2, target, anchor);
			insert(target, t2, anchor);
			mount_component(panel3, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const panel0_changes = {};

			if (dirty[0] & /*fileType, testingMode, fileTypeOptions, syntax, errorMessage*/ 2371 | dirty[2] & /*$$scope*/ 32768) {
				panel0_changes.$$scope = { dirty, ctx };
			}

			if (!updating_expanded && dirty[0] & /*views*/ 128) {
				updating_expanded = true;
				panel0_changes.expanded = /*views*/ ctx[7].file;
				add_flush_callback(() => updating_expanded = false);
			}

			panel0.$set(panel0_changes);
			const panel1_changes = {};

			if (dirty[0] & /*scaleOptions, scale, extensionOptions, extension, imagePath, altText*/ 786492 | dirty[2] & /*$$scope*/ 32768) {
				panel1_changes.$$scope = { dirty, ctx };
			}

			if (!updating_expanded_1 && dirty[0] & /*views*/ 128) {
				updating_expanded_1 = true;
				panel1_changes.expanded = /*views*/ ctx[7].images;
				add_flush_callback(() => updating_expanded_1 = false);
			}

			panel1.$set(panel1_changes);
			const panel2_changes = {};

			if (dirty[0] & /*includeResizer, centerHtmlOutput, fluid, maxWidth, customScript*/ 1185280 | dirty[2] & /*$$scope*/ 32768) {
				panel2_changes.$$scope = { dirty, ctx };
			}

			if (!updating_expanded_2 && dirty[0] & /*views*/ 128) {
				updating_expanded_2 = true;
				panel2_changes.expanded = /*views*/ ctx[7].page;
				add_flush_callback(() => updating_expanded_2 = false);
			}

			panel2.$set(panel2_changes);
			const panel3_changes = {};

			if (dirty[0] & /*showVariablesButton, styleTextSegments, applyStyleNames, applyHtags, includeGoogleFonts*/ 16900096 | dirty[2] & /*$$scope*/ 32768) {
				panel3_changes.$$scope = { dirty, ctx };
			}

			if (!updating_expanded_3 && dirty[0] & /*views*/ 128) {
				updating_expanded_3 = true;
				panel3_changes.expanded = /*views*/ ctx[7].text;
				add_flush_callback(() => updating_expanded_3 = false);
			}

			panel3.$set(panel3_changes);
		},
		i(local) {
			if (current) return;
			transition_in(panel0.$$.fragment, local);
			transition_in(panel1.$$.fragment, local);
			transition_in(panel2.$$.fragment, local);
			transition_in(panel3.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(panel0.$$.fragment, local);
			transition_out(panel1.$$.fragment, local);
			transition_out(panel2.$$.fragment, local);
			transition_out(panel3.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(panel0, detaching);
			if (detaching) detach(t0);
			destroy_component(panel1, detaching);
			if (detaching) detach(t1);
			destroy_component(panel2, detaching);
			if (detaching) detach(t2);
			destroy_component(panel3, detaching);
		}
	};
}

// (264:3) <Panel title="File settings" bind:expanded={views.file} on:changeView={onChangeView}>
function create_default_slot_4(ctx) {
	let file;
	let updating_fileType;
	let updating_testingMode;
	let updating_menuItems;
	let updating_syntax;
	let updating_errorMessage;
	let current;

	function file_fileType_binding(value) {
		/*file_fileType_binding*/ ctx[36](value);
	}

	function file_testingMode_binding(value) {
		/*file_testingMode_binding*/ ctx[37](value);
	}

	function file_menuItems_binding(value) {
		/*file_menuItems_binding*/ ctx[38](value);
	}

	function file_syntax_binding(value) {
		/*file_syntax_binding*/ ctx[39](value);
	}

	function file_errorMessage_binding(value) {
		/*file_errorMessage_binding*/ ctx[40](value);
	}

	let file_props = {};

	if (/*fileType*/ ctx[0] !== void 0) {
		file_props.fileType = /*fileType*/ ctx[0];
	}

	if (/*testingMode*/ ctx[11] !== void 0) {
		file_props.testingMode = /*testingMode*/ ctx[11];
	}

	if (/*fileTypeOptions*/ ctx[1] !== void 0) {
		file_props.menuItems = /*fileTypeOptions*/ ctx[1];
	}

	if (/*syntax*/ ctx[8] !== void 0) {
		file_props.syntax = /*syntax*/ ctx[8];
	}

	if (/*errorMessage*/ ctx[6] !== void 0) {
		file_props.errorMessage = /*errorMessage*/ ctx[6];
	}

	file = new File({ props: file_props });
	binding_callbacks.push(() => bind(file, 'fileType', file_fileType_binding, /*fileType*/ ctx[0]));
	binding_callbacks.push(() => bind(file, 'testingMode', file_testingMode_binding, /*testingMode*/ ctx[11]));
	binding_callbacks.push(() => bind(file, 'menuItems', file_menuItems_binding, /*fileTypeOptions*/ ctx[1]));
	binding_callbacks.push(() => bind(file, 'syntax', file_syntax_binding, /*syntax*/ ctx[8]));
	binding_callbacks.push(() => bind(file, 'errorMessage', file_errorMessage_binding, /*errorMessage*/ ctx[6]));
	file.$on("changeConfig", /*onChangeConfig*/ ctx[26]);
	file.$on("sendError", /*sendError_handler*/ ctx[41]);

	return {
		c() {
			create_component(file.$$.fragment);
		},
		m(target, anchor) {
			mount_component(file, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const file_changes = {};

			if (!updating_fileType && dirty[0] & /*fileType*/ 1) {
				updating_fileType = true;
				file_changes.fileType = /*fileType*/ ctx[0];
				add_flush_callback(() => updating_fileType = false);
			}

			if (!updating_testingMode && dirty[0] & /*testingMode*/ 2048) {
				updating_testingMode = true;
				file_changes.testingMode = /*testingMode*/ ctx[11];
				add_flush_callback(() => updating_testingMode = false);
			}

			if (!updating_menuItems && dirty[0] & /*fileTypeOptions*/ 2) {
				updating_menuItems = true;
				file_changes.menuItems = /*fileTypeOptions*/ ctx[1];
				add_flush_callback(() => updating_menuItems = false);
			}

			if (!updating_syntax && dirty[0] & /*syntax*/ 256) {
				updating_syntax = true;
				file_changes.syntax = /*syntax*/ ctx[8];
				add_flush_callback(() => updating_syntax = false);
			}

			if (!updating_errorMessage && dirty[0] & /*errorMessage*/ 64) {
				updating_errorMessage = true;
				file_changes.errorMessage = /*errorMessage*/ ctx[6];
				add_flush_callback(() => updating_errorMessage = false);
			}

			file.$set(file_changes);
		},
		i(local) {
			if (current) return;
			transition_in(file.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(file.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(file, detaching);
		}
	};
}

// (275:3) <Panel title="Image settings" bind:expanded={views.images} on:changeView={onChangeView}>
function create_default_slot_3(ctx) {
	let images;
	let updating_scaleOptions;
	let updating_scale;
	let updating_extensionOptions;
	let updating_extension;
	let updating_imagePath;
	let updating_altText;
	let current;

	function images_scaleOptions_binding(value) {
		/*images_scaleOptions_binding*/ ctx[43](value);
	}

	function images_scale_binding(value) {
		/*images_scale_binding*/ ctx[44](value);
	}

	function images_extensionOptions_binding(value) {
		/*images_extensionOptions_binding*/ ctx[45](value);
	}

	function images_extension_binding(value) {
		/*images_extension_binding*/ ctx[46](value);
	}

	function images_imagePath_binding(value) {
		/*images_imagePath_binding*/ ctx[47](value);
	}

	function images_altText_binding(value) {
		/*images_altText_binding*/ ctx[48](value);
	}

	let images_props = {};

	if (/*scaleOptions*/ ctx[5] !== void 0) {
		images_props.scaleOptions = /*scaleOptions*/ ctx[5];
	}

	if (/*scale*/ ctx[4] !== void 0) {
		images_props.scale = /*scale*/ ctx[4];
	}

	if (/*extensionOptions*/ ctx[3] !== void 0) {
		images_props.extensionOptions = /*extensionOptions*/ ctx[3];
	}

	if (/*extension*/ ctx[2] !== void 0) {
		images_props.extension = /*extension*/ ctx[2];
	}

	if (/*imagePath*/ ctx[18] !== void 0) {
		images_props.imagePath = /*imagePath*/ ctx[18];
	}

	if (/*altText*/ ctx[19] !== void 0) {
		images_props.altText = /*altText*/ ctx[19];
	}

	images = new Images({ props: images_props });
	binding_callbacks.push(() => bind(images, 'scaleOptions', images_scaleOptions_binding, /*scaleOptions*/ ctx[5]));
	binding_callbacks.push(() => bind(images, 'scale', images_scale_binding, /*scale*/ ctx[4]));
	binding_callbacks.push(() => bind(images, 'extensionOptions', images_extensionOptions_binding, /*extensionOptions*/ ctx[3]));
	binding_callbacks.push(() => bind(images, 'extension', images_extension_binding, /*extension*/ ctx[2]));
	binding_callbacks.push(() => bind(images, 'imagePath', images_imagePath_binding, /*imagePath*/ ctx[18]));
	binding_callbacks.push(() => bind(images, 'altText', images_altText_binding, /*altText*/ ctx[19]));
	images.$on("changeConfig", /*onChangeConfig*/ ctx[26]);

	return {
		c() {
			create_component(images.$$.fragment);
		},
		m(target, anchor) {
			mount_component(images, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const images_changes = {};

			if (!updating_scaleOptions && dirty[0] & /*scaleOptions*/ 32) {
				updating_scaleOptions = true;
				images_changes.scaleOptions = /*scaleOptions*/ ctx[5];
				add_flush_callback(() => updating_scaleOptions = false);
			}

			if (!updating_scale && dirty[0] & /*scale*/ 16) {
				updating_scale = true;
				images_changes.scale = /*scale*/ ctx[4];
				add_flush_callback(() => updating_scale = false);
			}

			if (!updating_extensionOptions && dirty[0] & /*extensionOptions*/ 8) {
				updating_extensionOptions = true;
				images_changes.extensionOptions = /*extensionOptions*/ ctx[3];
				add_flush_callback(() => updating_extensionOptions = false);
			}

			if (!updating_extension && dirty[0] & /*extension*/ 4) {
				updating_extension = true;
				images_changes.extension = /*extension*/ ctx[2];
				add_flush_callback(() => updating_extension = false);
			}

			if (!updating_imagePath && dirty[0] & /*imagePath*/ 262144) {
				updating_imagePath = true;
				images_changes.imagePath = /*imagePath*/ ctx[18];
				add_flush_callback(() => updating_imagePath = false);
			}

			if (!updating_altText && dirty[0] & /*altText*/ 524288) {
				updating_altText = true;
				images_changes.altText = /*altText*/ ctx[19];
				add_flush_callback(() => updating_altText = false);
			}

			images.$set(images_changes);
		},
		i(local) {
			if (current) return;
			transition_in(images.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(images.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(images, detaching);
		}
	};
}

// (286:3) <Panel title="Page settings" bind:expanded={views.page} on:changeView={onChangeView}>
function create_default_slot_2(ctx) {
	let page;
	let updating_includeResizer;
	let updating_centerHtmlOutput;
	let updating_fluid;
	let updating_maxWidth;
	let updating_customScript;
	let current;

	function page_includeResizer_binding(value) {
		/*page_includeResizer_binding*/ ctx[50](value);
	}

	function page_centerHtmlOutput_binding(value) {
		/*page_centerHtmlOutput_binding*/ ctx[51](value);
	}

	function page_fluid_binding(value) {
		/*page_fluid_binding*/ ctx[52](value);
	}

	function page_maxWidth_binding(value) {
		/*page_maxWidth_binding*/ ctx[53](value);
	}

	function page_customScript_binding(value) {
		/*page_customScript_binding*/ ctx[54](value);
	}

	let page_props = {};

	if (/*includeResizer*/ ctx[9] !== void 0) {
		page_props.includeResizer = /*includeResizer*/ ctx[9];
	}

	if (/*centerHtmlOutput*/ ctx[12] !== void 0) {
		page_props.centerHtmlOutput = /*centerHtmlOutput*/ ctx[12];
	}

	if (/*fluid*/ ctx[10] !== void 0) {
		page_props.fluid = /*fluid*/ ctx[10];
	}

	if (/*maxWidth*/ ctx[17] !== void 0) {
		page_props.maxWidth = /*maxWidth*/ ctx[17];
	}

	if (/*customScript*/ ctx[20] !== void 0) {
		page_props.customScript = /*customScript*/ ctx[20];
	}

	page = new Page({ props: page_props });
	binding_callbacks.push(() => bind(page, 'includeResizer', page_includeResizer_binding, /*includeResizer*/ ctx[9]));
	binding_callbacks.push(() => bind(page, 'centerHtmlOutput', page_centerHtmlOutput_binding, /*centerHtmlOutput*/ ctx[12]));
	binding_callbacks.push(() => bind(page, 'fluid', page_fluid_binding, /*fluid*/ ctx[10]));
	binding_callbacks.push(() => bind(page, 'maxWidth', page_maxWidth_binding, /*maxWidth*/ ctx[17]));
	binding_callbacks.push(() => bind(page, 'customScript', page_customScript_binding, /*customScript*/ ctx[20]));
	page.$on("changeConfig", /*onChangeConfig*/ ctx[26]);

	return {
		c() {
			create_component(page.$$.fragment);
		},
		m(target, anchor) {
			mount_component(page, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const page_changes = {};

			if (!updating_includeResizer && dirty[0] & /*includeResizer*/ 512) {
				updating_includeResizer = true;
				page_changes.includeResizer = /*includeResizer*/ ctx[9];
				add_flush_callback(() => updating_includeResizer = false);
			}

			if (!updating_centerHtmlOutput && dirty[0] & /*centerHtmlOutput*/ 4096) {
				updating_centerHtmlOutput = true;
				page_changes.centerHtmlOutput = /*centerHtmlOutput*/ ctx[12];
				add_flush_callback(() => updating_centerHtmlOutput = false);
			}

			if (!updating_fluid && dirty[0] & /*fluid*/ 1024) {
				updating_fluid = true;
				page_changes.fluid = /*fluid*/ ctx[10];
				add_flush_callback(() => updating_fluid = false);
			}

			if (!updating_maxWidth && dirty[0] & /*maxWidth*/ 131072) {
				updating_maxWidth = true;
				page_changes.maxWidth = /*maxWidth*/ ctx[17];
				add_flush_callback(() => updating_maxWidth = false);
			}

			if (!updating_customScript && dirty[0] & /*customScript*/ 1048576) {
				updating_customScript = true;
				page_changes.customScript = /*customScript*/ ctx[20];
				add_flush_callback(() => updating_customScript = false);
			}

			page.$set(page_changes);
		},
		i(local) {
			if (current) return;
			transition_in(page.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(page.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(page, detaching);
		}
	};
}

// (296:3) <Panel title="Text settings" bind:expanded={views.text} on:changeView={onChangeView}>
function create_default_slot_1(ctx) {
	let text_1;
	let updating_showVariablesButton;
	let updating_styleTextSegments;
	let updating_applyStyleNames;
	let updating_applyHtags;
	let updating_includeGoogleFonts;
	let current;

	function text_1_showVariablesButton_binding(value) {
		/*text_1_showVariablesButton_binding*/ ctx[56](value);
	}

	function text_1_styleTextSegments_binding(value) {
		/*text_1_styleTextSegments_binding*/ ctx[57](value);
	}

	function text_1_applyStyleNames_binding(value) {
		/*text_1_applyStyleNames_binding*/ ctx[58](value);
	}

	function text_1_applyHtags_binding(value) {
		/*text_1_applyHtags_binding*/ ctx[59](value);
	}

	function text_1_includeGoogleFonts_binding(value) {
		/*text_1_includeGoogleFonts_binding*/ ctx[60](value);
	}

	let text_1_props = {};

	if (/*showVariablesButton*/ ctx[24] !== void 0) {
		text_1_props.showVariablesButton = /*showVariablesButton*/ ctx[24];
	}

	if (/*styleTextSegments*/ ctx[15] !== void 0) {
		text_1_props.styleTextSegments = /*styleTextSegments*/ ctx[15];
	}

	if (/*applyStyleNames*/ ctx[13] !== void 0) {
		text_1_props.applyStyleNames = /*applyStyleNames*/ ctx[13];
	}

	if (/*applyHtags*/ ctx[14] !== void 0) {
		text_1_props.applyHtags = /*applyHtags*/ ctx[14];
	}

	if (/*includeGoogleFonts*/ ctx[16] !== void 0) {
		text_1_props.includeGoogleFonts = /*includeGoogleFonts*/ ctx[16];
	}

	text_1 = new Text({ props: text_1_props });
	binding_callbacks.push(() => bind(text_1, 'showVariablesButton', text_1_showVariablesButton_binding, /*showVariablesButton*/ ctx[24]));
	binding_callbacks.push(() => bind(text_1, 'styleTextSegments', text_1_styleTextSegments_binding, /*styleTextSegments*/ ctx[15]));
	binding_callbacks.push(() => bind(text_1, 'applyStyleNames', text_1_applyStyleNames_binding, /*applyStyleNames*/ ctx[13]));
	binding_callbacks.push(() => bind(text_1, 'applyHtags', text_1_applyHtags_binding, /*applyHtags*/ ctx[14]));
	binding_callbacks.push(() => bind(text_1, 'includeGoogleFonts', text_1_includeGoogleFonts_binding, /*includeGoogleFonts*/ ctx[16]));
	text_1.$on("changeConfig", /*onChangeConfig*/ ctx[26]);
	text_1.$on("writeVariables", /*onWriteVariables*/ ctx[33]);

	return {
		c() {
			create_component(text_1.$$.fragment);
		},
		m(target, anchor) {
			mount_component(text_1, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const text_1_changes = {};

			if (!updating_showVariablesButton && dirty[0] & /*showVariablesButton*/ 16777216) {
				updating_showVariablesButton = true;
				text_1_changes.showVariablesButton = /*showVariablesButton*/ ctx[24];
				add_flush_callback(() => updating_showVariablesButton = false);
			}

			if (!updating_styleTextSegments && dirty[0] & /*styleTextSegments*/ 32768) {
				updating_styleTextSegments = true;
				text_1_changes.styleTextSegments = /*styleTextSegments*/ ctx[15];
				add_flush_callback(() => updating_styleTextSegments = false);
			}

			if (!updating_applyStyleNames && dirty[0] & /*applyStyleNames*/ 8192) {
				updating_applyStyleNames = true;
				text_1_changes.applyStyleNames = /*applyStyleNames*/ ctx[13];
				add_flush_callback(() => updating_applyStyleNames = false);
			}

			if (!updating_applyHtags && dirty[0] & /*applyHtags*/ 16384) {
				updating_applyHtags = true;
				text_1_changes.applyHtags = /*applyHtags*/ ctx[14];
				add_flush_callback(() => updating_applyHtags = false);
			}

			if (!updating_includeGoogleFonts && dirty[0] & /*includeGoogleFonts*/ 65536) {
				updating_includeGoogleFonts = true;
				text_1_changes.includeGoogleFonts = /*includeGoogleFonts*/ ctx[16];
				add_flush_callback(() => updating_includeGoogleFonts = false);
			}

			text_1.$set(text_1_changes);
		},
		i(local) {
			if (current) return;
			transition_in(text_1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(text_1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(text_1, detaching);
		}
	};
}

// (310:2) <Panel title="Output" bind:expanded={views.preview} on:changeView={onChangeView}>
function create_default_slot(ctx) {
	let preview;
	let updating_exampleAssets;
	let updating_exampleFile;
	let updating_scale;
	let updating_showLoader;
	let current;

	function preview_exampleAssets_binding(value) {
		/*preview_exampleAssets_binding*/ ctx[62](value);
	}

	function preview_exampleFile_binding(value) {
		/*preview_exampleFile_binding*/ ctx[63](value);
	}

	function preview_scale_binding(value) {
		/*preview_scale_binding*/ ctx[64](value);
	}

	function preview_showLoader_binding(value) {
		/*preview_showLoader_binding*/ ctx[65](value);
	}

	let preview_props = {};

	if (/*exampleAssets*/ ctx[22] !== void 0) {
		preview_props.exampleAssets = /*exampleAssets*/ ctx[22];
	}

	if (/*exampleFile*/ ctx[23] !== void 0) {
		preview_props.exampleFile = /*exampleFile*/ ctx[23];
	}

	if (/*scale*/ ctx[4] !== void 0) {
		preview_props.scale = /*scale*/ ctx[4];
	}

	if (/*showLoader*/ ctx[25] !== void 0) {
		preview_props.showLoader = /*showLoader*/ ctx[25];
	}

	preview = new Preview({ props: preview_props });
	binding_callbacks.push(() => bind(preview, 'exampleAssets', preview_exampleAssets_binding, /*exampleAssets*/ ctx[22]));
	binding_callbacks.push(() => bind(preview, 'exampleFile', preview_exampleFile_binding, /*exampleFile*/ ctx[23]));
	binding_callbacks.push(() => bind(preview, 'scale', preview_scale_binding, /*scale*/ ctx[4]));
	binding_callbacks.push(() => bind(preview, 'showLoader', preview_showLoader_binding, /*showLoader*/ ctx[25]));

	return {
		c() {
			create_component(preview.$$.fragment);
		},
		m(target, anchor) {
			mount_component(preview, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const preview_changes = {};

			if (!updating_exampleAssets && dirty[0] & /*exampleAssets*/ 4194304) {
				updating_exampleAssets = true;
				preview_changes.exampleAssets = /*exampleAssets*/ ctx[22];
				add_flush_callback(() => updating_exampleAssets = false);
			}

			if (!updating_exampleFile && dirty[0] & /*exampleFile*/ 8388608) {
				updating_exampleFile = true;
				preview_changes.exampleFile = /*exampleFile*/ ctx[23];
				add_flush_callback(() => updating_exampleFile = false);
			}

			if (!updating_scale && dirty[0] & /*scale*/ 16) {
				updating_scale = true;
				preview_changes.scale = /*scale*/ ctx[4];
				add_flush_callback(() => updating_scale = false);
			}

			if (!updating_showLoader && dirty[0] & /*showLoader*/ 33554432) {
				updating_showLoader = true;
				preview_changes.showLoader = /*showLoader*/ ctx[25];
				add_flush_callback(() => updating_showLoader = false);
			}

			preview.$set(preview_changes);
		},
		i(local) {
			if (current) return;
			transition_in(preview.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(preview.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(preview, detaching);
		}
	};
}

// (316:0) {#if errorMessage}
function create_if_block(ctx) {
	let errormessage;
	let current;

	errormessage = new ErrorMessage({
			props: { errorMessage: /*errorMessage*/ ctx[6] }
		});

	return {
		c() {
			create_component(errormessage.$$.fragment);
		},
		m(target, anchor) {
			mount_component(errormessage, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const errormessage_changes = {};
			if (dirty[0] & /*errorMessage*/ 64) errormessage_changes.errorMessage = /*errorMessage*/ ctx[6];
			errormessage.$set(errormessage_changes);
		},
		i(local) {
			if (current) return;
			transition_in(errormessage.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(errormessage.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(errormessage, detaching);
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t0;
	let div3;
	let div1;
	let t1;
	let div2;
	let panel;
	let updating_expanded;
	let t2;
	let t3;
	let footer;
	let updating_nodeCount;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*views*/ ctx[7] && create_if_block_1(ctx);

	function panel_expanded_binding(value) {
		/*panel_expanded_binding*/ ctx[66](value);
	}

	let panel_props = {
		title: "Output",
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	if (/*views*/ ctx[7].preview !== void 0) {
		panel_props.expanded = /*views*/ ctx[7].preview;
	}

	panel = new Panel({ props: panel_props });
	binding_callbacks.push(() => bind(panel, 'expanded', panel_expanded_binding, /*views*/ ctx[7].preview));
	panel.$on("changeView", /*onChangeView*/ ctx[29]);
	let if_block1 = /*errorMessage*/ ctx[6] && create_if_block(ctx);

	function footer_nodeCount_binding(value) {
		/*footer_nodeCount_binding*/ ctx[67](value);
	}

	let footer_props = {};

	if (/*nodeCount*/ ctx[21] !== void 0) {
		footer_props.nodeCount = /*nodeCount*/ ctx[21];
	}

	footer = new Footer({ props: footer_props });
	binding_callbacks.push(() => bind(footer, 'nodeCount', footer_nodeCount_binding, /*nodeCount*/ ctx[21]));
	footer.$on("reset", /*onReset*/ ctx[28]);
	footer.$on("export", /*onSelectExport*/ ctx[27]);
	footer.$on("save", /*onSaveSettings*/ ctx[30]);
	footer.$on("load", /*onLoadSettings*/ ctx[32]);

	return {
		c() {
			div0 = element("div");
			div0.innerHTML = `<i class="ml-0.5 absolute text-xs text-gray-300 -rotate-45 -translate-x-1/4 -translate-y-1/4 fa-sharp fa-solid fa-grip-dots top-1/2 left-1/2"></i>`;
			t0 = space();
			div3 = element("div");
			div1 = element("div");
			if (if_block0) if_block0.c();
			t1 = space();
			div2 = element("div");
			create_component(panel.$$.fragment);
			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			create_component(footer.$$.fragment);
			attr(div0, "id", "corner");
			attr(div0, "class", "fixed bottom-0 right-0 cursor-se-resize w-4 h-4 z-[999] overflow-hidden");
			attr(div1, "class", "flex flex-col w-1/3 min-h-full pb-12 control-panel svelte-11mtc86");
			attr(div2, "class", "sticky w-2/3 h-full pb-12");
			attr(div3, "class", "flex w-full overflow-hidden content svelte-11mtc86");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t0, anchor);
			insert(target, div3, anchor);
			append(div3, div1);
			if (if_block0) if_block0.m(div1, null);
			append(div3, t1);
			append(div3, div2);
			mount_component(panel, div2, null);
			insert(target, t2, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t3, anchor);
			mount_component(footer, target, anchor);
			current = true;

			if (!mounted) {
				dispose = [
					listen(div0, "mousedown", /*resizeDown*/ ctx[34]),
					listen(div0, "mouseup", /*resizeUp*/ ctx[35])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*views*/ ctx[7]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty[0] & /*views*/ 128) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div1, null);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			const panel_changes = {};

			if (dirty[0] & /*exampleAssets, exampleFile, scale, showLoader*/ 46137360 | dirty[2] & /*$$scope*/ 32768) {
				panel_changes.$$scope = { dirty, ctx };
			}

			if (!updating_expanded && dirty[0] & /*views*/ 128) {
				updating_expanded = true;
				panel_changes.expanded = /*views*/ ctx[7].preview;
				add_flush_callback(() => updating_expanded = false);
			}

			panel.$set(panel_changes);

			if (/*errorMessage*/ ctx[6]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty[0] & /*errorMessage*/ 64) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(t3.parentNode, t3);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			const footer_changes = {};

			if (!updating_nodeCount && dirty[0] & /*nodeCount*/ 2097152) {
				updating_nodeCount = true;
				footer_changes.nodeCount = /*nodeCount*/ ctx[21];
				add_flush_callback(() => updating_nodeCount = false);
			}

			footer.$set(footer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(panel.$$.fragment, local);
			transition_in(if_block1);
			transition_in(footer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(panel.$$.fragment, local);
			transition_out(if_block1);
			transition_out(footer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div0);
			if (detaching) detach(t0);
			if (detaching) detach(div3);
			if (if_block0) if_block0.d();
			destroy_component(panel);
			if (detaching) detach(t2);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(t3);
			destroy_component(footer, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let showLoader;

	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	let errorMessage;
	let errorTimeout;
	let views = {};
	let fileType = undefined;

	let fileTypeOptions = [
		{
			value: 'html',
			label: 'html',
			group: null,
			selected: false
		},
		{
			value: 'svelte',
			label: 'svelte',
			group: null,
			selected: false
		}
	]; // TO DO

	let extension = undefined;

	let extensionOptions = [
		{
			value: 'PNG',
			label: 'png',
			group: null,
			selected: false
		},
		{
			value: 'JPG',
			label: 'jpg',
			group: null,
			selected: false
		},
		{
			value: 'SVG',
			label: 'svg',
			group: null,
			selected: false
		}
	];

	let scale = undefined;

	let scaleOptions = [
		{ value: 1, label: '1x', selected: false },
		{ value: 2, label: '2x', selected: false },
		{ value: 4, label: '4x', selected: false }
	];

	let syntax = undefined;
	let includeResizer = true;
	let fluid = true;
	let testingMode = false;
	let centerHtmlOutput = false;
	let applyStyleNames = false;
	let applyHtags = false;
	let styleTextSegments = true;
	let includeGoogleFonts = true;
	let maxWidth = undefined;
	let imagePath = undefined;
	let altText = undefined;
	let customScript = undefined;
	let nodeCount = 0;
	let exampleAssets = [];
	let exampleFile;
	let showVariablesButton = false;

	const buildConfig = () => {
		return {
			syntax,
			scale,
			extension,
			fileType,
			includeResizer,
			testingMode,
			maxWidth,
			fluid,
			centerHtmlOutput,
			imagePath,
			altText,
			applyStyleNames,
			applyHtags,
			styleTextSegments,
			includeGoogleFonts,
			customScript
		};
	};

	window.onmessage = event => __awaiter(void 0, void 0, void 0, function* () {
		const message = event.data.pluginMessage;
		const type = message.type;

		if (type === 'load') {
			const config = message.config;
			$$invalidate(7, views = message.views);
			$$invalidate(8, syntax = config.syntax);
			$$invalidate(2, extension = config.extension);
			$$invalidate(4, scale = config.scale);
			$$invalidate(0, fileType = config.fileType);
			$$invalidate(9, includeResizer = config.includeResizer);
			$$invalidate(11, testingMode = config.testingMode);
			$$invalidate(17, maxWidth = config.maxWidth);
			$$invalidate(10, fluid = config.fluid);
			$$invalidate(12, centerHtmlOutput = config.centerHtmlOutput);
			$$invalidate(18, imagePath = config.imagePath);
			$$invalidate(19, altText = config.altText);
			$$invalidate(13, applyStyleNames = config.applyStyleNames);
			$$invalidate(14, applyHtags = config.applyHtags);
			$$invalidate(15, styleTextSegments = config.styleTextSegments);
			$$invalidate(16, includeGoogleFonts = config.includeGoogleFonts);
			$$invalidate(20, customScript = config.customScript);
		} else if (type === 'preview') {
			const preview = message.preview;
			$$invalidate(21, nodeCount = preview.nodeCount);
			$$invalidate(22, exampleAssets = preview.exampleAssets);
			$$invalidate(23, exampleFile = preview.exampleFile);
			$$invalidate(22, exampleAssets = yield buildPreviewImages(exampleAssets));
			message.loading;
		} else if (type === 'loading') {
			message.loading;
		} else if (type === 'export') {
			const url = yield buildZipArchive(message.assets, message.file);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${syntax}.zip`;
			link.click();

			setTimeout(
				() => {
				},
				1500
			);
		} else if (type === 'variables') {
			$$invalidate(24, showVariablesButton = message.variables === null);
		} else if (type === 'error') {
			setErrorMessage(message.message);
		}
	});

	const postMessage = message => parent.postMessage({ pluginMessage: message }, '*');
	onMount(() => postMessage({ type: 'init' }));
	const onChangeConfig = () => postMessage({ type: 'config', config: buildConfig() });

	const onSelectExport = () => {
		if (!altText || altText === '') {
			setErrorMessage('Please enter an alt text');
			$$invalidate(7, views.images = true, views);
			return;
		}

		if (!syntax || syntax === '') {
			setErrorMessage('File name cannot be empty');
			return;
		}
		postMessage({ type: 'export', config: buildConfig() });
	};

	const onReset = () => postMessage({ type: 'reset' });

	const onChangeView = () => {
		parent.postMessage({ pluginMessage: { type: 'view', views } }, '*');
	};

	const onSaveSettings = () => {
		parent.postMessage({ pluginMessage: { type: 'saveSettings' } }, '*');
	};

	const setErrorMessage = message => {
		clearTimeout(errorTimeout);
		$$invalidate(6, errorMessage = message);

		// clear error message after 5 seconds
		errorTimeout = setTimeout(
			() => {
				$$invalidate(6, errorMessage = undefined);
			},
			3000
		);
	};

	const onLoadSettings = () => {
		parent.postMessage({ pluginMessage: { type: 'loadSettings' } }, '*');
	};

	const onWriteVariables = () => {
		parent.postMessage(
			{
				pluginMessage: { type: 'writeVariables' }
			},
			'*'
		);
	};

	const buildPreviewImages = assets => __awaiter(void 0, void 0, void 0, function* () {
		assets.forEach(asset => {
			let blob = new Blob([asset.data], { type: `image/png` });
			const url = window.URL.createObjectURL(blob);
			asset.url = url;
		});

		return assets;
	});

	const buildZipArchive = (assets, file) => __awaiter(void 0, void 0, void 0, function* () {
		let zip = new JSZip();

		assets.forEach(asset => {
			const extensionLower = asset.extension.value.toLowerCase();
			let blob = new Blob([asset.data], { type: `image/${extensionLower}` });
			zip.file(`${asset.filename}.${extensionLower}`, blob, { base64: true });
		});

		let fileBlob = new Blob([file.data], { type: `string` });
		zip.file(`${file.filename}.${file.extension.value.toLowerCase()}`, fileBlob, { base64: true });
		const blob = yield zip.generateAsync({ type: 'blob' });
		const url = window.URL.createObjectURL(blob);
		return url;
	});

	let resizing = false;

	const resizeWindow = e => {
		if (!resizing) return;

		const size = {
			w: Math.max(50, Math.floor(e.clientX + 5)),
			h: Math.max(50, Math.floor(e.clientY + 5))
		};

		parent.postMessage({ pluginMessage: { type: 'resize', size } }, '*');
	};

	const resizeDown = e => {
		resizing = true;

		// e.preventDefault();
		window.addEventListener('mousemove', resizeWindow, true);

		window.addEventListener('mouseup', resizeUp, true);
	};

	const resizeUp = () => {
		resizing = false;
		window.removeEventListener('mousemove', resizeWindow, true);
		window.removeEventListener('mouseup', null);
	};

	function file_fileType_binding(value) {
		fileType = value;
		$$invalidate(0, fileType);
	}

	function file_testingMode_binding(value) {
		testingMode = value;
		$$invalidate(11, testingMode);
	}

	function file_menuItems_binding(value) {
		fileTypeOptions = value;
		($$invalidate(1, fileTypeOptions), $$invalidate(0, fileType));
	}

	function file_syntax_binding(value) {
		syntax = value;
		$$invalidate(8, syntax);
	}

	function file_errorMessage_binding(value) {
		errorMessage = value;
		$$invalidate(6, errorMessage);
	}

	const sendError_handler = () => setErrorMessage(errorMessage);

	function panel0_expanded_binding(value) {
		if ($$self.$$.not_equal(views.file, value)) {
			views.file = value;
			$$invalidate(7, views);
		}
	}

	function images_scaleOptions_binding(value) {
		scaleOptions = value;
		($$invalidate(5, scaleOptions), $$invalidate(4, scale));
	}

	function images_scale_binding(value) {
		scale = value;
		$$invalidate(4, scale);
	}

	function images_extensionOptions_binding(value) {
		extensionOptions = value;
		($$invalidate(3, extensionOptions), $$invalidate(2, extension));
	}

	function images_extension_binding(value) {
		extension = value;
		$$invalidate(2, extension);
	}

	function images_imagePath_binding(value) {
		imagePath = value;
		$$invalidate(18, imagePath);
	}

	function images_altText_binding(value) {
		altText = value;
		$$invalidate(19, altText);
	}

	function panel1_expanded_binding(value) {
		if ($$self.$$.not_equal(views.images, value)) {
			views.images = value;
			$$invalidate(7, views);
		}
	}

	function page_includeResizer_binding(value) {
		includeResizer = value;
		$$invalidate(9, includeResizer);
	}

	function page_centerHtmlOutput_binding(value) {
		centerHtmlOutput = value;
		$$invalidate(12, centerHtmlOutput);
	}

	function page_fluid_binding(value) {
		fluid = value;
		$$invalidate(10, fluid);
	}

	function page_maxWidth_binding(value) {
		maxWidth = value;
		$$invalidate(17, maxWidth);
	}

	function page_customScript_binding(value) {
		customScript = value;
		$$invalidate(20, customScript);
	}

	function panel2_expanded_binding(value) {
		if ($$self.$$.not_equal(views.page, value)) {
			views.page = value;
			$$invalidate(7, views);
		}
	}

	function text_1_showVariablesButton_binding(value) {
		showVariablesButton = value;
		$$invalidate(24, showVariablesButton);
	}

	function text_1_styleTextSegments_binding(value) {
		styleTextSegments = value;
		$$invalidate(15, styleTextSegments);
	}

	function text_1_applyStyleNames_binding(value) {
		applyStyleNames = value;
		$$invalidate(13, applyStyleNames);
	}

	function text_1_applyHtags_binding(value) {
		applyHtags = value;
		$$invalidate(14, applyHtags);
	}

	function text_1_includeGoogleFonts_binding(value) {
		includeGoogleFonts = value;
		$$invalidate(16, includeGoogleFonts);
	}

	function panel3_expanded_binding(value) {
		if ($$self.$$.not_equal(views.text, value)) {
			views.text = value;
			$$invalidate(7, views);
		}
	}

	function preview_exampleAssets_binding(value) {
		exampleAssets = value;
		$$invalidate(22, exampleAssets);
	}

	function preview_exampleFile_binding(value) {
		exampleFile = value;
		$$invalidate(23, exampleFile);
	}

	function preview_scale_binding(value) {
		scale = value;
		$$invalidate(4, scale);
	}

	function preview_showLoader_binding(value) {
		showLoader = value;
		$$invalidate(25, showLoader);
	}

	function panel_expanded_binding(value) {
		if ($$self.$$.not_equal(views.preview, value)) {
			views.preview = value;
			$$invalidate(7, views);
		}
	}

	function footer_nodeCount_binding(value) {
		nodeCount = value;
		$$invalidate(21, nodeCount);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*fileTypeOptions, fileType*/ 3) {
			{
				fileTypeOptions.forEach((o, i) => {
					$$invalidate(1, fileTypeOptions[i].selected = o.value === fileType, fileTypeOptions);
				});
			}
		}

		if ($$self.$$.dirty[0] & /*extensionOptions, extension*/ 12) {
			{
				extensionOptions.forEach((o, i) => {
					$$invalidate(3, extensionOptions[i].selected = o.value === extension, extensionOptions);
				});
			}
		}

		if ($$self.$$.dirty[0] & /*scaleOptions, scale*/ 48) {
			{
				scaleOptions.forEach((o, i) => {
					$$invalidate(5, scaleOptions[i].selected = o.value === scale, scaleOptions);
				});
			}
		}
	};

	$$invalidate(25, showLoader = false);

	return [
		fileType,
		fileTypeOptions,
		extension,
		extensionOptions,
		scale,
		scaleOptions,
		errorMessage,
		views,
		syntax,
		includeResizer,
		fluid,
		testingMode,
		centerHtmlOutput,
		applyStyleNames,
		applyHtags,
		styleTextSegments,
		includeGoogleFonts,
		maxWidth,
		imagePath,
		altText,
		customScript,
		nodeCount,
		exampleAssets,
		exampleFile,
		showVariablesButton,
		showLoader,
		onChangeConfig,
		onSelectExport,
		onReset,
		onChangeView,
		onSaveSettings,
		setErrorMessage,
		onLoadSettings,
		onWriteVariables,
		resizeDown,
		resizeUp,
		file_fileType_binding,
		file_testingMode_binding,
		file_menuItems_binding,
		file_syntax_binding,
		file_errorMessage_binding,
		sendError_handler,
		panel0_expanded_binding,
		images_scaleOptions_binding,
		images_scale_binding,
		images_extensionOptions_binding,
		images_extension_binding,
		images_imagePath_binding,
		images_altText_binding,
		panel1_expanded_binding,
		page_includeResizer_binding,
		page_centerHtmlOutput_binding,
		page_fluid_binding,
		page_maxWidth_binding,
		page_customScript_binding,
		panel2_expanded_binding,
		text_1_showVariablesButton_binding,
		text_1_styleTextSegments_binding,
		text_1_applyStyleNames_binding,
		text_1_applyHtags_binding,
		text_1_includeGoogleFonts_binding,
		panel3_expanded_binding,
		preview_exampleAssets_binding,
		preview_exampleFile_binding,
		preview_scale_binding,
		preview_showLoader_binding,
		panel_expanded_binding,
		footer_nodeCount_binding
	];
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1, -1]);
	}
}

new App({
  target: document.getElementById("app")
});
