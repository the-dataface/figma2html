'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var jsYaml = {};

var loader$1 = {};

var common$5 = {};

function isNothing(subject) {
  return typeof subject === 'undefined' || subject === null;
}
function isObject(subject) {
  return typeof subject === 'object' && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = '',
    cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
common$5.isNothing = isNothing;
common$5.isObject = isObject;
common$5.toArray = toArray;
common$5.repeat = repeat;
common$5.isNegativeZero = isNegativeZero;
common$5.extend = extend;

function formatError(exception, compact) {
  var where = '',
    message = exception.reason || '(unknown reason)';
  if (!exception.mark) return message;
  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }
  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';
  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }
  return message + ' ' + where;
}
function YAMLException$4(reason, mark) {
  // Super constructor
  Error.call(this);
  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = new Error().stack || '';
  }
}

// Inherit from Error
YAMLException$4.prototype = Object.create(Error.prototype);
YAMLException$4.prototype.constructor = YAMLException$4;
YAMLException$4.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};
var exception = YAMLException$4;

var common$4 = common$5;

// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}

function padStart(string, max) {
  return common$4.repeat(' ', max - string.length) + string;
}
function makeSnippet$1(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== 'number') options.indent = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter !== 'number') options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = '',
    i,
    line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
    result = common$4.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + ' | ' + line.str + '\n' + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common$4.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + ' | ' + line.str + '\n';
  result += common$4.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
    result += common$4.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + ' | ' + line.str + '\n';
  }
  return result.replace(/\n$/, '');
}
var snippet = makeSnippet$1;

var coreExports = {};
var core = {
  get exports(){ return coreExports; },
  set exports(v){ coreExports = v; },
};

var YAMLException$3 = exception;
var TYPE_CONSTRUCTOR_OPTIONS = ['kind', 'multi', 'resolve', 'construct', 'instanceOf', 'predicate', 'represent', 'representName', 'defaultStyle', 'styleAliases'];
var YAML_NODE_KINDS = ['scalar', 'sequence', 'mapping'];
function compileStyleAliases(map) {
  var result = {};
  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$e(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException$3('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options = options; // keep original options in case user wants to extend this type later
  this.tag = tag;
  this.kind = options['kind'] || null;
  this.resolve = options['resolve'] || function () {
    return true;
  };
  this.construct = options['construct'] || function (data) {
    return data;
  };
  this.instanceOf = options['instanceOf'] || null;
  this.predicate = options['predicate'] || null;
  this.represent = options['represent'] || null;
  this.representName = options['representName'] || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.multi = options['multi'] || false;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException$3('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$e;

/*eslint-disable max-len*/

var YAMLException$2 = exception;
var Type$d = type;
function compileList(schema, name) {
  var result = [];
  schema[name].forEach(function (currentType) {
    var newIndex = result.length;
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap( /* lists... */
) {
  var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    },
    index,
    length;
  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof Type$d) {
    // Schema.extend(type)
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new YAMLException$2('Schema.extend argument should be a Type, [ Type ], ' + 'or a schema definition ({ implicit: [...], explicit: [...] })');
  }
  implicit.forEach(function (type) {
    if (!(type instanceof Type$d)) {
      throw new YAMLException$2('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException$2('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
    if (type.multi) {
      throw new YAMLException$2('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });
  explicit.forEach(function (type) {
    if (!(type instanceof Type$d)) {
      throw new YAMLException$2('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;

var Type$c = type;
var str = new Type$c('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) {
    return data !== null ? data : '';
  }
});

var Type$b = type;
var seq = new Type$b('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) {
    return data !== null ? data : [];
  }
});

var Type$a = type;
var map = new Type$a('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) {
    return data !== null ? data : {};
  }
});

var Schema = schema;
var failsafe = new Schema({
  explicit: [str, seq, map]
});

var Type$9 = type;
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === '~' || max === 4 && (data === 'null' || data === 'Null' || data === 'NULL');
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new Type$9('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
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

var Type$8 = type;
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === 'true' || data === 'True' || data === 'TRUE') || max === 5 && (data === 'false' || data === 'False' || data === 'FALSE');
}
function constructYamlBoolean(data) {
  return data === 'true' || data === 'True' || data === 'TRUE';
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}
var bool = new Type$8('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) {
      return object ? 'true' : 'false';
    },
    uppercase: function (object) {
      return object ? 'TRUE' : 'FALSE';
    },
    camelcase: function (object) {
      return object ? 'True' : 'False';
    }
  },
  defaultStyle: 'lowercase'
});

var common$3 = common$5;
var Type$7 = type;
function isHexCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */ || 0x41 /* A */ <= c && c <= 0x46 /* F */ || 0x61 /* a */ <= c && c <= 0x66 /* f */;
}

function isOctCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x37 /* 7 */;
}

function isDecCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */;
}

function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length,
    index = 0,
    hasDigits = false,
    ch;
  if (!max) return false;
  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }
  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
    if (ch === 'x') {
      // base 16
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
    if (ch === 'o') {
      // base 8
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data,
    sign = 1,
    ch;
  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }
  ch = value[0];
  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === '0') return 0;
  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && object % 1 === 0 && !common$3.isNegativeZero(object);
}
var int = new Type$7('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function (obj) {
      return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1);
    },
    octal: function (obj) {
      return obj >= 0 ? '0o' + obj.toString(8) : '-0o' + obj.toString(8).slice(1);
    },
    decimal: function (obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function (obj) {
      return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() : '-0x' + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary: [2, 'bin'],
    octal: [8, 'oct'],
    decimal: [10, 'dec'],
    hexadecimal: [16, 'hex']
  }
});

var common$2 = common$5;
var Type$6 = type;
var YAML_FLOAT_PATTERN = new RegExp(
// 2.5e4, 2.5 and integers
'^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
// .2e4, .2
// special case, seems not from spec
'|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
// .inf
'|[-+]?\\.(?:inf|Inf|INF)' +
// .nan
'|\\.(?:nan|NaN|NAN))$');
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) ||
  // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === '_') {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, '').toLowerCase();
  sign = value[0] === '-' ? -1 : 1;
  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === '.inf') {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case 'lowercase':
        return '.nan';
      case 'uppercase':
        return '.NAN';
      case 'camelcase':
        return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '.inf';
      case 'uppercase':
        return '.INF';
      case 'camelcase':
        return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '-.inf';
      case 'uppercase':
        return '-.INF';
      case 'camelcase':
        return '-.Inf';
    }
  } else if (common$2.isNegativeZero(object)) {
    return '-0.0';
  }
  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && (object % 1 !== 0 || common$2.isNegativeZero(object));
}
var float = new Type$6('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

var json = failsafe.extend({
  implicit: [_null, bool, int, float]
});

(function (module) {

  module.exports = json;
})(core);

var Type$5 = type;
var YAML_DATE_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' +
// [1] year
'-([0-9][0-9])' +
// [2] month
'-([0-9][0-9])$'); // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' +
// [1] year
'-([0-9][0-9]?)' +
// [2] month
'-([0-9][0-9]?)' +
// [3] day
'(?:[Tt]|[ \\t]+)' +
// ...
'([0-9][0-9]?)' +
// [4] hour
':([0-9][0-9])' +
// [5] minute
':([0-9][0-9])' +
// [6] second
'(?:\\.([0-9]*))?' +
// [7] fraction
'(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' +
// [8] tz [9] tz_sign [10] tz_hour
'(?::([0-9][0-9]))?))?$'); // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match,
    year,
    month,
    day,
    hour,
    minute,
    second,
    fraction = 0,
    delta = null,
    tz_hour,
    tz_minute,
    date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +match[1];
  month = +match[2] - 1; // JS month starts with 0
  day = +match[3];
  if (!match[4]) {
    // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}
var timestamp$1 = new Type$5('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

var Type$4 = type;
function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}
var merge = new Type$4('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

/*eslint-disable no-bitwise*/

var Type$3 = type;

// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code,
    idx,
    bitlen = 0,
    max = data.length,
    map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;
    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx,
    tailbits,
    input = data.replace(/[\r\n=]/g, ''),
    // remove CR/LF & padding to simplify scan
    max = input.length,
    map = BASE64_MAP,
    bits = 0,
    result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 0xFF);
      result.push(bits >> 8 & 0xFF);
      result.push(bits & 0xFF);
    }
    bits = bits << 6 | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 0xFF);
    result.push(bits >> 8 & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 0xFF);
    result.push(bits >> 2 & 0xFF);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 0xFF);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object /*, style*/) {
  var result = '',
    bits = 0,
    idx,
    tail,
    max = object.length,
    map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map[bits >> 18 & 0x3F];
      result += map[bits >> 12 & 0x3F];
      result += map[bits >> 6 & 0x3F];
      result += map[bits & 0x3F];
    }
    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;
  if (tail === 0) {
    result += map[bits >> 18 & 0x3F];
    result += map[bits >> 12 & 0x3F];
    result += map[bits >> 6 & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[bits >> 10 & 0x3F];
    result += map[bits >> 4 & 0x3F];
    result += map[bits << 2 & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[bits >> 2 & 0x3F];
    result += map[bits << 4 & 0x3F];
    result += map[64];
    result += map[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === '[object Uint8Array]';
}
var binary = new Type$3('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

var Type$2 = type;
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [],
    index,
    length,
    pair,
    pairKey,
    pairHasKey,
    object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== '[object Object]') return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new Type$2('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

var Type$1 = type;
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index,
    length,
    pair,
    keys,
    result,
    object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== '[object Object]') return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index,
    length,
    pair,
    keys,
    result,
    object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new Type$1('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

var Type = type;
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key,
    object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

var _default = coreExports.extend({
  implicit: [timestamp$1, merge],
  explicit: [binary, omap, pairs, set]
});

/*eslint-disable max-len,no-use-before-define*/

var common$1 = common$5;
var YAMLException$1 = exception;
var makeSnippet = snippet;
var DEFAULT_SCHEMA$1 = _default;
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 0x0A /* LF */ || c === 0x0D /* CR */;
}

function is_WHITE_SPACE(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */;
}

function is_WS_OR_EOL(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */ || c === 0x0A /* LF */ || c === 0x0D /* CR */;
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C /* , */ || c === 0x5B /* [ */ || c === 0x5D /* ] */ || c === 0x7B /* { */ || c === 0x7D /* } */;
}

function fromHexCode(c) {
  var lc;
  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;
  if (0x61 /* a */ <= lc && lc <= 0x66 /* f */) {
    return lc - 0x61 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 0x78 /* x */) {
    return 2;
  }
  if (c === 0x75 /* u */) {
    return 4;
  }
  if (c === 0x55 /* U */) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return c === 0x30 /* 0 */ ? '\x00' : c === 0x61 /* a */ ? '\x07' : c === 0x62 /* b */ ? '\x08' : c === 0x74 /* t */ ? '\x09' : c === 0x09 /* Tab */ ? '\x09' : c === 0x6E /* n */ ? '\x0A' : c === 0x76 /* v */ ? '\x0B' : c === 0x66 /* f */ ? '\x0C' : c === 0x72 /* r */ ? '\x0D' : c === 0x65 /* e */ ? '\x1B' : c === 0x20 /* Space */ ? ' ' : c === 0x22 /* " */ ? '\x22' : c === 0x2F /* / */ ? '/' : c === 0x5C /* \ */ ? '\x5C' : c === 0x4E /* N */ ? '\x85' : c === 0x5F /* _ */ ? '\xA0' : c === 0x4C /* L */ ? '\u2028' : c === 0x50 /* P */ ? '\u2029' : '';
}
function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode((c - 0x010000 >> 10) + 0xD800, (c - 0x010000 & 0x03FF) + 0xDC00);
}
var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function State$1(input, options) {
  this.input = input;
  this.filename = options['filename'] || null;
  this.schema = options['schema'] || DEFAULT_SCHEMA$1;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy = options['legacy'] || false;
  this.json = options['json'] || false;
  this.listener = options['listener'] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;
  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/
}

function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = makeSnippet(mark);
  return new YAMLException$1(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }
    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 || 0x20 <= _character && _character <= 0x10FFFF)) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common$1.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }
      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x0A /* LF */) {
    state.position++;
  } else if (ch === 0x0D /* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A /* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
    ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09 /* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 0x23 /* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A /* LF */ && ch !== 0x0D /* CR */ && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 0x20 /* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position,
    ch;
  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D /* - */ || ch === 0x2E /* . */) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common$1.repeat('\n', count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
    following,
    captureStart,
    captureEnd,
    hasPendingContent,
    _line,
    _lineStart,
    _lineIndent,
    _kind = state.kind,
    _result = state.result,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 0x23 /* # */ || ch === 0x26 /* & */ || ch === 0x2A /* * */ || ch === 0x21 /* ! */ || ch === 0x7C /* | */ || ch === 0x3E /* > */ || ch === 0x27 /* ' */ || ch === 0x22 /* " */ || ch === 0x25 /* % */ || ch === 0x40 /* @ */ || ch === 0x60 /* ` */) {
    return false;
  }
  if (ch === 0x3F /* ? */ || ch === 0x2D /* - */) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 0x3A /* : */) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 0x23 /* # */) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x27 /* ' */) {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27 /* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 0x27 /* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x22 /* " */) {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22 /* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 0x5C /* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, 'unknown escape sequence');
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true,
    _line,
    _lineStart,
    _pos,
    _tag = state.tag,
    _result,
    _anchor = state.anchor,
    following,
    terminator,
    isPair,
    isExplicitPair,
    isMapping,
    overridableKeys = Object.create(null),
    keyNode,
    keyTag,
    valueNode,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x5B /* [ */) {
    terminator = 0x5D; /* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B /* { */) {
    terminator = 0x7D; /* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C /* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 0x3F /* ? */) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 0x3A /* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 0x2C /* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, 'unexpected end of the stream within a flow collection');
}
function readBlockScalar(state, nodeIndent) {
  var captureStart,
    folding,
    chomping = CHOMPING_CLIP,
    didReadContent = false,
    detectedIndent = false,
    textIndent = nodeIndent,
    emptyLines = 0,
    atMoreIndented = false,
    tmp,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x7C /* | */) {
    folding = false;
  } else if (ch === 0x3E /* > */) {
    folding = true;
  } else {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 0x2B /* + */ || ch === 0x2D /* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 0x2B /* + */ ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 0x23 /* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20 /* Space */) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {
      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common$1.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {
      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common$1.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

        // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common$1.repeat('\n', emptyLines + 1);

        // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) {
          // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

        // Several line breaks - perceive as different lines.
      } else {
        state.result += common$1.repeat('\n', emptyLines);
      }

      // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common$1.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = [],
    following,
    detected = false,
    ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }
    if (ch !== 0x2D /* - */) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
    allowCompact,
    _line,
    _keyLine,
    _keyLineStart,
    _keyPos,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = {},
    overridableKeys = Object.create(null),
    keyTag = null,
    keyNode = null,
    valueNode = null,
    atExplicitKey = false,
    detected = false,
    ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F /* ? */ || ch === 0x3A /* : */) && is_WS_OR_EOL(following)) {
      if (ch === 0x3F /* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }
      state.position += 1;
      ch = following;

      //
      // Implicit notation case. Flow-style node as the key first, then ":", and the value.
      //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 0x3A /* : */) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }
      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position,
    isVerbatim = false,
    isNamed = false,
    tagHandle,
    tagName,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x21 /* ! */) return false;
  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 0x3C /* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 0x21 /* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = '!';
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 0x3E /* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 0x21 /* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;
  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x26 /* & */) return false;
  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x2A /* * */) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
    allowBlockScalars,
    allowBlockCollections,
    indentStatus = 1,
    // 1: this>parent, 0: this=parent, -1: this<parent
    atNewLine = false,
    hasContent = false,
    typeIndex,
    typeQuantity,
    typeList,
    type,
    flowIndent,
    blockIndent;
  if (state.listener !== null) {
    state.listener('open', state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = '?';
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];
      if (type.resolve(state.result)) {
        // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }
    if (!type.resolve(state.result, state.tag)) {
      // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position,
    _position,
    directiveName,
    directiveArgs,
    hasDirectives = false,
    ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 0x25 /* % */) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 0x23 /* # */) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2D /* - */ && state.input.charCodeAt(state.position + 1) === 0x2D /* - */ && state.input.charCodeAt(state.position + 2) === 0x2D /* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 0x2E /* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A /* LF */ && input.charCodeAt(input.length - 1) !== 0x0D /* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf('\0');
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';
  while (state.input.charCodeAt(state.position) === 0x20 /* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== 'function') {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException$1('expected a single document in the stream, but found more');
}
loader$1.loadAll = loadAll;
loader$1.load = load;

var dumper$1 = {};

/*eslint-disable no-use-before-define*/

var common = common$5;
var YAMLException = exception;
var DEFAULT_SCHEMA = _default;
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 0xFEFF;
var CHAR_TAB = 0x09; /* Tab */
var CHAR_LINE_FEED = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN = 0x0D; /* CR */
var CHAR_SPACE = 0x20; /* Space */
var CHAR_EXCLAMATION = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE = 0x22; /* " */
var CHAR_SHARP = 0x23; /* # */
var CHAR_PERCENT = 0x25; /* % */
var CHAR_AMPERSAND = 0x26; /* & */
var CHAR_SINGLE_QUOTE = 0x27; /* ' */
var CHAR_ASTERISK = 0x2A; /* * */
var CHAR_COMMA = 0x2C; /* , */
var CHAR_MINUS = 0x2D; /* - */
var CHAR_COLON = 0x3A; /* : */
var CHAR_EQUALS = 0x3D; /* = */
var CHAR_GREATER_THAN = 0x3E; /* > */
var CHAR_QUESTION = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET = 0x7B; /* { */
var CHAR_VERTICAL_LINE = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0x00] = '\\0';
ESCAPE_SEQUENCES[0x07] = '\\a';
ESCAPE_SEQUENCES[0x08] = '\\b';
ESCAPE_SEQUENCES[0x09] = '\\t';
ESCAPE_SEQUENCES[0x0A] = '\\n';
ESCAPE_SEQUENCES[0x0B] = '\\v';
ESCAPE_SEQUENCES[0x0C] = '\\f';
ESCAPE_SEQUENCES[0x0D] = '\\r';
ESCAPE_SEQUENCES[0x1B] = '\\e';
ESCAPE_SEQUENCES[0x22] = '\\"';
ESCAPE_SEQUENCES[0x5C] = '\\\\';
ESCAPE_SEQUENCES[0x85] = '\\N';
ESCAPE_SEQUENCES[0xA0] = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';
var DEPRECATED_BOOLEANS_SYNTAX = ['y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON', 'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;
  if (map === null) return {};
  result = {};
  keys = Object.keys(map);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);
    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];
    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }
  return '\\' + handle + common.repeat('0', length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1,
  QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options['schema'] || DEFAULT_SCHEMA;
  this.indent = Math.max(1, options['indent'] || 2);
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid = options['skipInvalid'] || false;
  this.flowLevel = common.isNothing(options['flowLevel']) ? -1 : options['flowLevel'];
  this.styleMap = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys = options['sortKeys'] || false;
  this.lineWidth = options['lineWidth'] || 80;
  this.noRefs = options['noRefs'] || false;
  this.noCompatMode = options['noCompatMode'] || false;
  this.condenseFlow = options['condenseFlow'] || false;
  this.quotingType = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options['forceQuotes'] || false;
  this.replacer = typeof options['replacer'] === 'function' ? options['replacer'] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = '';
  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
    position = 0,
    next = -1,
    result = '',
    line,
    length = string.length;
  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== '\n') result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}
function testImplicitResolving(state, str) {
  var index, length, type;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];
    if (type.resolve(str)) {
      return true;
    }
  }
  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return 0x00020 <= c && c <= 0x00007E || 0x000A1 <= c && c <= 0x00D7FF && c !== 0x2028 && c !== 0x2029 || 0x0E000 <= c && c <= 0x00FFFD && c !== CHAR_BOM || 0x10000 <= c && c <= 0x10FFFF;
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM
  // - b-char
  && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
  // ns-plain-safe
  inblock ?
  // c = flow-in
  cIsNsCharOrWhitespace : cIsNsCharOrWhitespace
  // - c-flow-indicator
  && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET

  // ns-plain-char
  ) && c !== CHAR_SHARP // false on '#'
  && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
  || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP // change to true on '[^ ]#'
  || prev === CHAR_COLON && cIsNsChar; // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET
  // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
  && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE
  // | “%” | “@” | “`”)
  && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos),
    second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1,
  STYLE_SINGLE = 2,
  STYLE_LITERAL = 3,
  STYLE_FOLDED = 4,
  STYLE_DOUBLE = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
          // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
    // No block styles in flow mode.
    || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }
    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }();
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip = string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : clip ? '' : '-';
  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1],
      line = match[2];
    moreIndented = line[0] === ' ';
    result += prefix + (!prevMoreIndented && !moreIndented && line !== '' ? '\n' : '') + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0,
    end,
    curr = 0,
    next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while (match = breakRe.exec(line)) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = curr > start ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1; // derive start <= length-1
    }

    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = '',
    _tag = state.tag,
    index,
    length,
    value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) || typeof value === 'undefined' && writeNode(state, level, null, false, false)) {
      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = '[' + _result + ']';
}
function writeBlockSequence(state, level, object, compact) {
  var _result = '',
    _tag = state.tag,
    index,
    length,
    value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === 'undefined' && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result = '',
    _tag = state.tag,
    objectKeyList = Object.keys(object),
    index,
    length,
    objectKey,
    objectValue,
    pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';
    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');
    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = '{' + _result + '}';
}
function writeBlockMapping(state, level, object, compact) {
  var _result = '',
    _tag = state.tag,
    objectKeyList = Object.keys(object),
    index,
    length,
    objectKey,
    objectValue,
    explicitPair,
    pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';
    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = state.tag !== null && state.tag !== '?' || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }
    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];
    if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === 'object' && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }
      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;
        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type === '[object Object]' || type === '[object Array]',
    duplicateIndex,
    duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== '?' || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }
    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(state.tag[0] === '!' ? state.tag.slice(1) : state.tag).replace(/!/g, '%21');
      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }
      state.dump = tagStr + ' ' + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [],
    duplicatesIndexes = [],
    index,
    length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({
      '': value
    }, '', value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';
  return '';
}
dumper$1.dump = dump;

var loader = loader$1;
var dumper = dumper$1;
function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' + 'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}
jsYaml.Type = type;
jsYaml.Schema = schema;
jsYaml.FAILSAFE_SCHEMA = failsafe;
jsYaml.JSON_SCHEMA = json;
jsYaml.CORE_SCHEMA = coreExports;
jsYaml.DEFAULT_SCHEMA = _default;
jsYaml.load = loader.load;
jsYaml.loadAll = loader.loadAll;
jsYaml.dump = dumper.dump;
jsYaml.YAMLException = exception;

// Re-export all types in case user wants to create custom schema
jsYaml.types = {
  binary: binary,
  float: float,
  map: map,
  null: _null,
  pairs: pairs,
  set: set,
  timestamp: timestamp$1,
  bool: bool,
  int: int,
  merge: merge,
  omap: omap,
  seq: seq,
  str: str
};

// Removed functions from JS-YAML 3.0.x
jsYaml.safeLoad = renamed('safeLoad', 'load');
jsYaml.safeLoadAll = renamed('safeLoadAll', 'loadAll');
jsYaml.safeDump = renamed('safeDump', 'dump');

var createSettingsBlock = (config) => {
    const { format, scale, srcSize } = config;
    // SVGs scale natively, hence the S!
    if (scale && format !== 'SVG') {
        return {
            settings: { format: format, constraint: { type: 'SCALE', value: +scale } },
            destSize: { w: srcSize.w * +scale, h: srcSize.h * +scale }
        };
    }
    return {
        settings: { format: format },
        destSize: srcSize
    };
};

const createGroupFromFrame = (frameNode) => {
    if (!frameNode || !frameNode.parent)
        return null;
    if (!Array.isArray(frameNode.children) || !frameNode.children.length)
        return null;
    const parent = frameNode.parent;
    if (parent.type === 'INSTANCE')
        return null;
    const group = figma.group(frameNode.children, parent);
    if (frameNode.name)
        group.name = frameNode.name;
    return group;
};
const createGroupsFromFrames = (items) => {
    const groups = [];
    if (!items.length)
        return groups;
    for (const node of items) {
        if (typeof node.findAll !== 'function')
            continue;
        const group = createGroupFromFrame(node);
        if (group) {
            groups.push(group);
            if (!node.children.length)
                node.remove();
        }
    }
    return groups;
};

var zeroPad = (val, digits) => {
    var str = String(val);
    while (str.length < digits)
        str = '0' + str;
    return str;
};

var timestamp = () => {
    var d = new Date();
    var year = d.getFullYear();
    var date = zeroPad(d.getDate(), 2);
    var month = zeroPad(d.getMonth() + 1, 2);
    var hour = zeroPad(d.getHours(), 2);
    var min = zeroPad(d.getMinutes(), 2);
    return year + '-' + month + '-' + date + ' ' + hour + ':' + min;
};

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
  })('slugify', commonjsGlobal, function () {
    var charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","„":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"}');
    var locales = JSON.parse('{"bg":{"Й":"Y","Ц":"Ts","Щ":"Sht","Ъ":"A","Ь":"Y","й":"y","ц":"ts","щ":"sht","ъ":"a","ь":"y"},"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","ß":"ss","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","¢":"centavos","£":"libras","¤":"moneda","₣":"francos","∑":"suma","∞":"infinito","♥":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","¢":"centavo","∑":"soma","£":"libra","∞":"infinito","♥":"amor"},"uk":{"И":"Y","и":"y","Й":"Y","й":"y","Ц":"Ts","ц":"ts","Х":"Kh","х":"kh","Щ":"Shch","щ":"shch","Г":"H","г":"h"},"vi":{"Đ":"D","đ":"d"},"da":{"Ø":"OE","ø":"oe","Å":"AA","å":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"større end"},"nb":{"&":"og","Å":"AA","Æ":"AE","Ø":"OE","å":"aa","æ":"ae","ø":"oe"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och","Å":"AA","Ä":"AE","Ö":"OE","å":"aa","ä":"ae","ö":"oe"}}');
    function replace(string, options) {
      if (typeof string !== 'string') {
        throw new Error('slugify: string argument expected');
      }
      options = typeof options === 'string' ? {
        replacement: options
      } : options || {};
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
        .replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '');
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
      return slug;
    }
    replace.extend = function (customMap) {
      Object.assign(charMap, customMap);
    };
    return replace;
  });
})(slugify$1);
var slugify = slugifyExports;

const fontList = [];
// TODO: shouldn't this use our stringify function?
const styles$1 = (segment) => {
    fontList.push(segment.fontName);
    let color = undefined;
    let mixBlendMode = undefined;
    if (segment.fills.length) {
        const [fill] = segment.fills;
        const [r, g, b] = [fill.color.r, fill.color.g, fill.color.b].map((color) => Math.round(color * 255));
        color = `rgba(${r}, ${g}, ${b}, ${fill.opacity})`;
        mixBlendMode = fill.blendMode.toLowerCase();
    }
    const object = {
        'font-family': segment.fontName.family,
        'font-style': segment.fontName.style.includes('Italic') ? 'italic' : 'normal',
        'font-weight': segment.fontWeight,
        'font-size': segment.fontSize + 'px',
        'text-decoration': segment.textDecoration.toLowerCase(),
        'text-transform': segment.textCase === 'ORIGINAL' ? 'none' : segment.textCase.toLowerCase(),
        'line-height': segment.lineHeight.unit === 'AUTO'
            ? 'normal'
            : segment.lineHeight.unit === 'PERCENT' && segment.lineHeight.value > 0
                ? segment.lineHeight.value / 100
                : segment.lineHeight.value + 'px',
        'letter-spacing': segment.letterSpacing.unit === 'PERCENT' && segment.letterSpacing.value > 0
            ? segment.letterSpacing.value / 100
            : segment.letterSpacing.value + 'px',
        color,
        'mix-blend-mode': mixBlendMode
    };
    return {
        object,
        string: Object.entries(object)
            .filter((d) => d[0] && d[1])
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ')
    };
};
var styleProps = { fontList, styles: styles$1 };

var trim = (s) => s.replace(/^[\s\uFEFF\xA0\x03]+|[\s\uFEFF\xA0\x03]+$/g, '');

// https://www.figma.com/plugin-docs/api/properties/TextNode-getstyledtextsegments/#fields
const fields = [
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
];
const hTag = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
var convertTextFrames = (textFrames, frameWidth, frameHeight) => {
    // return array of text frame style + class data
    return textFrames.map((textFrame, i) => {
        const textSegments = [];
        const customAttributes = [];
        let elClass = ``;
        let elId = `f2h-text-${i}`;
        let customClasses;
        let x = 0;
        let y = 0;
        let translateX = 0;
        let translateY = 0;
        // check all fields
        const segments = textFrame.getStyledTextSegments(fields);
        const styleid = figma.getStyleById(textFrame.textStyleId);
        segments.forEach((seg, i) => {
            // get styles object from included props
            const styles = styleProps.styles(seg);
            // fields to check against the root. all of these would need to match original
            const baseStyleFields = [
                'font-family',
                'font-size',
                'letter-spacing',
                'color',
                'line-height',
                'mix-blend-mode',
                'text-decoration',
                'text-transform'
            ];
            // is this segment's style the same as the first segment's style, except for font weight and font style?
            const isBaseStyle = !i ||
                !new Set(baseStyleFields.map((key) => styles.object[key] === textSegments[0].styles.object[key])).has(false);
            // is this segment's font-weight 700 (bold) (only if isBaseStyle is false)?
            const isBold = isBaseStyle && styles.object['font-weight'] === 700;
            // is this segment's font-weight neither 400 or 700 (only if isBaseStyle is false)?
            const isOtherWeight = isBaseStyle && styles.object['font-weight'] !== 400 && styles.object['font-weight'] !== 700
                ? styles.object['font-weight']
                : false;
            // is this segment's font-style italic (only if isBaseStyle is false)?
            const isItalic = isBaseStyle && styles.object['font-style'] === 'italic';
            textSegments.push({
                characters: seg.characters,
                start: seg.start,
                end: seg.end,
                hyperlink: seg.hyperlink,
                listOptions: seg.listOptions,
                styles,
                isBaseStyle,
                isBold,
                isOtherWeight,
                isItalic
            });
        });
        if ((styleid === null || styleid === void 0 ? void 0 : styleid.name) && typeof styleid.name !== 'symbol')
            elClass += ` ${slugify(styleid.name.split('/').slice(-1)[0], {
                lower: true,
                strict: true
            })}`;
        // get base style and change font-weight to 400 and style to normal
        const tag = hTag.has(trim(elClass)) ? trim(elClass) : 'p';
        const baseStyle = {
            tag,
            style: textSegments[0].styles.string
                .replace('font-weight: 700', 'font-weight: 400')
                .replace('font-style: italic', 'font-style: normal')
        };
        // turn layer name into custom attributes if it starts with [f2h]
        if (textFrame.name.startsWith('[f2h]')) {
            const layerName = textFrame.name.replace('[f2h]', '');
            const attributes = layerName.split(';');
            attributes.forEach((attr) => {
                const [key, value] = attr.split(':');
                customAttributes.push({
                    key: key,
                    value: value.split(',').map((v) => v.trim())
                });
            });
        }
        // get x positioning based on horizontal alignment
        switch (textFrame.textAlignHorizontal) {
            case 'LEFT':
                x = (textFrame.x / frameWidth) * 100;
                translateX = 0;
                break;
            case 'CENTER':
                x = ((textFrame.x + textFrame.width / 2) / frameWidth) * 100;
                translateX = -50;
                break;
            case 'RIGHT':
                x = ((textFrame.x + textFrame.width) / frameWidth) * 100;
                translateX = -100;
                break;
            case 'JUSTIFIED':
                x = (textFrame.x / frameWidth) * 100;
                translateX = 0;
                break;
        }
        // get y positioning based on vertical alignment
        switch (textFrame.textAlignVertical) {
            case 'TOP':
                y = (textFrame.y / frameHeight) * 100;
                translateY = 0;
                break;
            case 'CENTER':
                y = ((textFrame.y + textFrame.height / 2) / frameHeight) * 100;
                translateY = -50;
                break;
            case 'BOTTOM':
                y = ((textFrame.y + textFrame.height) / frameHeight) * 100;
                translateY = -100;
                break;
        }
        return {
            customClasses,
            customAttributes,
            class: elClass,
            elId,
            segments: textSegments,
            baseStyle,
            x: `${x.toFixed(2)}% `,
            y: `${y.toFixed(2)}% `,
            horizontalAlignment: textFrame.textAlignHorizontal,
            verticalAlignment: textFrame.textAlignVertical,
            width: textFrame.textAutoResize === 'WIDTH_AND_HEIGHT'
                ? 'auto'
                : `${textFrame.width.toFixed(2)}px`,
            opacity: textFrame.opacity,
            translate: `${translateX}%, ${translateY}%`,
            rotation: textFrame.rotation * -1,
            effect: textFrame.effects
        };
    });
};

var frame$1 = (id) => {
    return `#${id} { position: relative; overflow: hidden; display: none; }\n`;
};

var textEffect = (effects) => {
    let css = ``;
    const dropShadows = effects.filter((effect) => effect.type === 'DROP_SHADOW' && effect.visible);
    if (dropShadows.length > 0) {
        let textShadow = `text-shadow: `;
        dropShadows.forEach((effect, i) => {
            const x = effect.offset.x;
            const y = effect.offset.y;
            const r = effect.radius;
            const rgba = `rgba(${effect.color.r * 255}, ${effect.color.g * 255}, ${effect.color.b * 255}, ${effect.color.a})`;
            const end = i < dropShadows.length - 1 ? `, ` : `; `;
            textShadow += `${x}px ${y}px ${r}px ${rgba}${end}`;
        });
        css += textShadow;
    }
    const layerBlurs = effects.filter((effect) => effect.type === 'LAYER_BLUR' && effect.visible);
    if (layerBlurs.length > 0) {
        const blur = `-webkit-filter: blur(${layerBlurs[0].radius}px);\nfilter: blur(${layerBlurs[0].radius}px);`;
        css += blur;
    }
    return css;
};

var page = ({ id, config, css }) => {
    const hashID = `#${id}`;
    const selectors = {};
    // add max-width to styles
    selectors[hashID] = {
        'max-width': config.maxWidth ? `${config.maxWidth}px` : 'none',
        margin: config.centered ? '0 auto' : '0'
    };
    // center content
    if (config.centered) {
        selectors[`${hashID} .f2h-frame`] = {
            margin: '0 auto'
        };
    }
    // default <p> styles
    selectors[`${hashID} p, ${hashID} .body`] = { margin: '0' };
    // image placement
    selectors[`${hashID} .f2h-img`] = {
        width: '100% !important',
        top: '0'
    };
    selectors[`${hashID} .f2h-symbol`] = {
        'box-sizing': 'border-box'
    };
    selectors[`${hashID} :where(.frame, .f2h-text, .f2h-symbol)`] = {
        position: 'absolute'
    };
    selectors[`${hashID} :where(.f2h-link, .f2h-img)`] = {
        display: 'block'
    };
    const computedStyles = Object.entries(selectors)
        .map(([selector, properties]) => `\t${selector} { ${Object.entries(properties)
        .map(([property, value]) => `\n\t\t${property}: ${value};`)
        .join('')}\n\t}`)
        .join('\n\n') + `\n\n${css}`;
    return computedStyles;
};

var css = { frame: frame$1, page, textEffect };

var roundTo = (num, precision) => Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);

// mutates and concatenates the given object into a formatted string
// concatenates into html attribute format
const attrs = (obj) => Object.entries(obj)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
// concatenates into css style format
const styles = (obj) => Object.entries(obj)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
var stringify = { attrs, styles };

// TODO: type these parametrs
var span = (segment, variables, styleTextSegments) => {
    let el = ``;
    let characters = segment.characters;
    // replace variable text
    if (variables) {
        Object.keys(variables).forEach((key) => {
            // replace all instances of the variable name with the value
            characters = characters.replaceAll(`{{${key}}}`, variables[key]);
        });
    }
    // if segment has a hyperlink, add an a tag
    if (segment.hyperlink)
        el += `<a href="${segment.hyperlink.value}" target="_blank">`;
    // if segment.isBaseStyle is false, then add a span with inline styles
    if (!segment.isBaseStyle && styleTextSegments)
        el += `<span style="${segment.styles.string}">`;
    // if segment.isOtherWeight is not false, then add a span with inline styles
    if (segment.isOtherWeight && styleTextSegments)
        el += `<span style="font-weight: ${segment.isOtherWeight}">`;
    // if segment isItalic is true, add an i tag
    if (segment.isItalic)
        el += `<i>`;
    // if segment isBold is true, add a b tag
    if (segment.isBold)
        el += `<b>`;
    // add characters
    el += characters;
    // if segment isBold is true, close b tag
    if (segment.isBold)
        el += `</b>`;
    // if segment isItalic is true, close i tag
    if (segment.isItalic)
        el += `</i>`;
    // if segment.isOtherWeight is not false, then close span tag
    if (segment.isOtherWeight && styleTextSegments)
        el += `</span>`;
    // if segment.isBaseStyle is false, close span tag
    if (!segment.isBaseStyle && styleTextSegments)
        el += `</span>`;
    // if segment has a hyperlink, close a tag
    if (segment.hyperlink)
        el += `</a>`;
    return el;
};

var frame = ({ node, filename, widthRange, alt, config, variables }) => {
    let inlineStyle = '';
    const frameContent = { html: '', css: '', js: '' };
    const width = +node.name.match('#(.*)px')[1];
    const height = node.height;
    const aspectRatio = width / height;
    const [minWidth, maxWidth] = widthRange.ranges[widthRange.widths.indexOf(width)];
    const frameWidth = node.width;
    const frameHeight = node.height;
    const frameClass = `f2h-frame`;
    const id = `f2h-frame-${width}`;
    const format = config.format.toLowerCase();
    frameContent.css += `\t${css.frame(id)}`;
    // find all text nodes within the frame
    const textFrames = node.findAllWithCriteria({ types: ['TEXT'] });
    const textData = convertTextFrames(textFrames, frameWidth, frameHeight);
    // set layout mode to none
    node.layoutMode = 'NONE';
    node.clipsContent = true;
    // TO DO: fix this
    // inlineSpacerStyle = `padding: 0 0 ${ formatCssPct(height, width) } 0; `
    // export const formatCssPct = (height, width) => {
    // 	let pct = (height / width) * 100;
    // 	return pct.toFixed(2) + '%';
    // };
    // if responsiveness is fixed, set the width to the max width
    if (!config.fluid)
        inlineStyle += `width: ${width}px;`;
    frameContent.html += `\n\t<!-- Frame: ${filename.split('/').slice(-1)} -->\n`;
    frameContent.html += `\t<div ${stringify.attrs({
        id: id,
        class: `${frameClass.replace(':', '-')} frame artboard`,
        'data-aspect-ratio': roundTo(aspectRatio, 3),
        'data-min-width': minWidth,
        'data-max-width': maxWidth,
        style: inlineStyle
    })}>`;
    frameContent.html += `\n\t\t<div ${stringify.attrs({
        class: 'spacer',
        style: stringify.styles({
            padding: '0 0 0 0',
            'min-width': width > 0 ? `${width}px` : 'auto',
            'max-width': maxWidth ? `${maxWidth}px` : 'none'
        })
    })}></div>`;
    frameContent.html += `\n\t\t<picture>\n\t\t\t<source ${stringify.attrs({
        srcset: filename + '.' + format,
        type: 'image/' + format
    })}>\n\t\t\t<img ${stringify.attrs({
        id: 'img-' + id,
        class: 'f2h-img',
        alt: alt,
        'data-src': filename + '.' + format,
        src: 'data:image/gif;base64,R0lGODlhCgAKAIAAAB8fHwAAACH5BAEAAAAALAAAAAAKAAoAAAIIhI+py+0PYysAOw==',
        loading: 'lazy',
        draggable: 'false',
        decoding: 'async',
        width: width.toFixed(2),
        height: height.toFixed(2)
    })}/>\n\t\t</picture>\n`;
    if (textData) {
        // make an array of the baseStyle property of each text node
        const baseStyles = textData.map((text) => text.baseStyle);
        // get the most frequent value in baseStyles and make pStyle equal to it
        const pStyle = baseStyles
            .sort((a, b) => baseStyles.filter((v) => v === a).length - baseStyles.filter((v) => v === b).length)
            .pop();
        // add pStyle to css
        if (config.styleTextSegments)
            if (pStyle)
                frameContent.css += `\n\t#${id} ${pStyle.tag} { ${pStyle.style.replaceAll('undefined', '')} }`;
        textData.forEach((text) => {
            let el = ``;
            // TODO: make elClass part of elAttributes
            let elClass = 'f2h-text';
            let elAttributes = '';
            let effect = '';
            if (!!text.effect.length)
                effect = css.textEffect(text.effect);
            // base styles
            const style = {
                top: text.y,
                left: text.x,
                opacity: text.opacity,
                width: text.width
            };
            // if (text.rotation !== 0) {
            style['transform'] = `translate(${text.translate}) rotate(${text.rotation}deg)`;
            style['transform-origin'] = 'left top';
            style['text-align'] = text.horizontalAlignment.toLowerCase();
            // }
            let els = [];
            text.segments.forEach((segment, i) => {
                var _a, _b;
                // did the last line end with a line break?
                const prevEndsNewLine = (_b = (_a = text.segments) === null || _a === void 0 ? void 0 : _a[i - 1]) === null || _b === void 0 ? void 0 : _b.characters.endsWith('\n');
                // does this line end with a line break?
                const thisEndsNewLine = segment === null || segment === void 0 ? void 0 : segment.characters.endsWith('\n');
                // does this line include a line break?
                const thisIncludesNewLine = segment === null || segment === void 0 ? void 0 : segment.characters.includes('\n');
                const notNewElement = !!i && !prevEndsNewLine && !(thisIncludesNewLine && !thisEndsNewLine);
                if (notNewElement)
                    els[els.length - 1].segments.push(segment);
                else {
                    els.push({
                        tag: config.applyHtags && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(trim(text.class))
                            ? trim(text.class)
                            : 'p',
                        segments: [segment],
                        newElement: !!i && (!prevEndsNewLine || (thisIncludesNewLine && !thisEndsNewLine))
                    });
                }
            });
            // if text.customAttributes array contains an object with key 'class', add it to the class
            text.customAttributes.forEach((attr) => {
                if (attr.key === 'class')
                    elClass += ` ${attr.value.join(' ')}`;
                else
                    elAttributes += ` ${attr.key}="${attr.value}"`;
            });
            el += `<div class="${elClass}" ${elAttributes} style="${stringify.styles(style)} ${effect}">`;
            els.forEach((element) => {
                el += `\n\t\t\t<${element.tag} ${stringify.attrs({
                    class: `${text.elId} ${text.class} ${text.customClasses ? text.customClasses.join(' ') : ''}`
                })}>`;
                element.segments.forEach((segment) => {
                    el += span(segment, variables, config.styleTextSegments);
                });
                el += `</${element.tag}>\n`;
                if (config.styleTextSegments) {
                    // if text.baseStyle is not the same as pStyle, append text.baseStyle to frameContent.css
                    if (text.baseStyle.style !== pStyle.style)
                        frameContent.css += `\n\t#${id} .${text.elId}${text.class.replaceAll(' ', '.')} { ${text.baseStyle.style.replaceAll('undefined', '')} }`;
                }
            });
            el += `\t\t</div>\n`;
            frameContent.html += el;
        });
    }
    frameContent.html += `\t</div>\n`;
    return frameContent;
};

var fonts = (fontList) => {
    if (!fontList || fontList.length === 0)
        return;
    const weightLookup = {
        Thin: 100,
        ExtraLight: 200,
        Light: 300,
        Regular: 400,
        Medium: 500,
        SemiBold: 600,
        Bold: 700,
        ExtraBold: 800,
        Black: 900
    };
    // master list
    // group fontList array by family
    const typefaces = new Map();
    for (const { family, style } of [...fontList]) {
        const googleStyle = style.includes('Italic') ? '1,' : '0,';
        const weight = style === 'Italic' ? weightLookup['Regular'] : weightLookup[style.replace(' Italic', '')];
        const styleWeight = `${googleStyle}${weight}`;
        // initiate a new Map/Set if the family doesn't exist already
        !typefaces.has(family)
            ? typefaces.set(family, new Set([styleWeight]))
            : typefaces.get(family).add(styleWeight);
    }
    const urls = [...typefaces]
        .map(([typeface, variations]) => `family=${typeface.replace(/\s/g, '+')}:ital,wght@${[...variations].sort().join(';')}`)
        .join('&');
    // 	let families = '';
    // 	fontFamilies.forEach((f) => {
    // 		let name = `${f.family.replace(/\s/g, '+')}:ital,wght@`;
    // 		families += `family=${name}${f.weights.sort().join(';')}&`;
    // 	});
    // 	let fontScript = `
    //   <link rel="preconnect" href="https://fonts.googleapis.com">
    //   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    //   <link href="https://fonts.googleapis.com/css2?${families}display=swap" rel="stylesheet">
    // `;
    // write a small script to append these directly to the head of the document.
    // we don't ship a <head> natively to all for embeds to be easier. this grabs the DOM's head
    return `<script>
	  const apiLink = document.createElement('link');
		apiLink.rel = 'preconnect';
		apiLink.href = 'https://fonts.googleapis.com';

		const gstaticLink = document.createElement('link');
		gstaticLink.rel = 'preconnect';
		gstaticLink.href = 'https://fonts.gstatic.com';
		gstaticLink.crossorigin = true

		const fontLink = document.createElement('link');
		fontLink.rel = 'stylesheet';
		fontLink.href = 'https://fonts.googleapis.com/css2?${urls}&display=swap';

		document.head.appendChild(apiLink);
		document.head.appendChild(gstaticLink);
		document.head.appendChild(fontLink);
	</script>`;
};

var resizer = (containerId, isSvelte) => {
    // The resizer function is embedded in the HTML page -- external variables must
    // be passed in.
    const resizer = (containerId) => {
        if (!('querySelector' in document))
            return;
        const elementInView = (el) => {
            const bounds = el.getBoundingClientRect();
            return bounds.top < window.innerHeight && bounds.bottom > 0;
        };
        const updateImgSrc = (img) => {
            const src = img.getAttribute('data-src');
            if (src && img.getAttribute('src') != src)
                img.setAttribute('src', src);
        };
        const onIntersectionChange = (entries) => {
            const isIntersecting = entries.reduce((memo, entry) => memo || entry.isIntersecting, false);
            if (isIntersecting) {
                waiting = false;
                update();
            }
        };
        const selectChildren = (selector, parent) => parent ? Array.prototype.slice.call(parent.querySelectorAll(selector)) : [];
        // based on underscore.js
        const throttle = (func, wait) => {
            let timeout = null;
            let previous = 0;
            const run = () => {
                previous = Date.now();
                timeout = null;
                func();
            };
            return function () {
                const remaining = wait - (Date.now() - previous);
                if (remaining <= 0 || remaining > wait) {
                    clearTimeout(timeout);
                    run();
                }
                else if (!timeout) {
                    timeout = setTimeout(run, remaining);
                }
            };
        };
        const update = () => {
            const frames = selectChildren(`.${nameSpace}artboard:where([data-min-width],[data-max-width])`, container);
            // set width to either the container width or the window width, whichever is smaller
            const width = Math.min(Math.round(container.offsetWidth), window.innerWidth);
            // Set frame visibility based on container width
            frames.forEach(function (el) {
                let minwidth = el.getAttribute('data-min-width');
                let maxwidth = el.getAttribute('data-max-width');
                if (+minwidth <= width && (+maxwidth >= width || maxwidth === null)) {
                    if (!waiting)
                        selectChildren(`.${nameSpace}f2h-img`, el).forEach(updateImgSrc);
                    el.style.display = 'block';
                }
                else {
                    el.style.display = 'none';
                }
            });
            // Initialize lazy loading on first call
            if (waiting && !observer) {
                if (elementInView(container)) {
                    waiting = false;
                    update();
                }
                else {
                    observer = new IntersectionObserver(onIntersectionChange, {
                        rootMargin: '400px 400px'
                    });
                    observer.observe(container);
                }
            }
        };
        const container = document.getElementById(containerId);
        const onResize = throttle(update, 200);
        const nameSpace = '';
        let waiting = !!window.IntersectionObserver;
        let observer;
        update();
        document.addEventListener('DOMContentLoaded', update);
        window.addEventListener('resize', onResize);
    };
    // convert resizer function to JS source code
    const resizerJs = `(${trim(resizer.toString().replace(/ {2}/g, '\t'))})("${containerId}", {namespace: "", setup: window.setupInteractive || window.getComponent});`;
    if (isSvelte)
        return `<script>\n\t import { onMount } from 'svelte'; \n\t onMount(() => {\n\t\t${resizerJs}\n\t\t});\n</script>`;
    else
        return `<script>\n\t ${resizerJs}\n </script>`;
};

var js = { resizer, fonts };

var widthRange = (assets) => {
    let widthRange = { min: 0, max: 0, widths: [], ranges: [] };
    assets.forEach((asset) => {
        // let width = asset.node.width;
        let width = +asset.node.name.replace('#', '').replace('px', '');
        widthRange.widths.push(width);
    });
    // sort widthRange.widths
    widthRange.widths.sort((a, b) => a - b);
    widthRange.widths.forEach((width, i) => {
        let range = [];
        if (i == 0) {
            range.push(0, widthRange.widths[1] - 1);
        }
        else if (i < widthRange.widths.length - 1) {
            range.push(widthRange.widths[i], widthRange.widths[i + 1] - 1);
        }
        else if (i == widthRange.widths.length - 1) {
            range.push(width);
        }
        widthRange.ranges.push(range);
    });
    widthRange.max = Math.max(...widthRange.widths);
    return widthRange;
};

var html = ({ config, assets, variables }) => {
    const containerID = `${config.name}-box`;
    const frameCSS = assets
        .map(({ node, filename }) => frame({
        node,
        filename,
        widthRange: widthRange(assets),
        alt: config.alt,
        config,
        variables
    }).css)
        .join('\n\n');
    const assetsHTML = assets
        .map(({ node, filename }) => frame({
        node,
        filename,
        widthRange: widthRange(assets),
        alt: config.alt,
        config,
        variables
    }).html)
        .join('\n\n');
    const html = `<!-- Generated by figma2html on ${timestamp()} -->
	<style type='text/css'>${css.page({ id: containerID, config, css: frameCSS })}</style>
	<div id="${containerID}" class="figma2html">${assetsHTML}</div>
	${config.includeResizer ? js.resizer(containerID, false) : ''}
	${config.includeGoogleFonts && !!fontList.length ? js.fonts(fontList) : ''}
	${config.customScript ? config.customScript : ''}
	<!-- End figma2html generated content - ${timestamp()} -->`;
    return html;
};

var log = (...args) => console.log('[figma2html]', ...args);

var _a, _b, _c, _d;
/**
 * ignore invisible nodes. speeds up document traversal
 * @see {@link https://www.figma.com/plugin-docs/api/properties/figma-skipinvisibleinstancechildren/|figma.skipInvisibleInstanceChildren}
 */
figma.skipInvisibleInstanceChildren = true;
/**
 * show the UI.
 * __html__ references the string in /manifest.json.
 * @see {@link https://www.figma.com/plugin-docs/api/global-objects/#html|Global Objects}
 * */
figma.showUI(__html__, { width: 560, height: 500, themeColors: true });
/** UTILS */
const isFrameExportable = (frameName) => !!frameName.match(/^#\d+px$/);
/**
 * DEFAULT VARIABLES
 */
const defaults = {
    config: {
        name: slugify(figma.currentPage.name, { lower: true, strict: true }),
        scale: '1',
        format: 'PNG',
        output: 'html',
        includeResizer: true,
        testingMode: false,
        maxWidth: null,
        fluid: true,
        centered: false,
        imagePath: 'figma2html/',
        alt: null,
        applyStyleNames: true,
        applyHtags: true,
        styleTextSegments: true,
        includeGoogleFonts: true,
        customScript: null
    },
    size: { w: 960, h: 500 },
    variables: { hed: 'figma2html' },
    panels: {
        file: true,
        images: false,
        page: false,
        text: false,
        preview: true
    }
};
const newConfigFrame = ({ name, x = 0, y = 0, text, locked = false }) => {
    const frameNode = figma.createFrame();
    frameNode.name = name;
    frameNode.x = x;
    frameNode.y = y;
    frameNode.layoutMode = 'VERTICAL';
    frameNode.primaryAxisSizingMode = 'AUTO';
    frameNode.counterAxisSizingMode = 'AUTO';
    frameNode.verticalPadding = 4;
    frameNode.horizontalPadding = 6;
    frameNode.cornerRadius = 4;
    frameNode.locked = locked;
    const textNode = figma.createText();
    textNode.characters = jsYaml.dump(text).trim();
    frameNode.appendChild(textNode);
};
/**
 * STORED DATA
 * Interface with data in clientStorage
 * @see {@link https://www.figma.com/plugin-docs/api/figma-clientStorage/|ClientStorage}
 */
class Stored {
}
/**
 * PANELS.
 * Sections of the UI to show/hide by default
 */
Stored.panels = (_a = class {
    },
    _a.get = () => __awaiter(void 0, void 0, void 0, function* () {
        const panels = yield figma.clientStorage.getAsync('panels');
        return panels !== null && panels !== void 0 ? panels : defaults.panels;
    }),
    _a.set = (panels) => __awaiter(void 0, void 0, void 0, function* () {
        yield figma.clientStorage.setAsync('panels', panels);
        return panels;
    }),
    _a.clear = () => __awaiter(void 0, void 0, void 0, function* () {
        yield figma.clientStorage.deleteAsync('panels');
    }),
    _a);
/**
 * SIZE
 */
Stored.size = (_b = class {
    },
    _b.get = () => __awaiter(void 0, void 0, void 0, function* () {
        const _size = yield figma.clientStorage.getAsync('size');
        return _size !== null && _size !== void 0 ? _size : defaults.size;
    }),
    _b.set = (_size) => __awaiter(void 0, void 0, void 0, function* () {
        yield figma.clientStorage.setAsync('size', _size);
        return _size;
    }),
    _b.clear = () => __awaiter(void 0, void 0, void 0, function* () {
        yield figma.clientStorage.deleteAsync('size');
    }),
    _b);
/**
 * VARIABLES
 */
Stored.variables = (_c = class {
    },
    _c.get = () => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        // get the stored variables
        const variablesFrame = figma.currentPage.findChild((node) => node.type === 'FRAME' && node.name === 'f2h-variables');
        const variablesText = (_e = variablesFrame === null || variablesFrame === void 0 ? void 0 : variablesFrame.children) === null || _e === void 0 ? void 0 : _e[0];
        if (!!(variablesText === null || variablesText === void 0 ? void 0 : variablesText.characters)) {
            const variables = jsYaml.load(variablesText.characters);
            Stored.variables.write();
            figma.ui.postMessage({
                type: 'variables',
                variables: variables
            });
            return variables;
        }
        else {
            figma.ui.postMessage({
                type: 'variables',
                variables: null
            });
            return defaults.variables;
        }
    }),
    _c.write = () => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        // write an example variables array to a text node on the current page
        let variables = defaults.variables;
        let x = 0;
        let y = 0;
        // remove existing variables text node if found
        const existingVariablesFrame = figma.currentPage.findChild((node) => node.type === 'FRAME' && node.name === 'f2h-variables');
        const existingVariablesText = (_f = existingVariablesFrame === null || existingVariablesFrame === void 0 ? void 0 : existingVariablesFrame.children) === null || _f === void 0 ? void 0 : _f[0];
        if (!!(existingVariablesText === null || existingVariablesText === void 0 ? void 0 : existingVariablesText.characters)) {
            // save xPos of existing variables text node if it exists
            x = existingVariablesText.x;
            const characters = existingVariablesText.characters;
            variables = jsYaml.load(characters);
            existingVariablesText.remove();
        }
        // load Inter for variables text node
        figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
            const nodes = figma.currentPage.findAll((node) => isFrameExportable(node.name) || node.name === 'f2h-settings');
            const settingsNode = nodes.find((node) => node.name === 'f2h-settings');
            // if settings exists, place beside it
            if (settingsNode) {
                x = settingsNode.x + settingsNode.width;
            }
            else {
                // otherwise get all top-level children and place it to the right of them
                const maxX = nodes.reduce((max, node) => Math.max(max, node.x + node.width), 0);
                x = maxX;
            }
            // a little padding
            x += 25;
            // get uppermost point
            y = nodes.reduce((min, node) => Math.min(min, node.y), 0);
            // create the node
            newConfigFrame({
                name: 'f2h-variables',
                text: variables,
                x,
                y
            });
            figma.ui.postMessage({
                type: 'variables',
                variables: variables
            });
        });
    }),
    _c);
/**
 * CONFIG
 */
Stored.config = (_d = class {
    },
    _d.get = () => __awaiter(void 0, void 0, void 0, function* () {
        const _config = yield figma.clientStorage.getAsync('config');
        return _config || defaults.config;
    }),
    _d.set = (_config) => __awaiter(void 0, void 0, void 0, function* () {
        yield figma.clientStorage.setAsync('config', _config);
        return _config;
    }),
    _d.clear = () => __awaiter(void 0, void 0, void 0, function* () {
        yield figma.clientStorage.deleteAsync('config');
        return;
    }),
    // write the config to a text node on the current page
    _d.write = (config) => __awaiter(void 0, void 0, void 0, function* () {
        let x = 0;
        let y = 0;
        // remove existing settings text node if found
        const settings = figma.currentPage.findChild((node) => node.type === 'FRAME' && node.name === 'f2h-settings');
        if (settings) {
            // save position if settings node exists
            x = settings.x;
            settings.remove();
        }
        // load Inter for settings text node
        figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
            // get all frames with names starting with "#"
            const nodes = figma.currentPage.findChildren(({ name }) => isFrameExportable(name));
            // get furthest point to the right
            x = nodes.reduce((max, node) => Math.max(max, node.x + node.width), 0);
            x += 100;
            // get furthest point to the top
            y = nodes.reduce((min, node) => Math.min(min, node.y), 0);
            // create the node
            newConfigFrame({
                name: 'f2h-settings',
                text: config,
                x,
                y,
                locked: true
            });
        });
    }),
    // find text node named "settings" and load
    _d.load = () => __awaiter(void 0, void 0, void 0, function* () {
        const settingsFrame = figma.currentPage.findChild((node) => node.type === 'FRAME' && node.name === 'f2h-settings');
        const settingsNode = settingsFrame.children[0];
        if (!!(settingsNode === null || settingsNode === void 0 ? void 0 : settingsNode.characters)) {
            const config = jsYaml.load(settingsNode.characters);
            yield Stored.config.set(config);
        }
    }),
    _d);
class TempFrame {
    constructor() {
        this.create = () => {
            if (this.frame) {
                this.frame.remove();
                this.frame = undefined;
            }
            this.frame = figma.createFrame();
            this.frame.name = '[figma2html]';
            this.frame.clipsContent = false;
            this.frame = this.frame;
        };
        this.remove = () => {
            var _a;
            (_a = this.frame) === null || _a === void 0 ? void 0 : _a.remove();
            this.frame = undefined;
        };
    }
}
// create a temporary frame to export
const tempFrame = new TempFrame();
const getExportables = () => {
    const exportables = [];
    // get all frames with names starting with "#" or that are the variables block
    figma.currentPage.findAll((node) => {
        const isFrame = node.type === 'FRAME';
        const isTopLevel = node.parent === figma.currentPage;
        if (!(isFrame && isFrameExportable(node.name) && isTopLevel))
            return false;
        // add frame to exportables
        exportables.push({
            id: node.id,
            parentName: node.name,
            size: { w: node.width, h: node.height }
        });
        return true;
    });
    return exportables;
};
/** Create HTML file */
const getFile = (config, assets, variables) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        filename: config.name,
        output: config.output,
        data: html({ config, assets, variables })
    };
});
// TODO: clean up these declarations. values are immediately overwriten, making it hard to follow
const getAssets = (exportables, config, previewSettings) => __awaiter(void 0, void 0, void 0, function* () {
    // create a temporary frame to export
    tempFrame.create();
    let assets = [];
    for (let exportable of exportables) {
        const asset = {
            filename: `${config.imagePath}${config.imagePath.endsWith('/') ? '' : '/'}${exportable.parentName.substring(1)}`,
            format: config.format,
            size: undefined,
            data: new Uint8Array(),
            node: undefined
        };
        let originalNode = figma.getNodeById(exportable.id);
        // Convert all frames within this frame that contain text layers to groups
        let grouplessNode = originalNode.clone();
        grouplessNode.layoutMode = 'NONE';
        grouplessNode = withModificationsForText(grouplessNode);
        // Hide all text layers.
        let modifiedNode = withModificationsForExport(grouplessNode, config);
        if (tempFrame.frame) {
            tempFrame.frame.appendChild(grouplessNode);
            tempFrame.frame.appendChild(modifiedNode);
        }
        asset.node = grouplessNode;
        // asset.node = originalNode;
        // generate image data
        const baseExportConfig = {
            format: config.format,
            scale: config.scale,
            srcSize: exportable.size
        };
        const { destSize } = createSettingsBlock(baseExportConfig);
        asset.size = destSize;
        const { settings } = createSettingsBlock(previewSettings.isFinal
            ? baseExportConfig
            : {
                format: 'JPG',
                scale: '1',
                srcSize: previewSettings.thumbSize
            });
        try {
            /**
             * @see {@link https://www.figma.com/plugin-docs/api/properties/nodes-exportasync/|.exportAsync()}
             */
            asset.data = yield modifiedNode.exportAsync(settings);
        }
        catch (exportable) {
            log(exportable);
        }
        assets.push(asset);
    }
    // tempFrame.remove();
    return assets;
});
// TODO: can this function be folded into getAssets?
const withModificationsForText = (node) => {
    // find all frame nodes within the frame
    const frameNodes = node.findAllWithCriteria({ types: ['FRAME'] });
    // find all frame nodes within the frame that contain text layers
    frameNodes.filter((node) => {
        return node.findAllWithCriteria({ types: ['TEXT'] }).length > 0;
    });
    // // find all frame nodes within the frame with a child node of type TEXT
    // const allTextNodes = allNodes.filter((node) =>
    // 	node.children.find((child) => child.type === 'TEXT')
    // );
    // convert all frames to groups for positioning
    createGroupsFromFrames(frameNodes);
    return node;
};
const withModificationsForExport = (node, config) => {
    const textNodes = node.findAllWithCriteria({ types: ['TEXT'] });
    // fade all text layers if testingMode is true
    if (config.testingMode)
        for (let node of textNodes)
            node.opacity = 0.5;
    // hide all text layers if testingMode is false
    else
        for (let node of textNodes)
            node.visible = false;
    return node;
};
// Inspired by Naftali Beder https://github.com/naftalibeder/figma-frame-exporter
const thumbSize = { w: 32, h: 32 };
const refreshPreview = (config, variables) => __awaiter(void 0, void 0, void 0, function* () {
    const exportables = getExportables();
    if (!config) {
        figma.ui.postMessage({
            type: 'preview',
            preview: { total: 0, assets: [], file: undefined },
            loading: false
        });
        figma.ui.postMessage({ type: 'error', message: 'No config found' });
        return;
    }
    const assets = yield getAssets(exportables, config, { isFinal: false, thumbSize });
    const file = yield getFile(config, assets, variables);
    tempFrame.remove();
    figma.ui.postMessage({
        type: 'preview',
        preview: { total: exportables.length, assets, file },
        loading: false
    });
});
const generateExport = (config, variables) => __awaiter(void 0, void 0, void 0, function* () {
    const exportables = getExportables();
    const assets = yield getAssets(exportables, config, { isFinal: true });
    const file = yield getFile(config, assets, variables);
    tempFrame.remove();
    figma.ui.postMessage({ type: 'export', assets, file });
    return;
});
// Handle various messages
figma.ui.onmessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    let config;
    let variables;
    let panels;
    let size;
    switch (message.type) {
        case 'init':
            figma.ui.postMessage({ type: 'loading', loading: true });
            size = yield Stored.size.get();
            figma.ui.resize(size.w, size.h);
            config = yield Stored.config.get();
            Stored.config.write(config);
            variables = yield Stored.variables.get();
            panels = yield Stored.panels.get();
            log('Loaded stored config');
            log('Loaded stored variables');
            figma.ui.postMessage({ type: 'load', config, variables, panels });
            yield refreshPreview(config, variables);
            break;
        case 'panel':
            if (message.panels)
                panels = yield Stored.panels.set(message.panels);
            break;
        case 'resize':
            if (message.size)
                size = yield Stored.size.set(message.size);
            figma.ui.resize(size.w, size.h);
            break;
        case 'config':
            figma.ui.postMessage({ type: 'loading', loading: true });
            config = yield Stored.config.set(message.config);
            variables = yield Stored.variables.get();
            if (message.panels)
                panels = yield Stored.panels.set(message.panels);
            yield refreshPreview(config, variables);
            break;
        case 'export':
            variables = yield Stored.variables.get();
            yield generateExport(message.config, variables);
            break;
        case 'reset-settings':
            yield Stored.config.clear();
            yield Stored.size.clear();
            yield Stored.panels.clear();
            config = yield Stored.config.get();
            variables = yield Stored.variables.get();
            panels = yield Stored.panels.get();
            size = yield Stored.size.get();
            figma.ui.resize(size.w, size.h);
            figma.ui.postMessage({ type: 'load-settings', config, variables, panels, size });
            yield refreshPreview(config, variables);
            break;
        case 'save-settings':
            config = yield Stored.config.get();
            yield Stored.config.write(config);
            log('Writing stored config');
            break;
        case 'load-settings':
            yield Stored.config.load();
            config = yield Stored.config.get();
            variables = yield Stored.variables.get();
            panels = yield Stored.panels.get();
            log('Loaded stored config');
            figma.ui.postMessage({ type: 'load-settings', config, variables, panels });
            yield refreshPreview(config, variables);
            break;
        case 'write-variables':
            yield Stored.variables.write();
            log('Writing example variables');
            break;
    }
});
figma.on('close', () => {
    tempFrame.remove();
    log('closed');
    return;
});
