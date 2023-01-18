'use strict';
function e(e, t, n, i) {
	return new (n || (n = Promise))(function (r, o) {
		function a(e) {
			try {
				s(i.next(e));
			} catch (e) {
				o(e);
			}
		}
		function l(e) {
			try {
				s(i.throw(e));
			} catch (e) {
				o(e);
			}
		}
		function s(e) {
			var t;
			e.done
				? r(e.value)
				: ((t = e.value),
				  t instanceof n
						? t
						: new n(function (e) {
								e(t);
						  })).then(a, l);
		}
		s((i = i.apply(e, t || [])).next());
	});
}
'undefined' != typeof globalThis
	? globalThis
	: 'undefined' != typeof window
	? window
	: 'undefined' != typeof global
	? global
	: 'undefined' != typeof self && self;
var t = {},
	n = {},
	i = {};
function r(e) {
	return null == e;
}
function o(e, t) {
	var n = '',
		i = e.reason || '(unknown reason)';
	return e.mark
		? (e.mark.name && (n += 'in "' + e.mark.name + '" '),
		  (n += '(' + (e.mark.line + 1) + ':' + (e.mark.column + 1) + ')'),
		  !t && e.mark.snippet && (n += '\n\n' + e.mark.snippet),
		  i + ' ' + n)
		: i;
}
function a(e, t) {
	Error.call(this),
		(this.name = 'YAMLException'),
		(this.reason = e),
		(this.mark = t),
		(this.message = o(this, !1)),
		Error.captureStackTrace
			? Error.captureStackTrace(this, this.constructor)
			: (this.stack = new Error().stack || '');
}
(i.isNothing = r),
	(i.isObject = function (e) {
		return 'object' == typeof e && null !== e;
	}),
	(i.toArray = function (e) {
		return Array.isArray(e) ? e : r(e) ? [] : [e];
	}),
	(i.repeat = function (e, t) {
		var n,
			i = '';
		for (n = 0; n < t; n += 1) i += e;
		return i;
	}),
	(i.isNegativeZero = function (e) {
		return 0 === e && Number.NEGATIVE_INFINITY === 1 / e;
	}),
	(i.extend = function (e, t) {
		var n, i, r, o;
		if (t) for (n = 0, i = (o = Object.keys(t)).length; n < i; n += 1) e[(r = o[n])] = t[r];
		return e;
	}),
	(a.prototype = Object.create(Error.prototype)),
	(a.prototype.constructor = a),
	(a.prototype.toString = function (e) {
		return this.name + ': ' + o(this, e);
	});
var l = a,
	s = i;
function c(e, t, n, i, r) {
	var o = '',
		a = '',
		l = Math.floor(r / 2) - 1;
	return (
		i - t > l && (t = i - l + (o = ' ... ').length),
		n - i > l && (n = i + l - (a = ' ...').length),
		{ str: o + e.slice(t, n).replace(/\t/g, '→') + a, pos: i - t + o.length }
	);
}
function u(e, t) {
	return s.repeat(' ', t - e.length) + e;
}
var p = function (e, t) {
		if (((t = Object.create(t || null)), !e.buffer)) return null;
		t.maxLength || (t.maxLength = 79),
			'number' != typeof t.indent && (t.indent = 1),
			'number' != typeof t.linesBefore && (t.linesBefore = 3),
			'number' != typeof t.linesAfter && (t.linesAfter = 2);
		for (var n, i = /\r?\n|\r|\0/g, r = [0], o = [], a = -1; (n = i.exec(e.buffer)); )
			o.push(n.index),
				r.push(n.index + n[0].length),
				e.position <= n.index && a < 0 && (a = r.length - 2);
		a < 0 && (a = r.length - 1);
		var l,
			p,
			d = '',
			f = Math.min(e.line + t.linesAfter, o.length).toString().length,
			h = t.maxLength - (t.indent + f + 3);
		for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
			(p = c(e.buffer, r[a - l], o[a - l], e.position - (r[a] - r[a - l]), h)),
				(d =
					s.repeat(' ', t.indent) + u((e.line - l + 1).toString(), f) + ' | ' + p.str + '\n' + d);
		for (
			p = c(e.buffer, r[a], o[a], e.position, h),
				d += s.repeat(' ', t.indent) + u((e.line + 1).toString(), f) + ' | ' + p.str + '\n',
				d += s.repeat('-', t.indent + f + 3 + p.pos) + '^\n',
				l = 1;
			l <= t.linesAfter && !(a + l >= o.length);
			l++
		)
			(p = c(e.buffer, r[a + l], o[a + l], e.position - (r[a] - r[a + l]), h)),
				(d += s.repeat(' ', t.indent) + u((e.line + l + 1).toString(), f) + ' | ' + p.str + '\n');
		return d.replace(/\n$/, '');
	},
	d = {},
	f = {
		get exports() {
			return d;
		},
		set exports(e) {
			d = e;
		}
	},
	h = l,
	g = [
		'kind',
		'multi',
		'resolve',
		'construct',
		'instanceOf',
		'predicate',
		'represent',
		'representName',
		'defaultStyle',
		'styleAliases'
	],
	m = ['scalar', 'sequence', 'mapping'];
var y = function (e, t) {
		if (
			((t = t || {}),
			Object.keys(t).forEach(function (t) {
				if (-1 === g.indexOf(t))
					throw new h('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.');
			}),
			(this.options = t),
			(this.tag = e),
			(this.kind = t.kind || null),
			(this.resolve =
				t.resolve ||
				function () {
					return !0;
				}),
			(this.construct =
				t.construct ||
				function (e) {
					return e;
				}),
			(this.instanceOf = t.instanceOf || null),
			(this.predicate = t.predicate || null),
			(this.represent = t.represent || null),
			(this.representName = t.representName || null),
			(this.defaultStyle = t.defaultStyle || null),
			(this.multi = t.multi || !1),
			(this.styleAliases = (function (e) {
				var t = {};
				return (
					null !== e &&
						Object.keys(e).forEach(function (n) {
							e[n].forEach(function (e) {
								t[String(e)] = n;
							});
						}),
					t
				);
			})(t.styleAliases || null)),
			-1 === m.indexOf(this.kind))
		)
			throw new h('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
	},
	v = l,
	b = y;
function A(e, t) {
	var n = [];
	return (
		e[t].forEach(function (e) {
			var t = n.length;
			n.forEach(function (n, i) {
				n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = i);
			}),
				(n[t] = e);
		}),
		n
	);
}
function w(e) {
	return this.extend(e);
}
w.prototype.extend = function (e) {
	var t = [],
		n = [];
	if (e instanceof b) n.push(e);
	else if (Array.isArray(e)) n = n.concat(e);
	else {
		if (!e || (!Array.isArray(e.implicit) && !Array.isArray(e.explicit)))
			throw new v(
				'Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })'
			);
		e.implicit && (t = t.concat(e.implicit)), e.explicit && (n = n.concat(e.explicit));
	}
	t.forEach(function (e) {
		if (!(e instanceof b))
			throw new v(
				'Specified list of YAML types (or a single Type object) contains a non-Type object.'
			);
		if (e.loadKind && 'scalar' !== e.loadKind)
			throw new v(
				'There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.'
			);
		if (e.multi)
			throw new v(
				'There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.'
			);
	}),
		n.forEach(function (e) {
			if (!(e instanceof b))
				throw new v(
					'Specified list of YAML types (or a single Type object) contains a non-Type object.'
				);
		});
	var i = Object.create(w.prototype);
	return (
		(i.implicit = (this.implicit || []).concat(t)),
		(i.explicit = (this.explicit || []).concat(n)),
		(i.compiledImplicit = A(i, 'implicit')),
		(i.compiledExplicit = A(i, 'explicit')),
		(i.compiledTypeMap = (function () {
			var e,
				t,
				n = {
					scalar: {},
					sequence: {},
					mapping: {},
					fallback: {},
					multi: { scalar: [], sequence: [], mapping: [], fallback: [] }
				};
			function i(e) {
				e.multi
					? (n.multi[e.kind].push(e), n.multi.fallback.push(e))
					: (n[e.kind][e.tag] = n.fallback[e.tag] = e);
			}
			for (e = 0, t = arguments.length; e < t; e += 1) arguments[e].forEach(i);
			return n;
		})(i.compiledImplicit, i.compiledExplicit)),
		i
	);
};
var x = w,
	k = new y('tag:yaml.org,2002:str', {
		kind: 'scalar',
		construct: function (e) {
			return null !== e ? e : '';
		}
	}),
	C = new y('tag:yaml.org,2002:seq', {
		kind: 'sequence',
		construct: function (e) {
			return null !== e ? e : [];
		}
	}),
	S = new y('tag:yaml.org,2002:map', {
		kind: 'mapping',
		construct: function (e) {
			return null !== e ? e : {};
		}
	}),
	I = new x({ explicit: [k, C, S] });
var O = new y('tag:yaml.org,2002:null', {
	kind: 'scalar',
	resolve: function (e) {
		if (null === e) return !0;
		var t = e.length;
		return (1 === t && '~' === e) || (4 === t && ('null' === e || 'Null' === e || 'NULL' === e));
	},
	construct: function () {
		return null;
	},
	predicate: function (e) {
		return null === e;
	},
	represent: {
		canonical: function () {
			return '~';
		},
		lowercase: function () {
			return 'null';
		},
		uppercase: function () {
			return 'NULL';
		},
		camelcase: function () {
			return 'Null';
		},
		empty: function () {
			return '';
		}
	},
	defaultStyle: 'lowercase'
});
var E = new y('tag:yaml.org,2002:bool', {
		kind: 'scalar',
		resolve: function (e) {
			if (null === e) return !1;
			var t = e.length;
			return (
				(4 === t && ('true' === e || 'True' === e || 'TRUE' === e)) ||
				(5 === t && ('false' === e || 'False' === e || 'FALSE' === e))
			);
		},
		construct: function (e) {
			return 'true' === e || 'True' === e || 'TRUE' === e;
		},
		predicate: function (e) {
			return '[object Boolean]' === Object.prototype.toString.call(e);
		},
		represent: {
			lowercase: function (e) {
				return e ? 'true' : 'false';
			},
			uppercase: function (e) {
				return e ? 'TRUE' : 'FALSE';
			},
			camelcase: function (e) {
				return e ? 'True' : 'False';
			}
		},
		defaultStyle: 'lowercase'
	}),
	$ = i;
function j(e) {
	return 48 <= e && e <= 55;
}
function T(e) {
	return 48 <= e && e <= 57;
}
var M = new y('tag:yaml.org,2002:int', {
		kind: 'scalar',
		resolve: function (e) {
			if (null === e) return !1;
			var t,
				n,
				i = e.length,
				r = 0,
				o = !1;
			if (!i) return !1;
			if ((('-' !== (t = e[r]) && '+' !== t) || (t = e[++r]), '0' === t)) {
				if (r + 1 === i) return !0;
				if ('b' === (t = e[++r])) {
					for (r++; r < i; r++)
						if ('_' !== (t = e[r])) {
							if ('0' !== t && '1' !== t) return !1;
							o = !0;
						}
					return o && '_' !== t;
				}
				if ('x' === t) {
					for (r++; r < i; r++)
						if ('_' !== (t = e[r])) {
							if (
								!(
									(48 <= (n = e.charCodeAt(r)) && n <= 57) ||
									(65 <= n && n <= 70) ||
									(97 <= n && n <= 102)
								)
							)
								return !1;
							o = !0;
						}
					return o && '_' !== t;
				}
				if ('o' === t) {
					for (r++; r < i; r++)
						if ('_' !== (t = e[r])) {
							if (!j(e.charCodeAt(r))) return !1;
							o = !0;
						}
					return o && '_' !== t;
				}
			}
			if ('_' === t) return !1;
			for (; r < i; r++)
				if ('_' !== (t = e[r])) {
					if (!T(e.charCodeAt(r))) return !1;
					o = !0;
				}
			return !(!o || '_' === t);
		},
		construct: function (e) {
			var t,
				n = e,
				i = 1;
			if (
				(-1 !== n.indexOf('_') && (n = n.replace(/_/g, '')),
				('-' !== (t = n[0]) && '+' !== t) || ('-' === t && (i = -1), (t = (n = n.slice(1))[0])),
				'0' === n)
			)
				return 0;
			if ('0' === t) {
				if ('b' === n[1]) return i * parseInt(n.slice(2), 2);
				if ('x' === n[1]) return i * parseInt(n.slice(2), 16);
				if ('o' === n[1]) return i * parseInt(n.slice(2), 8);
			}
			return i * parseInt(n, 10);
		},
		predicate: function (e) {
			return (
				'[object Number]' === Object.prototype.toString.call(e) &&
				e % 1 == 0 &&
				!$.isNegativeZero(e)
			);
		},
		represent: {
			binary: function (e) {
				return e >= 0 ? '0b' + e.toString(2) : '-0b' + e.toString(2).slice(1);
			},
			octal: function (e) {
				return e >= 0 ? '0o' + e.toString(8) : '-0o' + e.toString(8).slice(1);
			},
			decimal: function (e) {
				return e.toString(10);
			},
			hexadecimal: function (e) {
				return e >= 0
					? '0x' + e.toString(16).toUpperCase()
					: '-0x' + e.toString(16).toUpperCase().slice(1);
			}
		},
		defaultStyle: 'decimal',
		styleAliases: {
			binary: [2, 'bin'],
			octal: [8, 'oct'],
			decimal: [10, 'dec'],
			hexadecimal: [16, 'hex']
		}
	}),
	L = i,
	N = y,
	F = new RegExp(
		'^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$'
	);
var z = /^[-+]?[0-9]+e/;
var U = new N('tag:yaml.org,2002:float', {
		kind: 'scalar',
		resolve: function (e) {
			return null !== e && !(!F.test(e) || '_' === e[e.length - 1]);
		},
		construct: function (e) {
			var t, n;
			return (
				(n = '-' === (t = e.replace(/_/g, '').toLowerCase())[0] ? -1 : 1),
				'+-'.indexOf(t[0]) >= 0 && (t = t.slice(1)),
				'.inf' === t
					? 1 === n
						? Number.POSITIVE_INFINITY
						: Number.NEGATIVE_INFINITY
					: '.nan' === t
					? NaN
					: n * parseFloat(t, 10)
			);
		},
		predicate: function (e) {
			return (
				'[object Number]' === Object.prototype.toString.call(e) &&
				(e % 1 != 0 || L.isNegativeZero(e))
			);
		},
		represent: function (e, t) {
			var n;
			if (isNaN(e))
				switch (t) {
					case 'lowercase':
						return '.nan';
					case 'uppercase':
						return '.NAN';
					case 'camelcase':
						return '.NaN';
				}
			else if (Number.POSITIVE_INFINITY === e)
				switch (t) {
					case 'lowercase':
						return '.inf';
					case 'uppercase':
						return '.INF';
					case 'camelcase':
						return '.Inf';
				}
			else if (Number.NEGATIVE_INFINITY === e)
				switch (t) {
					case 'lowercase':
						return '-.inf';
					case 'uppercase':
						return '-.INF';
					case 'camelcase':
						return '-.Inf';
				}
			else if (L.isNegativeZero(e)) return '-0.0';
			return (n = e.toString(10)), z.test(n) ? n.replace('e', '.e') : n;
		},
		defaultStyle: 'lowercase'
	}),
	R = I.extend({ implicit: [O, E, M, U] });
f.exports = R;
var _ = y,
	D = new RegExp('^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$'),
	Y = new RegExp(
		'^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$'
	);
var W = new _('tag:yaml.org,2002:timestamp', {
	kind: 'scalar',
	resolve: function (e) {
		return null !== e && (null !== D.exec(e) || null !== Y.exec(e));
	},
	construct: function (e) {
		var t,
			n,
			i,
			r,
			o,
			a,
			l,
			s,
			c = 0,
			u = null;
		if ((null === (t = D.exec(e)) && (t = Y.exec(e)), null === t))
			throw new Error('Date resolve error');
		if (((n = +t[1]), (i = +t[2] - 1), (r = +t[3]), !t[4])) return new Date(Date.UTC(n, i, r));
		if (((o = +t[4]), (a = +t[5]), (l = +t[6]), t[7])) {
			for (c = t[7].slice(0, 3); c.length < 3; ) c += '0';
			c = +c;
		}
		return (
			t[9] && ((u = 6e4 * (60 * +t[10] + +(t[11] || 0))), '-' === t[9] && (u = -u)),
			(s = new Date(Date.UTC(n, i, r, o, a, l, c))),
			u && s.setTime(s.getTime() - u),
			s
		);
	},
	instanceOf: Date,
	represent: function (e) {
		return e.toISOString();
	}
});
var H = new y('tag:yaml.org,2002:merge', {
		kind: 'scalar',
		resolve: function (e) {
			return '<<' === e || null === e;
		}
	}),
	P = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';
var B = new y('tag:yaml.org,2002:binary', {
		kind: 'scalar',
		resolve: function (e) {
			if (null === e) return !1;
			var t,
				n,
				i = 0,
				r = e.length,
				o = P;
			for (n = 0; n < r; n++)
				if (!((t = o.indexOf(e.charAt(n))) > 64)) {
					if (t < 0) return !1;
					i += 6;
				}
			return i % 8 == 0;
		},
		construct: function (e) {
			var t,
				n,
				i = e.replace(/[\r\n=]/g, ''),
				r = i.length,
				o = P,
				a = 0,
				l = [];
			for (t = 0; t < r; t++)
				t % 4 == 0 && t && (l.push((a >> 16) & 255), l.push((a >> 8) & 255), l.push(255 & a)),
					(a = (a << 6) | o.indexOf(i.charAt(t)));
			return (
				0 === (n = (r % 4) * 6)
					? (l.push((a >> 16) & 255), l.push((a >> 8) & 255), l.push(255 & a))
					: 18 === n
					? (l.push((a >> 10) & 255), l.push((a >> 2) & 255))
					: 12 === n && l.push((a >> 4) & 255),
				new Uint8Array(l)
			);
		},
		predicate: function (e) {
			return '[object Uint8Array]' === Object.prototype.toString.call(e);
		},
		represent: function (e) {
			var t,
				n,
				i = '',
				r = 0,
				o = e.length,
				a = P;
			for (t = 0; t < o; t++)
				t % 3 == 0 &&
					t &&
					((i += a[(r >> 18) & 63]),
					(i += a[(r >> 12) & 63]),
					(i += a[(r >> 6) & 63]),
					(i += a[63 & r])),
					(r = (r << 8) + e[t]);
			return (
				0 === (n = o % 3)
					? ((i += a[(r >> 18) & 63]),
					  (i += a[(r >> 12) & 63]),
					  (i += a[(r >> 6) & 63]),
					  (i += a[63 & r]))
					: 2 === n
					? ((i += a[(r >> 10) & 63]),
					  (i += a[(r >> 4) & 63]),
					  (i += a[(r << 2) & 63]),
					  (i += a[64]))
					: 1 === n &&
					  ((i += a[(r >> 2) & 63]), (i += a[(r << 4) & 63]), (i += a[64]), (i += a[64])),
				i
			);
		}
	}),
	q = y,
	G = Object.prototype.hasOwnProperty,
	J = Object.prototype.toString;
var K = new q('tag:yaml.org,2002:omap', {
		kind: 'sequence',
		resolve: function (e) {
			if (null === e) return !0;
			var t,
				n,
				i,
				r,
				o,
				a = [],
				l = e;
			for (t = 0, n = l.length; t < n; t += 1) {
				if (((i = l[t]), (o = !1), '[object Object]' !== J.call(i))) return !1;
				for (r in i)
					if (G.call(i, r)) {
						if (o) return !1;
						o = !0;
					}
				if (!o) return !1;
				if (-1 !== a.indexOf(r)) return !1;
				a.push(r);
			}
			return !0;
		},
		construct: function (e) {
			return null !== e ? e : [];
		}
	}),
	Z = y,
	V = Object.prototype.toString;
var X = new Z('tag:yaml.org,2002:pairs', {
		kind: 'sequence',
		resolve: function (e) {
			if (null === e) return !0;
			var t,
				n,
				i,
				r,
				o,
				a = e;
			for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
				if (((i = a[t]), '[object Object]' !== V.call(i))) return !1;
				if (1 !== (r = Object.keys(i)).length) return !1;
				o[t] = [r[0], i[r[0]]];
			}
			return !0;
		},
		construct: function (e) {
			if (null === e) return [];
			var t,
				n,
				i,
				r,
				o,
				a = e;
			for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
				(i = a[t]), (r = Object.keys(i)), (o[t] = [r[0], i[r[0]]]);
			return o;
		}
	}),
	Q = y,
	ee = Object.prototype.hasOwnProperty;
var te = new Q('tag:yaml.org,2002:set', {
		kind: 'mapping',
		resolve: function (e) {
			if (null === e) return !0;
			var t,
				n = e;
			for (t in n) if (ee.call(n, t) && null !== n[t]) return !1;
			return !0;
		},
		construct: function (e) {
			return null !== e ? e : {};
		}
	}),
	ne = d.extend({ implicit: [W, H], explicit: [B, K, X, te] }),
	ie = i,
	re = l,
	oe = p,
	ae = ne,
	le = Object.prototype.hasOwnProperty,
	se =
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,
	ce = /[\x85\u2028\u2029]/,
	ue = /[,\[\]\{\}]/,
	pe = /^(?:!|!!|![a-z\-]+!)$/i,
	de = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function fe(e) {
	return Object.prototype.toString.call(e);
}
function he(e) {
	return 10 === e || 13 === e;
}
function ge(e) {
	return 9 === e || 32 === e;
}
function me(e) {
	return 9 === e || 32 === e || 10 === e || 13 === e;
}
function ye(e) {
	return 44 === e || 91 === e || 93 === e || 123 === e || 125 === e;
}
function ve(e) {
	var t;
	return 48 <= e && e <= 57 ? e - 48 : 97 <= (t = 32 | e) && t <= 102 ? t - 97 + 10 : -1;
}
function be(e) {
	return 48 === e
		? '\0'
		: 97 === e
		? ''
		: 98 === e
		? '\b'
		: 116 === e || 9 === e
		? '\t'
		: 110 === e
		? '\n'
		: 118 === e
		? '\v'
		: 102 === e
		? '\f'
		: 114 === e
		? '\r'
		: 101 === e
		? ''
		: 32 === e
		? ' '
		: 34 === e
		? '"'
		: 47 === e
		? '/'
		: 92 === e
		? '\\'
		: 78 === e
		? ''
		: 95 === e
		? ' '
		: 76 === e
		? '\u2028'
		: 80 === e
		? '\u2029'
		: '';
}
function Ae(e) {
	return e <= 65535
		? String.fromCharCode(e)
		: String.fromCharCode(55296 + ((e - 65536) >> 10), 56320 + ((e - 65536) & 1023));
}
for (var we = new Array(256), xe = new Array(256), ke = 0; ke < 256; ke++)
	(we[ke] = be(ke) ? 1 : 0), (xe[ke] = be(ke));
function Ce(e, t) {
	(this.input = e),
		(this.filename = t.filename || null),
		(this.schema = t.schema || ae),
		(this.onWarning = t.onWarning || null),
		(this.legacy = t.legacy || !1),
		(this.json = t.json || !1),
		(this.listener = t.listener || null),
		(this.implicitTypes = this.schema.compiledImplicit),
		(this.typeMap = this.schema.compiledTypeMap),
		(this.length = e.length),
		(this.position = 0),
		(this.line = 0),
		(this.lineStart = 0),
		(this.lineIndent = 0),
		(this.firstTabInLine = -1),
		(this.documents = []);
}
function Se(e, t) {
	var n = {
		name: e.filename,
		buffer: e.input.slice(0, -1),
		position: e.position,
		line: e.line,
		column: e.position - e.lineStart
	};
	return (n.snippet = oe(n)), new re(t, n);
}
function Ie(e, t) {
	throw Se(e, t);
}
function Oe(e, t) {
	e.onWarning && e.onWarning.call(null, Se(e, t));
}
var Ee = {
	YAML: function (e, t, n) {
		var i, r, o;
		null !== e.version && Ie(e, 'duplication of %YAML directive'),
			1 !== n.length && Ie(e, 'YAML directive accepts exactly one argument'),
			null === (i = /^([0-9]+)\.([0-9]+)$/.exec(n[0])) &&
				Ie(e, 'ill-formed argument of the YAML directive'),
			(r = parseInt(i[1], 10)),
			(o = parseInt(i[2], 10)),
			1 !== r && Ie(e, 'unacceptable YAML version of the document'),
			(e.version = n[0]),
			(e.checkLineBreaks = o < 2),
			1 !== o && 2 !== o && Oe(e, 'unsupported YAML version of the document');
	},
	TAG: function (e, t, n) {
		var i, r;
		2 !== n.length && Ie(e, 'TAG directive accepts exactly two arguments'),
			(i = n[0]),
			(r = n[1]),
			pe.test(i) || Ie(e, 'ill-formed tag handle (first argument) of the TAG directive'),
			le.call(e.tagMap, i) &&
				Ie(e, 'there is a previously declared suffix for "' + i + '" tag handle'),
			de.test(r) || Ie(e, 'ill-formed tag prefix (second argument) of the TAG directive');
		try {
			r = decodeURIComponent(r);
		} catch (t) {
			Ie(e, 'tag prefix is malformed: ' + r);
		}
		e.tagMap[i] = r;
	}
};
function $e(e, t, n, i) {
	var r, o, a, l;
	if (t < n) {
		if (((l = e.input.slice(t, n)), i))
			for (r = 0, o = l.length; r < o; r += 1)
				9 === (a = l.charCodeAt(r)) ||
					(32 <= a && a <= 1114111) ||
					Ie(e, 'expected valid JSON character');
		else se.test(l) && Ie(e, 'the stream contains non-printable characters');
		e.result += l;
	}
}
function je(e, t, n, i) {
	var r, o, a, l;
	for (
		ie.isObject(n) || Ie(e, 'cannot merge mappings; the provided source object is unacceptable'),
			a = 0,
			l = (r = Object.keys(n)).length;
		a < l;
		a += 1
	)
		(o = r[a]), le.call(t, o) || ((t[o] = n[o]), (i[o] = !0));
}
function Te(e, t, n, i, r, o, a, l, s) {
	var c, u;
	if (Array.isArray(r))
		for (c = 0, u = (r = Array.prototype.slice.call(r)).length; c < u; c += 1)
			Array.isArray(r[c]) && Ie(e, 'nested arrays are not supported inside keys'),
				'object' == typeof r && '[object Object]' === fe(r[c]) && (r[c] = '[object Object]');
	if (
		('object' == typeof r && '[object Object]' === fe(r) && (r = '[object Object]'),
		(r = String(r)),
		null === t && (t = {}),
		'tag:yaml.org,2002:merge' === i)
	)
		if (Array.isArray(o)) for (c = 0, u = o.length; c < u; c += 1) je(e, t, o[c], n);
		else je(e, t, o, n);
	else
		e.json ||
			le.call(n, r) ||
			!le.call(t, r) ||
			((e.line = a || e.line),
			(e.lineStart = l || e.lineStart),
			(e.position = s || e.position),
			Ie(e, 'duplicated mapping key')),
			'__proto__' === r
				? Object.defineProperty(t, r, { configurable: !0, enumerable: !0, writable: !0, value: o })
				: (t[r] = o),
			delete n[r];
	return t;
}
function Me(e) {
	var t;
	10 === (t = e.input.charCodeAt(e.position))
		? e.position++
		: 13 === t
		? (e.position++, 10 === e.input.charCodeAt(e.position) && e.position++)
		: Ie(e, 'a line break is expected'),
		(e.line += 1),
		(e.lineStart = e.position),
		(e.firstTabInLine = -1);
}
function Le(e, t, n) {
	for (var i = 0, r = e.input.charCodeAt(e.position); 0 !== r; ) {
		for (; ge(r); )
			9 === r && -1 === e.firstTabInLine && (e.firstTabInLine = e.position),
				(r = e.input.charCodeAt(++e.position));
		if (t && 35 === r)
			do {
				r = e.input.charCodeAt(++e.position);
			} while (10 !== r && 13 !== r && 0 !== r);
		if (!he(r)) break;
		for (Me(e), r = e.input.charCodeAt(e.position), i++, e.lineIndent = 0; 32 === r; )
			e.lineIndent++, (r = e.input.charCodeAt(++e.position));
	}
	return -1 !== n && 0 !== i && e.lineIndent < n && Oe(e, 'deficient indentation'), i;
}
function Ne(e) {
	var t,
		n = e.position;
	return !(
		(45 !== (t = e.input.charCodeAt(n)) && 46 !== t) ||
		t !== e.input.charCodeAt(n + 1) ||
		t !== e.input.charCodeAt(n + 2) ||
		((n += 3), 0 !== (t = e.input.charCodeAt(n)) && !me(t))
	);
}
function Fe(e, t) {
	1 === t ? (e.result += ' ') : t > 1 && (e.result += ie.repeat('\n', t - 1));
}
function ze(e, t) {
	var n,
		i,
		r = e.tag,
		o = e.anchor,
		a = [],
		l = !1;
	if (-1 !== e.firstTabInLine) return !1;
	for (
		null !== e.anchor && (e.anchorMap[e.anchor] = a), i = e.input.charCodeAt(e.position);
		0 !== i &&
		(-1 !== e.firstTabInLine &&
			((e.position = e.firstTabInLine), Ie(e, 'tab characters must not be used in indentation')),
		45 === i) &&
		me(e.input.charCodeAt(e.position + 1));

	)
		if (((l = !0), e.position++, Le(e, !0, -1) && e.lineIndent <= t))
			a.push(null), (i = e.input.charCodeAt(e.position));
		else if (
			((n = e.line),
			_e(e, t, 3, !1, !0),
			a.push(e.result),
			Le(e, !0, -1),
			(i = e.input.charCodeAt(e.position)),
			(e.line === n || e.lineIndent > t) && 0 !== i)
		)
			Ie(e, 'bad indentation of a sequence entry');
		else if (e.lineIndent < t) break;
	return !!l && ((e.tag = r), (e.anchor = o), (e.kind = 'sequence'), (e.result = a), !0);
}
function Ue(e) {
	var t,
		n,
		i,
		r,
		o = !1,
		a = !1;
	if (33 !== (r = e.input.charCodeAt(e.position))) return !1;
	if (
		(null !== e.tag && Ie(e, 'duplication of a tag property'),
		60 === (r = e.input.charCodeAt(++e.position))
			? ((o = !0), (r = e.input.charCodeAt(++e.position)))
			: 33 === r
			? ((a = !0), (n = '!!'), (r = e.input.charCodeAt(++e.position)))
			: (n = '!'),
		(t = e.position),
		o)
	) {
		do {
			r = e.input.charCodeAt(++e.position);
		} while (0 !== r && 62 !== r);
		e.position < e.length
			? ((i = e.input.slice(t, e.position)), (r = e.input.charCodeAt(++e.position)))
			: Ie(e, 'unexpected end of the stream within a verbatim tag');
	} else {
		for (; 0 !== r && !me(r); )
			33 === r &&
				(a
					? Ie(e, 'tag suffix cannot contain exclamation marks')
					: ((n = e.input.slice(t - 1, e.position + 1)),
					  pe.test(n) || Ie(e, 'named tag handle cannot contain such characters'),
					  (a = !0),
					  (t = e.position + 1))),
				(r = e.input.charCodeAt(++e.position));
		(i = e.input.slice(t, e.position)),
			ue.test(i) && Ie(e, 'tag suffix cannot contain flow indicator characters');
	}
	i && !de.test(i) && Ie(e, 'tag name cannot contain such characters: ' + i);
	try {
		i = decodeURIComponent(i);
	} catch (t) {
		Ie(e, 'tag name is malformed: ' + i);
	}
	return (
		o
			? (e.tag = i)
			: le.call(e.tagMap, n)
			? (e.tag = e.tagMap[n] + i)
			: '!' === n
			? (e.tag = '!' + i)
			: '!!' === n
			? (e.tag = 'tag:yaml.org,2002:' + i)
			: Ie(e, 'undeclared tag handle "' + n + '"'),
		!0
	);
}
function Re(e) {
	var t, n;
	if (38 !== (n = e.input.charCodeAt(e.position))) return !1;
	for (
		null !== e.anchor && Ie(e, 'duplication of an anchor property'),
			n = e.input.charCodeAt(++e.position),
			t = e.position;
		0 !== n && !me(n) && !ye(n);

	)
		n = e.input.charCodeAt(++e.position);
	return (
		e.position === t && Ie(e, 'name of an anchor node must contain at least one character'),
		(e.anchor = e.input.slice(t, e.position)),
		!0
	);
}
function _e(e, t, n, i, r) {
	var o,
		a,
		l,
		s,
		c,
		u,
		p,
		d,
		f,
		h = 1,
		g = !1,
		m = !1;
	if (
		(null !== e.listener && e.listener('open', e),
		(e.tag = null),
		(e.anchor = null),
		(e.kind = null),
		(e.result = null),
		(o = a = l = 4 === n || 3 === n),
		i &&
			Le(e, !0, -1) &&
			((g = !0),
			e.lineIndent > t ? (h = 1) : e.lineIndent === t ? (h = 0) : e.lineIndent < t && (h = -1)),
		1 === h)
	)
		for (; Ue(e) || Re(e); )
			Le(e, !0, -1)
				? ((g = !0),
				  (l = o),
				  e.lineIndent > t ? (h = 1) : e.lineIndent === t ? (h = 0) : e.lineIndent < t && (h = -1))
				: (l = !1);
	if (
		(l && (l = g || r),
		(1 !== h && 4 !== n) ||
			((d = 1 === n || 2 === n ? t : t + 1),
			(f = e.position - e.lineStart),
			1 === h
				? (l &&
						(ze(e, f) ||
							(function (e, t, n) {
								var i,
									r,
									o,
									a,
									l,
									s,
									c,
									u = e.tag,
									p = e.anchor,
									d = {},
									f = Object.create(null),
									h = null,
									g = null,
									m = null,
									y = !1,
									v = !1;
								if (-1 !== e.firstTabInLine) return !1;
								for (
									null !== e.anchor && (e.anchorMap[e.anchor] = d),
										c = e.input.charCodeAt(e.position);
									0 !== c;

								) {
									if (
										(y ||
											-1 === e.firstTabInLine ||
											((e.position = e.firstTabInLine),
											Ie(e, 'tab characters must not be used in indentation')),
										(i = e.input.charCodeAt(e.position + 1)),
										(o = e.line),
										(63 !== c && 58 !== c) || !me(i))
									) {
										if (((a = e.line), (l = e.lineStart), (s = e.position), !_e(e, n, 2, !1, !0)))
											break;
										if (e.line === o) {
											for (c = e.input.charCodeAt(e.position); ge(c); )
												c = e.input.charCodeAt(++e.position);
											if (58 === c)
												me((c = e.input.charCodeAt(++e.position))) ||
													Ie(
														e,
														'a whitespace character is expected after the key-value separator within a block mapping'
													),
													y && (Te(e, d, f, h, g, null, a, l, s), (h = g = m = null)),
													(v = !0),
													(y = !1),
													(r = !1),
													(h = e.tag),
													(g = e.result);
											else {
												if (!v) return (e.tag = u), (e.anchor = p), !0;
												Ie(e, 'can not read an implicit mapping pair; a colon is missed');
											}
										} else {
											if (!v) return (e.tag = u), (e.anchor = p), !0;
											Ie(
												e,
												'can not read a block mapping entry; a multiline key may not be an implicit key'
											);
										}
									} else
										63 === c
											? (y && (Te(e, d, f, h, g, null, a, l, s), (h = g = m = null)),
											  (v = !0),
											  (y = !0),
											  (r = !0))
											: y
											? ((y = !1), (r = !0))
											: Ie(
													e,
													'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line'
											  ),
											(e.position += 1),
											(c = i);
									if (
										((e.line === o || e.lineIndent > t) &&
											(y && ((a = e.line), (l = e.lineStart), (s = e.position)),
											_e(e, t, 4, !0, r) && (y ? (g = e.result) : (m = e.result)),
											y || (Te(e, d, f, h, g, m, a, l, s), (h = g = m = null)),
											Le(e, !0, -1),
											(c = e.input.charCodeAt(e.position))),
										(e.line === o || e.lineIndent > t) && 0 !== c)
									)
										Ie(e, 'bad indentation of a mapping entry');
									else if (e.lineIndent < t) break;
								}
								return (
									y && Te(e, d, f, h, g, null, a, l, s),
									v && ((e.tag = u), (e.anchor = p), (e.kind = 'mapping'), (e.result = d)),
									v
								);
							})(e, f, d))) ||
				  (function (e, t) {
						var n,
							i,
							r,
							o,
							a,
							l,
							s,
							c,
							u,
							p,
							d,
							f,
							h = !0,
							g = e.tag,
							m = e.anchor,
							y = Object.create(null);
						if (91 === (f = e.input.charCodeAt(e.position))) (a = 93), (c = !1), (o = []);
						else {
							if (123 !== f) return !1;
							(a = 125), (c = !0), (o = {});
						}
						for (
							null !== e.anchor && (e.anchorMap[e.anchor] = o),
								f = e.input.charCodeAt(++e.position);
							0 !== f;

						) {
							if ((Le(e, !0, t), (f = e.input.charCodeAt(e.position)) === a))
								return (
									e.position++,
									(e.tag = g),
									(e.anchor = m),
									(e.kind = c ? 'mapping' : 'sequence'),
									(e.result = o),
									!0
								);
							h
								? 44 === f && Ie(e, "expected the node content, but found ','")
								: Ie(e, 'missed comma between flow collection entries'),
								(d = null),
								(l = s = !1),
								63 === f &&
									me(e.input.charCodeAt(e.position + 1)) &&
									((l = s = !0), e.position++, Le(e, !0, t)),
								(n = e.line),
								(i = e.lineStart),
								(r = e.position),
								_e(e, t, 1, !1, !0),
								(p = e.tag),
								(u = e.result),
								Le(e, !0, t),
								(f = e.input.charCodeAt(e.position)),
								(!s && e.line !== n) ||
									58 !== f ||
									((l = !0),
									(f = e.input.charCodeAt(++e.position)),
									Le(e, !0, t),
									_e(e, t, 1, !1, !0),
									(d = e.result)),
								c
									? Te(e, o, y, p, u, d, n, i, r)
									: l
									? o.push(Te(e, null, y, p, u, d, n, i, r))
									: o.push(u),
								Le(e, !0, t),
								44 === (f = e.input.charCodeAt(e.position))
									? ((h = !0), (f = e.input.charCodeAt(++e.position)))
									: (h = !1);
						}
						Ie(e, 'unexpected end of the stream within a flow collection');
				  })(e, d)
					? (m = !0)
					: ((a &&
							(function (e, t) {
								var n,
									i,
									r,
									o,
									a,
									l = 1,
									s = !1,
									c = !1,
									u = t,
									p = 0,
									d = !1;
								if (124 === (o = e.input.charCodeAt(e.position))) i = !1;
								else {
									if (62 !== o) return !1;
									i = !0;
								}
								for (e.kind = 'scalar', e.result = ''; 0 !== o; )
									if (43 === (o = e.input.charCodeAt(++e.position)) || 45 === o)
										1 === l
											? (l = 43 === o ? 3 : 2)
											: Ie(e, 'repeat of a chomping mode identifier');
									else {
										if (!((r = 48 <= (a = o) && a <= 57 ? a - 48 : -1) >= 0)) break;
										0 === r
											? Ie(
													e,
													'bad explicit indentation width of a block scalar; it cannot be less than one'
											  )
											: c
											? Ie(e, 'repeat of an indentation width identifier')
											: ((u = t + r - 1), (c = !0));
									}
								if (ge(o)) {
									do {
										o = e.input.charCodeAt(++e.position);
									} while (ge(o));
									if (35 === o)
										do {
											o = e.input.charCodeAt(++e.position);
										} while (!he(o) && 0 !== o);
								}
								for (; 0 !== o; ) {
									for (
										Me(e), e.lineIndent = 0, o = e.input.charCodeAt(e.position);
										(!c || e.lineIndent < u) && 32 === o;

									)
										e.lineIndent++, (o = e.input.charCodeAt(++e.position));
									if ((!c && e.lineIndent > u && (u = e.lineIndent), he(o))) p++;
									else {
										if (e.lineIndent < u) {
											3 === l
												? (e.result += ie.repeat('\n', s ? 1 + p : p))
												: 1 === l && s && (e.result += '\n');
											break;
										}
										for (
											i
												? ge(o)
													? ((d = !0), (e.result += ie.repeat('\n', s ? 1 + p : p)))
													: d
													? ((d = !1), (e.result += ie.repeat('\n', p + 1)))
													: 0 === p
													? s && (e.result += ' ')
													: (e.result += ie.repeat('\n', p))
												: (e.result += ie.repeat('\n', s ? 1 + p : p)),
												s = !0,
												c = !0,
												p = 0,
												n = e.position;
											!he(o) && 0 !== o;

										)
											o = e.input.charCodeAt(++e.position);
										$e(e, n, e.position, !1);
									}
								}
								return !0;
							})(e, d)) ||
					  (function (e, t) {
							var n, i, r;
							if (39 !== (n = e.input.charCodeAt(e.position))) return !1;
							for (
								e.kind = 'scalar', e.result = '', e.position++, i = r = e.position;
								0 !== (n = e.input.charCodeAt(e.position));

							)
								if (39 === n) {
									if (($e(e, i, e.position, !0), 39 !== (n = e.input.charCodeAt(++e.position))))
										return !0;
									(i = e.position), e.position++, (r = e.position);
								} else
									he(n)
										? ($e(e, i, r, !0), Fe(e, Le(e, !1, t)), (i = r = e.position))
										: e.position === e.lineStart && Ne(e)
										? Ie(e, 'unexpected end of the document within a single quoted scalar')
										: (e.position++, (r = e.position));
							Ie(e, 'unexpected end of the stream within a single quoted scalar');
					  })(e, d) ||
					  (function (e, t) {
							var n, i, r, o, a, l, s;
							if (34 !== (l = e.input.charCodeAt(e.position))) return !1;
							for (
								e.kind = 'scalar', e.result = '', e.position++, n = i = e.position;
								0 !== (l = e.input.charCodeAt(e.position));

							) {
								if (34 === l) return $e(e, n, e.position, !0), e.position++, !0;
								if (92 === l) {
									if (($e(e, n, e.position, !0), he((l = e.input.charCodeAt(++e.position)))))
										Le(e, !1, t);
									else if (l < 256 && we[l]) (e.result += xe[l]), e.position++;
									else if ((a = 120 === (s = l) ? 2 : 117 === s ? 4 : 85 === s ? 8 : 0) > 0) {
										for (r = a, o = 0; r > 0; r--)
											(a = ve((l = e.input.charCodeAt(++e.position)))) >= 0
												? (o = (o << 4) + a)
												: Ie(e, 'expected hexadecimal character');
										(e.result += Ae(o)), e.position++;
									} else Ie(e, 'unknown escape sequence');
									n = i = e.position;
								} else
									he(l)
										? ($e(e, n, i, !0), Fe(e, Le(e, !1, t)), (n = i = e.position))
										: e.position === e.lineStart && Ne(e)
										? Ie(e, 'unexpected end of the document within a double quoted scalar')
										: (e.position++, (i = e.position));
							}
							Ie(e, 'unexpected end of the stream within a double quoted scalar');
					  })(e, d)
							? (m = !0)
							: !(function (e) {
									var t, n, i;
									if (42 !== (i = e.input.charCodeAt(e.position))) return !1;
									for (
										i = e.input.charCodeAt(++e.position), t = e.position;
										0 !== i && !me(i) && !ye(i);

									)
										i = e.input.charCodeAt(++e.position);
									return (
										e.position === t &&
											Ie(e, 'name of an alias node must contain at least one character'),
										(n = e.input.slice(t, e.position)),
										le.call(e.anchorMap, n) || Ie(e, 'unidentified alias "' + n + '"'),
										(e.result = e.anchorMap[n]),
										Le(e, !0, -1),
										!0
									);
							  })(e)
							? (function (e, t, n) {
									var i,
										r,
										o,
										a,
										l,
										s,
										c,
										u,
										p = e.kind,
										d = e.result;
									if (
										me((u = e.input.charCodeAt(e.position))) ||
										ye(u) ||
										35 === u ||
										38 === u ||
										42 === u ||
										33 === u ||
										124 === u ||
										62 === u ||
										39 === u ||
										34 === u ||
										37 === u ||
										64 === u ||
										96 === u
									)
										return !1;
									if (
										(63 === u || 45 === u) &&
										(me((i = e.input.charCodeAt(e.position + 1))) || (n && ye(i)))
									)
										return !1;
									for (e.kind = 'scalar', e.result = '', r = o = e.position, a = !1; 0 !== u; ) {
										if (58 === u) {
											if (me((i = e.input.charCodeAt(e.position + 1))) || (n && ye(i))) break;
										} else if (35 === u) {
											if (me(e.input.charCodeAt(e.position - 1))) break;
										} else {
											if ((e.position === e.lineStart && Ne(e)) || (n && ye(u))) break;
											if (he(u)) {
												if (
													((l = e.line),
													(s = e.lineStart),
													(c = e.lineIndent),
													Le(e, !1, -1),
													e.lineIndent >= t)
												) {
													(a = !0), (u = e.input.charCodeAt(e.position));
													continue;
												}
												(e.position = o), (e.line = l), (e.lineStart = s), (e.lineIndent = c);
												break;
											}
										}
										a && ($e(e, r, o, !1), Fe(e, e.line - l), (r = o = e.position), (a = !1)),
											ge(u) || (o = e.position + 1),
											(u = e.input.charCodeAt(++e.position));
									}
									return $e(e, r, o, !1), !!e.result || ((e.kind = p), (e.result = d), !1);
							  })(e, d, 1 === n) && ((m = !0), null === e.tag && (e.tag = '?'))
							: ((m = !0),
							  (null === e.tag && null === e.anchor) ||
									Ie(e, 'alias node should not have any properties')),
					  null !== e.anchor && (e.anchorMap[e.anchor] = e.result))
				: 0 === h && (m = l && ze(e, f))),
		null === e.tag)
	)
		null !== e.anchor && (e.anchorMap[e.anchor] = e.result);
	else if ('?' === e.tag) {
		for (
			null !== e.result &&
				'scalar' !== e.kind &&
				Ie(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'),
				s = 0,
				c = e.implicitTypes.length;
			s < c;
			s += 1
		)
			if ((p = e.implicitTypes[s]).resolve(e.result)) {
				(e.result = p.construct(e.result)),
					(e.tag = p.tag),
					null !== e.anchor && (e.anchorMap[e.anchor] = e.result);
				break;
			}
	} else if ('!' !== e.tag) {
		if (le.call(e.typeMap[e.kind || 'fallback'], e.tag)) p = e.typeMap[e.kind || 'fallback'][e.tag];
		else
			for (p = null, s = 0, c = (u = e.typeMap.multi[e.kind || 'fallback']).length; s < c; s += 1)
				if (e.tag.slice(0, u[s].tag.length) === u[s].tag) {
					p = u[s];
					break;
				}
		p || Ie(e, 'unknown tag !<' + e.tag + '>'),
			null !== e.result &&
				p.kind !== e.kind &&
				Ie(
					e,
					'unacceptable node kind for !<' +
						e.tag +
						'> tag; it should be "' +
						p.kind +
						'", not "' +
						e.kind +
						'"'
				),
			p.resolve(e.result, e.tag)
				? ((e.result = p.construct(e.result, e.tag)),
				  null !== e.anchor && (e.anchorMap[e.anchor] = e.result))
				: Ie(e, 'cannot resolve a node with !<' + e.tag + '> explicit tag');
	}
	return null !== e.listener && e.listener('close', e), null !== e.tag || null !== e.anchor || m;
}
function De(e) {
	var t,
		n,
		i,
		r,
		o = e.position,
		a = !1;
	for (
		e.version = null,
			e.checkLineBreaks = e.legacy,
			e.tagMap = Object.create(null),
			e.anchorMap = Object.create(null);
		0 !== (r = e.input.charCodeAt(e.position)) &&
		(Le(e, !0, -1), (r = e.input.charCodeAt(e.position)), !(e.lineIndent > 0 || 37 !== r));

	) {
		for (a = !0, r = e.input.charCodeAt(++e.position), t = e.position; 0 !== r && !me(r); )
			r = e.input.charCodeAt(++e.position);
		for (
			i = [],
				(n = e.input.slice(t, e.position)).length < 1 &&
					Ie(e, 'directive name must not be less than one character in length');
			0 !== r;

		) {
			for (; ge(r); ) r = e.input.charCodeAt(++e.position);
			if (35 === r) {
				do {
					r = e.input.charCodeAt(++e.position);
				} while (0 !== r && !he(r));
				break;
			}
			if (he(r)) break;
			for (t = e.position; 0 !== r && !me(r); ) r = e.input.charCodeAt(++e.position);
			i.push(e.input.slice(t, e.position));
		}
		0 !== r && Me(e),
			le.call(Ee, n) ? Ee[n](e, n, i) : Oe(e, 'unknown document directive "' + n + '"');
	}
	Le(e, !0, -1),
		0 === e.lineIndent &&
		45 === e.input.charCodeAt(e.position) &&
		45 === e.input.charCodeAt(e.position + 1) &&
		45 === e.input.charCodeAt(e.position + 2)
			? ((e.position += 3), Le(e, !0, -1))
			: a && Ie(e, 'directives end mark is expected'),
		_e(e, e.lineIndent - 1, 4, !1, !0),
		Le(e, !0, -1),
		e.checkLineBreaks &&
			ce.test(e.input.slice(o, e.position)) &&
			Oe(e, 'non-ASCII line breaks are interpreted as content'),
		e.documents.push(e.result),
		e.position === e.lineStart && Ne(e)
			? 46 === e.input.charCodeAt(e.position) && ((e.position += 3), Le(e, !0, -1))
			: e.position < e.length - 1 && Ie(e, 'end of the stream or a document separator is expected');
}
function Ye(e, t) {
	(t = t || {}),
		0 !== (e = String(e)).length &&
			(10 !== e.charCodeAt(e.length - 1) && 13 !== e.charCodeAt(e.length - 1) && (e += '\n'),
			65279 === e.charCodeAt(0) && (e = e.slice(1)));
	var n = new Ce(e, t),
		i = e.indexOf('\0');
	for (
		-1 !== i && ((n.position = i), Ie(n, 'null byte is not allowed in input')), n.input += '\0';
		32 === n.input.charCodeAt(n.position);

	)
		(n.lineIndent += 1), (n.position += 1);
	for (; n.position < n.length - 1; ) De(n);
	return n.documents;
}
(n.loadAll = function (e, t, n) {
	null !== t && 'object' == typeof t && void 0 === n && ((n = t), (t = null));
	var i = Ye(e, n);
	if ('function' != typeof t) return i;
	for (var r = 0, o = i.length; r < o; r += 1) t(i[r]);
}),
	(n.load = function (e, t) {
		var n = Ye(e, t);
		if (0 !== n.length) {
			if (1 === n.length) return n[0];
			throw new re('expected a single document in the stream, but found more');
		}
	});
var We = {},
	He = i,
	Pe = l,
	Be = ne,
	qe = Object.prototype.toString,
	Ge = Object.prototype.hasOwnProperty,
	Je = 65279,
	Ke = {
		0: '\\0',
		7: '\\a',
		8: '\\b',
		9: '\\t',
		10: '\\n',
		11: '\\v',
		12: '\\f',
		13: '\\r',
		27: '\\e',
		34: '\\"',
		92: '\\\\',
		133: '\\N',
		160: '\\_',
		8232: '\\L',
		8233: '\\P'
	},
	Ze = [
		'y',
		'Y',
		'yes',
		'Yes',
		'YES',
		'on',
		'On',
		'ON',
		'n',
		'N',
		'no',
		'No',
		'NO',
		'off',
		'Off',
		'OFF'
	],
	Ve = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Xe(e) {
	var t, n, i;
	if (((t = e.toString(16).toUpperCase()), e <= 255)) (n = 'x'), (i = 2);
	else if (e <= 65535) (n = 'u'), (i = 4);
	else {
		if (!(e <= 4294967295))
			throw new Pe('code point within a string may not be greater than 0xFFFFFFFF');
		(n = 'U'), (i = 8);
	}
	return '\\' + n + He.repeat('0', i - t.length) + t;
}
function Qe(e) {
	(this.schema = e.schema || Be),
		(this.indent = Math.max(1, e.indent || 2)),
		(this.noArrayIndent = e.noArrayIndent || !1),
		(this.skipInvalid = e.skipInvalid || !1),
		(this.flowLevel = He.isNothing(e.flowLevel) ? -1 : e.flowLevel),
		(this.styleMap = (function (e, t) {
			var n, i, r, o, a, l, s;
			if (null === t) return {};
			for (n = {}, r = 0, o = (i = Object.keys(t)).length; r < o; r += 1)
				(a = i[r]),
					(l = String(t[a])),
					'!!' === a.slice(0, 2) && (a = 'tag:yaml.org,2002:' + a.slice(2)),
					(s = e.compiledTypeMap.fallback[a]) &&
						Ge.call(s.styleAliases, l) &&
						(l = s.styleAliases[l]),
					(n[a] = l);
			return n;
		})(this.schema, e.styles || null)),
		(this.sortKeys = e.sortKeys || !1),
		(this.lineWidth = e.lineWidth || 80),
		(this.noRefs = e.noRefs || !1),
		(this.noCompatMode = e.noCompatMode || !1),
		(this.condenseFlow = e.condenseFlow || !1),
		(this.quotingType = '"' === e.quotingType ? 2 : 1),
		(this.forceQuotes = e.forceQuotes || !1),
		(this.replacer = 'function' == typeof e.replacer ? e.replacer : null),
		(this.implicitTypes = this.schema.compiledImplicit),
		(this.explicitTypes = this.schema.compiledExplicit),
		(this.tag = null),
		(this.result = ''),
		(this.duplicates = []),
		(this.usedDuplicates = null);
}
function et(e, t) {
	for (var n, i = He.repeat(' ', t), r = 0, o = -1, a = '', l = e.length; r < l; )
		-1 === (o = e.indexOf('\n', r))
			? ((n = e.slice(r)), (r = l))
			: ((n = e.slice(r, o + 1)), (r = o + 1)),
			n.length && '\n' !== n && (a += i),
			(a += n);
	return a;
}
function tt(e, t) {
	return '\n' + He.repeat(' ', e.indent * t);
}
function nt(e) {
	return 32 === e || 9 === e;
}
function it(e) {
	return (
		(32 <= e && e <= 126) ||
		(161 <= e && e <= 55295 && 8232 !== e && 8233 !== e) ||
		(57344 <= e && e <= 65533 && e !== Je) ||
		(65536 <= e && e <= 1114111)
	);
}
function rt(e) {
	return it(e) && e !== Je && 13 !== e && 10 !== e;
}
function ot(e, t, n) {
	var i = rt(e),
		r = i && !nt(e);
	return (
		((n ? i : i && 44 !== e && 91 !== e && 93 !== e && 123 !== e && 125 !== e) &&
			35 !== e &&
			!(58 === t && !r)) ||
		(rt(t) && !nt(t) && 35 === e) ||
		(58 === t && r)
	);
}
function at(e, t) {
	var n,
		i = e.charCodeAt(t);
	return i >= 55296 &&
		i <= 56319 &&
		t + 1 < e.length &&
		(n = e.charCodeAt(t + 1)) >= 56320 &&
		n <= 57343
		? 1024 * (i - 55296) + n - 56320 + 65536
		: i;
}
function lt(e) {
	return /^\n* /.test(e);
}
function st(e, t, n, i, r, o, a, l) {
	var s,
		c,
		u = 0,
		p = null,
		d = !1,
		f = !1,
		h = -1 !== i,
		g = -1,
		m =
			it((c = at(e, 0))) &&
			c !== Je &&
			!nt(c) &&
			45 !== c &&
			63 !== c &&
			58 !== c &&
			44 !== c &&
			91 !== c &&
			93 !== c &&
			123 !== c &&
			125 !== c &&
			35 !== c &&
			38 !== c &&
			42 !== c &&
			33 !== c &&
			124 !== c &&
			61 !== c &&
			62 !== c &&
			39 !== c &&
			34 !== c &&
			37 !== c &&
			64 !== c &&
			96 !== c &&
			(function (e) {
				return !nt(e) && 58 !== e;
			})(at(e, e.length - 1));
	if (t || a)
		for (s = 0; s < e.length; u >= 65536 ? (s += 2) : s++) {
			if (!it((u = at(e, s)))) return 5;
			(m = m && ot(u, p, l)), (p = u);
		}
	else {
		for (s = 0; s < e.length; u >= 65536 ? (s += 2) : s++) {
			if (10 === (u = at(e, s)))
				(d = !0), h && ((f = f || (s - g - 1 > i && ' ' !== e[g + 1])), (g = s));
			else if (!it(u)) return 5;
			(m = m && ot(u, p, l)), (p = u);
		}
		f = f || (h && s - g - 1 > i && ' ' !== e[g + 1]);
	}
	return d || f
		? n > 9 && lt(e)
			? 5
			: a
			? 2 === o
				? 5
				: 2
			: f
			? 4
			: 3
		: !m || a || r(e)
		? 2 === o
			? 5
			: 2
		: 1;
}
function ct(e, t, n, i, r) {
	e.dump = (function () {
		if (0 === t.length) return 2 === e.quotingType ? '""' : "''";
		if (!e.noCompatMode && (-1 !== Ze.indexOf(t) || Ve.test(t)))
			return 2 === e.quotingType ? '"' + t + '"' : "'" + t + "'";
		var o = e.indent * Math.max(1, n),
			a = -1 === e.lineWidth ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o),
			l = i || (e.flowLevel > -1 && n >= e.flowLevel);
		switch (
			st(
				t,
				l,
				e.indent,
				a,
				function (t) {
					return (function (e, t) {
						var n, i;
						for (n = 0, i = e.implicitTypes.length; n < i; n += 1)
							if (e.implicitTypes[n].resolve(t)) return !0;
						return !1;
					})(e, t);
				},
				e.quotingType,
				e.forceQuotes && !i,
				r
			)
		) {
			case 1:
				return t;
			case 2:
				return "'" + t.replace(/'/g, "''") + "'";
			case 3:
				return '|' + ut(t, e.indent) + pt(et(t, o));
			case 4:
				return (
					'>' +
					ut(t, e.indent) +
					pt(
						et(
							(function (e, t) {
								var n,
									i,
									r = /(\n+)([^\n]*)/g,
									o =
										((l = e.indexOf('\n')),
										(l = -1 !== l ? l : e.length),
										(r.lastIndex = l),
										dt(e.slice(0, l), t)),
									a = '\n' === e[0] || ' ' === e[0];
								var l;
								for (; (i = r.exec(e)); ) {
									var s = i[1],
										c = i[2];
									(n = ' ' === c[0]),
										(o += s + (a || n || '' === c ? '' : '\n') + dt(c, t)),
										(a = n);
								}
								return o;
							})(t, a),
							o
						)
					)
				);
			case 5:
				return (
					'"' +
					(function (e) {
						for (var t, n = '', i = 0, r = 0; r < e.length; i >= 65536 ? (r += 2) : r++)
							(i = at(e, r)),
								!(t = Ke[i]) && it(i)
									? ((n += e[r]), i >= 65536 && (n += e[r + 1]))
									: (n += t || Xe(i));
						return n;
					})(t) +
					'"'
				);
			default:
				throw new Pe('impossible error: invalid scalar style');
		}
	})();
}
function ut(e, t) {
	var n = lt(e) ? String(t) : '',
		i = '\n' === e[e.length - 1];
	return n + (i && ('\n' === e[e.length - 2] || '\n' === e) ? '+' : i ? '' : '-') + '\n';
}
function pt(e) {
	return '\n' === e[e.length - 1] ? e.slice(0, -1) : e;
}
function dt(e, t) {
	if ('' === e || ' ' === e[0]) return e;
	for (var n, i, r = / [^ ]/g, o = 0, a = 0, l = 0, s = ''; (n = r.exec(e)); )
		(l = n.index) - o > t && ((i = a > o ? a : l), (s += '\n' + e.slice(o, i)), (o = i + 1)),
			(a = l);
	return (
		(s += '\n'),
		e.length - o > t && a > o ? (s += e.slice(o, a) + '\n' + e.slice(a + 1)) : (s += e.slice(o)),
		s.slice(1)
	);
}
function ft(e, t, n, i) {
	var r,
		o,
		a,
		l = '',
		s = e.tag;
	for (r = 0, o = n.length; r < o; r += 1)
		(a = n[r]),
			e.replacer && (a = e.replacer.call(n, String(r), a)),
			(gt(e, t + 1, a, !0, !0, !1, !0) || (void 0 === a && gt(e, t + 1, null, !0, !0, !1, !0))) &&
				((i && '' === l) || (l += tt(e, t)),
				e.dump && 10 === e.dump.charCodeAt(0) ? (l += '-') : (l += '- '),
				(l += e.dump));
	(e.tag = s), (e.dump = l || '[]');
}
function ht(e, t, n) {
	var i, r, o, a, l, s;
	for (o = 0, a = (r = n ? e.explicitTypes : e.implicitTypes).length; o < a; o += 1)
		if (
			((l = r[o]).instanceOf || l.predicate) &&
			(!l.instanceOf || ('object' == typeof t && t instanceof l.instanceOf)) &&
			(!l.predicate || l.predicate(t))
		) {
			if (
				(n
					? l.multi && l.representName
						? (e.tag = l.representName(t))
						: (e.tag = l.tag)
					: (e.tag = '?'),
				l.represent)
			) {
				if (
					((s = e.styleMap[l.tag] || l.defaultStyle), '[object Function]' === qe.call(l.represent))
				)
					i = l.represent(t, s);
				else {
					if (!Ge.call(l.represent, s))
						throw new Pe('!<' + l.tag + '> tag resolver accepts not "' + s + '" style');
					i = l.represent[s](t, s);
				}
				e.dump = i;
			}
			return !0;
		}
	return !1;
}
function gt(e, t, n, i, r, o, a) {
	(e.tag = null), (e.dump = n), ht(e, n, !1) || ht(e, n, !0);
	var l,
		s = qe.call(e.dump),
		c = i;
	i && (i = e.flowLevel < 0 || e.flowLevel > t);
	var u,
		p,
		d = '[object Object]' === s || '[object Array]' === s;
	if (
		(d && (p = -1 !== (u = e.duplicates.indexOf(n))),
		((null !== e.tag && '?' !== e.tag) || p || (2 !== e.indent && t > 0)) && (r = !1),
		p && e.usedDuplicates[u])
	)
		e.dump = '*ref_' + u;
	else {
		if ((d && p && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), '[object Object]' === s))
			i && 0 !== Object.keys(e.dump).length
				? (!(function (e, t, n, i) {
						var r,
							o,
							a,
							l,
							s,
							c,
							u = '',
							p = e.tag,
							d = Object.keys(n);
						if (!0 === e.sortKeys) d.sort();
						else if ('function' == typeof e.sortKeys) d.sort(e.sortKeys);
						else if (e.sortKeys) throw new Pe('sortKeys must be a boolean or a function');
						for (r = 0, o = d.length; r < o; r += 1)
							(c = ''),
								(i && '' === u) || (c += tt(e, t)),
								(l = n[(a = d[r])]),
								e.replacer && (l = e.replacer.call(n, a, l)),
								gt(e, t + 1, a, !0, !0, !0) &&
									((s = (null !== e.tag && '?' !== e.tag) || (e.dump && e.dump.length > 1024)) &&
										(e.dump && 10 === e.dump.charCodeAt(0) ? (c += '?') : (c += '? ')),
									(c += e.dump),
									s && (c += tt(e, t)),
									gt(e, t + 1, l, !0, s) &&
										(e.dump && 10 === e.dump.charCodeAt(0) ? (c += ':') : (c += ': '),
										(u += c += e.dump)));
						(e.tag = p), (e.dump = u || '{}');
				  })(e, t, e.dump, r),
				  p && (e.dump = '&ref_' + u + e.dump))
				: (!(function (e, t, n) {
						var i,
							r,
							o,
							a,
							l,
							s = '',
							c = e.tag,
							u = Object.keys(n);
						for (i = 0, r = u.length; i < r; i += 1)
							(l = ''),
								'' !== s && (l += ', '),
								e.condenseFlow && (l += '"'),
								(a = n[(o = u[i])]),
								e.replacer && (a = e.replacer.call(n, o, a)),
								gt(e, t, o, !1, !1) &&
									(e.dump.length > 1024 && (l += '? '),
									(l += e.dump + (e.condenseFlow ? '"' : '') + ':' + (e.condenseFlow ? '' : ' ')),
									gt(e, t, a, !1, !1) && (s += l += e.dump));
						(e.tag = c), (e.dump = '{' + s + '}');
				  })(e, t, e.dump),
				  p && (e.dump = '&ref_' + u + ' ' + e.dump));
		else if ('[object Array]' === s)
			i && 0 !== e.dump.length
				? (e.noArrayIndent && !a && t > 0 ? ft(e, t - 1, e.dump, r) : ft(e, t, e.dump, r),
				  p && (e.dump = '&ref_' + u + e.dump))
				: (!(function (e, t, n) {
						var i,
							r,
							o,
							a = '',
							l = e.tag;
						for (i = 0, r = n.length; i < r; i += 1)
							(o = n[i]),
								e.replacer && (o = e.replacer.call(n, String(i), o)),
								(gt(e, t, o, !1, !1) || (void 0 === o && gt(e, t, null, !1, !1))) &&
									('' !== a && (a += ',' + (e.condenseFlow ? '' : ' ')), (a += e.dump));
						(e.tag = l), (e.dump = '[' + a + ']');
				  })(e, t, e.dump),
				  p && (e.dump = '&ref_' + u + ' ' + e.dump));
		else {
			if ('[object String]' !== s) {
				if ('[object Undefined]' === s) return !1;
				if (e.skipInvalid) return !1;
				throw new Pe('unacceptable kind of an object to dump ' + s);
			}
			'?' !== e.tag && ct(e, e.dump, t, o, c);
		}
		null !== e.tag &&
			'?' !== e.tag &&
			((l = encodeURI('!' === e.tag[0] ? e.tag.slice(1) : e.tag).replace(/!/g, '%21')),
			(l =
				'!' === e.tag[0]
					? '!' + l
					: 'tag:yaml.org,2002:' === l.slice(0, 18)
					? '!!' + l.slice(18)
					: '!<' + l + '>'),
			(e.dump = l + ' ' + e.dump));
	}
	return !0;
}
function mt(e, t) {
	var n,
		i,
		r = [],
		o = [];
	for (yt(e, r, o), n = 0, i = o.length; n < i; n += 1) t.duplicates.push(r[o[n]]);
	t.usedDuplicates = new Array(i);
}
function yt(e, t, n) {
	var i, r, o;
	if (null !== e && 'object' == typeof e)
		if (-1 !== (r = t.indexOf(e))) -1 === n.indexOf(r) && n.push(r);
		else if ((t.push(e), Array.isArray(e))) for (r = 0, o = e.length; r < o; r += 1) yt(e[r], t, n);
		else for (r = 0, o = (i = Object.keys(e)).length; r < o; r += 1) yt(e[i[r]], t, n);
}
We.dump = function (e, t) {
	var n = new Qe((t = t || {}));
	n.noRefs || mt(e, n);
	var i = e;
	return (
		n.replacer && (i = n.replacer.call({ '': i }, '', i)), gt(n, 0, i, !0, !0) ? n.dump + '\n' : ''
	);
};
var vt = n,
	bt = We;
function At(e, t) {
	return function () {
		throw new Error(
			'Function yaml.' +
				e +
				' is removed in js-yaml 4. Use yaml.' +
				t +
				' instead, which is now safe by default.'
		);
	};
}
(t.Type = y),
	(t.Schema = x),
	(t.FAILSAFE_SCHEMA = I),
	(t.JSON_SCHEMA = R),
	(t.CORE_SCHEMA = d),
	(t.DEFAULT_SCHEMA = ne),
	(t.load = vt.load),
	(t.loadAll = vt.loadAll),
	(t.dump = bt.dump),
	(t.YAMLException = l),
	(t.types = {
		binary: B,
		float: U,
		map: S,
		null: O,
		pairs: X,
		set: te,
		timestamp: W,
		bool: E,
		int: M,
		merge: H,
		omap: K,
		seq: C,
		str: k
	}),
	(t.safeLoad = At('safeLoad', 'load')),
	(t.safeLoadAll = At('safeLoadAll', 'loadAll')),
	(t.safeDump = At('safeDump', 'dump'));
var wt = (e) => {
	const { format: t, scale: n, srcSize: i } = e;
	return n && 'SVG' !== t
		? {
				settings: { format: t, constraint: { type: 'SCALE', value: +n } },
				destSize: { w: i.w * +n, h: i.h * +n }
		  }
		: { settings: { format: t }, destSize: i };
};
const xt = (e) => {
	if (!e || !e.parent) return null;
	if (!Array.isArray(e.children) || !e.children.length) return null;
	const t = e.parent;
	if ('INSTANCE' === t.type) return null;
	const n = figma.group(e.children, t);
	return e.name && (n.name = e.name), n;
};
var kt,
	Ct,
	St = (e, t) => {
		for (var n = String(e); n.length < t; ) n = '0' + n;
		return n;
	},
	It = () => {
		var e = new Date(),
			t = e.getFullYear(),
			n = St(e.getDate(), 2);
		return (
			t +
			'-' +
			St(e.getMonth() + 1, 2) +
			'-' +
			n +
			' ' +
			St(e.getHours(), 2) +
			':' +
			St(e.getMinutes(), 2)
		);
	},
	Ot = {};
(Ct = function () {
	var e = JSON.parse(
			'{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\"","”":"\\"","„":"\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"}'
		),
		t = JSON.parse(
			'{"bg":{"Й":"Y","Ц":"Ts","Щ":"Sht","Ъ":"A","Ь":"Y","й":"y","ц":"ts","щ":"sht","ъ":"a","ь":"y"},"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","ß":"ss","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","¢":"centavos","£":"libras","¤":"moneda","₣":"francos","∑":"suma","∞":"infinito","♥":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","¢":"centavo","∑":"soma","£":"libra","∞":"infinito","♥":"amor"},"uk":{"И":"Y","и":"y","Й":"Y","й":"y","Ц":"Ts","ц":"ts","Х":"Kh","х":"kh","Щ":"Shch","щ":"shch","Г":"H","г":"h"},"vi":{"Đ":"D","đ":"d"},"da":{"Ø":"OE","ø":"oe","Å":"AA","å":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"større end"},"nb":{"&":"og","Å":"AA","Æ":"AE","Ø":"OE","å":"aa","æ":"ae","ø":"oe"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och","Å":"AA","Ä":"AE","Ö":"OE","å":"aa","ä":"ae","ö":"oe"}}'
		);
	function n(n, i) {
		if ('string' != typeof n) throw new Error('slugify: string argument expected');
		var r = t[(i = 'string' == typeof i ? { replacement: i } : i || {}).locale] || {},
			o = void 0 === i.replacement ? '-' : i.replacement,
			a = void 0 === i.trim || i.trim,
			l = n
				.normalize()
				.split('')
				.reduce(function (t, n) {
					var a = r[n] || e[n] || n;
					return a === o && (a = ' '), t + a.replace(i.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '');
				}, '');
		return (
			i.strict && (l = l.replace(/[^A-Za-z0-9\s]/g, '')),
			a && (l = l.trim()),
			(l = l.replace(/\s+/g, o)),
			i.lower && (l = l.toLowerCase()),
			l
		);
	}
	return (
		(n.extend = function (t) {
			Object.assign(e, t);
		}),
		n
	);
}),
	((kt = {
		get exports() {
			return Ot;
		},
		set exports(e) {
			Ot = e;
		}
	}).exports = Ct()),
	(kt.exports.default = Ct());
var Et = Ot;
const $t = [];
var jt = (e) => {
		let t, n;
		if (($t.push(e.fontName), e.fills.length)) {
			const [i] = e.fills,
				[r, o, a] = [i.color.r, i.color.g, i.color.b].map((e) => Math.round(255 * e));
			(t = `rgba(${r}, ${o}, ${a}, ${i.opacity})`), (n = i.blendMode.toLowerCase());
		}
		const i = {
			'font-family': e.fontName.family,
			'font-style': e.fontName.style.includes('Italic') ? 'italic' : 'normal',
			'font-weight': e.fontWeight,
			'font-size': e.fontSize + 'px',
			'text-decoration': e.textDecoration.toLowerCase(),
			'text-transform': 'ORIGINAL' === e.textCase ? 'none' : e.textCase.toLowerCase(),
			'line-height':
				'AUTO' === e.lineHeight.unit
					? 'normal'
					: 'PERCENT' === e.lineHeight.unit && e.lineHeight.value > 0
					? e.lineHeight.value / 100
					: e.lineHeight.value + 'px',
			'letter-spacing':
				'PERCENT' === e.letterSpacing.unit && e.letterSpacing.value > 0
					? e.letterSpacing.value / 100
					: e.letterSpacing.value + 'px',
			color: t,
			'mix-blend-mode': n
		};
		return {
			object: i,
			string: Object.entries(i)
				.filter((e) => e[0] && e[1])
				.map(([e, t]) => `${e}: ${t};`)
				.join(' ')
		};
	},
	Tt = (e) => e.replace(/^[\s\uFEFF\xA0\x03]+|[\s\uFEFF\xA0\x03]+$/g, '');
const Mt = [
		'fontName',
		'fontWeight',
		'fontSize',
		'textDecoration',
		'textCase',
		'lineHeight',
		'letterSpacing',
		'fills',
		'textStyleId',
		'fillStyleId',
		'listOptions',
		'indentation',
		'hyperlink'
	],
	Lt = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
var Nt = (e) => `#${e} { position: relative; overflow: hidden; display: none; }\n`,
	Ft = ({ id: e, config: t, css: n }) => {
		const i = `#${e}`,
			r = {};
		(r[i] = {
			'max-width': t.maxWidth ? `${t.maxWidth}px` : 'none',
			margin: t.centered ? '0 auto' : '0'
		}),
			t.centered && (r[`${i} .f2h-frame`] = { margin: '0 auto' }),
			(r[`${i} p, ${i} .body`] = { margin: '0' }),
			(r[`${i} .f2h-img`] = { width: '100% !important', top: '0' }),
			(r[`${i} .f2h-symbol`] = { 'box-sizing': 'border-box' }),
			(r[`${i} :where(.frame, .f2h-text, .f2h-symbol)`] = { position: 'absolute' }),
			(r[`${i} :where(.f2h-link, .f2h-img)`] = { display: 'block' });
		return (
			Object.entries(r)
				.map(
					([e, t]) =>
						`\t${e} { ${Object.entries(t)
							.map(([e, t]) => `\n\t\t${e}: ${t};`)
							.join('')}\n\t}`
				)
				.join('\n\n') + `\n\n${n}`
		);
	},
	zt = (e) => {
		let t = '';
		const n = e.filter((e) => 'DROP_SHADOW' === e.type && e.visible);
		if (n.length > 0) {
			let e = 'text-shadow: ';
			n.forEach((t, i) => {
				const r = t.offset.x,
					o = t.offset.y,
					a = t.radius,
					l = `rgba(${255 * t.color.r}, ${255 * t.color.g}, ${255 * t.color.b}, ${t.color.a})`,
					s = i < n.length - 1 ? ', ' : '; ';
				e += `${r}px ${o}px ${a}px ${l}${s}`;
			}),
				(t += e);
		}
		const i = e.filter((e) => 'LAYER_BLUR' === e.type && e.visible);
		if (i.length > 0) {
			t += `-webkit-filter: blur(${i[0].radius}px);\nfilter: blur(${i[0].radius}px);`;
		}
		return t;
	};
var Ut,
	Rt,
	_t,
	Dt,
	Yt = (e) =>
		Object.entries(e)
			.filter(([, e]) => e)
			.map(([e, t]) => `${e}="${t}"`)
			.join(' '),
	Wt = (e) =>
		Object.entries(e)
			.filter(([, e]) => e)
			.map(([e, t]) => `${e}: ${t};`)
			.join(' '),
	Ht = ({ node: e, filename: t, widthRange: n, alt: i, config: r, variables: o }) => {
		let a = '';
		const l = { html: '', css: '', js: '' },
			s = +e.name.match('#(.*)px')[1],
			c = e.height,
			u = s / c,
			[p, d] = n.ranges[n.widths.indexOf(s)],
			f = e.width,
			h = e.height,
			g = 'f2h-frame',
			m = `f2h-frame-${s}`,
			y = r.format.toLowerCase();
		l.css += `\t${Nt(m)}`;
		const v = ((e, t, n) =>
			e.map((e, i) => {
				const r = [],
					o = [];
				let a = '',
					l = `f2h-text-${i}`,
					s = 0,
					c = 0,
					u = 0,
					p = 0;
				const d = e.getStyledTextSegments(Mt),
					f = figma.getStyleById(e.textStyleId);
				d.forEach((e, t) => {
					const n = jt(e),
						i =
							!t ||
							!new Set(
								[
									'font-family',
									'font-size',
									'letter-spacing',
									'color',
									'line-height',
									'mix-blend-mode',
									'text-decoration',
									'text-transform'
								].map((e) => n.object[e] === r[0].styles.object[e])
							).has(!1),
						o = i && 700 === n.object['font-weight'],
						a =
							!(!i || 400 === n.object['font-weight'] || 700 === n.object['font-weight']) &&
							n.object['font-weight'],
						l = i && 'italic' === n.object['font-style'];
					r.push({
						characters: e.characters,
						start: e.start,
						end: e.end,
						hyperlink: e.hyperlink,
						listOptions: e.listOptions,
						styles: n,
						isBaseStyle: i,
						isBold: o,
						isOtherWeight: a,
						isItalic: l
					});
				}),
					(null == f ? void 0 : f.name) &&
						'symbol' != typeof f.name &&
						(a += ` ${Et(f.name.split('/').slice(-1)[0], { lower: !0, strict: !0 })}`);
				const h = {
					tag: Lt.has(Tt(a)) ? Tt(a) : 'p',
					style: r[0].styles.string
						.replace('font-weight: 700', 'font-weight: 400')
						.replace('font-style: italic', 'font-style: normal')
				};
				switch (
					(e.name.startsWith('[f2h]') &&
						e.name
							.replace('[f2h]', '')
							.split(';')
							.forEach((e) => {
								const [t, n] = e.split(':');
								o.push({ key: t, value: n.split(',').map((e) => e.trim()) });
							}),
					e.textAlignHorizontal)
				) {
					case 'LEFT':
					case 'JUSTIFIED':
						(s = (e.x / t) * 100), (u = 0);
						break;
					case 'CENTER':
						(s = ((e.x + e.width / 2) / t) * 100), (u = -50);
						break;
					case 'RIGHT':
						(s = ((e.x + e.width) / t) * 100), (u = -100);
				}
				switch (e.textAlignVertical) {
					case 'TOP':
						(c = (e.y / n) * 100), (p = 0);
						break;
					case 'CENTER':
						(c = ((e.y + e.height / 2) / n) * 100), (p = -50);
						break;
					case 'BOTTOM':
						(c = ((e.y + e.height) / n) * 100), (p = -100);
				}
				return {
					customClasses: void 0,
					customAttributes: o,
					class: a,
					elId: l,
					segments: r,
					baseStyle: h,
					x: `${s.toFixed(2)}% `,
					y: `${c.toFixed(2)}% `,
					horizontalAlignment: e.textAlignHorizontal,
					verticalAlignment: e.textAlignVertical,
					width: 'WIDTH_AND_HEIGHT' === e.textAutoResize ? 'auto' : `${e.width.toFixed(2)}px`,
					opacity: e.opacity,
					translate: `${u}%, ${p}%`,
					rotation: -1 * e.rotation,
					effect: e.effects
				};
			}))(e.findAllWithCriteria({ types: ['TEXT'] }), f, h);
		var b, A;
		if (
			((e.layoutMode = 'NONE'),
			(e.clipsContent = !0),
			r.fluid || (a += `width: ${s}px;`),
			(l.html += `\n\t\x3c!-- Frame: ${t.split('/').slice(-1)} --\x3e\n`),
			(l.html += `\t<div ${Yt({
				id: m,
				class: `${g.replace(':', '-')} frame artboard`,
				'data-aspect-ratio': ((b = u), (A = 3), Math.round(b * Math.pow(10, A)) / Math.pow(10, A)),
				'data-min-width': p,
				'data-max-width': d,
				style: a
			})}>`),
			(l.html += `\n\t\t<div ${Yt({
				class: 'spacer',
				style: Wt({
					padding: '0 0 0 0',
					'min-width': s > 0 ? `${s}px` : 'auto',
					'max-width': d ? `${d}px` : 'none'
				})
			})}></div>`),
			(l.html += `\n\t\t<picture>\n\t\t\t<source ${Yt({
				srcset: t + '.' + y,
				type: 'image/' + y
			})}>\n\t\t\t<img ${Yt({
				id: 'img-' + m,
				class: 'f2h-img',
				alt: i,
				'data-src': t + '.' + y,
				src: 'data:image/gif;base64,R0lGODlhCgAKAIAAAB8fHwAAACH5BAEAAAAALAAAAAAKAAoAAAIIhI+py+0PYysAOw==',
				loading: 'lazy',
				draggable: 'false',
				decoding: 'async',
				width: s.toFixed(2),
				height: c.toFixed(2)
			})}/>\n\t\t</picture>\n`),
			v)
		) {
			const e = v.map((e) => e.baseStyle),
				t = e
					.sort((t, n) => e.filter((e) => e === t).length - e.filter((e) => e === n).length)
					.pop();
			r.styleTextSegments &&
				t &&
				(l.css += `\n\t#${m} ${t.tag} { ${t.style.replaceAll('undefined', '')} }`),
				v.forEach((e) => {
					let n = '',
						i = 'f2h-text',
						a = '',
						s = '';
					e.effect.length && (s = zt(e.effect));
					const c = { top: e.y, left: e.x, opacity: e.opacity, width: e.width };
					(c.transform = `translate(${e.translate}) rotate(${e.rotation}deg)`),
						(c['transform-origin'] = 'left top'),
						(c['text-align'] = e.horizontalAlignment.toLowerCase());
					let u = [];
					e.segments.forEach((t, n) => {
						var i, o;
						const a =
								null === (o = null === (i = e.segments) || void 0 === i ? void 0 : i[n - 1]) ||
								void 0 === o
									? void 0
									: o.characters.endsWith('\n'),
							l = null == t ? void 0 : t.characters.endsWith('\n'),
							s = null == t ? void 0 : t.characters.includes('\n');
						!(!n || a || (s && !l))
							? u[u.length - 1].segments.push(t)
							: u.push({
									tag:
										r.applyHtags && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(Tt(e.class))
											? Tt(e.class)
											: 'p',
									segments: [t],
									newElement: !!n && (!a || (s && !l))
							  });
					}),
						e.customAttributes.forEach((e) => {
							'class' === e.key ? (i += ` ${e.value.join(' ')}`) : (a += ` ${e.key}="${e.value}"`);
						}),
						(n += `<div class="${i}" ${a} style="${Wt(c)} ${s}">`),
						u.forEach((i) => {
							(n += `\n\t\t\t<${i.tag} ${Yt({
								class: `${e.elId} ${e.class} ${e.customClasses ? e.customClasses.join(' ') : ''}`
							})}>`),
								i.segments.forEach((e) => {
									n += ((e, t, n) => {
										let i = '',
											r = e.characters;
										return (
											t &&
												Object.keys(t).forEach((e) => {
													r = r.replaceAll(`{{${e}}}`, t[e]);
												}),
											e.hyperlink && (i += `<a href="${e.hyperlink.value}" target="_blank">`),
											!e.isBaseStyle && n && (i += `<span style="${e.styles.string}">`),
											e.isOtherWeight &&
												n &&
												(i += `<span style="font-weight: ${e.isOtherWeight}">`),
											e.isItalic && (i += '<i>'),
											e.isBold && (i += '<b>'),
											(i += r),
											e.isBold && (i += '</b>'),
											e.isItalic && (i += '</i>'),
											e.isOtherWeight && n && (i += '</span>'),
											!e.isBaseStyle && n && (i += '</span>'),
											e.hyperlink && (i += '</a>'),
											i
										);
									})(e, o, r.styleTextSegments);
								}),
								(n += `</${i.tag}>\n`),
								r.styleTextSegments &&
									e.baseStyle.style !== t.style &&
									(l.css += `\n\t#${m} .${e.elId}${e.class.replaceAll(
										' ',
										'.'
									)} { ${e.baseStyle.style.replaceAll('undefined', '')} }`);
						}),
						(n += '\t\t</div>\n'),
						(l.html += n);
				});
		}
		return (l.html += '\t</div>\n'), l;
	},
	Pt = (e, t) => {
		const n = `(${Tt(
			((e) => {
				if (!('querySelector' in document)) return;
				const t = (e) => {
						const t = e.getAttribute('data-src');
						t && e.getAttribute('src') != t && e.setAttribute('src', t);
					},
					n = (e) => {
						e.reduce((e, t) => e || t.isIntersecting, !1) && ((c = !1), r());
					},
					i = (e, t) => (t ? Array.prototype.slice.call(t.querySelectorAll(e)) : []),
					r = () => {
						const e = i(`.${l}artboard:where([data-min-width],[data-max-width])`, o),
							a = Math.min(Math.round(o.offsetWidth), window.innerWidth);
						e.forEach(function (e) {
							let n = e.getAttribute('data-min-width'),
								r = e.getAttribute('data-max-width');
							+n <= a && (+r >= a || null === r)
								? (c || i(`.${l}f2h-img`, e).forEach(t), (e.style.display = 'block'))
								: (e.style.display = 'none');
						}),
							c &&
								!s &&
								(((e) => {
									const t = e.getBoundingClientRect();
									return t.top < window.innerHeight && t.bottom > 0;
								})(o)
									? ((c = !1), r())
									: ((s = new IntersectionObserver(n, { rootMargin: '400px 400px' })),
									  s.observe(o)));
					},
					o = document.getElementById(e),
					a = ((e, t) => {
						let n = null,
							i = 0;
						const r = () => {
							(i = Date.now()), (n = null), e();
						};
						return function () {
							const e = t - (Date.now() - i);
							e <= 0 || e > t ? (clearTimeout(n), r()) : n || (n = setTimeout(r, e));
						};
					})(r, 200),
					l = '';
				let s,
					c = !!window.IntersectionObserver;
				r(), document.addEventListener('DOMContentLoaded', r), window.addEventListener('resize', a);
			})
				.toString()
				.replace(/ {2}/g, '\t')
		)})("${e}", {namespace: "", setup: window.setupInteractive || window.getComponent});`;
		return t
			? `<script>\n\t import { onMount } from 'svelte'; \n\t onMount(() => {\n\t\t${n}\n\t\t});\n<\/script>`
			: `<script>\n\t ${n}\n <\/script>`;
	},
	Bt = (e) => {
		if (!e || 0 === e.length) return;
		const t = {
				Thin: 100,
				ExtraLight: 200,
				Light: 300,
				Regular: 400,
				Medium: 500,
				SemiBold: 600,
				Bold: 700,
				ExtraBold: 800,
				Black: 900
			},
			n = new Map();
		for (const { family: i, style: r } of [...e]) {
			const e = `${r.includes('Italic') ? '1,' : '0,'}${
				'Italic' === r ? t.Regular : t[r.replace(' Italic', '')]
			}`;
			n.has(i) ? n.get(i).add(e) : n.set(i, new Set([e]));
		}
		return `<script>\n\t  const apiLink = document.createElement('link');\n\t\tapiLink.rel = 'preconnect';\n\t\tapiLink.href = 'https://fonts.googleapis.com';\n\n\t\tconst gstaticLink = document.createElement('link');\n\t\tgstaticLink.rel = 'preconnect';\n\t\tgstaticLink.href = 'https://fonts.gstatic.com';\n\t\tgstaticLink.crossorigin = true\n\n\t\tconst fontLink = document.createElement('link');\n\t\tfontLink.rel = 'stylesheet';\n\t\tfontLink.href = 'https://fonts.googleapis.com/css2?${[
			...n
		]
			.map(([e, t]) => `family=${e.replace(/\s/g, '+')}:ital,wght@${[...t].sort().join(';')}`)
			.join(
				'&'
			)}&display=swap';\n\n\t\tdocument.head.appendChild(apiLink);\n\t\tdocument.head.appendChild(gstaticLink);\n\t\tdocument.head.appendChild(fontLink);\n\t<\/script>`;
	},
	qt = (e) => {
		let t = { min: 0, max: 0, widths: [], ranges: [] };
		return (
			e.forEach((e) => {
				let n = +e.node.name.replace('#', '').replace('px', '');
				t.widths.push(n);
			}),
			t.widths.sort((e, t) => e - t),
			t.widths.forEach((e, n) => {
				let i = [];
				0 == n
					? i.push(0, t.widths[1] - 1)
					: n < t.widths.length - 1
					? i.push(t.widths[n], t.widths[n + 1] - 1)
					: n == t.widths.length - 1 && i.push(e),
					t.ranges.push(i);
			}),
			(t.max = Math.max(...t.widths)),
			t
		);
	},
	Gt = ({ config: e, assets: t, variables: n }) => {
		const i = `${e.name}-box`,
			r = t
				.map(
					({ node: i, filename: r }) =>
						Ht({ node: i, filename: r, widthRange: qt(t), alt: e.alt, config: e, variables: n }).css
				)
				.join('\n\n'),
			o = t
				.map(
					({ node: i, filename: r }) =>
						Ht({ node: i, filename: r, widthRange: qt(t), alt: e.alt, config: e, variables: n })
							.html
				)
				.join('\n\n');
		return `\x3c!-- Generated by figma2html on ${It()} --\x3e\n\t<style type='text/css'>${Ft({
			id: i,
			config: e,
			css: r
		})}</style>\n\t<div id="${i}" class="figma2html">${o}</div>\n\t${
			e.includeResizer ? Pt(i, !1) : ''
		}\n\t${e.includeGoogleFonts && $t.length ? Bt($t) : ''}\n\t${
			e.customScript ? e.customScript : ''
		}\n\t\x3c!-- End figma2html generated content - ${It()} --\x3e`;
	},
	Jt = (...e) => console.log('[figma2html]', ...e);
(figma.skipInvisibleInstanceChildren = !0),
	figma.showUI(__html__, { width: 560, height: 500, themeColors: !0 });
const Kt = (e) => !!e.match(/^#\d+px$/),
	Zt = {
		config: {
			name: Et(figma.currentPage.name, { lower: !0, strict: !0 }),
			scale: '1',
			format: 'PNG',
			output: 'html',
			includeResizer: !0,
			testingMode: !1,
			maxWidth: null,
			fluid: !0,
			centered: !1,
			imagePath: 'figma2html/',
			alt: null,
			applyStyleNames: !0,
			applyHtags: !0,
			styleTextSegments: !0,
			includeGoogleFonts: !0,
			customScript: null
		},
		size: { w: 960, h: 500 },
		variables: { hed: 'figma2html' },
		panels: { file: !0, images: !1, page: !1, text: !1, preview: !0 }
	},
	Vt = ({ name: e, x: n = 0, y: i = 0, text: r, locked: o = !1 }) => {
		const a = figma.createFrame();
		(a.name = e),
			(a.x = n),
			(a.y = i),
			(a.layoutMode = 'VERTICAL'),
			(a.primaryAxisSizingMode = 'AUTO'),
			(a.counterAxisSizingMode = 'AUTO'),
			(a.verticalPadding = 4),
			(a.horizontalPadding = 6),
			(a.cornerRadius = 4),
			(a.locked = o);
		const l = figma.createText();
		(l.characters = t.dump(r).trim()), a.appendChild(l);
	};
class Xt {}
(Xt.panels =
	(((Ut = class {}).get = () =>
		e(void 0, void 0, void 0, function* () {
			const e = yield figma.clientStorage.getAsync('panels');
			return null != e ? e : Zt.panels;
		})),
	(Ut.set = (t) =>
		e(void 0, void 0, void 0, function* () {
			return yield figma.clientStorage.setAsync('panels', t), t;
		})),
	(Ut.clear = () =>
		e(void 0, void 0, void 0, function* () {
			yield figma.clientStorage.deleteAsync('panels');
		})),
	Ut)),
	(Xt.size =
		(((Rt = class {}).get = () =>
			e(void 0, void 0, void 0, function* () {
				const e = yield figma.clientStorage.getAsync('size');
				return null != e ? e : Zt.size;
			})),
		(Rt.set = (t) =>
			e(void 0, void 0, void 0, function* () {
				return yield figma.clientStorage.setAsync('size', t), t;
			})),
		(Rt.clear = () =>
			e(void 0, void 0, void 0, function* () {
				yield figma.clientStorage.deleteAsync('size');
			})),
		Rt)),
	(Xt.variables =
		(((_t = class {}).get = () =>
			e(void 0, void 0, void 0, function* () {
				var e;
				const n = figma.currentPage.findChild(
						(e) => 'FRAME' === e.type && 'f2h-variables' === e.name
					),
					i = null === (e = null == n ? void 0 : n.children) || void 0 === e ? void 0 : e[0];
				if (null == i ? void 0 : i.characters) {
					const e = t.load(i.characters);
					return Xt.variables.write(), figma.ui.postMessage({ type: 'variables', variables: e }), e;
				}
				return figma.ui.postMessage({ type: 'variables', variables: null }), Zt.variables;
			})),
		(_t.write = () =>
			e(void 0, void 0, void 0, function* () {
				var e;
				let n = Zt.variables,
					i = 0,
					r = 0;
				const o = figma.currentPage.findChild(
						(e) => 'FRAME' === e.type && 'f2h-variables' === e.name
					),
					a = null === (e = null == o ? void 0 : o.children) || void 0 === e ? void 0 : e[0];
				if (null == a ? void 0 : a.characters) {
					i = a.x;
					const e = a.characters;
					(n = t.load(e)), a.remove();
				}
				figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
					const e = figma.currentPage.findAll((e) => Kt(e.name) || 'f2h-settings' === e.name),
						t = e.find((e) => 'f2h-settings' === e.name);
					if (t) i = t.x + t.width;
					else {
						const t = e.reduce((e, t) => Math.max(e, t.x + t.width), 0);
						i = t;
					}
					(i += 25),
						(r = e.reduce((e, t) => Math.min(e, t.y), 0)),
						Vt({ name: 'f2h-variables', text: n, x: i, y: r }),
						figma.ui.postMessage({ type: 'variables', variables: n });
				});
			})),
		_t)),
	(Xt.config =
		(((Dt = class {}).get = () =>
			e(void 0, void 0, void 0, function* () {
				return (yield figma.clientStorage.getAsync('config')) || Zt.config;
			})),
		(Dt.set = (t) =>
			e(void 0, void 0, void 0, function* () {
				return yield figma.clientStorage.setAsync('config', t), t;
			})),
		(Dt.clear = () =>
			e(void 0, void 0, void 0, function* () {
				yield figma.clientStorage.deleteAsync('config');
			})),
		(Dt.write = (t) =>
			e(void 0, void 0, void 0, function* () {
				let e = 0,
					n = 0;
				const i = figma.currentPage.findChild(
					(e) => 'FRAME' === e.type && 'f2h-settings' === e.name
				);
				i && ((e = i.x), i.remove()),
					figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
						const i = figma.currentPage.findChildren(({ name: e }) => Kt(e));
						(e = i.reduce((e, t) => Math.max(e, t.x + t.width), 0)),
							(e += 100),
							(n = i.reduce((e, t) => Math.min(e, t.y), 0)),
							Vt({ name: 'f2h-settings', text: t, x: e, y: n, locked: !0 });
					});
			})),
		(Dt.load = () =>
			e(void 0, void 0, void 0, function* () {
				const e = figma.currentPage.findChild(
					(e) => 'FRAME' === e.type && 'f2h-settings' === e.name
				).children[0];
				if (null == e ? void 0 : e.characters) {
					const n = t.load(e.characters);
					yield Xt.config.set(n);
				}
			})),
		Dt));
const Qt = new (class {
		constructor() {
			(this.create = () => {
				this.frame && (this.frame.remove(), (this.frame = void 0)),
					(this.frame = figma.createFrame()),
					(this.frame.name = '[figma2html]'),
					(this.frame.clipsContent = !1),
					(this.frame = this.frame);
			}),
				(this.remove = () => {
					var e;
					null === (e = this.frame) || void 0 === e || e.remove(), (this.frame = void 0);
				});
		}
	})(),
	en = () => {
		const e = [];
		return (
			figma.currentPage.findAll((t) => {
				const n = 'FRAME' === t.type,
					i = t.parent === figma.currentPage;
				return (
					!!(n && Kt(t.name) && i) &&
					(e.push({ id: t.id, parentName: t.name, size: { w: t.width, h: t.height } }), !0)
				);
			}),
			e
		);
	},
	tn = (t, n, i) =>
		e(void 0, void 0, void 0, function* () {
			return {
				filename: t.name,
				output: t.output,
				data: Gt({ config: t, assets: n, variables: i })
			};
		}),
	nn = (t, n, i) =>
		e(void 0, void 0, void 0, function* () {
			Qt.create();
			let e = [];
			for (let r of t) {
				const t = {
					filename: `${n.imagePath}${n.imagePath.endsWith('/') ? '' : '/'}${r.parentName.substring(
						1
					)}`,
					format: n.format,
					size: void 0,
					data: new Uint8Array(),
					node: void 0
				};
				let o = figma.getNodeById(r.id).clone();
				(o.layoutMode = 'NONE'), (o = rn(o));
				let a = on(o, n);
				Qt.frame && (Qt.frame.appendChild(o), Qt.frame.appendChild(a)), (t.node = o);
				const l = { format: n.format, scale: n.scale, srcSize: r.size },
					{ destSize: s } = wt(l);
				t.size = s;
				const { settings: c } = wt(
					i.isFinal ? l : { format: 'JPG', scale: '1', srcSize: i.thumbSize }
				);
				try {
					t.data = yield a.exportAsync(c);
				} catch (e) {
					Jt(e);
				}
				e.push(t);
			}
			return e;
		}),
	rn = (e) => {
		const t = e.findAllWithCriteria({ types: ['FRAME'] });
		return (
			t.filter((e) => e.findAllWithCriteria({ types: ['TEXT'] }).length > 0),
			((e) => {
				const t = [];
				if (!e.length) return t;
				for (const n of e) {
					if ('function' != typeof n.findAll) continue;
					const e = xt(n);
					e && (t.push(e), n.children.length || n.remove());
				}
			})(t),
			e
		);
	},
	on = (e, t) => {
		const n = e.findAllWithCriteria({ types: ['TEXT'] });
		if (t.testingMode) for (let e of n) e.opacity = 0.5;
		else for (let e of n) e.visible = !1;
		return e;
	},
	an = { w: 32, h: 32 },
	ln = (t, n) =>
		e(void 0, void 0, void 0, function* () {
			const e = en();
			if (!t)
				return (
					figma.ui.postMessage({
						type: 'preview',
						preview: { total: 0, assets: [], file: void 0 },
						loading: !1
					}),
					void figma.ui.postMessage({ type: 'error', message: 'No config found' })
				);
			const i = yield nn(e, t, { isFinal: !1, thumbSize: an }),
				r = yield tn(t, i, n);
			Qt.remove(),
				figma.ui.postMessage({
					type: 'preview',
					preview: { total: e.length, assets: i, file: r },
					loading: !1
				});
		});
(figma.ui.onmessage = (t) =>
	e(void 0, void 0, void 0, function* () {
		let n, i, r, o;
		switch (t.type) {
			case 'init':
				figma.ui.postMessage({ type: 'loading', loading: !0 }),
					(o = yield Xt.size.get()),
					figma.ui.resize(o.w, o.h),
					(n = yield Xt.config.get()),
					Xt.config.write(n),
					(i = yield Xt.variables.get()),
					(r = yield Xt.panels.get()),
					Jt('Loaded stored config'),
					Jt('Loaded stored variables'),
					figma.ui.postMessage({ type: 'load', config: n, variables: i, panels: r }),
					yield ln(n, i);
				break;
			case 'panel':
				t.panels && (r = yield Xt.panels.set(t.panels));
				break;
			case 'resize':
				t.size && (o = yield Xt.size.set(t.size)), figma.ui.resize(o.w, o.h);
				break;
			case 'config':
				figma.ui.postMessage({ type: 'loading', loading: !0 }),
					(n = yield Xt.config.set(t.config)),
					(i = yield Xt.variables.get()),
					t.panels && (r = yield Xt.panels.set(t.panels)),
					yield ln(n, i);
				break;
			case 'export':
				(i = yield Xt.variables.get()),
					yield ((t, n) =>
						e(void 0, void 0, void 0, function* () {
							const e = en(),
								i = yield nn(e, t, { isFinal: !0 }),
								r = yield tn(t, i, n);
							Qt.remove(), figma.ui.postMessage({ type: 'export', assets: i, file: r });
						}))(t.config, i);
				break;
			case 'reset-settings':
				yield Xt.config.clear(),
					yield Xt.size.clear(),
					yield Xt.panels.clear(),
					(n = yield Xt.config.get()),
					(i = yield Xt.variables.get()),
					(r = yield Xt.panels.get()),
					(o = yield Xt.size.get()),
					figma.ui.resize(o.w, o.h),
					figma.ui.postMessage({
						type: 'load-settings',
						config: n,
						variables: i,
						panels: r,
						size: o
					}),
					yield ln(n, i);
				break;
			case 'save-settings':
				(n = yield Xt.config.get()), yield Xt.config.write(n), Jt('Writing stored config');
				break;
			case 'load-settings':
				yield Xt.config.load(),
					(n = yield Xt.config.get()),
					(i = yield Xt.variables.get()),
					(r = yield Xt.panels.get()),
					Jt('Loaded stored config'),
					figma.ui.postMessage({ type: 'load-settings', config: n, variables: i, panels: r }),
					yield ln(n, i);
				break;
			case 'write-variables':
				yield Xt.variables.write(), Jt('Writing example variables');
		}
	})),
	figma.on('close', () => {
		Qt.remove(), Jt('closed');
	});
