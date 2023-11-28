try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const O = (r, ...e) => {
  let t = r;
  return e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t;
}, T = O;
class f extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(e, t) {
    const s = T(e, t);
    super(s), this.name = e, this.details = t;
  }
}
const L = /* @__PURE__ */ new Set(), u = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, k = (r) => [u.prefix, r, u.suffix].filter((e) => e && e.length > 0).join("-"), D = (r) => {
  for (const e of Object.keys(u))
    r(e);
}, d = {
  updateDetails: (r) => {
    D((e) => {
      typeof r[e] == "string" && (u[e] = r[e]);
    });
  },
  getGoogleAnalyticsName: (r) => r || k(u.googleAnalytics),
  getPrecacheName: (r) => r || k(u.precache),
  getPrefix: () => u.prefix,
  getRuntimeName: (r) => r || k(u.runtime),
  getSuffix: () => u.suffix
};
function P(r, e) {
  const t = new URL(r);
  for (const s of e)
    t.searchParams.delete(s);
  return t.href;
}
async function H(r, e, t, s) {
  const a = P(e.url, t);
  if (e.url === a)
    return r.match(e, s);
  const i = Object.assign(Object.assign({}, s), { ignoreSearch: !0 }), n = await r.keys(e, i);
  for (const o of n) {
    const c = P(o.url, t);
    if (a === c)
      return r.match(o, s);
  }
}
class M {
  /**
   * Creates a promise and exposes its resolve and reject functions as methods.
   */
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
async function q() {
  for (const r of L)
    await r();
}
const j = (r) => new URL(String(r), location.href).href.replace(new RegExp(`^${location.origin}`), "");
function x(r) {
  return new Promise((e) => setTimeout(e, r));
}
const A = {
  get googleAnalytics() {
    return d.getGoogleAnalyticsName();
  },
  get precache() {
    return d.getPrecacheName();
  },
  get prefix() {
    return d.getPrefix();
  },
  get runtime() {
    return d.getRuntimeName();
  },
  get suffix() {
    return d.getSuffix();
  }
};
function W() {
  self.addEventListener("activate", () => self.clients.claim());
}
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const E = "GET", y = (r) => r && typeof r == "object" ? r : { handle: r };
class w {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, s = E) {
    this.handler = y(t), this.match = e, this.method = s;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  setCatchHandler(e) {
    this.catchHandler = y(e);
  }
}
class F extends w {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, s) {
    const a = ({ url: i }) => {
      const n = e.exec(i.href);
      if (n && !(i.origin !== location.origin && n.index !== 0))
        return n.slice(1);
    };
    super(a, t, s);
  }
}
class K {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: t } = e, s = this.handleRequest({ request: t, event: e });
      s && e.respondWith(s);
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: t } = e.data, s = Promise.all(t.urlsToCache.map((a) => {
          typeof a == "string" && (a = [a]);
          const i = new Request(...a);
          return this.handleRequest({ request: i, event: e });
        }));
        e.waitUntil(s), e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle.
   * @param {ExtendableEvent} options.event The event that triggered the
   *     request.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request: e, event: t }) {
    const s = new URL(e.url, location.href);
    if (!s.protocol.startsWith("http"))
      return;
    const a = s.origin === location.origin, { params: i, route: n } = this.findMatchingRoute({
      event: t,
      request: e,
      sameOrigin: a,
      url: s
    });
    let o = n && n.handler;
    const c = e.method;
    if (!o && this._defaultHandlerMap.has(c) && (o = this._defaultHandlerMap.get(c)), !o)
      return;
    let l;
    try {
      l = o.handle({ url: s, request: e, event: t, params: i });
    } catch (h) {
      l = Promise.reject(h);
    }
    const m = n && n.catchHandler;
    return l instanceof Promise && (this._catchHandler || m) && (l = l.catch(async (h) => {
      if (m)
        try {
          return await m.handle({ url: s, request: e, event: t, params: i });
        } catch (C) {
          C instanceof Error && (h = C);
        }
      if (this._catchHandler)
        return this._catchHandler.handle({ url: s, request: e, event: t });
      throw h;
    })), l;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {boolean} options.sameOrigin The result of comparing `url.origin`
   *     against the current origin.
   * @param {Request} options.request The request to match.
   * @param {Event} options.event The corresponding event.
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url: e, sameOrigin: t, request: s, event: a }) {
    const i = this._routes.get(s.method) || [];
    for (const n of i) {
      let o;
      const c = n.match({ url: e, sameOrigin: t, request: s, event: a });
      if (c)
        return o = c, (Array.isArray(o) && o.length === 0 || c.constructor === Object && // eslint-disable-line
        Object.keys(c).length === 0 || typeof c == "boolean") && (o = void 0), { route: n, params: o };
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to associate with this
   * default handler. Each method has its own default.
   */
  setDefaultHandler(e, t = E) {
    this._defaultHandlerMap.set(t, y(e));
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(e) {
    this._catchHandler = y(e);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox-routing.Route} route The route to register.
   */
  registerRoute(e) {
    this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new f("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const t = this._routes.get(e.method).indexOf(e);
    if (t > -1)
      this._routes.get(e.method).splice(t, 1);
    else
      throw new f("unregister-route-route-not-registered");
  }
}
let p;
const R = () => (p || (p = new K(), p.addFetchListener(), p.addCacheListener()), p);
function I(r, e, t) {
  let s;
  if (typeof r == "string") {
    const i = new URL(r, location.href), n = ({ url: o }) => o.href === i.href;
    s = new w(n, e, t);
  } else if (r instanceof RegExp)
    s = new F(r, e, t);
  else if (typeof r == "function")
    s = new w(r, e, t);
  else if (r instanceof w)
    s = r;
  else
    throw new f("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return R().registerRoute(s), s;
}
function $(r) {
  R().setCatchHandler(r);
}
function B(r) {
  R().setDefaultHandler(r);
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
function g(r) {
  return typeof r == "string" ? new Request(r) : r;
}
class G {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  constructor(e, t) {
    this._cacheKeys = {}, Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new M(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const s of this._plugins)
      this._pluginStateMap.set(s, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  async fetch(e) {
    const { event: t } = this;
    let s = g(e);
    if (s.mode === "navigate" && t instanceof FetchEvent && t.preloadResponse) {
      const n = await t.preloadResponse;
      if (n)
        return n;
    }
    const a = this.hasCallback("fetchDidFail") ? s.clone() : null;
    try {
      for (const n of this.iterateCallbacks("requestWillFetch"))
        s = await n({ request: s.clone(), event: t });
    } catch (n) {
      if (n instanceof Error)
        throw new f("plugin-error-request-will-fetch", {
          thrownErrorMessage: n.message
        });
    }
    const i = s.clone();
    try {
      let n;
      n = await fetch(s, s.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      for (const o of this.iterateCallbacks("fetchDidSucceed"))
        n = await o({
          event: t,
          request: i,
          response: n
        });
      return n;
    } catch (n) {
      throw a && await this.runCallbacks("fetchDidFail", {
        error: n,
        event: t,
        originalRequest: a.clone(),
        request: i.clone()
      }), n;
    }
  }
  /**
   * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
   * the response generated by `this.fetch()`.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to manually call `waitUntil()` on the event.
   *
   * @param {Request|string} input The request or URL to fetch and cache.
   * @return {Promise<Response>}
   */
  async fetchAndCachePut(e) {
    const t = await this.fetch(e), s = t.clone();
    return this.waitUntil(this.cachePut(e, s)), t;
  }
  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
   * defined on the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cachedResponseWillByUsed()
   *
   * @param {Request|string} key The Request or URL to use as the cache key.
   * @return {Promise<Response|undefined>} A matching response, if found.
   */
  async cacheMatch(e) {
    const t = g(e);
    let s;
    const { cacheName: a, matchOptions: i } = this._strategy, n = await this.getCacheKey(t, "read"), o = Object.assign(Object.assign({}, i), { cacheName: a });
    s = await caches.match(n, o);
    for (const c of this.iterateCallbacks("cachedResponseWillBeUsed"))
      s = await c({
        cacheName: a,
        matchOptions: i,
        cachedResponse: s,
        request: n,
        event: this.event
      }) || void 0;
    return s;
  }
  /**
   * Puts a request/response pair in the cache (and invokes any applicable
   * plugin callback methods) using the `cacheName` and `plugins` defined on
   * the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cacheWillUpdate()
   * - cacheDidUpdate()
   *
   * @param {Request|string} key The request or URL to use as the cache key.
   * @param {Response} response The response to cache.
   * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(e, t) {
    const s = g(e);
    await x(0);
    const a = await this.getCacheKey(s, "write");
    if (!t)
      throw new f("cache-put-with-no-response", {
        url: j(a.url)
      });
    const i = await this._ensureResponseSafeToCache(t);
    if (!i)
      return !1;
    const { cacheName: n, matchOptions: o } = this._strategy, c = await self.caches.open(n), l = this.hasCallback("cacheDidUpdate"), m = l ? await H(
      // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
      // feature. Consider into ways to only add this behavior if using
      // precaching.
      c,
      a.clone(),
      ["__WB_REVISION__"],
      o
    ) : null;
    try {
      await c.put(a, l ? i.clone() : i);
    } catch (h) {
      if (h instanceof Error)
        throw h.name === "QuotaExceededError" && await q(), h;
    }
    for (const h of this.iterateCallbacks("cacheDidUpdate"))
      await h({
        cacheName: n,
        oldResponse: m,
        newResponse: i.clone(),
        request: a,
        event: this.event
      });
    return !0;
  }
  /**
   * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
   * executes any of those callbacks found in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified
   *
   * @param {Request} request
   * @param {string} mode
   * @return {Promise<Request>}
   */
  async getCacheKey(e, t) {
    const s = `${e.url} | ${t}`;
    if (!this._cacheKeys[s]) {
      let a = e;
      for (const i of this.iterateCallbacks("cacheKeyWillBeUsed"))
        a = g(await i({
          mode: t,
          request: a,
          event: this.event,
          // params has a type any can't change right now.
          params: this.params
          // eslint-disable-line
        }));
      this._cacheKeys[s] = a;
    }
    return this._cacheKeys[s];
  }
  /**
   * Returns true if the strategy has at least one plugin with the given
   * callback.
   *
   * @param {string} name The name of the callback to check for.
   * @return {boolean}
   */
  hasCallback(e) {
    for (const t of this._strategy.plugins)
      if (e in t)
        return !0;
    return !1;
  }
  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object (merged ith the current plugin state) as the only
   * argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See
   * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
   * below for how to handle that case.
   *
   * @param {string} name The name of the callback to run within each plugin.
   * @param {Object} param The object to pass as the first (and only) param
   *     when executing each callback. This object will be merged with the
   *     current plugin state prior to callback execution.
   */
  async runCallbacks(e, t) {
    for (const s of this.iterateCallbacks(e))
      await s(t);
  }
  /**
   * Accepts a callback and returns an iterable of matching plugin callbacks,
   * where each callback is wrapped with the current handler state (i.e. when
   * you call each callback, whatever object parameter you pass it will
   * be merged with the plugin's current state).
   *
   * @param {string} name The name fo the callback to run
   * @return {Array<Function>}
   */
  *iterateCallbacks(e) {
    for (const t of this._strategy.plugins)
      if (typeof t[e] == "function") {
        const s = this._pluginStateMap.get(t);
        yield (i) => {
          const n = Object.assign(Object.assign({}, i), { state: s });
          return t[e](n);
        };
      }
  }
  /**
   * Adds a promise to the
   * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
   * of the event event associated with the request being handled (usually a
   * `FetchEvent`).
   *
   * Note: you can await
   * {@link workbox-strategies.StrategyHandler~doneWaiting}
   * to know when all added promises have settled.
   *
   * @param {Promise} promise A promise to add to the extend lifetime promises
   *     of the event that triggered the request.
   */
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  /**
   * Returns a promise that resolves once all promises passed to
   * {@link workbox-strategies.StrategyHandler~waitUntil}
   * have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not this handler's
   * `waitUntil()` method), otherwise the service worker thread my be killed
   * prior to your work completing.
   */
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promises.
   */
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Request} options.request
   * @param {Response} options.response
   * @return {Promise<Response|undefined>}
   *
   * @private
   */
  async _ensureResponseSafeToCache(e) {
    let t = e, s = !1;
    for (const a of this.iterateCallbacks("cacheWillUpdate"))
      if (t = await a({
        request: this.request,
        response: t,
        event: this.event
      }) || void 0, s = !0, !t)
        break;
    return s || t && t.status !== 200 && (t = void 0), t;
  }
}
class v {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  constructor(e = {}) {
    this.cacheName = d.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  handle(e) {
    const [t] = this.handleAll(e);
    return t;
  }
  /**
   * Similar to {@link workbox-strategies.Strategy~handle}, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   * @return {Array<Promise>} A tuple of [response, done]
   *     promises that can be used to determine when the response resolves as
   *     well as when the handler has completed all its work.
   */
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const t = e.event, s = typeof e.request == "string" ? new Request(e.request) : e.request, a = "params" in e ? e.params : void 0, i = new G(this, { event: t, request: s, params: a }), n = this._getResponse(i, s, t), o = this._awaitComplete(n, i, s, t);
    return [n, o];
  }
  async _getResponse(e, t, s) {
    await e.runCallbacks("handlerWillStart", { event: s, request: t });
    let a;
    try {
      if (a = await this._handle(t, e), !a || a.type === "error")
        throw new f("no-response", { url: t.url });
    } catch (i) {
      if (i instanceof Error) {
        for (const n of e.iterateCallbacks("handlerDidError"))
          if (a = await n({ error: i, event: s, request: t }), a)
            break;
      }
      if (!a)
        throw i;
    }
    for (const i of e.iterateCallbacks("handlerWillRespond"))
      a = await i({ event: s, request: t, response: a });
    return a;
  }
  async _awaitComplete(e, t, s, a) {
    let i, n;
    try {
      i = await e;
    } catch {
    }
    try {
      await t.runCallbacks("handlerDidRespond", {
        event: a,
        request: s,
        response: i
      }), await t.doneWaiting();
    } catch (o) {
      o instanceof Error && (n = o);
    }
    if (await t.runCallbacks("handlerDidComplete", {
      event: a,
      request: s,
      response: i,
      error: n
    }), t.destroy(), n)
      throw n;
  }
}
const Q = {
  /**
   * Returns a valid response (to allow caching) if the status is 200 (OK) or
   * 0 (opaque).
   *
   * @param {Object} options
   * @param {Response} options.response
   * @return {Response|null}
   *
   * @private
   */
  cacheWillUpdate: async ({ response: r }) => r.status === 200 || r.status === 0 ? r : null
};
class z extends v {
  /**
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * @param {number} [options.networkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   * This option can be used to combat
   * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
   * scenarios.
   */
  constructor(e = {}) {
    super(e), this.plugins.some((t) => "cacheWillUpdate" in t) || this.plugins.unshift(Q), this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const s = [], a = [];
    let i;
    if (this._networkTimeoutSeconds) {
      const { id: c, promise: l } = this._getTimeoutPromise({ request: e, logs: s, handler: t });
      i = c, a.push(l);
    }
    const n = this._getNetworkPromise({
      timeoutId: i,
      request: e,
      logs: s,
      handler: t
    });
    a.push(n);
    const o = await t.waitUntil((async () => await t.waitUntil(Promise.race(a)) || // If Promise.race() resolved with null, it might be due to a network
    // timeout + a cache miss. If that were to happen, we'd rather wait until
    // the networkPromise resolves instead of returning null.
    // Note that it's fine to await an already-resolved promise, so we don't
    // have to check to see if it's still "in flight".
    await n)());
    if (!o)
      throw new f("no-response", { url: e.url });
    return o;
  }
  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs array
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  _getTimeoutPromise({ request: e, logs: t, handler: s }) {
    let a;
    return {
      promise: new Promise((n) => {
        a = setTimeout(async () => {
          n(await s.cacheMatch(e));
        }, this._networkTimeoutSeconds * 1e3);
      }),
      id: a
    };
  }
  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs Array.
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getNetworkPromise({ timeoutId: e, request: t, logs: s, handler: a }) {
    let i, n;
    try {
      n = await a.fetchAndCachePut(t);
    } catch (o) {
      o instanceof Error && (i = o);
    }
    return e && clearTimeout(e), (i || !n) && (n = await a.cacheMatch(t)), n;
  }
}
class J extends v {
  /**
   * @param {Object} [options]
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {number} [options.networkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will result in a network error.
   */
  constructor(e = {}) {
    super(e), this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    let s, a;
    try {
      const i = [
        t.fetch(e)
      ];
      if (this._networkTimeoutSeconds) {
        const n = x(this._networkTimeoutSeconds * 1e3);
        i.push(n);
      }
      if (a = await Promise.race(i), !a)
        throw new Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`);
    } catch (i) {
      i instanceof Error && (s = i);
    }
    if (!a)
      throw new f("no-response", { url: e.url, error: s });
    return a;
  }
}
self.skipWaiting();
const U = {
  race: !1,
  debug: !1,
  credentials: "same-origin",
  networkTimeoutSeconds: 0,
  fallback: "index.html"
}, b = A.runtime, V = () => new z({ cacheName: b }), X = [{"revision":null,"url":"assets/index-72V5IIx1.js"},{"revision":null,"url":"assets/index-Iw8K0QNl.css"},{"revision":null,"url":"assets/workbox-window.prod.es5-prqDwDSL.js"},{"revision":"bc2a7e0520c222b5fa230d2a29e47372","url":"index.html"},{"revision":"59d3ac1bedc6736e2375bf3992557c5f","url":"favicon.ico"},{"revision":"f3f6c82606cc916b7ddb938766a3599d","url":"pwa-64x64.png"},{"revision":"ddf72dc91e6bd0c9f0014608332609b6","url":"pwa-192x192.png"},{"revision":"e95bf5afddfe5a711ebfc779bad89d68","url":"pwa-512x512.png"},{"revision":"ee146e6906eefc054cb5f0dd7cd475be","url":"maskable-icon-512x512.png"},{"revision":"a0f383649781d2ec73d816c9ee16114f","url":"manifest.webmanifest"}], N = [], S = X.map(
  (r) => {
    const e = new URL(r.url, self.location);
    return N.push(new Request(e.href, {
      credentials: U.credentials
    })), e.href;
  }
);
self.addEventListener("install", (r) => {
  r.waitUntil(
    caches.open(b).then((e) => e.addAll(N))
  );
});
self.addEventListener("activate", (r) => {
  r.waitUntil(
    caches.open(b).then((e) => {
      e.keys().then((t) => {
        t.forEach((s) => {
          console.log(s), S.includes(s.url) || e.delete(s).then((a) => {
          });
        });
      });
    })
  );
});
I(
  ({ url: r }) => S.includes(r.href),
  V()
);
B(new J());
$(({ event: r }) => {
  switch (r.request.destination) {
    case "document":
      return caches.match(U.fallback).then((e) => e ? Promise.resolve(e) : Promise.resolve(Response.error()));
    default:
      return Promise.resolve(Response.error());
  }
});
W();
