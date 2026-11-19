// @bun
// ../node_modules/zod/v4/core/core.js
var _a;
function $constructor(name, initializer, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: new Set
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer(inst, def);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0;i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a;
    const inst = params?.Parent ? new Definition : this;
    init(inst, def);
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $brand = Symbol("zod_brand");

class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}

class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// ../node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object, key, getter) {
  let value = undefined;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return;
      }
      if (value === undefined) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: true
  });
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === undefined)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function merge(a, b) {
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const def = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class, schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function required(Class, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone(schema, def);
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}

// ../node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error, path = []) => {
    for (const issue of error.issues) {
      if (issue.code === "invalid_union" && issue.errors.length) {
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      } else if (issue.code === "invalid_key") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else if (issue.code === "invalid_element") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else {
        const fullpath = [...path, ...issue.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}

// ../node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
// ../node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const time = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// ../node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr) {
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr) {
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    var _a;
    (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = new Set);
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// ../node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join(`
`));
  }
}

// ../node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 4,
  patch: 3
};

// ../node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError;
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary) => {
            return handleCanaryResult(canary, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: (value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
});
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === undefined)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def.normalize && def.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def.abort
          });
          return;
        }
      }
      const url = new URL(trimmed);
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.normalize) {
        payload.value = url.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error;
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error;
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error;
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error;
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = inst._zod.bag.pattern ?? number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : undefined : undefined;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null;
  inst._zod.values = new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0;i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
  const isPresent = key in input;
  if (result.issues.length) {
    if (isOptionalIn && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && !isOptionalIn) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: undefined,
        path: [key]
      });
    }
    return;
  }
  if (result.value === undefined) {
    if (isPresent) {
      final.value[key] = undefined;
    }
  } else {
    final.value[key] = result.value;
  }
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k of keys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const isOptionalIn = _catchall.optin === "optional";
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (key === "__proto__")
      continue;
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
    } else {
      handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  if (!desc?.get) {
    const sh = def.shape;
    Object.defineProperty(def, "shape", {
      get: () => {
        const newSh = { ...sh };
        Object.defineProperty(def, "shape", {
          value: newSh
        });
        return newSh;
      }
    });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = new Set);
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const isOptionalIn = el._zod.optin === "optional";
      const isOptionalOut = el._zod.optout === "optional";
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const generateFastpass = (shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = (key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc.write(`const input = payload.value;`);
    const ids = Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {};`);
    for (const key of normalized.keys) {
      const id = ids[key];
      const k = esc(key);
      const schema = shape[key];
      const isOptionalIn = schema?._zod?.optin === "optional";
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(key)};`);
      if (isOptionalIn && isOptionalOut) {
        doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results, payload, inst, ctx);
    });
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left, right]) => {
        return handleIntersectionResults(payload, left, right);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = new Map;
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values) {
      payload.value = {};
      const recordKeys = new Set;
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result) => {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[outKey] = result.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result) => {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[keyResult.value] = result.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[keyResult.value] = result.value;
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  if (def.values.length === 0) {
    throw new Error("Cannot create literal schema with no valid values");
  }
  const values = new Set(def.values);
  inst._zod.values = values;
  inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output) => {
        payload.value = output;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError;
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === undefined && (result.issues.length || result.fallback)) {
    return { issues: [], value: undefined };
  }
  return result;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === undefined) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleDefaultResult(result, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleNonOptionalResult(result, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => {
        payload.value = result.value;
        if (result.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right) => handlePipeResult(right, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left) => handlePipeResult(left, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r) => handleRefineResult(r, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
// ../node_modules/zod/v4/core/registries.js
var _a2;
var $output = Symbol("ZodOutput");
var $input = Symbol("ZodInput");

class $ZodRegistry {
  constructor() {
    this._map = new WeakMap;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new WeakMap;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// ../node_modules/zod/v4/core/api.js
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _emoji2(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class, params) {
  return new Class({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _null2(Class, params) {
  return new Class({
    type: "null",
    ...normalizeParams(params)
  });
}
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
  return _overwrite((input) => slugify(input));
}
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
function _superRefine(fn, params) {
  const ch = _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
// ../node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: new Map,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? undefined
  };
}
function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta)
    Object.assign(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = new Map;
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema = seen.schema;
    for (const key in schema) {
      delete schema[key];
    }
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema = seen.def ?? seen.schema;
    const _cached = { ...schema };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema.allOf = schema.allOf ?? [];
        schema.allOf.push(refSchema);
      } else {
        Object.assign(schema, refSchema);
      }
      Object.assign(schema, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {}
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== undefined && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) {} else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
// ../node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
};
var stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time") {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json.type = "integer";
  else
    json.type = "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json.maximum = maximum;
  }
  if (typeof multipleOf === "number")
    json.multipleOf = multipleOf;
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var nullProcessor = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0") {
    json.type = "string";
    json.nullable = true;
    json.enum = [null];
  } else {
    json.type = "null";
  }
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {};
var enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var literalProcessor = (schema, ctx, json, _params) => {
  const def = schema._zod.def;
  const vals = [];
  for (const val of def.values) {
    if (val === undefined) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {} else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
};
var transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = process(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
var objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  json.properties = {};
  const shape = def.shape;
  for (const key in shape) {
    json.properties[key] = process(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v = def.shape[key]._zod;
    if (ctx.io === "input") {
      return v.optin === undefined;
    } else {
      return v.optout === undefined;
    }
  }));
  if (requiredKeys.size > 0) {
    json.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = process(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = process(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
};
var recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      json.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = process(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json.additionalProperties = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues;
    }
  }
};
var nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(undefined);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  process(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
// ../node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// ../node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
    },
    addIssue: {
      value: (issue) => {
        inst.issues.push(issue);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    addIssues: {
      value: (issues) => {
        inst.issues.push(...issues);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, {
  Parent: Error
});

// ../node_modules/zod/v4/classic/parse.js
var parse3 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// ../node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap;
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = new Set;
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.parse = (data, params) => parse3(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse2(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode(inst, data, params);
  inst.decode = (data, params) => decode(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def = this.def;
      return this.clone(mergeDefs(def, {
        checks: [
          ...def.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def, params) {
      return clone(this, def, params);
    },
    brand() {
      return this;
    },
    register(reg, meta) {
      reg.add(this, meta);
      return this;
    },
    refine(check, params) {
      return this.check(refine(check, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(_overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args) {
      if (args.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(undefined).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args) {
      return this.check(_regex(...args));
    },
    includes(...args) {
      return this.check(_includes(...args));
    },
    startsWith(...args) {
      return this.check(_startsWith(...args));
    },
    endsWith(...args) {
      return this.check(_endsWith(...args));
    },
    min(...args) {
      return this.check(_minLength(...args));
    },
    max(...args) {
      return this.check(_maxLength(...args));
    },
    length(...args) {
      return this.check(_length(...args));
    },
    nonempty(...args) {
      return this.check(_minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args) {
      return this.check(_normalize(...args));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  });
});
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(_email(ZodEmail, params));
  inst.url = (params) => inst.check(_url(ZodURL, params));
  inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(_xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(_e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime2(params));
  inst.date = (params) => inst.check(date2(params));
  inst.time = (params) => inst.check(time2(params));
  inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
  _installLazyMethods(inst, "ZodNumber", {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  });
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
  inst.element = def.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(_minLength(n, params));
    },
    nonempty(params) {
      return this.check(_minLength(1, params));
    },
    max(n, params) {
      return this.check(_maxLength(n, params));
    },
    length(n, params) {
      return this.check(_length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
  defineLazy(inst, "shape", () => {
    return def.shape;
  });
  _installLazyMethods(inst, "ZodObject", {
    keyof() {
      return _enum(Object.keys(this._zod.def.shape));
    },
    catchall(catchall) {
      return this.clone({ ...this._zod.def, catchall });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: never() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: undefined });
    },
    extend(incoming) {
      return extend(this, incoming);
    },
    safeExtend(incoming) {
      return safeExtend(this, incoming);
    },
    merge(other) {
      return merge(this, other);
    },
    pick(mask) {
      return pick(this, mask);
    },
    omit(mask) {
      return omit(this, mask);
    },
    partial(...args) {
      return partial(ZodOptional, this, args[0]);
    },
    required(...args) {
      return required(ZodNonOptional, this, args[0]);
    }
  });
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output) => {
        payload.value = output;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
// ../node_modules/@hatch/space-sdk/dist/server-contract.js
var PRIVILEGED_CONTRACT_BRAND = "@hatch/space-sdk/privileged-contract/v1";
function definePrivilegedContracts(specs) {
  const contracts = {};
  for (const [name, spec] of Object.entries(specs)) {
    contracts[name] = {
      __brand: PRIVILEGED_CONTRACT_BRAND,
      name,
      request: spec.request,
      response: spec.response,
      ...spec.capabilities !== undefined ? { capabilities: spec.capabilities } : {},
      ...spec.timeoutMs !== undefined ? { timeoutMs: spec.timeoutMs } : {}
    };
  }
  return contracts;
}
var ACTION_BRAND = "@hatch/space-sdk/action/v1";
var LEGACY_ACTION_BRAND = Symbol.for("@hatch/space-sdk/action");
function createDefineAction() {
  return function defineAction(spec) {
    return {
      __brand: ACTION_BRAND,
      request: spec.request,
      response: spec.response,
      ...spec.description !== undefined ? { description: spec.description } : {},
      ...spec.privileged !== undefined ? { privileged: spec.privileged } : {},
      handler: spec.handler
    };
  };
}
// ../node_modules/@hatch/space-sdk/dist/index.js
var defineAction = createDefineAction();

// .generated/privileged.contract.ts
var privileged = definePrivilegedContracts({
  readGameData: {
    request: object({}),
    response: object({ json: string2() })
  },
  readManifest: {
    request: object({}),
    response: object({ json: string2() })
  },
  readClipsBatch: {
    request: object({ ids: array(string2().min(1).max(80)).max(100) }),
    response: object({
      clips: array(object({ id: string2(), base64: string2() })),
      missing: array(string2())
    })
  },
  readClipSizes: {
    request: object({ ids: array(string2().min(1).max(80)).max(500) }),
    response: object({
      sizes: array(object({ id: string2(), size: number2() })),
      missing: array(string2())
    })
  },
  readArtBatch: {
    request: object({ ids: array(string2().min(1).max(80)).max(20) }),
    response: object({
      art: array(object({ id: string2(), base64: string2() })),
      missing: array(string2())
    })
  },
  readArtSizes: {
    request: object({ ids: array(string2().min(1).max(80)).max(500) }),
    response: object({
      sizes: array(object({ id: string2(), size: number2() })),
      missing: array(string2())
    })
  },
  listArtIds: {
    request: object({}),
    response: object({ ids: array(string2()) })
  },
  readVideoBatch: {
    request: object({ ids: array(string2().min(1).max(80)).max(5) }),
    response: object({
      videos: array(object({ id: string2(), base64: string2() })),
      missing: array(string2())
    })
  },
  pgMode: {
    request: object({}),
    response: object({ external: boolean2() })
  },
  pgQuery: {
    request: object({
      sql: string2().min(1).max(20000),
      params: array(union([string2(), number2(), boolean2(), _null3()])).max(64)
    }),
    response: object({ rows: array(record(string2(), unknown())) })
  }
});

// ../node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}

// ../node_modules/drizzle-orm/column.js
class Column {
  constructor(table, config) {
    this.table = table;
    this.config = config;
    this.name = config.name;
    this.keyAsName = config.keyAsName;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType;
    this.columnType = config.columnType;
    this.generated = config.generated;
    this.generatedIdentity = config.generatedIdentity;
  }
  static [entityKind] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = undefined;
  generated = undefined;
  generatedIdentity = undefined;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  shouldDisableInsert() {
    return this.config.generated !== undefined && this.config.generated.type !== "byDefault";
  }
}

// ../node_modules/drizzle-orm/column-builder.js
class ColumnBuilder {
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: undefined,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: undefined,
      uniqueType: undefined,
      dataType,
      columnType,
      generated: undefined
    };
  }
  $type() {
    return this;
  }
  notNull() {
    this.config.notNull = true;
    return this;
  }
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  $default = this.$defaultFn;
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  $onUpdate = this.$onUpdateFn;
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  setName(name) {
    if (this.config.name !== "")
      return;
    this.config.name = name;
  }
}

// ../node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");

// ../node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}

// ../node_modules/drizzle-orm/pg-core/columns/enum.js
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}

// ../node_modules/drizzle-orm/subquery.js
class Subquery {
  static [entityKind] = "Subquery";
  constructor(sql, fields, alias, isWith = false, usedTables = []) {
    this._ = {
      brand: "Subquery",
      sql,
      selectedFields: fields,
      alias,
      isWith,
      usedTables
    };
  }
}

// ../node_modules/drizzle-orm/version.js
var version2 = "0.45.2";

// ../node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version2);
    }
    return iife((otel2, rawTracer2) => rawTracer2.startActiveSpan(name, (span) => {
      try {
        return fn(span);
      } catch (e) {
        span.setStatus({
          code: otel2.SpanStatusCode.ERROR,
          message: e instanceof Error ? e.message : "Unknown error"
        });
        throw e;
      } finally {
        span.end();
      }
    }), otel, rawTracer);
  }
};

// ../node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// ../node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");

class Table {
  static [entityKind] = "Table";
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  [TableName];
  [OriginalName];
  [Schema];
  [Columns];
  [ExtraConfigColumns];
  [BaseName];
  [IsAlias] = false;
  [IsDrizzleTable] = true;
  [ExtraConfigBuilder] = undefined;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
}

// ../node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
  return value !== null && value !== undefined && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}

class StringChunk {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
}

class SQL {
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
    for (const chunk of queryChunks) {
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        this.usedTables.push(schemaName === undefined ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]);
      }
    }
  }
  static [entityKind] = "SQL";
  decoder = noopDecoder;
  shouldInlineParams = false;
  usedTables = [];
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === undefined) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is(chunk, SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === undefined || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === undefined ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === undefined || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== undefined) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === undefined) {
      return this;
    }
    return new SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  if(condition) {
    return condition ? this : undefined;
  }
}

class Name {
  constructor(value) {
    this.value = value;
  }
  static [entityKind] = "Name";
  brand;
  getSQL() {
    return new SQL([this]);
  }
}
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};

class Param {
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  static [entityKind] = "Param";
  brand;
  getSQL() {
    return new SQL([this]);
  }
}
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  sql2.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== undefined) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {

  class Aliased {
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));

class Placeholder {
  constructor(name2) {
    this.name = name2;
  }
  static [entityKind] = "Placeholder";
  getSQL() {
    return new SQL([this]);
  }
}
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");

class View {
  static [entityKind] = "View";
  [ViewBaseConfig];
  [IsDrizzleView] = true;
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
}
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// ../node_modules/drizzle-orm/utils.js
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder;

// ../node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
var eq = (left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
};

// ../node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}

// ../node_modules/drizzle-orm/sqlite-core/foreign-keys.js
class ForeignKeyBuilder {
  static [entityKind] = "SQLiteForeignKeyBuilder";
  reference;
  _onUpdate;
  _onDelete;
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  build(table) {
    return new ForeignKey(table, this);
  }
}

class ForeignKey {
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "SQLiteForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
}

// ../node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}

// ../node_modules/drizzle-orm/sqlite-core/columns/common.js
class SQLiteColumnBuilder extends ColumnBuilder {
  static [entityKind] = "SQLiteColumnBuilder";
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  generatedAlwaysAs(as, config) {
    this.config.generated = {
      as,
      type: "always",
      mode: config?.mode ?? "virtual"
    };
    return this;
  }
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
}

class SQLiteColumn extends Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entityKind] = "SQLiteColumn";
}

// ../node_modules/drizzle-orm/sqlite-core/columns/blob.js
class SQLiteBigIntBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteBigInt");
  }
  build(table) {
    return new SQLiteBigInt(table, this.config);
  }
}

class SQLiteBigInt extends SQLiteColumn {
  static [entityKind] = "SQLiteBigInt";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return BigInt(buf.toString("utf8"));
    }
    return BigInt(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(value.toString());
  }
}

class SQLiteBlobJsonBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBlobJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteBlobJson");
  }
  build(table) {
    return new SQLiteBlobJson(table, this.config);
  }
}

class SQLiteBlobJson extends SQLiteColumn {
  static [entityKind] = "SQLiteBlobJson";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return JSON.parse(buf.toString("utf8"));
    }
    return JSON.parse(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(JSON.stringify(value));
  }
}

class SQLiteBlobBufferBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBlobBufferBuilder";
  constructor(name) {
    super(name, "buffer", "SQLiteBlobBuffer");
  }
  build(table) {
    return new SQLiteBlobBuffer(table, this.config);
  }
}

class SQLiteBlobBuffer extends SQLiteColumn {
  static [entityKind] = "SQLiteBlobBuffer";
  mapFromDriverValue(value) {
    if (Buffer.isBuffer(value)) {
      return value;
    }
    return Buffer.from(value);
  }
  getSQLType() {
    return "blob";
  }
}
function blob(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}

// ../node_modules/drizzle-orm/sqlite-core/columns/custom.js
class SQLiteCustomColumnBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "SQLiteCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  build(table) {
    return new SQLiteCustomColumn(table, this.config);
  }
}

class SQLiteCustomColumn extends SQLiteColumn {
  static [entityKind] = "SQLiteCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
}
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SQLiteCustomColumnBuilder(name, config, customTypeParams);
  };
}

// ../node_modules/drizzle-orm/sqlite-core/columns/integer.js
class SQLiteBaseIntegerBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBaseIntegerBuilder";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config) {
    if (config?.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
}

class SQLiteBaseInteger extends SQLiteColumn {
  static [entityKind] = "SQLiteBaseInteger";
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
}

class SQLiteIntegerBuilder extends SQLiteBaseIntegerBuilder {
  static [entityKind] = "SQLiteIntegerBuilder";
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table) {
    return new SQLiteInteger(table, this.config);
  }
}

class SQLiteInteger extends SQLiteBaseInteger {
  static [entityKind] = "SQLiteInteger";
}

class SQLiteTimestampBuilder extends SQLiteBaseIntegerBuilder {
  static [entityKind] = "SQLiteTimestampBuilder";
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  defaultNow() {
    return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table) {
    return new SQLiteTimestamp(table, this.config);
  }
}

class SQLiteTimestamp extends SQLiteBaseInteger {
  static [entityKind] = "SQLiteTimestamp";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1000);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1000);
    }
    return unix;
  }
}

class SQLiteBooleanBuilder extends SQLiteBaseIntegerBuilder {
  static [entityKind] = "SQLiteBooleanBuilder";
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table) {
    return new SQLiteBoolean(table, this.config);
  }
}

class SQLiteBoolean extends SQLiteBaseInteger {
  static [entityKind] = "SQLiteBoolean";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
}
function integer2(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config.mode);
  }
  if (config?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config.mode);
  }
  return new SQLiteIntegerBuilder(name);
}

// ../node_modules/drizzle-orm/sqlite-core/columns/numeric.js
class SQLiteNumericBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteNumericBuilder";
  constructor(name) {
    super(name, "string", "SQLiteNumeric");
  }
  build(table) {
    return new SQLiteNumeric(table, this.config);
  }
}

class SQLiteNumeric extends SQLiteColumn {
  static [entityKind] = "SQLiteNumeric";
  mapFromDriverValue(value) {
    if (typeof value === "string")
      return value;
    return String(value);
  }
  getSQLType() {
    return "numeric";
  }
}

class SQLiteNumericNumberBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteNumericNumberBuilder";
  constructor(name) {
    super(name, "number", "SQLiteNumericNumber");
  }
  build(table) {
    return new SQLiteNumericNumber(table, this.config);
  }
}

class SQLiteNumericNumber extends SQLiteColumn {
  static [entityKind] = "SQLiteNumericNumber";
  mapFromDriverValue(value) {
    if (typeof value === "number")
      return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
}

class SQLiteNumericBigIntBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteNumericBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteNumericBigInt");
  }
  build(table) {
    return new SQLiteNumericBigInt(table, this.config);
  }
}

class SQLiteNumericBigInt extends SQLiteColumn {
  static [entityKind] = "SQLiteNumericBigInt";
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
}
function numeric(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}

// ../node_modules/drizzle-orm/sqlite-core/columns/real.js
class SQLiteRealBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteRealBuilder";
  constructor(name) {
    super(name, "number", "SQLiteReal");
  }
  build(table) {
    return new SQLiteReal(table, this.config);
  }
}

class SQLiteReal extends SQLiteColumn {
  static [entityKind] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
}
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}

// ../node_modules/drizzle-orm/sqlite-core/columns/text.js
class SQLiteTextBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteTextBuilder";
  constructor(name, config) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config.enum;
    this.config.length = config.length;
  }
  build(table) {
    return new SQLiteText(table, this.config);
  }
}

class SQLiteText extends SQLiteColumn {
  static [entityKind] = "SQLiteText";
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}

class SQLiteTextJsonBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteTextJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  build(table) {
    return new SQLiteTextJson(table, this.config);
  }
}

class SQLiteTextJson extends SQLiteColumn {
  static [entityKind] = "SQLiteTextJson";
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
}
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config);
}

// ../node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer: integer2,
    numeric,
    real,
    text
  };
}

// ../node_modules/drizzle-orm/sqlite-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");

class SQLiteTable extends Table {
  static [entityKind] = "SQLiteTable";
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys
  });
  [Table.Symbol.Columns];
  [InlineForeignKeys] = [];
  [Table.Symbol.ExtraConfigBuilder] = undefined;
}
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
    const colBuilder = colBuilderBase;
    colBuilder.setName(name2);
    const column = colBuilder.build(rawTable);
    rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
    return [name2, column];
  }));
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
var sqliteTable = (name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
};

// src/schema.ts
var entries = sqliteTable("entries", {
  id: integer2("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  createdAt: integer2("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date)
});
var students = sqliteTable("students", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  groupName: text("group_name").notNull().default(""),
  badgeColor: text("badge_color").notNull().default("#C1272D"),
  secretPicture: text("secret_picture").notNull().default(""),
  radioLeo: integer2("radio_leo").notNull().default(0),
  stateJson: text("state_json").notNull().default("{}"),
  updatedAt: integer2("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date)
});
var assignments = sqliteTable("assignments", {
  id: integer2("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  targetType: text("target_type", { enum: ["class", "group", "student"] }).notNull(),
  targetId: text("target_id").notNull().default(""),
  section: text("section").notNull(),
  skillId: text("skill_id").notNull().default(""),
  stdCode: text("std_code").notNull().default(""),
  grade: text("grade").notNull().default(""),
  windowStart: text("window_start").notNull(),
  windowEnd: text("window_end").notNull(),
  createdAt: integer2("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date)
});
var meta2 = sqliteTable("meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default("")
});
var recordings = sqliteTable("recordings", {
  id: integer2("id").primaryKey({ autoIncrement: true }),
  studentId: text("student_id").notNull().default(""),
  kind: text("kind", { enum: ["reading", "voice"] }).notNull(),
  refId: text("ref_id").notNull().default(""),
  blobKey: text("blob_key").notNull(),
  createdAt: integer2("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date)
});

// src/store.ts
class LocalStore {
  ctx;
  external = false;
  constructor(ctx) {
    this.ctx = ctx;
  }
  db() {
    return this.ctx.db();
  }
  async metaGet(key) {
    const rows = await this.db().select().from(meta2).where(eq(meta2.key, key));
    return rows[0]?.value;
  }
  async metaAll() {
    return this.db().select().from(meta2);
  }
  async metaSet(key, value) {
    await this.db().insert(meta2).values({ key, value }).onConflictDoUpdate({ target: meta2.key, set: { value } });
  }
  async metaDelete(key) {
    await this.db().delete(meta2).where(eq(meta2.key, key));
  }
  async studentsAll() {
    return this.db().select().from(students);
  }
  async studentsByName() {
    return this.db().select().from(students).orderBy(asc(students.name));
  }
  async studentsAny() {
    const rows = await this.db().select({ id: students.id }).from(students).limit(1);
    return rows.length > 0;
  }
  async studentById(id) {
    const rows = await this.db().select().from(students).where(eq(students.id, id));
    return rows[0];
  }
  async studentExists(id) {
    const rows = await this.db().select({ id: students.id }).from(students).where(eq(students.id, id));
    return rows.length > 0;
  }
  async studentInsert(row) {
    await this.db().insert(students).values(row);
  }
  async studentUpdateState(id, stateJson) {
    await this.db().update(students).set({ stateJson, updatedAt: new Date }).where(eq(students.id, id));
  }
  async studentUpdateName(id, name) {
    await this.db().update(students).set({ name }).where(eq(students.id, id));
  }
  async studentUpdateSecretPicture(id, pictureId) {
    await this.db().update(students).set({ secretPicture: pictureId }).where(eq(students.id, id));
  }
  async studentUpdateRadioLeo(id, enabled) {
    await this.db().update(students).set({ radioLeo: enabled ? 1 : 0 }).where(eq(students.id, id));
  }
  async studentDelete(id) {
    await this.db().delete(students).where(eq(students.id, id));
  }
  async assignmentsAll() {
    return this.db().select().from(assignments).orderBy(asc(assignments.id));
  }
  async assignmentInsert(row) {
    const result = await this.db().insert(assignments).values(row).returning({ id: assignments.id });
    const inserted = result[0];
    if (!inserted)
      throw new Error("assignmentInsert: no row returned");
    return inserted.id;
  }
  async assignmentDelete(id) {
    await this.db().delete(assignments).where(eq(assignments.id, id));
  }
  async assignmentsDeleteByTarget(targetId) {
    await this.db().delete(assignments).where(eq(assignments.targetId, targetId));
  }
  async recordingsList(kind) {
    return kind ? this.db().select().from(recordings).where(eq(recordings.kind, kind)).orderBy(desc(recordings.id)) : this.db().select().from(recordings).orderBy(desc(recordings.id));
  }
  async recordingsByStudent(studentId) {
    return this.db().select().from(recordings).where(eq(recordings.studentId, studentId));
  }
  async recordingInsert(row) {
    await this.db().insert(recordings).values(row);
  }
  async recordingDelete(id) {
    await this.db().delete(recordings).where(eq(recordings.id, id));
  }
  async recordingsDeleteByStudent(studentId) {
    await this.db().delete(recordings).where(eq(recordings.studentId, studentId));
  }
  async recordingData() {
    return null;
  }
}
function pgNum(v) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}
function pgStr(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}
function pgStudent(r) {
  return {
    id: pgStr(r.id),
    name: pgStr(r.name),
    groupName: pgStr(r.group_name),
    badgeColor: pgStr(r.badge_color),
    secretPicture: pgStr(r.secret_picture),
    radioLeo: pgNum(r.radio_leo),
    stateJson: pgStr(r.state_json),
    updatedAt: new Date(pgNum(r.updated_at))
  };
}
function pgAssignment(r) {
  return {
    id: pgNum(r.id),
    title: pgStr(r.title),
    targetType: pgStr(r.target_type),
    targetId: pgStr(r.target_id),
    section: pgStr(r.section),
    skillId: pgStr(r.skill_id),
    stdCode: pgStr(r.std_code),
    grade: pgStr(r.grade),
    windowStart: pgStr(r.window_start),
    windowEnd: pgStr(r.window_end),
    createdAt: new Date(pgNum(r.created_at))
  };
}
function pgRecording(r) {
  return {
    id: pgNum(r.id),
    studentId: pgStr(r.student_id),
    kind: pgStr(r.kind),
    refId: pgStr(r.ref_id),
    blobKey: pgStr(r.blob_key),
    createdAt: new Date(pgNum(r.created_at))
  };
}
var STUDENT_COLS = "id, name, group_name, badge_color, secret_picture, radio_leo, state_json, updated_at";
var ASSIGNMENT_COLS = "id::int AS id, title, target_type, target_id, section, skill_id, std_code, grade, window_start, window_end, created_at";
var RECORDING_COLS = "id::int AS id, student_id, kind, ref_id, blob_key, created_at";

class PgStore {
  ctx;
  external = true;
  constructor(ctx) {
    this.ctx = ctx;
  }
  async q(sqlText, params = []) {
    const { rows } = await this.ctx.executePrivileged(privileged.pgQuery, { sql: sqlText, params });
    return rows;
  }
  async metaGet(key) {
    const rows = await this.q("SELECT value FROM meta WHERE key = $1", [key]);
    const v = rows[0]?.value;
    return typeof v === "string" ? v : undefined;
  }
  async metaAll() {
    const rows = await this.q("SELECT key, value FROM meta");
    return rows.map((r) => ({ key: pgStr(r.key), value: pgStr(r.value) }));
  }
  async metaSet(key, value) {
    await this.q("INSERT INTO meta (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [key, value]);
  }
  async metaDelete(key) {
    await this.q("DELETE FROM meta WHERE key = $1", [key]);
  }
  async studentsAll() {
    const rows = await this.q(`SELECT ${STUDENT_COLS} FROM students`);
    return rows.map(pgStudent);
  }
  async studentsByName() {
    const rows = await this.q(`SELECT ${STUDENT_COLS} FROM students ORDER BY name COLLATE "C" ASC`);
    return rows.map(pgStudent);
  }
  async studentsAny() {
    const rows = await this.q("SELECT id FROM students LIMIT 1");
    return rows.length > 0;
  }
  async studentById(id) {
    const rows = await this.q(`SELECT ${STUDENT_COLS} FROM students WHERE id = $1`, [id]);
    return rows[0] ? pgStudent(rows[0]) : undefined;
  }
  async studentExists(id) {
    const rows = await this.q("SELECT id FROM students WHERE id = $1", [id]);
    return rows.length > 0;
  }
  async studentInsert(row) {
    await this.q("INSERT INTO students (id, name, group_name, badge_color, secret_picture, radio_leo, state_json, updated_at) VALUES ($1, $2, $3, $4, '', 0, $5, $6)", [row.id, row.name, row.groupName, row.badgeColor, row.stateJson, Date.now()]);
  }
  async studentUpdateState(id, stateJson) {
    await this.q("UPDATE students SET state_json = $1, updated_at = $2 WHERE id = $3", [stateJson, Date.now(), id]);
  }
  async studentUpdateName(id, name) {
    await this.q("UPDATE students SET name = $1 WHERE id = $2", [name, id]);
  }
  async studentUpdateSecretPicture(id, pictureId) {
    await this.q("UPDATE students SET secret_picture = $1 WHERE id = $2", [pictureId, id]);
  }
  async studentUpdateRadioLeo(id, enabled) {
    await this.q("UPDATE students SET radio_leo = $1 WHERE id = $2", [enabled ? 1 : 0, id]);
  }
  async studentDelete(id) {
    await this.q("DELETE FROM students WHERE id = $1", [id]);
  }
  async assignmentsAll() {
    const rows = await this.q(`SELECT ${ASSIGNMENT_COLS} FROM assignments ORDER BY id ASC`);
    return rows.map(pgAssignment);
  }
  async assignmentInsert(row) {
    const rows = await this.q("INSERT INTO assignments (title, target_type, target_id, section, skill_id, std_code, grade, window_start, window_end, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id::int AS id", [row.title, row.targetType, row.targetId, row.section, row.skillId, row.stdCode, row.grade, row.windowStart, row.windowEnd, Date.now()]);
    const id = rows[0]?.id;
    if (id === undefined)
      throw new Error("assignmentInsert: no row returned");
    return pgNum(id);
  }
  async assignmentDelete(id) {
    await this.q("DELETE FROM assignments WHERE id = $1", [id]);
  }
  async assignmentsDeleteByTarget(targetId) {
    await this.q("DELETE FROM assignments WHERE target_id = $1", [targetId]);
  }
  async recordingsList(kind) {
    const rows = kind ? await this.q(`SELECT ${RECORDING_COLS} FROM recordings WHERE kind = $1 ORDER BY id DESC`, [kind]) : await this.q(`SELECT ${RECORDING_COLS} FROM recordings ORDER BY id DESC`);
    return rows.map(pgRecording);
  }
  async recordingsByStudent(studentId) {
    const rows = await this.q(`SELECT ${RECORDING_COLS} FROM recordings WHERE student_id = $1`, [studentId]);
    return rows.map(pgRecording);
  }
  async recordingInsert(row, data) {
    if (data) {
      await this.q("INSERT INTO recordings (student_id, kind, ref_id, blob_key, created_at, data, content_type) VALUES ($1, $2, $3, $4, $5, decode($6, 'base64'), $7)", [row.studentId, row.kind, row.refId, row.blobKey, Date.now(), data.base64, data.contentType]);
    } else {
      await this.q("INSERT INTO recordings (student_id, kind, ref_id, blob_key, created_at) VALUES ($1, $2, $3, $4, $5)", [row.studentId, row.kind, row.refId, row.blobKey, Date.now()]);
    }
  }
  async recordingDelete(id) {
    await this.q("DELETE FROM recordings WHERE id = $1", [id]);
  }
  async recordingsDeleteByStudent(studentId) {
    await this.q("DELETE FROM recordings WHERE student_id = $1", [studentId]);
  }
  async recordingData(id) {
    const rows = await this.q("SELECT encode(data, 'base64') AS data_b64, content_type FROM recordings WHERE id = $1 AND data IS NOT NULL", [id]);
    const r = rows[0];
    if (!r || typeof r.data_b64 !== "string" || r.data_b64 === "")
      return null;
    return { base64: r.data_b64, contentType: pgStr(r.content_type) };
  }
}
var externalPromise = null;
function pgExternal(ctx) {
  externalPromise ??= ctx.executePrivileged(privileged.pgMode, {}).then((r) => r.external).catch(() => false);
  return externalPromise;
}
async function getStore(ctx) {
  return await pgExternal(ctx) ? new PgStore(ctx) : new LocalStore(ctx);
}

// src/actions.ts
var CLASS_GRADES = ["K", "1", "2", "3", "4", "5"];
var CLASS_CODE_ALPHABET = "ABCDEFGHJKMNPQRTUVWXY346789";
function makeClassCode() {
  let out = "";
  for (let i = 0;i < 6; i++) {
    out += CLASS_CODE_ALPHABET[Math.floor(Math.random() * CLASS_CODE_ALPHABET.length)];
  }
  return out;
}
var GRADE_START = {
  K: { esRung: 0, enRung: 0, belt: 0 },
  "1": { esRung: 1, enRung: 1, belt: 1 },
  "2": { esRung: 3, enRung: 3, belt: 2 },
  "3": { esRung: 4, enRung: 4, belt: 3 },
  "4": { esRung: 5, enRung: 5, belt: 4 },
  "5": { esRung: 6, enRung: 6, belt: 4 }
};
function gradeStart(grade) {
  return GRADE_START[grade] ?? null;
}
async function readEventSettings(ctx) {
  const store = await getStore(ctx);
  const rows = await store.metaAll();
  const get = (k) => rows.find((r) => r.key === k)?.value === "1";
  return { preview: get("event_preview"), off: get("event_off") };
}
var RADIO_LEO_MASTER_KEY = "radio_leo_master";
async function readRadioLeoMaster(ctx) {
  const store = await getStore(ctx);
  return await store.metaGet(RADIO_LEO_MASTER_KEY) === "1";
}
async function readClassGrade(ctx) {
  const store = await getStore(ctx);
  const v = await store.metaGet("class_grade") ?? "";
  return gradeStart(v) ? v : "";
}
var TEACHER_PIN_KEY = "teacher_pin_v1";
var TEACHER_SESSIONS_KEY = "teacher_sessions_v1";
var TEACHER_FAILS_KEY = "teacher_pin_fails_v1";
var TEACHER_SESSION_MS = 12 * 60 * 60 * 1000;
function bytesToHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return bytesToHex(new Uint8Array(buf));
}
function randomHex(byteCount) {
  const arr = new Uint8Array(byteCount);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}
function safeEqualHex(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0;i < a.length; i++)
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function pinHash(salt, pin) {
  return sha256Hex(`${salt}:${pin}`);
}
function validPinFormat(pin) {
  return /^\d{4,8}$/.test(pin);
}
var TEACHER_RECOVERY_KEY = "teacher_recovery_v1";
function normalizePhrase(p) {
  return p.trim().toLowerCase().replace(/\s+/g, " ");
}
function validPhrase(p) {
  const n = normalizePhrase(p);
  return n.length >= 8 && n.split(" ").length >= 2;
}
async function readRecovery(ctx) {
  const store = await getStore(ctx);
  const raw = await store.metaGet(TEACHER_RECOVERY_KEY);
  try {
    const v = raw ? JSON.parse(raw) : null;
    return v && typeof v.salt === "string" && typeof v.hash === "string" ? v : null;
  } catch {
    return null;
  }
}
async function writeRecovery(ctx, phrase) {
  const salt = randomHex(16);
  const rec = { salt, hash: await pinHash(salt, normalizePhrase(phrase)) };
  await writeMeta(ctx, TEACHER_RECOVERY_KEY, JSON.stringify(rec));
}
async function readPinFails(ctx) {
  const store = await getStore(ctx);
  const raw = await store.metaGet(TEACHER_FAILS_KEY);
  try {
    if (raw)
      return JSON.parse(raw);
  } catch {}
  return { count: 0, lockedUntil: 0 };
}
async function notePinFail(ctx, fails, missReason) {
  const count = fails.count + 1;
  await writeMeta(ctx, TEACHER_FAILS_KEY, JSON.stringify({ count, lockedUntil: count >= 5 ? Date.now() + 5 * 60 * 1000 : 0 }));
  return count >= 5 ? "locked" : missReason;
}
async function readTeacherPin(ctx) {
  const store = await getStore(ctx);
  const raw = await store.metaGet(TEACHER_PIN_KEY);
  try {
    const v = raw ? JSON.parse(raw) : null;
    return v && typeof v.salt === "string" && typeof v.hash === "string" ? v : null;
  } catch {
    return null;
  }
}
async function writeMeta(ctx, key, value) {
  const store = await getStore(ctx);
  await store.metaSet(key, value);
}
async function ensureRecordingServed(ctx, store, row) {
  if (!store.external)
    return;
  const head = await ctx.blobs.head(row.blobKey);
  if (head)
    return;
  const data = await store.recordingData(row.id);
  if (!data)
    return;
  const bytes = Uint8Array.from(Buffer.from(data.base64, "base64"));
  await ctx.blobs.put(row.blobKey, bytes, { contentType: data.contentType || "audio/webm" });
}
var TEACHER_EMAIL_KEY = "teacher_google_email";
var TEACHER_EMAIL_FAILS_KEY = "teacher_email_fails_v1";
async function readTeacherEmail(ctx) {
  const store = await getStore(ctx);
  return (await store.metaGet(TEACHER_EMAIL_KEY) ?? "").trim().toLowerCase();
}
async function readEmailFails(ctx) {
  const store = await getStore(ctx);
  const raw = await store.metaGet(TEACHER_EMAIL_FAILS_KEY);
  try {
    if (raw)
      return JSON.parse(raw);
  } catch {}
  return { count: 0, lockedUntil: 0 };
}
async function mintTeacherSession(ctx) {
  const token = randomHex(32);
  const store = await getStore(ctx);
  const raw = await store.metaGet(TEACHER_SESSIONS_KEY);
  let sessions = [];
  try {
    sessions = raw ? JSON.parse(raw) : [];
  } catch {
    sessions = [];
  }
  const now = Date.now();
  sessions = sessions.filter((s) => s.exp > now);
  sessions.push({ h: await sha256Hex(token), exp: now + TEACHER_SESSION_MS });
  await writeMeta(ctx, TEACHER_SESSIONS_KEY, JSON.stringify(sessions.slice(-8)));
  return token;
}
async function isTeacher(ctx, token) {
  if (!token)
    return false;
  const store = await getStore(ctx);
  const raw = await store.metaGet(TEACHER_SESSIONS_KEY);
  let sessions = [];
  try {
    sessions = raw ? JSON.parse(raw) : [];
  } catch {
    sessions = [];
  }
  const h = await sha256Hex(token);
  const now = Date.now();
  return sessions.some((s) => s.exp > now && safeEqualHex(s.h, h));
}
async function requireTeacher(ctx, token) {
  if (!await isTeacher(ctx, token)) {
    throw new Error("Teacher access locked: enter the teacher PIN first.");
  }
}
var teacherTokenField = string2().max(200).optional();
function defaultState(lang, grade = "") {
  const start = gradeStart(grade);
  return {
    lang,
    gradeSeed: start ? grade : "",
    puntosTotal: 0,
    puntosBySkill: {},
    rayos: 20,
    sessionSeconds: 0,
    esRung: start ? start.esRung : 0,
    enRung: start ? start.enRung : 0,
    esFamily: 0,
    enFamily: 0,
    mastery: {},
    recent: {},
    placedEs: false,
    placedEn: false,
    belts: { math: start ? start.belt : 0, en: start ? start.belt : 0, es: start ? start.belt : 0 },
    beltWins: { math: 0, en: 0, es: 0 },
    beltDates: {},
    battlesWon: 0,
    owned: ["mask_red", "suit_red", "cape_none"],
    equipped: { mask: "mask_red", suit: "suit_red", cape: "cape_none", gear: "", trim: "" },
    cognates: [],
    eventCounts: {},
    eventBadges: [],
    seasonalWords: [],
    atrapaUnlocked: false,
    atrapaBest: 0,
    braveMarks: 0,
    braveKeys: [],
    revancha: null,
    quest: {
      forest: {
        es: { introSeen: false, panelSeen: [], clearedSeen: false },
        en: { introSeen: false, panelSeen: [], clearedSeen: false }
      },
      ring: { introSeen: false, clearedSeen: false },
      library: { introSeen: false, clearedSeen: false },
      music: { introSeen: false, clearedSeen: false },
      math: { introSeen: false, panelSeen: [], clearedSeen: false, clearedBands: [] }
    },
    shields: [],
    events: [],
    scienceDone: [],
    gardenDone: [],
    landAwards: [],
    scienceIntroSeen: false,
    gardenIntroSeen: false,
    googleEmail: "",
    companeroId: "",
    joinedViaCodeAt: "",
    sentences: [],
    lastDay: "",
    dayMisses: 0,
    dayCorrect: 0,
    dayCompleted: 0,
    fiesta: {
      playDays: [],
      streak: 0,
      bestStreak: 0,
      freezes: 0,
      questClaims: {},
      hearts: 0,
      powerShield: 1,
      powerDouble: 0,
      powerHint: 0,
      pinatas: 0,
      surpriseDays: []
    }
  };
}
var DEMO_ROSTER = [
  { id: "st-sofia", name: "Sof\xEDa", groupName: "Sol", badgeColor: "#E85D9E", lang: "es" },
  { id: "st-mateo", name: "Mateo", groupName: "Sol", badgeColor: "#0E7C7B", lang: "es" },
  { id: "st-lucia", name: "Luc\xEDa", groupName: "Sol", badgeColor: "#7C4DBC", lang: "es" },
  { id: "st-diego", name: "Diego", groupName: "Sol", badgeColor: "#2E7D32", lang: "es" },
  { id: "st-alex", name: "Alex", groupName: "Luna", badgeColor: "#1565C0", lang: "en" },
  { id: "st-mia", name: "Mia", groupName: "Luna", badgeColor: "#AD1457", lang: "en" },
  { id: "st-carlos", name: "Carlos", groupName: "Luna", badgeColor: "#EF6C00", lang: "es" },
  { id: "st-valentina", name: "Valentina", groupName: "Luna", badgeColor: "#00838F", lang: "es" }
];
async function ensureRoster(ctx) {
  const store = await getStore(ctx);
  if (await store.studentsAny())
    return;
  const grade = await readClassGrade(ctx);
  for (const s of DEMO_ROSTER) {
    await store.studentInsert({
      id: s.id,
      name: s.name,
      groupName: s.groupName,
      badgeColor: s.badgeColor,
      stateJson: JSON.stringify(defaultState(s.lang, grade))
    });
  }
}
function parseState(json, lang = "es") {
  try {
    const parsed = JSON.parse(json);
    const merged = { ...defaultState(lang), ...parsed };
    const eq = { ...defaultState(lang).equipped, ...parsed.equipped ?? {} };
    if (eq.mask === "mask_cempasuchil") {
      eq.trim = "mask_cempasuchil";
      eq.mask = "mask_red";
    }
    if (typeof eq.trim !== "string")
      eq.trim = "";
    merged.equipped = eq;
    const dq = defaultState(lang).quest;
    const pq = parsed.quest ?? {};
    const trail = (v, d) => {
      const o = v ?? {};
      return {
        introSeen: typeof o.introSeen === "boolean" ? o.introSeen : d.introSeen,
        panelSeen: Array.isArray(o.panelSeen) ? o.panelSeen : [...d.panelSeen],
        clearedSeen: typeof o.clearedSeen === "boolean" ? o.clearedSeen : d.clearedSeen
      };
    };
    const stub = (v, d) => {
      const o = v ?? {};
      return {
        introSeen: typeof o.introSeen === "boolean" ? o.introSeen : d.introSeen,
        clearedSeen: typeof o.clearedSeen === "boolean" ? o.clearedSeen : d.clearedSeen
      };
    };
    const pf = pq.forest ?? {};
    const pm = pq.math;
    merged.quest = {
      forest: { es: trail(pf.es, dq.forest.es), en: trail(pf.en, dq.forest.en) },
      ring: stub(pq.ring, dq.ring),
      library: stub(pq.library, dq.library),
      music: stub(pq.music, dq.music),
      math: {
        introSeen: typeof pm?.introSeen === "boolean" ? pm.introSeen : dq.math.introSeen,
        panelSeen: Array.isArray(pm?.panelSeen) ? pm.panelSeen : [...dq.math.panelSeen],
        clearedSeen: typeof pm?.clearedSeen === "boolean" ? pm.clearedSeen : dq.math.clearedSeen,
        clearedBands: Array.isArray(pm?.clearedBands) ? pm.clearedBands : [...dq.math.clearedBands]
      }
    };
    merged.shields = Array.isArray(parsed.shields) ? parsed.shields : [];
    merged.events = Array.isArray(parsed.events) ? parsed.events : [];
    return merged;
  } catch {
    return defaultState(lang);
  }
}
var SECRET_PICTURE_IDS = [
  "gato",
  "perro",
  "elefante",
  "leon",
  "tigre",
  "oso",
  "mono",
  "mariposa",
  "sol",
  "estrella",
  "flor",
  "pinata",
  "volcan",
  "dragon",
  "tren",
  "barco"
];
function isSecretPictureId(id) {
  return SECRET_PICTURE_IDS.includes(id);
}
function shuffled(arr) {
  const out = [...arr];
  for (let i = out.length - 1;i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}
function studentRowOut(r, opts) {
  const state = parseState(r.stateJson);
  if (!opts.teacher)
    state.googleEmail = "";
  const own = r.radioLeo === 1;
  return {
    id: r.id,
    name: r.name,
    groupName: r.groupName,
    badgeColor: r.badgeColor,
    hasSecretPicture: isSecretPictureId(r.secretPicture),
    secretPictureId: opts.teacher && isSecretPictureId(r.secretPicture) ? r.secretPicture : "",
    radioLeoEnabled: opts.radioMaster && own,
    radioLeoStudent: opts.teacher ? own : false,
    state
  };
}
var studentOut = object({
  id: string2(),
  name: string2(),
  groupName: string2(),
  badgeColor: string2(),
  hasSecretPicture: boolean2(),
  secretPictureId: string2(),
  radioLeoEnabled: boolean2(),
  radioLeoStudent: boolean2(),
  state: unknown()
});
var familyPeekSummary = object({
  name: string2(),
  badgeColor: string2(),
  lang: string2(),
  avatar: object({ mask: string2(), suit: string2(), cape: string2(), gear: string2(), trim: string2() }),
  puntos: number2(),
  rayos: number2(),
  battlesWon: number2(),
  belts: record(string2(), number2()),
  beltWins: record(string2(), number2()),
  beltDates: record(string2(), string2()),
  esRung: number2(),
  enRung: number2(),
  gradeSeed: string2(),
  mastery: record(string2(), object({ correct: number2(), total: number2() })),
  recent: record(string2(), array(number2())),
  booksRead: array(string2()),
  scienceDone: array(string2())
});
var familyPeekResponse = object({
  status: _enum(["ok", "wrong", "no-picture"]),
  summary: familyPeekSummary.nullable()
});
var assignmentOut = object({
  id: number2(),
  title: string2(),
  targetType: string2(),
  targetId: string2(),
  section: string2(),
  skillId: string2(),
  stdCode: string2(),
  grade: string2(),
  windowStart: string2(),
  windowEnd: string2()
});
var okResponse = object({ ok: literal(true) });
var Actions = {
  teacherGateStatus: defineAction({
    description: "Report whether a teacher PIN and recovery phrase have been configured, without revealing either secret.",
    request: object({}),
    response: object({ configured: boolean2(), recoverySet: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      return { configured: await readTeacherPin(ctx) !== null, recoverySet: await readRecovery(ctx) !== null };
    }
  }),
  setupTeacherPin: defineAction({
    description: "Set the teacher PIN on first run (only while none exists) and return a teacher session token.",
    request: object({ pin: string2().min(4).max(8), recoveryPhrase: string2().max(120).optional() }),
    response: object({ ok: boolean2(), token: string2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      if (await readTeacherPin(ctx))
        return { ok: false, token: "", reason: "already-set" };
      if (!validPinFormat(args.pin))
        return { ok: false, token: "", reason: "bad-pin" };
      const phrase = (args.recoveryPhrase ?? "").trim();
      if (phrase && !validPhrase(phrase))
        return { ok: false, token: "", reason: "bad-phrase" };
      const salt = randomHex(16);
      await writeMeta(ctx, TEACHER_PIN_KEY, JSON.stringify({ salt, hash: await pinHash(salt, args.pin) }));
      if (phrase)
        await writeRecovery(ctx, phrase);
      const token = await mintTeacherSession(ctx);
      return { ok: true, token, reason: "" };
    }
  }),
  verifyTeacherPin: defineAction({
    description: "Check a teacher PIN attempt (rate-limited) and mint a 12-hour teacher session token on success.",
    request: object({ pin: string2().min(1).max(8) }),
    response: object({ ok: boolean2(), token: string2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const rec = await readTeacherPin(ctx);
      if (!rec)
        return { ok: false, token: "", reason: "not-configured" };
      const fails = await readPinFails(ctx);
      const now = Date.now();
      if (fails.lockedUntil > now)
        return { ok: false, token: "", reason: "locked" };
      if (validPinFormat(args.pin) && safeEqualHex(await pinHash(rec.salt, args.pin), rec.hash)) {
        await writeMeta(ctx, TEACHER_FAILS_KEY, JSON.stringify({ count: 0, lockedUntil: 0 }));
        const token = await mintTeacherSession(ctx);
        return { ok: true, token, reason: "" };
      }
      const count = fails.count + 1;
      await writeMeta(ctx, TEACHER_FAILS_KEY, JSON.stringify({ count, lockedUntil: count >= 5 ? now + 5 * 60 * 1000 : 0 }));
      return { ok: false, token: "", reason: count >= 5 ? "locked" : "bad-pin" };
    }
  }),
  verifyTeacherSession: defineAction({
    description: "Check whether a teacher session token is still valid.",
    request: object({ token: string2().min(1).max(200) }),
    response: object({ valid: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      return { valid: await isTeacher(ctx, args.token) };
    }
  }),
  lockTeacher: defineAction({
    description: "End a teacher session server-side so its token no longer unlocks the dashboard.",
    request: object({ token: string2().min(1).max(200) }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const raw = await store.metaGet(TEACHER_SESSIONS_KEY);
      let sessions = [];
      try {
        sessions = raw ? JSON.parse(raw) : [];
      } catch {
        sessions = [];
      }
      const h = await sha256Hex(args.token);
      await writeMeta(ctx, TEACHER_SESSIONS_KEY, JSON.stringify(sessions.filter((s) => !safeEqualHex(s.h, h))));
      return { ok: true };
    }
  }),
  changeTeacherPin: defineAction({
    description: "Change the teacher PIN from inside the unlocked dashboard.",
    request: object({ teacherToken: teacherTokenField, newPin: string2().min(4).max(8) }),
    response: object({ ok: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      if (!validPinFormat(args.newPin))
        return { ok: false, reason: "bad-pin" };
      const salt = randomHex(16);
      await writeMeta(ctx, TEACHER_PIN_KEY, JSON.stringify({ salt, hash: await pinHash(salt, args.newPin) }));
      return { ok: true, reason: "" };
    }
  }),
  getRecoveryStatus: defineAction({
    description: "Report whether a PIN recovery phrase is set (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ set: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      return { set: await readRecovery(ctx) !== null };
    }
  }),
  setRecoveryPhrase: defineAction({
    description: "Set or replace the PIN recovery phrase from inside the unlocked dashboard.",
    request: object({ teacherToken: teacherTokenField, phrase: string2().min(1).max(120) }),
    response: object({ ok: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      if (!validPhrase(args.phrase))
        return { ok: false, reason: "bad-phrase" };
      await writeRecovery(ctx, args.phrase);
      return { ok: true, reason: "" };
    }
  }),
  resetPinWithRecovery: defineAction({
    description: "Reset a forgotten teacher PIN using the recovery phrase and return a fresh session token.",
    request: object({ phrase: string2().min(1).max(120), newPin: string2().min(4).max(8) }),
    response: object({ ok: boolean2(), token: string2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const rec = await readRecovery(ctx);
      if (!rec)
        return { ok: false, token: "", reason: "no-recovery" };
      const fails = await readPinFails(ctx);
      if (fails.lockedUntil > Date.now())
        return { ok: false, token: "", reason: "locked" };
      if (!validPinFormat(args.newPin))
        return { ok: false, token: "", reason: "bad-pin" };
      const candidate = await pinHash(rec.salt, normalizePhrase(args.phrase));
      if (!safeEqualHex(candidate, rec.hash)) {
        return { ok: false, token: "", reason: await notePinFail(ctx, fails, "bad-phrase") };
      }
      const salt = randomHex(16);
      await writeMeta(ctx, TEACHER_PIN_KEY, JSON.stringify({ salt, hash: await pinHash(salt, args.newPin) }));
      await writeMeta(ctx, TEACHER_FAILS_KEY, JSON.stringify({ count: 0, lockedUntil: 0 }));
      const token = await mintTeacherSession(ctx);
      return { ok: true, token, reason: "" };
    }
  }),
  getGameData: defineAction({
    description: "Return the full game data pack (ladders, skills, avatar items, lines) and the audio clip count.",
    request: object({}),
    response: object({ data: unknown(), clipCount: number2() }),
    privileged: [privileged.readGameData, privileged.readManifest],
    async handler(ctx) {
      const { json } = await ctx.executePrivileged(privileged.readGameData, {});
      const manifest = await ctx.executePrivileged(privileged.readManifest, {});
      const rows = JSON.parse(manifest.json);
      return { data: JSON.parse(json), clipCount: rows.length };
    }
  }),
  seedAudioPack: defineAction({
    description: "Copy every audio clip from the pack into owned blob storage, idempotently, keyed by clip count and pack version.",
    request: object({}),
    response: object({ seeded: number2(), total: number2(), already: boolean2(), done: boolean2() }),
    privileged: [privileged.readManifest, privileged.readClipsBatch, privileged.readClipSizes, privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const AUDIO_PACK_VERSION = "2026-11-19-storyweaver-e1";
      const store = await getStore(ctx);
      const flag = await store.metaGet("audio_seeded");
      const ver = await store.metaGet("audio_pack_version");
      const manifest = await ctx.executePrivileged(privileged.readManifest, {});
      const rows = JSON.parse(manifest.json);
      if (flag === String(rows.length) && ver === AUDIO_PACK_VERSION) {
        return { seeded: 0, total: rows.length, already: true, done: true };
      }
      const PROGRESS_KEY = "audio_seed_progress";
      const prog = await store.metaGet(PROGRESS_KEY);
      let start = 0;
      if (prog) {
        const [pv, pi] = prog.split(":");
        const n = Number(pi);
        if (pv === AUDIO_PACK_VERSION && Number.isFinite(n) && n > 0)
          start = Math.min(n, rows.length);
      }
      const setMeta = async (key, value) => {
        await store.metaSet(key, value);
      };
      let seeded = 0;
      const CHUNK = 200;
      const MAX_CHUNKS = 6;
      let idx = start;
      let chunks = 0;
      for (;idx < rows.length && chunks < MAX_CHUNKS; idx += CHUNK, chunks += 1) {
        const ids = rows.slice(idx, idx + CHUNK).map((r) => r.id);
        const { sizes } = await ctx.executePrivileged(privileged.readClipSizes, { ids });
        const stale = [];
        await Promise.all(sizes.map(async (s) => {
          const head = await ctx.blobs.head(`audio/${s.id}`);
          if (!head || (head.sizeBytes ?? head.size) !== s.size)
            stale.push(s.id);
        }));
        for (let j = 0;j < stale.length; j += 90) {
          const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: stale.slice(j, j + 90) });
          await Promise.all(clips.map(async (clip) => {
            const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
            await ctx.blobs.put(`audio/${clip.id}`, bytes, { contentType: "audio/mpeg" });
            seeded += 1;
          }));
        }
        await setMeta(PROGRESS_KEY, `${AUDIO_PACK_VERSION}:${Math.min(idx + CHUNK, rows.length)}`);
      }
      const done = idx >= rows.length;
      if (done) {
        await setMeta("audio_seeded", String(rows.length));
        await setMeta("audio_pack_version", AUDIO_PACK_VERSION);
        await setMeta(PROGRESS_KEY, "");
      }
      return { seeded, total: rows.length, already: false, done };
    }
  }),
  refreshVideoPack: defineAction({
    description: "Re-copy the video asset pack into owned blob storage.",
    request: object({}),
    response: object({ seeded: number2(), already: boolean2() }),
    privileged: [privileged.readVideoBatch, privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const VIDEO_PACK_VERSION = "2026-11-18-diet1";
      const VIDEO_IDS = ["vocales", "colores-1", "colores-2", "numeros", "formas", "sonidos", "familias", "rimas", "numeros-6-10", "de-2-en-2", "de-5-en-5", "readalong-catrina", "readalong-serpent"];
      const store = await getStore(ctx);
      const ver = await store.metaGet("video_pack_version");
      if (ver === VIDEO_PACK_VERSION)
        return { seeded: 0, already: true };
      let seeded = 0;
      for (const id of VIDEO_IDS) {
        const { videos } = await ctx.executePrivileged(privileged.readVideoBatch, { ids: [id] });
        const item = videos[0];
        if (!item)
          continue;
        const bytes = Uint8Array.from(Buffer.from(item.base64, "base64"));
        await ctx.blobs.put(`video/${id}`, bytes, { contentType: "video/mp4" });
        seeded += 1;
      }
      await store.metaSet("video_pack_version", VIDEO_PACK_VERSION);
      return { seeded, already: false };
    }
  }),
  refreshDietArt: defineAction({
    description: "Re-copy recompressed art assets whose disk bytes changed into blob storage, in bounded batches.",
    request: object({}),
    response: object({ copied: number2(), done: boolean2(), already: boolean2() }),
    privileged: [privileged.listArtIds, privileged.readArtSizes, privileged.readArtBatch, privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const DIET_VERSION = "2026-11-18-diet1";
      const store = await getStore(ctx);
      if (await store.metaGet("art_diet_version") === DIET_VERSION) {
        return { copied: 0, done: true, already: true };
      }
      const { ids } = await ctx.executePrivileged(privileged.listArtIds, {});
      const stale = [];
      for (let start = 0;start < ids.length; start += 500) {
        const chunk = ids.slice(start, start + 500);
        const { sizes } = await ctx.executePrivileged(privileged.readArtSizes, { ids: chunk });
        for (const s of sizes) {
          const head = await ctx.blobs.head(`art/${s.id}`);
          if (!head || (head.sizeBytes ?? head.size) !== s.size)
            stale.push(s.id);
        }
      }
      const batch = stale.slice(0, 40);
      let copied = 0;
      for (let start = 0;start < batch.length; start += 20) {
        const chunk = batch.slice(start, start + 20);
        const { art } = await ctx.executePrivileged(privileged.readArtBatch, { ids: chunk });
        for (const item of art) {
          const bytes = Uint8Array.from(Buffer.from(item.base64, "base64"));
          await ctx.blobs.put(`art/${item.id}`, bytes, { contentType: "image/webp" });
          copied += 1;
        }
      }
      const done = stale.length <= batch.length && copied === batch.length;
      if (done)
        await store.metaSet("art_diet_version", DIET_VERSION);
      return { copied, done, already: false };
    }
  }),
  refreshPlaytestAudioClips: defineAction({
    description: "Force-refresh the playtest-wave replacement audio clips over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "es_fch_0_0_2",
        "es_fpass_2",
        "es_fch_3_0_2",
        "es_cch_0_0_1",
        "es_cch_0_1_1",
        "es_cq_1_0",
        "es_cch_1_0_1",
        "es_cch_2_1_0",
        "es_cch_2_1_1",
        "en_cpass_2",
        "en_cch_3_1_1",
        "en_w_soap",
        "ff_3_why_es",
        "es_cpass_3",
        "en_cpass_3",
        "ln_hint_s0_es",
        "ln_hint_s0_en",
        "ln_hint_s1_es",
        "ln_hint_s2_es",
        "ff_0_why_es",
        "ff_0_why_en",
        "es_fpass_3",
        "en_fpass_3",
        "ln_revancha_es",
        "ln_brave_es"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshQuestClips: defineAction({
    description: "Force-refresh the story-quest narration clips over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "ln_qpanel_1_en",
        "ln_qpanel_1_es",
        "ln_qpanel_2_en",
        "ln_qpanel_2_es",
        "ln_qpanel_3_en",
        "ln_qpanel_3_es",
        "ln_qpanel_4_en",
        "ln_qpanel_4_es",
        "ln_qpanel_5_en",
        "ln_qpanel_5_es",
        "ln_qmission_f1_en",
        "ln_qmission_f1_es",
        "ln_qmission_f2_en",
        "ln_qmission_f2_es",
        "ln_qmission_f3_en",
        "ln_qmission_f3_es",
        "ln_qmission_f4_en",
        "ln_qmission_f4_es",
        "ln_qmission_f5_en",
        "ln_qmission_f5_es",
        "ln_qmission_f6_en",
        "ln_qmission_f6_es",
        "ln_qmission_f7_en",
        "ln_qmission_f7_es",
        "ln_qforest_cleared_en",
        "ln_qforest_cleared_es"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshTogetherClips: defineAction({
    description: "Force-refresh the Play Together co-play framing clips over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "ln_games_together_en",
        "ln_games_together_es",
        "ln_together_welcome_en",
        "ln_together_welcome_es",
        "ln_together_read_en",
        "ln_together_read_es",
        "ln_together_team_0_en",
        "ln_together_team_0_es",
        "ln_together_team_1_en",
        "ln_together_team_1_es",
        "ln_together_team_2_en",
        "ln_together_team_2_es",
        "ln_together_done_en",
        "ln_together_done_es"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshMathClips: defineAction({
    description: "Force-refresh the Math Highlands narration clips over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "en_w_build",
        "en_w_compare",
        "en_w_count_on",
        "en_w_digit",
        "en_w_less_than",
        "en_w_more_than",
        "en_w_number",
        "en_w_order",
        "en_w_place_value",
        "es_w_comparar",
        "es_w_construir",
        "es_w_el_digito",
        "es_w_el_numero",
        "es_w_el_orden",
        "es_w_la_centena",
        "es_w_la_decena",
        "es_w_la_unidad",
        "es_w_mas_que",
        "es_w_menos_que",
        "es_w_seguir_contando",
        "es_w_valor_posicional",
        "ln_math_chart_en",
        "ln_math_chart_es",
        "ln_math_in_en",
        "ln_math_in_es",
        "ln_mhint_build_number_1_en",
        "ln_mhint_build_number_1_es",
        "ln_mhint_build_number_2_en",
        "ln_mhint_build_number_2_es",
        "ln_mhint_count_order_1_en",
        "ln_mhint_count_order_1_es",
        "ln_mhint_count_order_2_en",
        "ln_mhint_count_order_2_es",
        "ln_mpanel_1_en",
        "ln_mpanel_1_es",
        "ln_mpanel_2_en",
        "ln_mpanel_2_es",
        "ln_mpanel_3_en",
        "ln_mpanel_3_es",
        "ln_mpanel_4_en",
        "ln_mpanel_4_es",
        "ln_mpanel_5_en",
        "ln_mpanel_5_es",
        "ln_mstem_build_this_en",
        "ln_mstem_build_this_es",
        "ln_mstem_count_by_fives_en",
        "ln_mstem_count_by_fives_es",
        "ln_mstem_count_by_hundreds_en",
        "ln_mstem_count_by_hundreds_es",
        "ln_mstem_count_by_tens_en",
        "ln_mstem_count_by_tens_es",
        "ln_mstem_how_many_hundreds_en",
        "ln_mstem_how_many_hundreds_es",
        "ln_mstem_how_many_ones_en",
        "ln_mstem_how_many_ones_es",
        "ln_mstem_how_many_tens_en",
        "ln_mstem_how_many_tens_es",
        "ln_mstem_put_in_order_en",
        "ln_mstem_put_in_order_es",
        "ln_mstem_tap_number_en",
        "ln_mstem_tap_number_es",
        "ln_mstem_what_next_en",
        "ln_mstem_what_next_es",
        "ln_mstem_what_number_en",
        "ln_mstem_what_number_es",
        "ln_mstem_which_less_en",
        "ln_mstem_which_less_es",
        "ln_mstem_which_missing_en",
        "ln_mstem_which_missing_es",
        "ln_mstem_which_more_en",
        "ln_mstem_which_more_es",
        "ln_qmath_cleared_en",
        "ln_qmath_cleared_es",
        "ln_qmission_b1_en",
        "ln_qmission_b1_es",
        "num_en_30",
        "num_en_40",
        "num_en_50",
        "num_en_60",
        "num_en_70",
        "num_en_80",
        "num_en_90",
        "num_en_hundred",
        "num_en_thousand",
        "num_es_200",
        "num_es_21",
        "num_es_22",
        "num_es_23",
        "num_es_24",
        "num_es_25",
        "num_es_26",
        "num_es_27",
        "num_es_28",
        "num_es_29",
        "num_es_30",
        "num_es_300",
        "num_es_40",
        "num_es_400",
        "num_es_50",
        "num_es_500",
        "num_es_60",
        "num_es_600",
        "num_es_70",
        "num_es_700",
        "num_es_80",
        "num_es_800",
        "num_es_90",
        "num_es_900",
        "num_es_cien",
        "num_es_ciento"
      ];
      const REPAIRED_IDS = [
        "en_w_place_value",
        "es_w_comparar",
        "es_w_construir",
        "es_w_la_centena",
        "es_w_menos_que",
        "es_w_seguir_contando",
        "ln_math_chart_en",
        "ln_math_chart_es",
        "ln_mpanel_2_en",
        "ln_mpanel_3_en",
        "ln_mpanel_3_es",
        "ln_qmission_b1_en",
        "num_es_21",
        "num_es_27",
        "num_es_28",
        "num_es_30",
        "num_es_500",
        "num_es_60",
        "num_es_70",
        "num_es_900"
      ];
      const ALL_IDS = [...IDS, ...REPAIRED_IDS.filter((id) => !IDS.includes(id))];
      const out = [];
      for (let i = 0;i < ALL_IDS.length; i += 60) {
        const batch = ALL_IDS.slice(i, i + 60);
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: batch });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshFullMathClips: defineAction({
    description: "Force-refresh the full math clip set over the seeded blobs.",
    request: object({ ids: array(string2().min(1).max(80)).min(1).max(300) }),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx, args) {
      const out = [];
      for (let i = 0;i < args.ids.length; i += 60) {
        const batch = args.ids.slice(i, i + 60);
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: batch });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshFull2Clips: defineAction({
    description: "Force-refresh the second full audio pack wave over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "ln_qmission_a6_es",
        "ln_qmission_b4_es",
        "es_w_simetria",
        "num_es_millones",
        "ln_mstem_what_part_es",
        "ln_qmission_b6_es",
        "ln_mstory_a6_4_en"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshReplacedAudioClips: defineAction({
    description: "Force-refresh clips whose takes were replaced in a repair wave over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      total: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const REPLACED_IDS = [
        "es_w_estrella",
        "en_ls_s",
        "en_dig_th",
        "ln_forest_in_en",
        "ln_freeplay_es",
        "ln_praise_4_en",
        "es_sent_8",
        "en_w_van",
        "en_w_thumb",
        "es_w_humo",
        "es_w_precio",
        "es_w_yema",
        "es_w_noche",
        "es_w_taller"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: REPLACED_IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      const all = await ctx.blobs.list("audio/");
      return { refreshed: out.length, total: all.length, clips: out };
    }
  }),
  refreshClassroomClips: defineAction({
    description: "Force-refresh the classroom-layer line clips (opener, chant, ceremony) over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "ln_opener_welcome_en",
        "ln_opener_welcome_es",
        "ln_opener_chant_in_en",
        "ln_opener_chant_in_es",
        "ln_opener_cognate_in_en",
        "ln_opener_cognate_in_es",
        "ln_chant_1_en",
        "ln_chant_1_es",
        "ln_chant_2_en",
        "ln_chant_2_es",
        "ln_chant_3_en",
        "ln_chant_3_es",
        "ln_chant_4_en",
        "ln_chant_4_es",
        "ln_ceremony_in_en",
        "ln_ceremony_in_es",
        "ln_ceremony_next_en",
        "ln_ceremony_next_es",
        "ln_rudo_label_atajo_en",
        "ln_rudo_label_atajo_es",
        "ln_rudo_label_revuelto_en",
        "ln_rudo_label_revuelto_es",
        "ln_rudo_label_niebla_en",
        "ln_rudo_label_niebla_es",
        "ln_home_welcome_en",
        "ln_home_welcome_es"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshContentPackClips: defineAction({
    description: "Force-refresh the v4 content-pack clips (EN word bank, second passage set, division operators) over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "en_w_ant",
        "en_w_cow",
        "en_w_duck",
        "en_w_elk",
        "en_w_frog",
        "en_w_grapes",
        "en_w_horse",
        "en_w_insect",
        "en_w_juice",
        "en_w_koala",
        "en_w_lemon",
        "en_w_monkey",
        "en_w_nose",
        "en_w_orange",
        "en_w_panda",
        "en_w_quilt",
        "en_w_rabbit",
        "en_w_snake",
        "en_w_violin",
        "en_w_wolf",
        "en_w_yarn",
        "en_w_zoo",
        "en_w_bat",
        "en_w_cap",
        "en_w_fan",
        "en_w_jet",
        "en_w_kid",
        "en_w_lip",
        "en_w_mop",
        "en_w_nut",
        "en_w_rug",
        "en_w_zip",
        "en_w_shell",
        "en_w_wash",
        "en_w_chick",
        "en_w_cheese",
        "en_w_three",
        "en_w_teeth",
        "en_w_wheel",
        "en_w_white",
        "en_w_blow",
        "en_w_blend",
        "en_w_clean",
        "en_w_floor",
        "en_w_stone",
        "en_w_stamp",
        "en_w_snail",
        "en_w_tail",
        "en_w_tray",
        "en_w_gray",
        "en_w_feet",
        "en_w_leaf",
        "en_w_eat",
        "en_w_road",
        "en_w_lie",
        "en_w_cried",
        "en_w_true",
        "en_w_clue",
        "en_w_jar",
        "en_w_paper",
        "en_w_first",
        "en_w_shirt",
        "en_w_storm",
        "en_w_short",
        "en_w_hurt",
        "en_w_purple",
        "en_sent_5",
        "en_sent_6",
        "en_sent_7",
        "en_sent_8",
        "en_sent_9",
        "en_fpass_6",
        "en_fq_6_0",
        "en_fch_6_0_0",
        "en_fch_6_0_1",
        "en_fch_6_0_2",
        "en_fpass_7",
        "en_fq_7_0",
        "en_fch_7_0_0",
        "en_fch_7_0_1",
        "en_fch_7_0_2",
        "en_fpass_8",
        "en_fq_8_0",
        "en_fch_8_0_0",
        "en_fch_8_0_1",
        "en_fch_8_0_2",
        "en_fpass_9",
        "en_fq_9_0",
        "en_fch_9_0_0",
        "en_fch_9_0_1",
        "en_fch_9_0_2",
        "en_fpass_10",
        "en_fq_10_0",
        "en_fch_10_0_0",
        "en_fch_10_0_1",
        "en_fch_10_0_2",
        "en_fpass_11",
        "en_fq_11_0",
        "en_fch_11_0_0",
        "en_fch_11_0_1",
        "en_fch_11_0_2",
        "en_cpass_6",
        "en_cq_6_0",
        "en_cch_6_0_0",
        "en_cch_6_0_1",
        "en_cch_6_0_2",
        "en_cq_6_1",
        "en_cch_6_1_0",
        "en_cch_6_1_1",
        "en_cch_6_1_2",
        "en_cpass_7",
        "en_cq_7_0",
        "en_cch_7_0_0",
        "en_cch_7_0_1",
        "en_cch_7_0_2",
        "en_cq_7_1",
        "en_cch_7_1_0",
        "en_cch_7_1_1",
        "en_cch_7_1_2",
        "en_cpass_8",
        "en_cq_8_0",
        "en_cch_8_0_0",
        "en_cch_8_0_1",
        "en_cch_8_0_2",
        "en_cq_8_1",
        "en_cch_8_1_0",
        "en_cch_8_1_1",
        "en_cch_8_1_2",
        "en_cpass_9",
        "en_cq_9_0",
        "en_cch_9_0_0",
        "en_cch_9_0_1",
        "en_cch_9_0_2",
        "en_cq_9_1",
        "en_cch_9_1_0",
        "en_cch_9_1_1",
        "en_cch_9_1_2",
        "en_cpass_10",
        "en_cq_10_0",
        "en_cch_10_0_0",
        "en_cch_10_0_1",
        "en_cch_10_0_2",
        "en_cq_10_1",
        "en_cch_10_1_0",
        "en_cch_10_1_1",
        "en_cch_10_1_2",
        "en_cpass_11",
        "en_cq_11_0",
        "en_cch_11_0_0",
        "en_cch_11_0_1",
        "en_cch_11_0_2",
        "en_cq_11_1",
        "en_cch_11_1_0",
        "en_cch_11_1_1",
        "en_cch_11_1_2",
        "es_fpass_6",
        "es_fq_6_0",
        "es_fch_6_0_0",
        "es_fch_6_0_1",
        "es_fch_6_0_2",
        "es_fpass_7",
        "es_fq_7_0",
        "es_fch_7_0_0",
        "es_fch_7_0_1",
        "es_fch_7_0_2",
        "es_fpass_8",
        "es_fq_8_0",
        "es_fch_8_0_0",
        "es_fch_8_0_1",
        "es_fch_8_0_2",
        "es_fpass_9",
        "es_fq_9_0",
        "es_fch_9_0_0",
        "es_fch_9_0_1",
        "es_fch_9_0_2",
        "es_fpass_10",
        "es_fq_10_0",
        "es_fch_10_0_0",
        "es_fch_10_0_1",
        "es_fch_10_0_2",
        "es_fpass_11",
        "es_fq_11_0",
        "es_fch_11_0_0",
        "es_fch_11_0_1",
        "es_fch_11_0_2",
        "es_cpass_6",
        "es_cq_6_0",
        "es_cch_6_0_0",
        "es_cch_6_0_1",
        "es_cch_6_0_2",
        "es_cq_6_1",
        "es_cch_6_1_0",
        "es_cch_6_1_1",
        "es_cch_6_1_2",
        "es_cpass_7",
        "es_cq_7_0",
        "es_cch_7_0_0",
        "es_cch_7_0_1",
        "es_cch_7_0_2",
        "es_cq_7_1",
        "es_cch_7_1_0",
        "es_cch_7_1_1",
        "es_cch_7_1_2",
        "es_cpass_8",
        "es_cq_8_0",
        "es_cch_8_0_0",
        "es_cch_8_0_1",
        "es_cch_8_0_2",
        "es_cq_8_1",
        "es_cch_8_1_0",
        "es_cch_8_1_1",
        "es_cch_8_1_2",
        "es_cpass_9",
        "es_cq_9_0",
        "es_cch_9_0_0",
        "es_cch_9_0_1",
        "es_cch_9_0_2",
        "es_cq_9_1",
        "es_cch_9_1_0",
        "es_cch_9_1_1",
        "es_cch_9_1_2",
        "es_cpass_10",
        "es_cq_10_0",
        "es_cch_10_0_0",
        "es_cch_10_0_1",
        "es_cch_10_0_2",
        "es_cq_10_1",
        "es_cch_10_1_0",
        "es_cch_10_1_1",
        "es_cch_10_1_2",
        "es_cpass_11",
        "es_cq_11_0",
        "es_cch_11_0_0",
        "es_cch_11_0_1",
        "es_cch_11_0_2",
        "es_cq_11_1",
        "es_cch_11_1_0",
        "es_cch_11_1_1",
        "es_cch_11_1_2",
        "op_en_divided",
        "op_es_entre"
      ];
      const out = [];
      for (let j = 0;j < IDS.length; j += 90) {
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS.slice(j, j + 90) });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshSpanishPronunciationClips: defineAction({
    description: "Force-refresh the re-recorded Spanish pronunciation clips over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "es_syl_a",
        "es_syl_e",
        "es_syl_i",
        "es_syl_o",
        "es_syl_u",
        "es_syl_to",
        "es_syl_do",
        "es_syl_be",
        "es_syl_he",
        "es_inv_as",
        "es_inv_is",
        "es_inv_el",
        "es_inv_an",
        "es_inv_en",
        "es_inv_in",
        "es_inv_on",
        "es_inv_ar",
        "es_inv_er",
        "es_inv_ir",
        "es_inv_or",
        "es_inv_ur",
        "es_inv_em",
        "es_dip_ai",
        "es_dip_ie",
        "es_dip_ue",
        "es_w_bus",
        "es_w_once",
        "es_w_color",
        "es_w_pie",
        "es_w_red",
        "es_w_banana",
        "es_w_hospital",
        "es_w_sopa",
        "es_w_exito",
        "es_w_carpeta",
        "es_w_ala",
        "es_w_papa",
        "es_w_mama",
        "es_syl_pa",
        "es_syl_la",
        "es_syl_ma",
        "es_syl_sa",
        "es_syl_so"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshPronFixClips: defineAction({
    description: "Force-refresh the first Spanish pronunciation-fix clip batch over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "es_cch_4_0_1",
        "es_fch_4_0_0",
        "es_fch_5_0_2",
        "es_w_el_florero",
        "gar_g10_q1c0_es",
        "gar_g10_q1c1_es",
        "gar_g2_q1c2_es",
        "gar_g3_q0c2_es",
        "gar_g5_q1c1_es",
        "gar_g7_q0c0_es",
        "gar_g7_q0c1_es",
        "gar_g7_q1c0_es",
        "gar_g8_q0c2_es",
        "gar_g9_q0c0_es",
        "gar_g9_q0c1_es",
        "lib_s1b1_q2c1_es",
        "lib_s1b1_q2c2_es",
        "lib_s1b2_q0c2_es",
        "lib_s1b3_q2c2_es",
        "lib_s1b4_q0c0_es",
        "lib_s1b4_q0c1_es",
        "lib_s1b6_q0c2_es",
        "mue_q0c1_es",
        "sci_s1_q0c0_es",
        "sci_s1_q0c1_es",
        "sci_s1_q2c1_es",
        "sci_s2_q0c2_es",
        "sci_s3_q0c1_es",
        "sci_s3_q0c2_es",
        "sci_s3_q2c0_es",
        "sci_s6_q1c2_es",
        "sci_s6_q2c0_es",
        "sci_s7_q0c2_es",
        "sci_s9_q0c2_es",
        "sci_s9_q2c2_es"
      ];
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS });
      const out = [];
      for (const clip of clips) {
        const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
        const key = `audio/${clip.id}`;
        await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
        const head = await ctx.blobs.head(key);
        out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshPronFix2Clips: defineAction({
    description: "Force-refresh the second Spanish pronunciation-fix clip batch over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "gar_g1_p3_es",
        "gar_g3_q1c1_es",
        "gar_g4_q0c0_es",
        "gar_g4_q1c2_es",
        "gar_g5_q0c0_es",
        "gar_g5_q0c2_es",
        "gar_g8_q1c1_es",
        "lib_s1b2_q0c0_es",
        "lib_s1b2_q1c1_es",
        "lib_s1b4_q1c2_es",
        "lib_s1b5_q1c0_es",
        "sci_s10_q2c0_es",
        "sci_s10_q2c2_es",
        "sci_s3_q0_es",
        "sci_s5_q1c2_es",
        "sci_s6_q0c2_es",
        "sci_s7_q2c1_es"
      ];
      const out = [];
      for (let i = 0;i < IDS.length; i += 90) {
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS.slice(i, i + 90) });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshPronFix3Clips: defineAction({
    description: "Force-refresh the third Spanish pronunciation-fix clip batch over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "mis_b10_q2_es",
        "mis_b4_q0c1_es",
        "mis_b6_q1c1_es",
        "mis_b9_q2_es",
        "sci_s10_q3c0_es",
        "sci_s10_q3c1_es",
        "lib_s1b4_q0c1_en"
      ];
      const out = [];
      for (let i = 0;i < IDS.length; i += 90) {
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS.slice(i, i + 90) });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshSpanishGateFixClips: defineAction({
    description: "Force-refresh the Spanish gate-fix clip batch over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "es_w_sensor",
        "es_w_jaguar",
        "es_w_flotar",
        "sci_s10_q3c0_es",
        "sci_s10_q3c1_es",
        "exp_s2_s1_es",
        "exp_s7_s0_en",
        "ln_mstory_a7_5_es",
        "mis_b1_p10_es",
        "mis_b2_p7_es",
        "es_w_gravedad",
        "mis_b3_p9_es"
      ];
      const out = [];
      for (let i = 0;i < IDS.length; i += 90) {
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS.slice(i, i + 90) });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshContent2Clips: defineAction({
    description: "Force-refresh the second content-wave clip batch over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "gar_g5_p0_en",
        "gar_g5_p0_es",
        "gar_g5_p1_en",
        "gar_g5_p1_es",
        "gar_g5_p2_en",
        "gar_g5_p2_es",
        "gar_g5_p3_en",
        "gar_g5_p3_es",
        "gar_g5_q0_en",
        "gar_g5_q0_es",
        "gar_g5_q0c0_en",
        "gar_g5_q0c0_es",
        "gar_g5_q0c1_en",
        "gar_g5_q0c1_es",
        "gar_g5_q0c2_en",
        "gar_g5_q0c2_es",
        "gar_g5_q1_en",
        "gar_g5_q1_es",
        "gar_g5_q1c0_en",
        "gar_g5_q1c0_es",
        "gar_g5_q1c1_en",
        "gar_g5_q1c1_es",
        "gar_g5_q1c2_en",
        "gar_g5_q1c2_es",
        "gar_g6_p0_en",
        "gar_g6_p0_es",
        "gar_g6_p1_en",
        "gar_g6_p1_es",
        "gar_g6_p2_en",
        "gar_g6_p2_es",
        "gar_g6_p3_en",
        "gar_g6_p3_es",
        "gar_g6_q0_en",
        "gar_g6_q0_es",
        "gar_g6_q0c0_en",
        "gar_g6_q0c0_es",
        "gar_g6_q0c1_en",
        "gar_g6_q0c1_es",
        "gar_g6_q0c2_en",
        "gar_g6_q0c2_es",
        "gar_g6_q1_en",
        "gar_g6_q1_es",
        "gar_g6_q1c0_en",
        "gar_g6_q1c0_es",
        "gar_g6_q1c1_en",
        "gar_g6_q1c1_es",
        "gar_g6_q1c2_en",
        "gar_g6_q1c2_es",
        "sci_s6_b_en",
        "sci_s6_b_es",
        "sci_s6_q0_en",
        "sci_s6_q0_es",
        "sci_s6_q0c0_en",
        "sci_s6_q0c0_es",
        "sci_s6_q0c1_en",
        "sci_s6_q0c1_es",
        "sci_s6_q0c2_en",
        "sci_s6_q0c2_es",
        "sci_s6_q1_en",
        "sci_s6_q1_es",
        "sci_s6_q1c0_en",
        "sci_s6_q1c0_es",
        "sci_s6_q1c1_en",
        "sci_s6_q1c1_es",
        "sci_s6_q1c2_en",
        "sci_s6_q1c2_es",
        "sci_s6_q2_en",
        "sci_s6_q2_es",
        "sci_s6_q2c0_en",
        "sci_s6_q2c0_es",
        "sci_s6_q2c1_en",
        "sci_s6_q2c1_es",
        "sci_s6_q2c2_en",
        "sci_s6_q2c2_es",
        "sci_s7_b_en",
        "sci_s7_b_es",
        "sci_s7_q0_en",
        "sci_s7_q0_es",
        "sci_s7_q0c0_en",
        "sci_s7_q0c0_es",
        "sci_s7_q0c1_en",
        "sci_s7_q0c1_es",
        "sci_s7_q0c2_en",
        "sci_s7_q0c2_es",
        "sci_s7_q1_en",
        "sci_s7_q1_es",
        "sci_s7_q1c0_en",
        "sci_s7_q1c0_es",
        "sci_s7_q1c1_en",
        "sci_s7_q1c1_es",
        "sci_s7_q1c2_en",
        "sci_s7_q1c2_es",
        "sci_s7_q2_en",
        "sci_s7_q2_es",
        "sci_s7_q2c0_en",
        "sci_s7_q2c0_es",
        "sci_s7_q2c1_en",
        "sci_s7_q2c1_es",
        "sci_s7_q2c2_en",
        "sci_s7_q2c2_es"
      ];
      const out = [];
      for (let i = 0;i < IDS.length; i += 90) {
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS.slice(i, i + 90) });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  refreshOvernightClips: defineAction({
    description: "Force-refresh the overnight batch of new and repaired clips over the seeded blobs.",
    request: object({}),
    response: object({ clipsAdded: number2(), packVersion: string2() }),
    privileged: [privileged.readClipsBatch, privileged.readClipSizes, privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const PACK_VERSION = "2026-10-27-content5";
      const store = await getStore(ctx);
      const doneFlag = await store.metaGet("overnight_clips_version");
      if (doneFlag === PACK_VERSION)
        return { clipsAdded: 0, packVersion: PACK_VERSION };
      const IDS = [
        "ln_mstory_a6_9_en",
        "ln_mstory_a6_9_es",
        "ln_mstory_a6_10_en",
        "ln_mstory_a6_10_es",
        "ln_mstory_a6_11_en",
        "ln_mstory_a6_11_es",
        "ln_mstory_a6_12_en",
        "ln_mstory_a6_12_es",
        "ln_mstory_a7_5_en",
        "ln_mstory_a7_5_es",
        "ln_mstory_a7_6_en",
        "ln_mstory_a7_6_es",
        "ln_mstory_a7_7_en",
        "ln_mstory_a7_7_es",
        "ln_mstory_a7_8_en",
        "ln_mstory_a7_8_es",
        "ln_mstory_b7_9_en",
        "ln_mstory_b7_9_es",
        "ln_mstory_b7_10_en",
        "ln_mstory_b7_10_es",
        "ln_mstory_b7_11_en",
        "ln_mstory_b7_11_es",
        "ln_mstory_b7_12_en",
        "ln_mstory_b7_12_es",
        "ln_mstory_b7_13_en",
        "ln_mstory_b7_13_es",
        "ln_mstory_c7_9_en",
        "ln_mstory_c7_9_es",
        "ln_mstory_c7_10_en",
        "ln_mstory_c7_10_es",
        "ln_mstory_c7_11_en",
        "ln_mstory_c7_11_es",
        "ln_mstory_c7_12_en",
        "ln_mstory_c7_12_es",
        "ln_mstory_c7_13_en",
        "ln_mstory_c7_13_es",
        "ln_mstory_c7_14_en",
        "ln_mstory_c7_14_es",
        "ln_mstory_c7_15_en",
        "ln_mstory_c7_15_es",
        "sci_s1_q3_en",
        "sci_s1_q3_es",
        "sci_s1_q3c0_en",
        "sci_s1_q3c0_es",
        "sci_s1_q3c1_en",
        "sci_s1_q3c1_es",
        "sci_s2_q3_en",
        "sci_s2_q3_es",
        "sci_s4_q3_en",
        "sci_s4_q3_es",
        "sci_s4_q3c0_en",
        "sci_s4_q3c0_es",
        "sci_s4_q3c1_en",
        "sci_s4_q3c1_es",
        "sci_s4_q3c2_en",
        "sci_s4_q3c2_es",
        "sci_s5_q3_en",
        "sci_s5_q3_es",
        "sci_s5_q3c0_en",
        "sci_s5_q3c0_es",
        "sci_s5_q3c1_en",
        "sci_s5_q3c1_es",
        "sci_s5_q3c2_en",
        "sci_s5_q3c2_es",
        "sci_s6_q3_en",
        "sci_s6_q3_es",
        "sci_s6_q3c0_en",
        "sci_s6_q3c0_es",
        "sci_s6_q3c2_en",
        "sci_s6_q3c2_es",
        "sci_s7_q3_en",
        "sci_s7_q3_es",
        "sci_s7_q3c0_en",
        "sci_s7_q3c0_es",
        "sci_s7_q3c1_en",
        "sci_s7_q3c1_es",
        "sci_s7_q3c2_en",
        "sci_s7_q3c2_es",
        "sci_s8_q3_en",
        "sci_s8_q3_es",
        "sci_s8_q3c0_en",
        "sci_s8_q3c0_es",
        "sci_s8_q3c1_en",
        "sci_s8_q3c1_es",
        "sci_s8_q3c2_en",
        "sci_s8_q3c2_es",
        "sci_s9_q3c0_en",
        "sci_s9_q3c0_es",
        "sci_s9_q3c1_en",
        "sci_s9_q3c1_es",
        "sci_s9_q3c2_en",
        "sci_s9_q3c2_es",
        "sci_s10_q3_en",
        "sci_s10_q3_es",
        "sci_s10_q3c0_en",
        "sci_s10_q3c0_es",
        "sci_s10_q3c1_en",
        "sci_s10_q3c1_es",
        "sci_s10_q3c2_es",
        "exp_s1_title_en",
        "exp_s1_title_es",
        "exp_s1_mat_en",
        "exp_s1_mat_es",
        "exp_s1_s0_en",
        "exp_s1_s0_es",
        "exp_s1_s1_en",
        "exp_s1_s1_es",
        "exp_s1_s2_en",
        "exp_s1_s2_es",
        "exp_s1_s3_en",
        "exp_s1_s3_es",
        "exp_s2_title_en",
        "exp_s2_title_es",
        "exp_s2_mat_en",
        "exp_s2_mat_es",
        "exp_s2_s0_en",
        "exp_s2_s0_es",
        "exp_s2_s1_en",
        "exp_s2_s1_es",
        "exp_s2_s2_en",
        "exp_s2_s2_es",
        "exp_s2_s3_en",
        "exp_s2_s3_es",
        "exp_s3_title_en",
        "exp_s3_title_es",
        "exp_s3_mat_en",
        "exp_s3_mat_es",
        "exp_s3_s0_en",
        "exp_s3_s0_es",
        "exp_s3_s1_en",
        "exp_s3_s1_es",
        "exp_s3_s2_en",
        "exp_s3_s2_es",
        "exp_s3_s3_en",
        "exp_s3_s3_es",
        "exp_s4_title_en",
        "exp_s4_title_es",
        "exp_s4_mat_en",
        "exp_s4_mat_es",
        "exp_s4_s0_en",
        "exp_s4_s0_es",
        "exp_s4_s1_en",
        "exp_s4_s1_es",
        "exp_s4_s2_en",
        "exp_s4_s2_es",
        "exp_s4_s3_en",
        "exp_s4_s3_es",
        "exp_s5_title_en",
        "exp_s5_title_es",
        "exp_s5_mat_en",
        "exp_s5_mat_es",
        "exp_s5_s0_en",
        "exp_s5_s0_es",
        "exp_s5_s1_en",
        "exp_s5_s1_es",
        "exp_s5_s2_en",
        "exp_s5_s2_es",
        "exp_s5_s3_en",
        "exp_s5_s3_es",
        "exp_s6_title_en",
        "exp_s6_title_es",
        "exp_s6_mat_en",
        "exp_s6_mat_es",
        "exp_s6_s0_en",
        "exp_s6_s0_es",
        "exp_s6_s1_en",
        "exp_s6_s1_es",
        "exp_s6_s2_en",
        "exp_s6_s2_es",
        "exp_s6_s3_en",
        "exp_s6_s3_es",
        "exp_s7_title_en",
        "exp_s7_title_es",
        "exp_s7_mat_en",
        "exp_s7_mat_es",
        "exp_s7_s0_en",
        "exp_s7_s0_es",
        "exp_s7_s1_en",
        "exp_s7_s1_es",
        "exp_s7_s2_en",
        "exp_s7_s2_es",
        "exp_s7_s3_en",
        "exp_s7_s3_es",
        "exp_s8_title_en",
        "exp_s8_title_es",
        "exp_s8_mat_en",
        "exp_s8_mat_es",
        "exp_s8_s0_en",
        "exp_s8_s0_es",
        "exp_s8_s1_en",
        "exp_s8_s1_es",
        "exp_s8_s2_en",
        "exp_s8_s2_es",
        "exp_s8_s3_en",
        "exp_s8_s3_es",
        "exp_s9_title_en",
        "exp_s9_title_es",
        "exp_s9_mat_en",
        "exp_s9_mat_es",
        "exp_s9_s0_en",
        "exp_s9_s0_es",
        "exp_s9_s1_en",
        "exp_s9_s1_es",
        "exp_s9_s2_en",
        "exp_s9_s2_es",
        "exp_s9_s3_en",
        "exp_s9_s3_es",
        "exp_s10_title_en",
        "exp_s10_title_es",
        "exp_s10_mat_en",
        "exp_s10_mat_es",
        "exp_s10_s0_en",
        "exp_s10_s0_es",
        "exp_s10_s1_en",
        "exp_s10_s1_es",
        "exp_s10_s2_en",
        "exp_s10_s2_es",
        "exp_s10_s3_en",
        "exp_s10_s3_es",
        "mis_b1_p0_en",
        "mis_b1_p0_es",
        "mis_b1_p1_en",
        "mis_b1_p1_es",
        "mis_b1_p2_en",
        "mis_b1_p2_es",
        "mis_b1_p3_en",
        "mis_b1_p3_es",
        "mis_b1_p4_en",
        "mis_b1_p4_es",
        "mis_b1_p5_en",
        "mis_b1_p5_es",
        "mis_b1_p6_en",
        "mis_b1_p6_es",
        "mis_b1_p7_en",
        "mis_b1_p7_es",
        "mis_b1_p8_en",
        "mis_b1_p8_es",
        "mis_b1_p9_en",
        "mis_b1_p9_es",
        "mis_b1_p10_en",
        "mis_b1_p10_es",
        "mis_b1_p11_en",
        "mis_b1_p11_es",
        "mis_b1_p12_en",
        "mis_b1_p12_es",
        "mis_b1_p13_en",
        "mis_b1_p13_es",
        "mis_b1_p14_en",
        "mis_b1_p14_es",
        "mis_b1_p15_en",
        "mis_b1_p15_es",
        "en_w_space_station",
        "es_w_estacion_espacial",
        "en_w_orbit",
        "es_w_orbita",
        "en_w_astronaut",
        "es_w_astronauta",
        "en_w_rocket",
        "es_w_cohete",
        "en_w_earth",
        "es_w_la_tierra",
        "en_w_solar_panel",
        "es_w_panel_solar",
        "en_w_float",
        "es_w_flotar",
        "en_w_spacewalk",
        "es_w_caminata_espacial",
        "mis_b1_q0_en",
        "mis_b1_q0_es",
        "mis_b1_q0c0_en",
        "mis_b1_q0c0_es",
        "mis_b1_q0c1_en",
        "mis_b1_q0c1_es",
        "mis_b1_q0c2_en",
        "mis_b1_q0c2_es",
        "mis_b1_q1_en",
        "mis_b1_q1_es",
        "mis_b1_q1c0_en",
        "mis_b1_q1c0_es",
        "mis_b1_q1c1_en",
        "mis_b1_q1c1_es",
        "mis_b1_q1c2_en",
        "mis_b1_q1c2_es",
        "mis_b1_q2_en",
        "mis_b1_q2_es",
        "mis_b2_p0_en",
        "mis_b2_p0_es",
        "mis_b2_p1_en",
        "mis_b2_p1_es",
        "mis_b2_p2_en",
        "mis_b2_p2_es",
        "mis_b2_p3_en",
        "mis_b2_p3_es",
        "mis_b2_p4_en",
        "mis_b2_p4_es",
        "mis_b2_p5_en",
        "mis_b2_p5_es",
        "mis_b2_p6_en",
        "mis_b2_p6_es",
        "mis_b2_p7_en",
        "mis_b2_p7_es",
        "mis_b2_p8_en",
        "mis_b2_p8_es",
        "mis_b2_p9_en",
        "mis_b2_p9_es",
        "mis_b2_p10_en",
        "mis_b2_p10_es",
        "mis_b2_p11_en",
        "mis_b2_p11_es",
        "mis_b2_p12_en",
        "mis_b2_p12_es",
        "mis_b2_p13_en",
        "mis_b2_p13_es",
        "mis_b2_p14_en",
        "mis_b2_p14_es",
        "mis_b2_p15_en",
        "mis_b2_p15_es",
        "en_w_mars",
        "es_w_marte",
        "en_w_rover",
        "es_w_astromovil",
        "en_w_dust",
        "es_w_polvo",
        "en_w_canyon",
        "es_w_canon",
        "en_w_gravity",
        "es_w_gravedad",
        "en_w_sunset",
        "es_w_atardecer",
        "mis_b2_q0_en",
        "mis_b2_q0_es",
        "mis_b2_q0c0_en",
        "mis_b2_q0c0_es",
        "mis_b2_q0c1_en",
        "mis_b2_q0c1_es",
        "mis_b2_q0c2_en",
        "mis_b2_q0c2_es",
        "mis_b2_q1_en",
        "mis_b2_q1_es",
        "mis_b2_q2_en",
        "mis_b2_q2_es",
        "mis_b3_p0_en",
        "mis_b3_p0_es",
        "mis_b3_p1_en",
        "mis_b3_p1_es",
        "mis_b3_p2_en",
        "mis_b3_p2_es",
        "mis_b3_p3_en",
        "mis_b3_p3_es",
        "mis_b3_p4_en",
        "mis_b3_p4_es",
        "mis_b3_p5_en",
        "mis_b3_p5_es",
        "mis_b3_p6_en",
        "mis_b3_p6_es",
        "mis_b3_p7_en",
        "mis_b3_p7_es",
        "mis_b3_p8_en",
        "mis_b3_p8_es",
        "mis_b3_p9_en",
        "mis_b3_p9_es",
        "mis_b3_p10_en",
        "mis_b3_p10_es",
        "mis_b3_p11_en",
        "mis_b3_p11_es",
        "mis_b3_p12_en",
        "mis_b3_p12_es",
        "mis_b3_p13_en",
        "mis_b3_p13_es",
        "mis_b3_p14_en",
        "mis_b3_p14_es",
        "mis_b3_p15_en",
        "mis_b3_p15_es",
        "en_w_moon",
        "es_w_la_luna",
        "en_w_crater",
        "en_w_footprint",
        "es_w_huella",
        "en_w_ice",
        "en_w_base",
        "es_w_la_base",
        "es_w_bandera",
        "en_w_drill",
        "es_w_taladro",
        "en_w_shadow",
        "es_w_sombra",
        "mis_b3_q0_en",
        "mis_b3_q0_es",
        "mis_b3_q0c0_en",
        "mis_b3_q0c0_es",
        "mis_b3_q0c1_en",
        "mis_b3_q0c1_es",
        "mis_b3_q0c2_en",
        "mis_b3_q0c2_es",
        "mis_b3_q1_en",
        "mis_b3_q1_es",
        "mis_b3_q1c0_en",
        "mis_b3_q1c0_es",
        "mis_b3_q1c1_en",
        "mis_b3_q1c1_es",
        "mis_b3_q1c2_en",
        "mis_b3_q1c2_es",
        "mis_b3_q2_en",
        "mis_b3_q2_es",
        "mis_b4_p0_en",
        "mis_b4_p0_es",
        "mis_b4_p1_en",
        "mis_b4_p1_es",
        "mis_b4_p2_en",
        "mis_b4_p2_es",
        "mis_b4_p3_en",
        "mis_b4_p3_es",
        "mis_b4_p4_en",
        "mis_b4_p4_es",
        "mis_b4_p5_en",
        "mis_b4_p5_es",
        "mis_b4_p6_en",
        "mis_b4_p6_es",
        "mis_b4_p7_en",
        "mis_b4_p7_es",
        "mis_b4_p8_en",
        "mis_b4_p8_es",
        "mis_b4_p9_en",
        "mis_b4_p9_es",
        "mis_b4_p10_en",
        "mis_b4_p10_es",
        "mis_b4_p11_en",
        "mis_b4_p11_es",
        "mis_b4_p12_en",
        "mis_b4_p12_es",
        "mis_b4_p13_en",
        "mis_b4_p13_es",
        "mis_b4_p14_en",
        "mis_b4_p14_es",
        "mis_b4_p15_en",
        "mis_b4_p15_es",
        "en_w_ocean",
        "es_w_oceano",
        "en_w_submarine",
        "es_w_submarino",
        "en_w_deep",
        "es_w_profundo",
        "en_w_trench",
        "es_w_la_fosa",
        "en_w_light",
        "es_w_luz",
        "es_w_ballena",
        "en_w_crab",
        "es_w_cangrejo",
        "en_w_snow",
        "es_w_nieve",
        "mis_b4_q0_en",
        "mis_b4_q0_es",
        "mis_b4_q0c0_en",
        "mis_b4_q0c0_es",
        "mis_b4_q0c1_en",
        "mis_b4_q0c1_es",
        "mis_b4_q0c2_en",
        "mis_b4_q0c2_es",
        "mis_b4_q1_en",
        "mis_b4_q1_es",
        "mis_b4_q1c0_en",
        "mis_b4_q1c0_es",
        "mis_b4_q1c1_en",
        "mis_b4_q1c1_es",
        "mis_b4_q1c2_en",
        "mis_b4_q1c2_es",
        "mis_b4_q2_en",
        "mis_b4_q2_es",
        "mis_b5_p0_en",
        "mis_b5_p0_es",
        "mis_b5_p1_en",
        "mis_b5_p1_es",
        "mis_b5_p2_en",
        "mis_b5_p2_es",
        "mis_b5_p3_en",
        "mis_b5_p3_es",
        "mis_b5_p4_en",
        "mis_b5_p4_es",
        "mis_b5_p5_en",
        "mis_b5_p5_es",
        "mis_b5_p6_en",
        "mis_b5_p6_es",
        "mis_b5_p7_en",
        "mis_b5_p7_es",
        "mis_b5_p8_en",
        "mis_b5_p8_es",
        "mis_b5_p9_en",
        "mis_b5_p9_es",
        "mis_b5_p10_en",
        "mis_b5_p10_es",
        "mis_b5_p11_en",
        "mis_b5_p11_es",
        "mis_b5_p12_en",
        "mis_b5_p12_es",
        "mis_b5_p13_en",
        "mis_b5_p13_es",
        "mis_b5_p14_en",
        "mis_b5_p14_es",
        "mis_b5_p15_en",
        "mis_b5_p15_es",
        "en_w_heart",
        "es_w_corazon",
        "en_w_lungs",
        "es_w_pulmones",
        "en_w_blood",
        "es_w_sangre",
        "en_w_bone",
        "es_w_hueso",
        "en_w_brain",
        "es_w_cerebro",
        "en_w_stomach",
        "es_w_estomago",
        "en_w_muscle",
        "es_w_musculo",
        "en_w_cell",
        "es_w_celula",
        "mis_b5_q0_en",
        "mis_b5_q0_es",
        "mis_b5_q0c0_en",
        "mis_b5_q0c0_es",
        "mis_b5_q0c1_en",
        "mis_b5_q0c1_es",
        "mis_b5_q0c2_en",
        "mis_b5_q0c2_es",
        "mis_b5_q1_en",
        "mis_b5_q1_es",
        "mis_b5_q1c0_en",
        "mis_b5_q1c0_es",
        "mis_b5_q1c1_en",
        "mis_b5_q1c1_es",
        "mis_b5_q1c2_en",
        "mis_b5_q1c2_es",
        "mis_b5_q2_en",
        "mis_b5_q2_es",
        "mis_b6_p0_en",
        "mis_b6_p0_es",
        "mis_b6_p1_en",
        "mis_b6_p1_es",
        "mis_b6_p2_en",
        "mis_b6_p2_es",
        "mis_b6_p3_en",
        "mis_b6_p3_es",
        "mis_b6_p4_en",
        "mis_b6_p4_es",
        "mis_b6_p5_en",
        "mis_b6_p5_es",
        "mis_b6_p6_en",
        "mis_b6_p6_es",
        "mis_b6_p7_en",
        "mis_b6_p7_es",
        "mis_b6_p8_en",
        "mis_b6_p8_es",
        "mis_b6_p9_en",
        "mis_b6_p9_es",
        "mis_b6_p10_en",
        "mis_b6_p10_es",
        "mis_b6_p11_en",
        "mis_b6_p11_es",
        "mis_b6_p12_en",
        "mis_b6_p12_es",
        "mis_b6_p13_en",
        "mis_b6_p13_es",
        "mis_b6_p14_en",
        "mis_b6_p14_es",
        "mis_b6_p15_en",
        "mis_b6_p15_es",
        "en_w_sensor",
        "es_w_sensor",
        "en_w_earthquake",
        "es_w_terremoto",
        "en_w_ash",
        "es_w_ceniza",
        "en_w_lava",
        "es_w_lava",
        "es_w_mascarilla",
        "en_w_shelter",
        "es_w_refugio",
        "en_w_volcanologist",
        "es_w_vulcanologa",
        "mis_b6_q0_en",
        "mis_b6_q0_es",
        "mis_b6_q0c0_en",
        "mis_b6_q0c0_es",
        "mis_b6_q0c1_en",
        "mis_b6_q0c1_es",
        "mis_b6_q0c2_en",
        "mis_b6_q0c2_es",
        "mis_b6_q1_en",
        "mis_b6_q1_es",
        "mis_b6_q1c0_en",
        "mis_b6_q1c0_es",
        "mis_b6_q1c1_en",
        "mis_b6_q1c1_es",
        "mis_b6_q1c2_en",
        "mis_b6_q1c2_es",
        "mis_b6_q2_en",
        "mis_b6_q2_es",
        "mis_b7_p0_en",
        "mis_b7_p0_es",
        "mis_b7_p1_en",
        "mis_b7_p1_es",
        "mis_b7_p2_en",
        "mis_b7_p2_es",
        "mis_b7_p3_en",
        "mis_b7_p3_es",
        "mis_b7_p4_en",
        "mis_b7_p4_es",
        "mis_b7_p5_en",
        "mis_b7_p5_es",
        "mis_b7_p6_en",
        "mis_b7_p6_es",
        "mis_b7_p7_en",
        "mis_b7_p7_es",
        "mis_b7_p8_en",
        "mis_b7_p8_es",
        "mis_b7_p9_en",
        "mis_b7_p9_es",
        "mis_b7_p10_en",
        "mis_b7_p10_es",
        "mis_b7_p11_en",
        "mis_b7_p11_es",
        "mis_b7_p12_en",
        "mis_b7_p12_es",
        "mis_b7_p13_en",
        "mis_b7_p13_es",
        "mis_b7_p14_en",
        "mis_b7_p14_es",
        "mis_b7_p15_en",
        "mis_b7_p15_es",
        "en_w_northern_lights",
        "es_w_aurora",
        "en_w_bear",
        "en_w_fox",
        "en_w_cold",
        "en_w_rope",
        "es_w_cuerda",
        "en_w_station",
        "es_w_estacion",
        "mis_b7_q0_en",
        "mis_b7_q0_es",
        "mis_b7_q0c0_en",
        "mis_b7_q0c0_es",
        "mis_b7_q0c1_en",
        "mis_b7_q0c1_es",
        "mis_b7_q0c2_en",
        "mis_b7_q0c2_es",
        "mis_b7_q1_en",
        "mis_b7_q1_es",
        "mis_b7_q1c0_en",
        "mis_b7_q1c0_es",
        "mis_b7_q1c1_en",
        "mis_b7_q1c1_es",
        "mis_b7_q2_en",
        "mis_b7_q2_es",
        "mis_b8_p0_en",
        "mis_b8_p0_es",
        "mis_b8_p1_en",
        "mis_b8_p1_es",
        "mis_b8_p2_en",
        "mis_b8_p2_es",
        "mis_b8_p3_en",
        "mis_b8_p3_es",
        "mis_b8_p4_en",
        "mis_b8_p4_es",
        "mis_b8_p5_en",
        "mis_b8_p5_es",
        "mis_b8_p6_en",
        "mis_b8_p6_es",
        "mis_b8_p7_en",
        "mis_b8_p7_es",
        "mis_b8_p8_en",
        "mis_b8_p8_es",
        "mis_b8_p9_en",
        "mis_b8_p9_es",
        "mis_b8_p10_en",
        "mis_b8_p10_es",
        "mis_b8_p11_en",
        "mis_b8_p11_es",
        "mis_b8_p12_en",
        "mis_b8_p12_es",
        "mis_b8_p13_en",
        "mis_b8_p13_es",
        "mis_b8_p14_en",
        "mis_b8_p14_es",
        "mis_b8_p15_en",
        "mis_b8_p15_es",
        "en_w_hurricane",
        "es_w_huracan",
        "en_w_wind",
        "es_w_viento",
        "en_w_cloud",
        "en_w_instrument",
        "es_w_instrumento",
        "mis_b8_q0_en",
        "mis_b8_q0_es",
        "mis_b8_q0c0_en",
        "mis_b8_q0c0_es",
        "mis_b8_q0c1_en",
        "mis_b8_q0c1_es",
        "mis_b8_q0c2_en",
        "mis_b8_q0c2_es",
        "mis_b8_q1_en",
        "mis_b8_q1_es",
        "mis_b8_q1c0_en",
        "mis_b8_q1c0_es",
        "mis_b8_q1c1_en",
        "mis_b8_q1c1_es",
        "mis_b8_q1c2_en",
        "mis_b8_q1c2_es",
        "mis_b8_q2_en",
        "mis_b8_q2_es",
        "mis_b9_p0_en",
        "mis_b9_p0_es",
        "mis_b9_p1_en",
        "mis_b9_p1_es",
        "mis_b9_p2_en",
        "mis_b9_p2_es",
        "mis_b9_p3_en",
        "mis_b9_p3_es",
        "mis_b9_p4_en",
        "mis_b9_p4_es",
        "mis_b9_p5_en",
        "mis_b9_p5_es",
        "mis_b9_p6_en",
        "mis_b9_p6_es",
        "mis_b9_p7_en",
        "mis_b9_p7_es",
        "mis_b9_p8_en",
        "mis_b9_p8_es",
        "mis_b9_p9_en",
        "mis_b9_p9_es",
        "mis_b9_p10_en",
        "mis_b9_p10_es",
        "mis_b9_p11_en",
        "mis_b9_p11_es",
        "mis_b9_p12_en",
        "mis_b9_p12_es",
        "mis_b9_p13_en",
        "mis_b9_p13_es",
        "mis_b9_p14_en",
        "mis_b9_p14_es",
        "mis_b9_p15_en",
        "mis_b9_p15_es",
        "en_w_jaguar",
        "es_w_jaguar",
        "en_w_rainforest",
        "es_w_selva",
        "en_w_camera",
        "es_w_camara",
        "en_w_river",
        "en_w_night",
        "en_w_spots",
        "es_w_manchas",
        "mis_b9_q0_en",
        "mis_b9_q0_es",
        "mis_b9_q0c0_en",
        "mis_b9_q0c0_es",
        "mis_b9_q0c1_en",
        "mis_b9_q0c1_es",
        "mis_b9_q0c2_en",
        "mis_b9_q0c2_es",
        "mis_b9_q1_en",
        "mis_b9_q1_es",
        "mis_b9_q1c0_en",
        "mis_b9_q1c0_es",
        "mis_b9_q1c1_en",
        "mis_b9_q1c1_es",
        "mis_b9_q1c2_en",
        "mis_b9_q1c2_es",
        "mis_b9_q2_en",
        "mis_b9_q2_es",
        "mis_b10_p0_en",
        "mis_b10_p0_es",
        "mis_b10_p1_en",
        "mis_b10_p1_es",
        "mis_b10_p2_en",
        "mis_b10_p2_es",
        "mis_b10_p3_en",
        "mis_b10_p3_es",
        "mis_b10_p4_en",
        "mis_b10_p4_es",
        "mis_b10_p5_en",
        "mis_b10_p5_es",
        "mis_b10_p6_en",
        "mis_b10_p6_es",
        "mis_b10_p7_en",
        "mis_b10_p7_es",
        "mis_b10_p8_en",
        "mis_b10_p8_es",
        "mis_b10_p9_en",
        "mis_b10_p9_es",
        "mis_b10_p10_en",
        "mis_b10_p10_es",
        "mis_b10_p11_en",
        "mis_b10_p11_es",
        "mis_b10_p12_en",
        "mis_b10_p12_es",
        "mis_b10_p13_en",
        "mis_b10_p13_es",
        "mis_b10_p14_en",
        "mis_b10_p14_es",
        "mis_b10_p15_en",
        "mis_b10_p15_es",
        "en_w_dinosaur",
        "es_w_dinosaurio",
        "en_w_brush",
        "es_w_cepillo",
        "en_w_plaster",
        "es_w_yeso",
        "en_w_skull",
        "en_w_horn",
        "es_w_cuerno",
        "en_w_museum",
        "es_w_museo",
        "mis_b10_q0_en",
        "mis_b10_q0_es",
        "mis_b10_q0c0_en",
        "mis_b10_q0c0_es",
        "mis_b10_q0c1_en",
        "mis_b10_q0c1_es",
        "mis_b10_q0c2_en",
        "mis_b10_q0c2_es",
        "mis_b10_q1_en",
        "mis_b10_q1_es",
        "mis_b10_q1c0_en",
        "mis_b10_q1c0_es",
        "mis_b10_q1c1_en",
        "mis_b10_q1c1_es",
        "mis_b10_q1c2_en",
        "mis_b10_q1c2_es",
        "mis_b10_q2_en",
        "mis_b10_q2_es"
      ];
      let added = 0;
      for (let i = 0;i < IDS.length; i += 200) {
        const { sizes } = await ctx.executePrivileged(privileged.readClipSizes, { ids: IDS.slice(i, i + 200) });
        const stale = [];
        await Promise.all(sizes.map(async (s) => {
          const head = await ctx.blobs.head(`audio/${s.id}`);
          if (!head || (head.sizeBytes ?? head.size) !== s.size)
            stale.push(s.id);
        }));
        for (let j = 0;j < stale.length; j += 90) {
          const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: stale.slice(j, j + 90) });
          await Promise.all(clips.map(async (clip) => {
            const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
            await ctx.blobs.put(`audio/${clip.id}`, bytes, { contentType: "audio/mpeg" });
            added += 1;
          }));
        }
      }
      await store.metaSet("overnight_clips_version", PACK_VERSION);
      return { clipsAdded: added, packVersion: PACK_VERSION };
    }
  }),
  refreshSelClips: defineAction({
    description: "Force-refresh the El Rinc\xF3n de las Emociones (SEL) clips over the seeded blobs.",
    request: object({}),
    response: object({ clipsAdded: number2(), packVersion: string2() }),
    privileged: [privileged.readClipsBatch, privileged.readClipSizes, privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const PACK_VERSION = "2026-10-27-content6";
      const store = await getStore(ctx);
      const doneFlag = await store.metaGet("sel_clips_version");
      if (doneFlag === PACK_VERSION)
        return { clipsAdded: 0, packVersion: PACK_VERSION };
      const IDS = [
        "sel_feel_nervous_en",
        "sel_feel_nervous_es",
        "sel_sig_nervous_en",
        "sel_sig_nervous_es",
        "sel_feel_angry_en",
        "sel_feel_angry_es",
        "sel_sig_angry_en",
        "sel_sig_angry_es",
        "sel_feel_sad_en",
        "sel_feel_sad_es",
        "sel_sig_sad_en",
        "sel_sig_sad_es",
        "sel_feel_left_out_en",
        "sel_feel_left_out_es",
        "sel_sig_left_out_en",
        "sel_sig_left_out_es",
        "sel_feel_jealous_en",
        "sel_feel_jealous_es",
        "sel_sig_jealous_en",
        "sel_sig_jealous_es",
        "sel_feel_scared_en",
        "sel_feel_scared_es",
        "sel_sig_scared_en",
        "sel_sig_scared_es",
        "sel_feel_embarrassed_en",
        "sel_feel_embarrassed_es",
        "sel_sig_embarrassed_en",
        "sel_sig_embarrassed_es",
        "sel_feel_excited_en",
        "sel_feel_excited_es",
        "sel_sig_excited_en",
        "sel_sig_excited_es",
        "sel_feel_lonely_en",
        "sel_feel_lonely_es",
        "sel_sig_lonely_en",
        "sel_sig_lonely_es",
        "sel_feel_proud_en",
        "sel_feel_proud_es",
        "sel_sig_proud_en",
        "sel_sig_proud_es",
        "sel_breath_count_title_en",
        "sel_breath_count_title_es",
        "sel_breath_count_s0_en",
        "sel_breath_count_s0_es",
        "sel_breath_count_s1_en",
        "sel_breath_count_s1_es",
        "sel_breath_flower_title_en",
        "sel_breath_flower_title_es",
        "sel_breath_flower_s0_en",
        "sel_breath_flower_s0_es",
        "sel_breath_flower_s1_en",
        "sel_breath_flower_s1_es",
        "sel_breath_teddy_title_en",
        "sel_breath_teddy_title_es",
        "sel_breath_teddy_s0_en",
        "sel_breath_teddy_s0_es",
        "sel_breath_teddy_s1_en",
        "sel_breath_teddy_s1_es",
        "sel_breath_teddy_s2_en",
        "sel_breath_teddy_s2_es",
        "sel_breath_push_title_en",
        "sel_breath_push_title_es",
        "sel_breath_push_s0_en",
        "sel_breath_push_s0_es",
        "sel_breath_push_s1_en",
        "sel_breath_push_s1_es",
        "sel_breath_push_s2_en",
        "sel_breath_push_s2_es",
        "sel_breath_mountain_title_en",
        "sel_breath_mountain_title_es",
        "sel_breath_mountain_s0_en",
        "sel_breath_mountain_s0_es",
        "sel_breath_mountain_s1_en",
        "sel_breath_mountain_s1_es",
        "sel_breath_mountain_s2_en",
        "sel_breath_mountain_s2_es",
        "sel_tool_b1_title_en",
        "sel_tool_b1_title_es",
        "sel_tool_b1_say_en",
        "sel_tool_b1_say_es",
        "sel_tool_b1_s0_en",
        "sel_tool_b1_s0_es",
        "sel_tool_b1_s1_en",
        "sel_tool_b1_s1_es",
        "sel_tool_b1_s2_en",
        "sel_tool_b1_s2_es",
        "sel_tool_b1_grown_en",
        "sel_tool_b1_grown_es",
        "sel_tool_b2_title_en",
        "sel_tool_b2_title_es",
        "sel_tool_b2_say_en",
        "sel_tool_b2_say_es",
        "sel_tool_b2_s0_en",
        "sel_tool_b2_s0_es",
        "sel_tool_b2_s1_en",
        "sel_tool_b2_s1_es",
        "sel_tool_b2_s2_en",
        "sel_tool_b2_s2_es",
        "sel_tool_b2_grown_en",
        "sel_tool_b2_grown_es",
        "sel_tool_b3_title_en",
        "sel_tool_b3_title_es",
        "sel_tool_b3_say_en",
        "sel_tool_b3_say_es",
        "sel_tool_b3_s0_en",
        "sel_tool_b3_s0_es",
        "sel_tool_b3_s1_en",
        "sel_tool_b3_s1_es",
        "sel_tool_b3_s2_en",
        "sel_tool_b3_s2_es",
        "sel_tool_b3_grown_en",
        "sel_tool_b3_grown_es",
        "sel_tool_b4_title_en",
        "sel_tool_b4_title_es",
        "sel_tool_b4_say_en",
        "sel_tool_b4_say_es",
        "sel_tool_b4_s0_en",
        "sel_tool_b4_s0_es",
        "sel_tool_b4_s1_en",
        "sel_tool_b4_s1_es",
        "sel_tool_b4_s2_en",
        "sel_tool_b4_s2_es",
        "sel_tool_b4_grown_en",
        "sel_tool_b4_grown_es",
        "sel_tool_b5_title_en",
        "sel_tool_b5_title_es",
        "sel_tool_b5_say_en",
        "sel_tool_b5_say_es",
        "sel_tool_b5_s0_en",
        "sel_tool_b5_s0_es",
        "sel_tool_b5_s1_en",
        "sel_tool_b5_s1_es",
        "sel_tool_b5_s2_en",
        "sel_tool_b5_s2_es",
        "sel_tool_b5_grown_en",
        "sel_tool_b5_grown_es",
        "sel_tool_b6_title_en",
        "sel_tool_b6_title_es",
        "sel_tool_b6_say_en",
        "sel_tool_b6_say_es",
        "sel_tool_b6_s0_en",
        "sel_tool_b6_s0_es",
        "sel_tool_b6_s1_en",
        "sel_tool_b6_s1_es",
        "sel_tool_b6_s2_en",
        "sel_tool_b6_s2_es",
        "sel_tool_b6_grown_en",
        "sel_tool_b6_grown_es",
        "sel_tool_b7_title_en",
        "sel_tool_b7_title_es",
        "sel_tool_b7_say_en",
        "sel_tool_b7_say_es",
        "sel_tool_b7_s0_en",
        "sel_tool_b7_s0_es",
        "sel_tool_b7_s1_en",
        "sel_tool_b7_s1_es",
        "sel_tool_b7_s2_en",
        "sel_tool_b7_s2_es",
        "sel_tool_b7_grown_en",
        "sel_tool_b7_grown_es",
        "sel_tool_b8_title_en",
        "sel_tool_b8_title_es",
        "sel_tool_b8_say_en",
        "sel_tool_b8_say_es",
        "sel_tool_b8_s0_en",
        "sel_tool_b8_s0_es",
        "sel_tool_b8_s1_en",
        "sel_tool_b8_s1_es",
        "sel_tool_b8_s2_en",
        "sel_tool_b8_s2_es",
        "sel_tool_b8_grown_en",
        "sel_tool_b8_grown_es",
        "sel_tool_b9_title_en",
        "sel_tool_b9_title_es",
        "sel_tool_b9_say_en",
        "sel_tool_b9_say_es",
        "sel_tool_b9_s0_en",
        "sel_tool_b9_s0_es",
        "sel_tool_b9_s1_en",
        "sel_tool_b9_s1_es",
        "sel_tool_b9_s2_en",
        "sel_tool_b9_s2_es",
        "sel_tool_b9_grown_en",
        "sel_tool_b9_grown_es",
        "sel_tool_b10_title_en",
        "sel_tool_b10_title_es",
        "sel_tool_b10_say_en",
        "sel_tool_b10_say_es",
        "sel_tool_b10_s0_en",
        "sel_tool_b10_s0_es",
        "sel_tool_b10_s1_en",
        "sel_tool_b10_s1_es",
        "sel_tool_b10_s2_en",
        "sel_tool_b10_s2_es",
        "sel_tool_b10_grown_en",
        "sel_tool_b10_grown_es",
        "sel_ui_title_en",
        "sel_ui_title_es",
        "sel_ui_checkin_q_en",
        "sel_ui_checkin_q_es",
        "sel_ui_checkin_sub_en",
        "sel_ui_checkin_sub_es",
        "sel_ui_breathe_title_en",
        "sel_ui_breathe_title_es",
        "sel_ui_breathe_intro_en",
        "sel_ui_breathe_intro_es",
        "sel_ui_breathe_done_en",
        "sel_ui_breathe_done_es",
        "sel_ui_toolbox_title_en",
        "sel_ui_toolbox_title_es",
        "sel_ui_toolbox_intro_en",
        "sel_ui_toolbox_intro_es",
        "sel_ui_grown_label_en",
        "sel_ui_grown_label_es",
        "sel_ui_scenarios_title_en",
        "sel_ui_scenarios_title_es",
        "sel_ui_diario_title_en",
        "sel_ui_diario_title_es",
        "sel_ui_diario_q_en",
        "sel_ui_diario_q_es",
        "sel_ui_diario_saved_en",
        "sel_ui_diario_saved_es",
        "sel_ui_books_title_en",
        "sel_ui_books_title_es",
        "sel_scn_b1_q_en",
        "sel_scn_b1_q_es",
        "sel_scn_b1_c0_en",
        "sel_scn_b1_c0_es",
        "sel_scn_b1_c1_en",
        "sel_scn_b1_c1_es",
        "sel_scn_b1_c2_en",
        "sel_scn_b1_c2_es",
        "sel_scn_b2_q_en",
        "sel_scn_b2_q_es",
        "sel_scn_b2_c0_en",
        "sel_scn_b2_c0_es",
        "sel_scn_b2_c1_en",
        "sel_scn_b2_c1_es",
        "sel_scn_b2_c2_en",
        "sel_scn_b2_c2_es",
        "sel_scn_b3_q_en",
        "sel_scn_b3_q_es",
        "sel_scn_b3_c0_en",
        "sel_scn_b3_c0_es",
        "sel_scn_b3_c1_en",
        "sel_scn_b3_c1_es",
        "sel_scn_b3_c2_en",
        "sel_scn_b3_c2_es",
        "sel_scn_b4_q_en",
        "sel_scn_b4_q_es",
        "sel_scn_b4_c0_en",
        "sel_scn_b4_c0_es",
        "sel_scn_b4_c1_en",
        "sel_scn_b4_c1_es",
        "sel_scn_b4_c2_en",
        "sel_scn_b4_c2_es",
        "sel_scn_b5_q_en",
        "sel_scn_b5_q_es",
        "sel_scn_b5_c0_en",
        "sel_scn_b5_c0_es",
        "sel_scn_b5_c1_en",
        "sel_scn_b5_c1_es",
        "sel_scn_b5_c2_en",
        "sel_scn_b5_c2_es",
        "sel_scn_b6_q_en",
        "sel_scn_b6_q_es",
        "sel_scn_b6_c0_en",
        "sel_scn_b6_c0_es",
        "sel_scn_b6_c1_en",
        "sel_scn_b6_c1_es",
        "sel_scn_b6_c2_en",
        "sel_scn_b6_c2_es",
        "sel_scn_b7_q_en",
        "sel_scn_b7_q_es",
        "sel_scn_b7_c0_en",
        "sel_scn_b7_c0_es",
        "sel_scn_b7_c1_en",
        "sel_scn_b7_c1_es",
        "sel_scn_b7_c2_en",
        "sel_scn_b7_c2_es",
        "sel_scn_b8_q_en",
        "sel_scn_b8_q_es",
        "sel_scn_b8_c0_en",
        "sel_scn_b8_c0_es",
        "sel_scn_b8_c1_en",
        "sel_scn_b8_c1_es",
        "sel_scn_b8_c2_en",
        "sel_scn_b8_c2_es",
        "sel_scn_b9_q_en",
        "sel_scn_b9_q_es",
        "sel_scn_b9_c0_en",
        "sel_scn_b9_c0_es",
        "sel_scn_b9_c1_en",
        "sel_scn_b9_c1_es",
        "sel_scn_b9_c2_en",
        "sel_scn_b9_c2_es",
        "sel_scn_b10_q_en",
        "sel_scn_b10_q_es",
        "sel_scn_b10_c0_en",
        "sel_scn_b10_c0_es",
        "sel_scn_b10_c1_en",
        "sel_scn_b10_c1_es",
        "sel_scn_b10_c2_en",
        "sel_scn_b10_c2_es",
        "emo_b1_p0_en",
        "emo_b1_p0_es",
        "emo_b1_p1_en",
        "emo_b1_p1_es",
        "emo_b1_p2_en",
        "emo_b1_p2_es",
        "emo_b1_p3_en",
        "emo_b1_p3_es",
        "emo_b1_p4_en",
        "emo_b1_p4_es",
        "emo_b1_p5_en",
        "emo_b1_p5_es",
        "emo_b1_p6_en",
        "emo_b1_p6_es",
        "emo_b1_p7_en",
        "emo_b1_p7_es",
        "emo_b1_p8_en",
        "emo_b1_p8_es",
        "emo_b1_p9_en",
        "emo_b1_p9_es",
        "emo_b1_p10_en",
        "emo_b1_p10_es",
        "emo_b1_p11_en",
        "emo_b1_p11_es",
        "emo_b1_p12_en",
        "emo_b1_p12_es",
        "emo_b1_p13_en",
        "emo_b1_p13_es",
        "emo_b1_p14_en",
        "emo_b1_p14_es",
        "emo_b1_p15_en",
        "emo_b1_p15_es",
        "en_w_nervous",
        "es_w_nervioso",
        "en_w_worried",
        "es_w_preocupado",
        "en_w_shy",
        "es_w_timido",
        "en_w_restless",
        "es_w_inquieto",
        "en_w_safe",
        "es_w_seguro",
        "en_w_proud",
        "es_w_orgulloso",
        "emo_b1_q0_en",
        "emo_b1_q0_es",
        "emo_b1_q0c0_en",
        "emo_b1_q0c0_es",
        "emo_b1_q0c1_en",
        "emo_b1_q0c1_es",
        "emo_b1_q0c2_en",
        "emo_b1_q0c2_es",
        "emo_b1_q1_en",
        "emo_b1_q1_es",
        "emo_b1_q1c0_en",
        "emo_b1_q1c0_es",
        "emo_b1_q1c1_en",
        "emo_b1_q1c1_es",
        "emo_b1_q1c2_en",
        "emo_b1_q1c2_es",
        "emo_b1_q2_en",
        "emo_b1_q2_es",
        "emo_b2_p0_en",
        "emo_b2_p0_es",
        "emo_b2_p1_en",
        "emo_b2_p1_es",
        "emo_b2_p2_en",
        "emo_b2_p2_es",
        "emo_b2_p3_en",
        "emo_b2_p3_es",
        "emo_b2_p4_en",
        "emo_b2_p4_es",
        "emo_b2_p5_en",
        "emo_b2_p5_es",
        "emo_b2_p6_en",
        "emo_b2_p6_es",
        "emo_b2_p7_en",
        "emo_b2_p7_es",
        "emo_b2_p8_en",
        "emo_b2_p8_es",
        "emo_b2_p9_en",
        "emo_b2_p9_es",
        "emo_b2_p10_en",
        "emo_b2_p10_es",
        "emo_b2_p11_en",
        "emo_b2_p11_es",
        "emo_b2_p12_en",
        "emo_b2_p12_es",
        "emo_b2_p13_en",
        "emo_b2_p13_es",
        "emo_b2_p14_en",
        "emo_b2_p14_es",
        "emo_b2_p15_en",
        "emo_b2_p15_es",
        "en_w_angry",
        "es_w_enojado",
        "en_w_frustrated",
        "es_w_frustrado",
        "en_w_annoyed",
        "es_w_molesto",
        "en_w_grumpy",
        "es_w_malhumorado",
        "en_w_tense",
        "es_w_tenso",
        "en_w_impatient",
        "es_w_impaciente",
        "en_w_calmer",
        "es_w_calmado",
        "en_w_peaceful",
        "emo_b2_q0_en",
        "emo_b2_q0_es",
        "emo_b2_q0c0_en",
        "emo_b2_q0c0_es",
        "emo_b2_q0c1_en",
        "emo_b2_q0c1_es",
        "emo_b2_q0c2_en",
        "emo_b2_q0c2_es",
        "emo_b2_q1_en",
        "emo_b2_q1_es",
        "emo_b2_q1c0_en",
        "emo_b2_q1c0_es",
        "emo_b2_q1c1_en",
        "emo_b2_q1c1_es",
        "emo_b2_q1c2_en",
        "emo_b2_q1c2_es",
        "emo_b2_q2_en",
        "emo_b2_q2_es",
        "emo_b3_p0_en",
        "emo_b3_p0_es",
        "emo_b3_p1_en",
        "emo_b3_p1_es",
        "emo_b3_p2_en",
        "emo_b3_p2_es",
        "emo_b3_p3_en",
        "emo_b3_p3_es",
        "emo_b3_p4_en",
        "emo_b3_p4_es",
        "emo_b3_p5_en",
        "emo_b3_p5_es",
        "emo_b3_p6_en",
        "emo_b3_p6_es",
        "emo_b3_p7_en",
        "emo_b3_p7_es",
        "emo_b3_p8_en",
        "emo_b3_p8_es",
        "emo_b3_p9_en",
        "emo_b3_p9_es",
        "emo_b3_p10_en",
        "emo_b3_p10_es",
        "emo_b3_p11_en",
        "emo_b3_p11_es",
        "emo_b3_p12_en",
        "emo_b3_p12_es",
        "emo_b3_p13_en",
        "emo_b3_p13_es",
        "emo_b3_p14_en",
        "emo_b3_p14_es",
        "emo_b3_p15_en",
        "emo_b3_p15_es",
        "en_w_sad",
        "es_w_triste",
        "en_w_down",
        "es_w_abatido",
        "en_w_teary",
        "es_w_lloroso",
        "en_w_homesick",
        "es_w_nostalgico",
        "en_w_empty",
        "es_w_vacio",
        "en_w_comforted",
        "es_w_consolado",
        "en_w_loved",
        "es_w_querido",
        "en_w_hopeful",
        "es_w_esperanzado",
        "emo_b3_q0_en",
        "emo_b3_q0_es",
        "emo_b3_q0c0_en",
        "emo_b3_q0c0_es",
        "emo_b3_q0c1_en",
        "emo_b3_q0c1_es",
        "emo_b3_q0c2_en",
        "emo_b3_q0c2_es",
        "emo_b3_q1_en",
        "emo_b3_q1_es",
        "emo_b3_q1c0_en",
        "emo_b3_q1c0_es",
        "emo_b3_q1c1_en",
        "emo_b3_q1c1_es",
        "emo_b3_q1c2_en",
        "emo_b3_q1c2_es",
        "emo_b3_q2_en",
        "emo_b3_q2_es",
        "emo_b4_p0_en",
        "emo_b4_p0_es",
        "emo_b4_p1_en",
        "emo_b4_p1_es",
        "emo_b4_p2_en",
        "emo_b4_p2_es",
        "emo_b4_p3_en",
        "emo_b4_p3_es",
        "emo_b4_p4_en",
        "emo_b4_p4_es",
        "emo_b4_p5_en",
        "emo_b4_p5_es",
        "emo_b4_p6_en",
        "emo_b4_p6_es",
        "emo_b4_p7_en",
        "emo_b4_p7_es",
        "emo_b4_p8_en",
        "emo_b4_p8_es",
        "emo_b4_p9_en",
        "emo_b4_p9_es",
        "emo_b4_p10_en",
        "emo_b4_p10_es",
        "emo_b4_p11_en",
        "emo_b4_p11_es",
        "emo_b4_p12_en",
        "emo_b4_p12_es",
        "emo_b4_p13_en",
        "emo_b4_p13_es",
        "emo_b4_p14_en",
        "emo_b4_p14_es",
        "emo_b4_p15_en",
        "emo_b4_p15_es",
        "en_w_left_out",
        "es_w_excluido",
        "en_w_ignored",
        "es_w_ignorado",
        "en_w_invisible",
        "es_w_invisible",
        "en_w_included",
        "es_w_incluido",
        "en_w_welcome",
        "es_w_bienvenido",
        "en_w_friendly",
        "es_w_amable",
        "emo_b4_q0_en",
        "emo_b4_q0_es",
        "emo_b4_q0c0_en",
        "emo_b4_q0c0_es",
        "emo_b4_q0c1_en",
        "emo_b4_q0c1_es",
        "emo_b4_q0c2_en",
        "emo_b4_q0c2_es",
        "emo_b4_q1_en",
        "emo_b4_q1_es",
        "emo_b4_q1c0_en",
        "emo_b4_q1c0_es",
        "emo_b4_q1c1_en",
        "emo_b4_q1c1_es",
        "emo_b4_q1c2_en",
        "emo_b4_q1c2_es",
        "emo_b4_q2_en",
        "emo_b4_q2_es",
        "emo_b5_p0_en",
        "emo_b5_p0_es",
        "emo_b5_p1_en",
        "emo_b5_p1_es",
        "emo_b5_p2_en",
        "emo_b5_p2_es",
        "emo_b5_p3_en",
        "emo_b5_p3_es",
        "emo_b5_p4_en",
        "emo_b5_p4_es",
        "emo_b5_p5_en",
        "emo_b5_p5_es",
        "emo_b5_p6_en",
        "emo_b5_p6_es",
        "emo_b5_p7_en",
        "emo_b5_p7_es",
        "emo_b5_p8_en",
        "emo_b5_p8_es",
        "emo_b5_p9_en",
        "emo_b5_p9_es",
        "emo_b5_p10_en",
        "emo_b5_p10_es",
        "emo_b5_p11_en",
        "emo_b5_p11_es",
        "emo_b5_p12_en",
        "emo_b5_p12_es",
        "emo_b5_p13_en",
        "emo_b5_p13_es",
        "emo_b5_p14_en",
        "emo_b5_p14_es",
        "emo_b5_p15_en",
        "emo_b5_p15_es",
        "en_w_jealous",
        "es_w_celoso",
        "en_w_envious",
        "es_w_envidioso",
        "en_w_resentful",
        "es_w_resentido",
        "en_w_unfair",
        "es_w_injusto",
        "en_w_eager",
        "es_w_deseoso",
        "en_w_happy_for_you",
        "es_w_contento_por_ti",
        "en_w_grateful",
        "es_w_agradecido",
        "emo_b5_q0_en",
        "emo_b5_q0_es",
        "emo_b5_q0c0_en",
        "emo_b5_q0c0_es",
        "emo_b5_q0c1_en",
        "emo_b5_q0c1_es",
        "emo_b5_q0c2_en",
        "emo_b5_q0c2_es",
        "emo_b5_q1_en",
        "emo_b5_q1_es",
        "emo_b5_q1c0_en",
        "emo_b5_q1c0_es",
        "emo_b5_q1c1_en",
        "emo_b5_q1c1_es",
        "emo_b5_q1c2_en",
        "emo_b5_q1c2_es",
        "emo_b5_q2_en",
        "emo_b5_q2_es",
        "emo_b6_p0_en",
        "emo_b6_p0_es",
        "emo_b6_p1_en",
        "emo_b6_p1_es",
        "emo_b6_p2_en",
        "emo_b6_p2_es",
        "emo_b6_p3_en",
        "emo_b6_p3_es",
        "emo_b6_p4_en",
        "emo_b6_p4_es",
        "emo_b6_p5_en",
        "emo_b6_p5_es",
        "emo_b6_p6_en",
        "emo_b6_p6_es",
        "emo_b6_p7_en",
        "emo_b6_p7_es",
        "emo_b6_p8_en",
        "emo_b6_p8_es",
        "emo_b6_p9_en",
        "emo_b6_p9_es",
        "emo_b6_p10_en",
        "emo_b6_p10_es",
        "emo_b6_p11_en",
        "emo_b6_p11_es",
        "emo_b6_p12_en",
        "emo_b6_p12_es",
        "emo_b6_p13_en",
        "emo_b6_p13_es",
        "emo_b6_p14_en",
        "emo_b6_p14_es",
        "emo_b6_p15_en",
        "emo_b6_p15_es",
        "en_w_fearful",
        "es_w_temeroso",
        "en_w_startled",
        "es_w_sobresaltado",
        "en_w_sleepy",
        "es_w_sonoliento",
        "emo_b6_q0_en",
        "emo_b6_q0_es",
        "emo_b6_q0c0_en",
        "emo_b6_q0c0_es",
        "emo_b6_q0c1_en",
        "emo_b6_q0c1_es",
        "emo_b6_q0c2_en",
        "emo_b6_q0c2_es",
        "emo_b6_q1_en",
        "emo_b6_q1_es",
        "emo_b6_q1c0_en",
        "emo_b6_q1c0_es",
        "emo_b6_q1c1_en",
        "emo_b6_q1c1_es",
        "emo_b6_q1c2_en",
        "emo_b6_q1c2_es",
        "emo_b6_q2_en",
        "emo_b6_q2_es",
        "emo_b7_p0_en",
        "emo_b7_p0_es",
        "emo_b7_p1_en",
        "emo_b7_p1_es",
        "emo_b7_p2_en",
        "emo_b7_p2_es",
        "emo_b7_p3_en",
        "emo_b7_p3_es",
        "emo_b7_p4_en",
        "emo_b7_p4_es",
        "emo_b7_p5_en",
        "emo_b7_p5_es",
        "emo_b7_p6_en",
        "emo_b7_p6_es",
        "emo_b7_p7_en",
        "emo_b7_p7_es",
        "emo_b7_p8_en",
        "emo_b7_p8_es",
        "emo_b7_p9_en",
        "emo_b7_p9_es",
        "emo_b7_p10_en",
        "emo_b7_p10_es",
        "emo_b7_p11_en",
        "emo_b7_p11_es",
        "emo_b7_p12_en",
        "emo_b7_p12_es",
        "emo_b7_p13_en",
        "emo_b7_p13_es",
        "emo_b7_p14_en",
        "emo_b7_p14_es",
        "emo_b7_p15_en",
        "emo_b7_p15_es",
        "en_w_embarrassed",
        "es_w_avergonzado",
        "es_w_apenado",
        "en_w_forgiven",
        "es_w_perdonado",
        "en_w_confident",
        "emo_b7_q0_en",
        "emo_b7_q0_es",
        "emo_b7_q0c0_en",
        "emo_b7_q0c0_es",
        "emo_b7_q0c1_en",
        "emo_b7_q0c1_es",
        "emo_b7_q0c2_en",
        "emo_b7_q0c2_es",
        "emo_b7_q1_en",
        "emo_b7_q1_es",
        "emo_b7_q1c0_en",
        "emo_b7_q1c0_es",
        "emo_b7_q1c1_en",
        "emo_b7_q1c1_es",
        "emo_b7_q1c2_en",
        "emo_b7_q1c2_es",
        "emo_b7_q2_en",
        "emo_b7_q2_es",
        "emo_b8_p0_en",
        "emo_b8_p0_es",
        "emo_b8_p1_en",
        "emo_b8_p1_es",
        "emo_b8_p2_en",
        "emo_b8_p2_es",
        "emo_b8_p3_en",
        "emo_b8_p3_es",
        "emo_b8_p4_en",
        "emo_b8_p4_es",
        "emo_b8_p5_en",
        "emo_b8_p5_es",
        "emo_b8_p6_en",
        "emo_b8_p6_es",
        "emo_b8_p7_en",
        "emo_b8_p7_es",
        "emo_b8_p8_en",
        "emo_b8_p8_es",
        "emo_b8_p9_en",
        "emo_b8_p9_es",
        "emo_b8_p10_en",
        "emo_b8_p10_es",
        "emo_b8_p11_en",
        "emo_b8_p11_es",
        "emo_b8_p12_en",
        "emo_b8_p12_es",
        "emo_b8_p13_en",
        "emo_b8_p13_es",
        "emo_b8_p14_en",
        "emo_b8_p14_es",
        "emo_b8_p15_en",
        "emo_b8_p15_es",
        "en_w_excited",
        "es_w_emocionado",
        "en_w_thrilled",
        "es_w_entusiasmado",
        "en_w_squirmy",
        "es_w_movedizo",
        "en_w_focused",
        "es_w_concentrado",
        "en_w_ready",
        "es_w_listo",
        "emo_b8_q0_en",
        "emo_b8_q0_es",
        "emo_b8_q0c1_en",
        "emo_b8_q0c1_es",
        "emo_b8_q0c2_en",
        "emo_b8_q0c2_es",
        "emo_b8_q1_en",
        "emo_b8_q1_es",
        "emo_b8_q1c0_en",
        "emo_b8_q1c0_es",
        "emo_b8_q1c1_en",
        "emo_b8_q1c1_es",
        "emo_b8_q1c2_en",
        "emo_b8_q1c2_es",
        "emo_b8_q2_en",
        "emo_b8_q2_es",
        "emo_b9_p0_en",
        "emo_b9_p0_es",
        "emo_b9_p1_en",
        "emo_b9_p1_es",
        "emo_b9_p2_en",
        "emo_b9_p2_es",
        "emo_b9_p3_en",
        "emo_b9_p3_es",
        "emo_b9_p4_en",
        "emo_b9_p4_es",
        "emo_b9_p5_en",
        "emo_b9_p5_es",
        "emo_b9_p6_en",
        "emo_b9_p6_es",
        "emo_b9_p7_en",
        "emo_b9_p7_es",
        "emo_b9_p8_en",
        "emo_b9_p8_es",
        "emo_b9_p9_en",
        "emo_b9_p9_es",
        "emo_b9_p10_en",
        "emo_b9_p10_es",
        "emo_b9_p11_en",
        "emo_b9_p11_es",
        "emo_b9_p12_en",
        "emo_b9_p12_es",
        "emo_b9_p13_en",
        "emo_b9_p13_es",
        "emo_b9_p14_en",
        "emo_b9_p14_es",
        "emo_b9_p15_en",
        "emo_b9_p15_es",
        "en_w_lonely",
        "es_w_solitario",
        "en_w_bored",
        "es_w_aburrido",
        "en_w_forgotten",
        "es_w_olvidado",
        "en_w_connected",
        "es_w_conectado",
        "emo_b9_q0_en",
        "emo_b9_q0_es",
        "emo_b9_q0c0_en",
        "emo_b9_q0c0_es",
        "emo_b9_q0c1_en",
        "emo_b9_q0c1_es",
        "emo_b9_q0c2_en",
        "emo_b9_q0c2_es",
        "emo_b9_q1_en",
        "emo_b9_q1_es",
        "emo_b9_q1c0_en",
        "emo_b9_q1c0_es",
        "emo_b9_q1c1_en",
        "emo_b9_q1c1_es",
        "emo_b9_q1c2_en",
        "emo_b9_q1c2_es",
        "emo_b9_q2_en",
        "emo_b9_q2_es",
        "emo_b10_p0_en",
        "emo_b10_p0_es",
        "emo_b10_p1_en",
        "emo_b10_p1_es",
        "emo_b10_p2_en",
        "emo_b10_p2_es",
        "emo_b10_p3_en",
        "emo_b10_p3_es",
        "emo_b10_p4_en",
        "emo_b10_p4_es",
        "emo_b10_p5_en",
        "emo_b10_p5_es",
        "emo_b10_p6_en",
        "emo_b10_p6_es",
        "emo_b10_p7_en",
        "emo_b10_p7_es",
        "emo_b10_p8_en",
        "emo_b10_p8_es",
        "emo_b10_p9_en",
        "emo_b10_p9_es",
        "emo_b10_p10_en",
        "emo_b10_p10_es",
        "emo_b10_p11_en",
        "emo_b10_p11_es",
        "emo_b10_p12_en",
        "emo_b10_p12_es",
        "emo_b10_p13_en",
        "emo_b10_p13_es",
        "emo_b10_p14_en",
        "emo_b10_p14_es",
        "emo_b10_p15_en",
        "emo_b10_p15_es",
        "en_w_pleased",
        "es_w_contento",
        "emo_b10_q0_en",
        "emo_b10_q0_es",
        "emo_b10_q0c0_en",
        "emo_b10_q0c0_es",
        "emo_b10_q0c1_en",
        "emo_b10_q0c1_es",
        "emo_b10_q0c2_en",
        "emo_b10_q0c2_es",
        "emo_b10_q1_en",
        "emo_b10_q1_es",
        "emo_b10_q1c0_en",
        "emo_b10_q1c0_es",
        "emo_b10_q1c1_en",
        "emo_b10_q1c1_es",
        "emo_b10_q1c2_en",
        "emo_b10_q1c2_es",
        "emo_b10_q2_en",
        "emo_b10_q2_es",
        "emo_b10_q2c1_en"
      ];
      let added = 0;
      for (let i = 0;i < IDS.length; i += 200) {
        const { sizes } = await ctx.executePrivileged(privileged.readClipSizes, { ids: IDS.slice(i, i + 200) });
        const stale = [];
        await Promise.all(sizes.map(async (s) => {
          const head = await ctx.blobs.head(`audio/${s.id}`);
          if (!head || (head.sizeBytes ?? head.size) !== s.size)
            stale.push(s.id);
        }));
        for (let j = 0;j < stale.length; j += 90) {
          const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: stale.slice(j, j + 90) });
          await Promise.all(clips.map(async (clip) => {
            const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
            await ctx.blobs.put(`audio/${clip.id}`, bytes, { contentType: "audio/mpeg" });
            added += 1;
          }));
        }
      }
      await store.metaSet("sel_clips_version", PACK_VERSION);
      return { clipsAdded: added, packVersion: PACK_VERSION };
    }
  }),
  saveFeelingsEntry: defineAction({
    description: "Save one student's feelings-journal entry from El Rinc\xF3n de las Emociones.",
    request: object({
      studentId: string2().max(60).default(""),
      feelingId: string2().min(1).max(60),
      dateISO: string2().max(40).optional()
    }),
    response: object({ ok: boolean2(), count: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const sid = args.studentId.trim();
      if (!sid)
        return { ok: false, count: 0 };
      if (!await store.studentExists(sid))
        return { ok: false, count: 0 };
      const key = `feelings_entries:${sid}`;
      const raw = await store.metaGet(key);
      let entries = [];
      try {
        const parsed = JSON.parse(raw ?? "[]");
        if (Array.isArray(parsed))
          entries = parsed;
      } catch {
        entries = [];
      }
      entries.push({ dateISO: args.dateISO && args.dateISO.length > 0 ? args.dateISO : new Date().toISOString(), feelingId: args.feelingId });
      if (entries.length > 200)
        entries = entries.slice(-200);
      await store.metaSet(key, JSON.stringify(entries));
      ctx.invalidateQueries();
      return { ok: true, count: entries.length };
    }
  }),
  getFeelingsEntries: defineAction({
    description: "List saved feelings-journal entries for the teacher view.",
    request: object({ studentId: string2().max(60).default("") }),
    response: object({
      entries: array(object({ dateISO: string2(), feelingId: string2() })),
      count: number2()
    }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const sid = args.studentId.trim() || "guest";
      const key = `feelings_entries:${sid}`;
      const raw = await store.metaGet(key);
      let entries = [];
      try {
        const parsed = JSON.parse(raw ?? "[]");
        if (Array.isArray(parsed)) {
          entries = parsed.filter((e) => e && typeof e.dateISO === "string" && typeof e.feelingId === "string");
        }
      } catch {
        entries = [];
      }
      const newestFirst = [...entries].reverse();
      return { entries: newestFirst.slice(0, 30), count: entries.length };
    }
  }),
  saveMorningCheckin: defineAction({
    description: "Record the signed-in student's SEL morning check-in (one feeling) for today.",
    request: object({
      studentId: string2().max(60).default(""),
      feelingId: string2().min(1).max(60),
      localDay: string2().regex(/^\d{4}-\d{2}-\d{2}$/)
    }),
    response: object({ ok: boolean2(), count: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const sid = args.studentId.trim();
      if (!sid)
        return { ok: false, count: 0 };
      if (!await store.studentExists(sid))
        return { ok: false, count: 0 };
      const key = `feelings_entries:${sid}`;
      const raw = await store.metaGet(key);
      let entries = [];
      try {
        const parsed = JSON.parse(raw ?? "[]");
        if (Array.isArray(parsed))
          entries = parsed;
      } catch {
        entries = [];
      }
      const already = entries.some((e) => e && e.kind === "checkin" && e.localDay === args.localDay);
      if (!already) {
        entries.push({ dateISO: new Date().toISOString(), feelingId: args.feelingId, kind: "checkin", localDay: args.localDay });
        if (entries.length > 200)
          entries = entries.slice(-200);
        await store.metaSet(key, JSON.stringify(entries));
        ctx.invalidateQueries();
      }
      return { ok: true, count: entries.length };
    }
  }),
  dismissMorningCheckin: defineAction({
    description: "Remember that the student dismissed today's SEL morning check-in card without answering.",
    request: object({
      studentId: string2().max(60).default(""),
      localDay: string2().regex(/^\d{4}-\d{2}-\d{2}$/)
    }),
    response: object({ ok: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const sid = args.studentId.trim();
      if (!sid)
        return { ok: false };
      if (!await store.studentExists(sid))
        return { ok: false };
      await store.metaSet(`checkin_dismissed:${sid}`, args.localDay);
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  getMorningCheckin: defineAction({
    description: "Whether the student already answered or dismissed today's SEL morning check-in.",
    request: object({
      studentId: string2().max(60).default(""),
      localDay: string2().regex(/^\d{4}-\d{2}-\d{2}$/)
    }),
    response: object({ answered: boolean2(), dismissed: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const sid = args.studentId.trim();
      if (!sid)
        return { answered: false, dismissed: false };
      const dismissedDay = await store.metaGet(`checkin_dismissed:${sid}`);
      const raw = await store.metaGet(`feelings_entries:${sid}`);
      let answered = false;
      try {
        const parsed = JSON.parse(raw ?? "[]");
        if (Array.isArray(parsed)) {
          answered = parsed.some((e) => e && e.kind === "checkin" && e.localDay === args.localDay);
        }
      } catch {
        answered = false;
      }
      return { answered, dismissed: dismissedDay === args.localDay };
    }
  }),
  getFeelingsSnapshot: defineAction({
    description: "Aggregate class feelings counts from SEL morning check-ins: per-feeling totals for today and for this week (counts only, never per-student).",
    request: object({
      teacherToken: teacherTokenField,
      today: string2().regex(/^\d{4}-\d{2}-\d{2}$/),
      weekStart: string2().regex(/^\d{4}-\d{2}-\d{2}$/)
    }),
    response: object({
      today: array(object({ feelingId: string2(), count: number2() })),
      week: array(object({ feelingId: string2(), count: number2() })),
      todayTotal: number2(),
      weekTotal: number2(),
      weekStart: string2()
    }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const todayCounts = new Map;
      const weekCounts = new Map;
      let todayTotal = 0;
      let weekTotal = 0;
      const roster = await store.studentsAll();
      for (const s of roster) {
        const raw = await store.metaGet(`feelings_entries:${s.id}`);
        if (!raw)
          continue;
        let entries = [];
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed))
            entries = parsed;
        } catch {
          entries = [];
        }
        for (const e of entries) {
          if (!e || e.kind !== "checkin" || typeof e.feelingId !== "string" || typeof e.localDay !== "string")
            continue;
          if (e.localDay === args.today) {
            todayCounts.set(e.feelingId, (todayCounts.get(e.feelingId) ?? 0) + 1);
            todayTotal += 1;
          }
          if (e.localDay >= args.weekStart && e.localDay <= args.today) {
            weekCounts.set(e.feelingId, (weekCounts.get(e.feelingId) ?? 0) + 1);
            weekTotal += 1;
          }
        }
      }
      const toList = (m) => [...m.entries()].map(([feelingId, count]) => ({ feelingId, count }));
      return { today: toList(todayCounts), week: toList(weekCounts), todayTotal, weekTotal, weekStart: args.weekStart };
    }
  }),
  refreshNumberClips: defineAction({
    description: "Force-refresh the repaired number-speech clips (atoms and whole composites) over the seeded blobs.",
    request: object({}),
    response: object({
      refreshed: number2(),
      clips: array(object({ id: string2(), bytes: number2() }))
    }),
    privileged: [privileged.readClipsBatch],
    async handler(ctx) {
      const IDS = [
        "num_en_0",
        "num_en_10",
        "num_en_11",
        "num_en_12",
        "num_en_13",
        "num_en_14",
        "num_en_15",
        "num_en_16",
        "num_en_17",
        "num_en_18",
        "num_en_19",
        "num_en_2",
        "num_en_20",
        "num_en_3",
        "num_en_30",
        "num_en_4",
        "num_en_40",
        "num_en_5",
        "num_en_50",
        "num_en_6",
        "num_en_60",
        "num_en_7",
        "num_en_70",
        "num_en_8",
        "num_en_80",
        "num_en_9",
        "num_en_90",
        "num_en_hundred",
        "num_en_million",
        "num_en_thousand",
        "num_es_1",
        "num_es_10",
        "num_es_12",
        "num_es_14",
        "num_es_16",
        "num_es_17",
        "num_es_18",
        "num_es_19",
        "num_es_20",
        "num_es_200",
        "num_es_21",
        "num_es_22",
        "num_es_23",
        "num_es_24",
        "num_es_25",
        "num_es_26",
        "num_es_27",
        "num_es_28",
        "num_es_29",
        "num_es_3",
        "num_es_30",
        "num_es_300",
        "num_es_40",
        "num_es_400",
        "num_es_5",
        "num_es_50",
        "num_es_500",
        "num_es_6",
        "num_es_60",
        "num_es_600",
        "num_es_7",
        "num_es_70",
        "num_es_700",
        "num_es_8",
        "num_es_80",
        "num_es_800",
        "num_es_9",
        "num_es_90",
        "num_es_900",
        "num_es_cien",
        "num_es_ciento",
        "num_es_millon",
        "num_es_millones",
        "es_w_y",
        "es_w_mil",
        "es_w_cero",
        "es_w_dos",
        "es_w_cuatro",
        "es_w_once",
        "es_w_trece",
        "es_w_quince",
        "en_w_one",
        "num_es_31",
        "num_es_32",
        "num_es_33",
        "num_es_34",
        "num_es_35",
        "num_es_36",
        "num_es_37",
        "num_es_38",
        "num_es_39",
        "num_es_41",
        "num_es_42",
        "num_es_43",
        "num_es_44",
        "num_es_45",
        "num_es_46",
        "num_es_47",
        "num_es_48",
        "num_es_49",
        "num_es_51",
        "num_es_52",
        "num_es_53",
        "num_es_54",
        "num_es_55",
        "num_es_56",
        "num_es_57",
        "num_es_58",
        "num_es_59",
        "num_es_61",
        "num_es_62",
        "num_es_63",
        "num_es_64",
        "num_es_65",
        "num_es_66",
        "num_es_67",
        "num_es_68",
        "num_es_69",
        "num_es_71",
        "num_es_72",
        "num_es_73",
        "num_es_74",
        "num_es_75",
        "num_es_76",
        "num_es_77",
        "num_es_78",
        "num_es_79",
        "num_es_81",
        "num_es_82",
        "num_es_83",
        "num_es_84",
        "num_es_85",
        "num_es_86",
        "num_es_87",
        "num_es_88",
        "num_es_89",
        "num_es_91",
        "num_es_92",
        "num_es_93",
        "num_es_94",
        "num_es_95",
        "num_es_96",
        "num_es_97",
        "num_es_98",
        "num_es_99",
        "num_en_21",
        "num_en_22",
        "num_en_23",
        "num_en_24",
        "num_en_25",
        "num_en_26",
        "num_en_27",
        "num_en_28",
        "num_en_29",
        "num_en_31",
        "num_en_32",
        "num_en_33",
        "num_en_34",
        "num_en_35",
        "num_en_36",
        "num_en_37",
        "num_en_38",
        "num_en_39",
        "num_en_41",
        "num_en_42",
        "num_en_43",
        "num_en_44",
        "num_en_45",
        "num_en_46",
        "num_en_47",
        "num_en_48",
        "num_en_49",
        "num_en_51",
        "num_en_52",
        "num_en_53",
        "num_en_54",
        "num_en_55",
        "num_en_56",
        "num_en_57",
        "num_en_58",
        "num_en_59",
        "num_en_61",
        "num_en_62",
        "num_en_63",
        "num_en_64",
        "num_en_65",
        "num_en_66",
        "num_en_67",
        "num_en_68",
        "num_en_69",
        "num_en_71",
        "num_en_72",
        "num_en_73",
        "num_en_74",
        "num_en_75",
        "num_en_76",
        "num_en_77",
        "num_en_78",
        "num_en_79",
        "num_en_81",
        "num_en_82",
        "num_en_83",
        "num_en_84",
        "num_en_85",
        "num_en_86",
        "num_en_87",
        "num_en_88",
        "num_en_89",
        "num_en_91",
        "num_en_92",
        "num_en_93",
        "num_en_94",
        "num_en_95",
        "num_en_96",
        "num_en_97",
        "num_en_98",
        "num_en_99"
      ];
      const out = [];
      for (let i = 0;i < IDS.length; i += 90) {
        const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: IDS.slice(i, i + 90) });
        for (const clip of clips) {
          const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
          const key = `audio/${clip.id}`;
          await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
          const head = await ctx.blobs.head(key);
          out.push({ id: clip.id, bytes: head?.sizeBytes ?? head?.size ?? bytes.length });
        }
      }
      return { refreshed: out.length, clips: out };
    }
  }),
  getClassroomSettings: defineAction({
    description: "Return classroom-wide settings such as the ceremony hide-names preference.",
    request: object({}),
    response: object({ hideNames: boolean2(), masterMute: boolean2(), volumeCap: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const store = await getStore(ctx);
      const rows = await store.metaAll();
      const get = (k) => rows.find((r) => r.key === k)?.value;
      const cap = Number(get("quiet_volume_cap") ?? "100");
      return {
        hideNames: get("ceremony_hide_names") === "1",
        masterMute: get("quiet_master_mute") === "1",
        volumeCap: Number.isFinite(cap) ? Math.min(100, Math.max(10, cap)) : 100
      };
    }
  }),
  setClassroomSettings: defineAction({
    description: "Update classroom-wide settings (teacher session required).",
    request: object({
      teacherToken: teacherTokenField,
      hideNames: boolean2(),
      masterMute: boolean2().optional(),
      volumeCap: number2().min(10).max(100).optional()
    }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const put = async (key, value) => {
        await store.metaSet(key, value);
      };
      await put("ceremony_hide_names", args.hideNames ? "1" : "0");
      if (typeof args.masterMute === "boolean")
        await put("quiet_master_mute", args.masterMute ? "1" : "0");
      if (typeof args.volumeCap === "number")
        await put("quiet_volume_cap", String(Math.round(args.volumeCap)));
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  getClassCode: defineAction({
    description: "Return the class join code students use to enter the Arena (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ code: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      let code = await store.metaGet("class_code") ?? "";
      if (!code) {
        code = makeClassCode();
        await store.metaSet("class_code", code);
      }
      return { code };
    }
  }),
  regenerateClassCode: defineAction({
    description: "Generate a new class join code, invalidating the old one (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ code: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const code = makeClassCode();
      await store.metaSet("class_code", code);
      ctx.invalidateQueries();
      return { code };
    }
  }),
  joinWithClassCode: defineAction({
    description: "Join the class roster by entering the class code, returning the student's saved state.",
    request: object({ code: string2().min(1).max(12) }),
    response: object({ ok: boolean2(), students: array(studentOut) }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const want = (await store.metaGet("class_code") ?? "").trim().toUpperCase();
      const got = args.code.trim().toUpperCase().replace(/[\s-]/g, "");
      if (!want || got !== want)
        return { ok: false, students: [] };
      await ensureRoster(ctx);
      const roster = await store.studentsByName();
      const radioMaster = await readRadioLeoMaster(ctx);
      return {
        ok: true,
        students: roster.map((r) => studentRowOut(r, { teacher: false, radioMaster }))
      };
    }
  }),
  selfJoinClass: defineAction({
    description: "Student self-join with the class code and their own name: creates their roster record on first join, recovers their saved record on return, or returns same-name matches to pick from.",
    request: object({ code: string2().min(1).max(12), name: string2().min(1).max(40) }),
    response: object({
      status: _enum(["joined", "pick", "bad-code"]),
      student: studentOut.nullable(),
      matches: array(studentOut)
    }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const want = (await store.metaGet("class_code") ?? "").trim().toUpperCase();
      const got = args.code.trim().toUpperCase().replace(/[\s-]/g, "");
      if (!want || got !== want)
        return { status: "bad-code", student: null, matches: [] };
      await ensureRoster(ctx);
      const cleanName = args.name.trim().replace(/\s+/g, " ");
      const norm = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();
      const roster = await store.studentsByName();
      const radioMaster = await readRadioLeoMaster(ctx);
      const toOut = (r) => studentRowOut(r, { teacher: false, radioMaster });
      const matches = roster.filter((r) => norm(r.name) === norm(cleanName));
      if (matches.length > 1) {
        return {
          status: "pick",
          student: null,
          matches: matches.map((r) => toOut(r))
        };
      }
      if (matches.length === 1) {
        const r = matches[0];
        const st = parseState(r.stateJson);
        let row = r;
        if (!st.joinedViaCodeAt) {
          st.joinedViaCodeAt = new Date().toISOString();
          await store.studentUpdateState(r.id, JSON.stringify(st));
          ctx.invalidateQueries();
          row = { ...r, stateJson: JSON.stringify(st) };
        }
        return { status: "joined", student: toOut(row), matches: [] };
      }
      const grade = await readClassGrade(ctx);
      const fresh = defaultState("es", grade);
      fresh.joinedViaCodeAt = new Date().toISOString();
      const colors = ["#C1272D", "#0E7C7B", "#E85D9E", "#1565C0", "#2E7D32", "#EF6C00"];
      const badgeColor = colors[roster.length % colors.length] ?? "#C1272D";
      const id = `st-${Date.now().toString(36)}-${randomHex(4)}`;
      await store.studentInsert({
        id,
        name: cleanName,
        groupName: "",
        badgeColor,
        stateJson: JSON.stringify(fresh)
      });
      ctx.invalidateQueries();
      const created = { id, name: cleanName, groupName: "", badgeColor, secretPicture: "", radioLeo: 0, stateJson: JSON.stringify(fresh), updatedAt: new Date };
      return { status: "joined", student: toOut(created), matches: [] };
    }
  }),
  getClassGoal: defineAction({
    description: "Return the current class goal, if one is set.",
    request: object({}),
    response: object({
      active: boolean2(),
      target: number2(),
      baseline: number2(),
      current: number2(),
      labelEn: string2(),
      labelEs: string2()
    }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const store = await getStore(ctx);
      const rawGoal = await store.metaGet("class_goal");
      let goal = null;
      try {
        goal = rawGoal ? JSON.parse(rawGoal) : null;
      } catch {
        goal = null;
      }
      await ensureRoster(ctx);
      const roster = await store.studentsAll();
      let current = 0;
      for (const r of roster) {
        const st = parseState(r.stateJson);
        for (const m of Object.values(st.mastery ?? {}))
          current += m.correct ?? 0;
      }
      if (!goal)
        return { active: false, target: 0, baseline: current, current, labelEn: "", labelEs: "" };
      return { active: true, target: goal.target, baseline: goal.baseline, current, labelEn: goal.labelEn, labelEs: goal.labelEs };
    }
  }),
  getClassMeter: defineAction({
    description: "Return the class celebration meter: the shared goal and the whole-class aggregate progress only (no per-student data).",
    request: object({}),
    response: object({
      active: boolean2(),
      labelEn: string2(),
      labelEs: string2(),
      progress: number2(),
      span: number2(),
      met: boolean2()
    }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const store = await getStore(ctx);
      const rawGoal = await store.metaGet("class_goal");
      let goal = null;
      try {
        goal = rawGoal ? JSON.parse(rawGoal) : null;
      } catch {
        goal = null;
      }
      if (!goal)
        return { active: false, labelEn: "", labelEs: "", progress: 0, span: 0, met: false };
      await ensureRoster(ctx);
      const roster = await store.studentsAll();
      let current = 0;
      for (const r of roster) {
        const st = parseState(r.stateJson);
        for (const m of Object.values(st.mastery ?? {}))
          current += m.correct ?? 0;
      }
      const span = Math.max(1, goal.target - goal.baseline);
      const progress = Math.min(span, Math.max(0, current - goal.baseline));
      return { active: true, labelEn: goal.labelEn, labelEs: goal.labelEs, progress, span, met: progress >= span };
    }
  }),
  setClassGoal: defineAction({
    description: "Set the class goal shown to students (teacher session required).",
    request: object({ teacherToken: teacherTokenField, target: number2().min(1).max(1e5), labelEn: string2().max(80), labelEs: string2().max(80) }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await ensureRoster(ctx);
      const roster = await store.studentsAll();
      let baseline = 0;
      for (const r of roster) {
        const st = parseState(r.stateJson);
        for (const m of Object.values(st.mastery ?? {}))
          baseline += m.correct ?? 0;
      }
      const goal = { target: baseline + args.target, baseline, labelEn: args.labelEn, labelEs: args.labelEs };
      await store.metaSet("class_goal", JSON.stringify(goal));
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  clearClassGoal: defineAction({
    description: "Clear the current class goal (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await store.metaDelete("class_goal");
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  saveRecording: defineAction({
    description: "Store a student or teacher audio recording (reading take or native-voice line) in blob storage.",
    request: object({
      teacherToken: teacherTokenField,
      studentId: string2().max(60),
      kind: _enum(["reading", "voice"]),
      refId: string2().min(1).max(80),
      base64: string2().min(1).max(14000000),
      contentType: string2().max(60).default("audio/webm")
    }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      if (args.kind === "voice")
        await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const bytes = Uint8Array.from(Buffer.from(args.base64, "base64"));
      const blobKey = `recordings/${args.kind}/${args.refId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await ctx.blobs.put(blobKey, bytes, { contentType: args.contentType || "audio/webm" });
      await store.recordingInsert({ studentId: args.studentId, kind: args.kind, refId: args.refId, blobKey }, { base64: args.base64, contentType: args.contentType || "audio/webm" });
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  listRecordings: defineAction({
    description: "List stored audio recordings, optionally filtered by student or kind.",
    request: object({ teacherToken: teacherTokenField, kind: _enum(["reading", "voice"]).optional() }),
    response: object({
      recordings: array(object({
        id: number2(),
        studentId: string2(),
        kind: string2(),
        refId: string2(),
        url: string2(),
        createdAt: string2()
      }))
    }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const rows = await store.recordingsList(args.kind);
      const out = [];
      for (const r of rows.slice(0, 200)) {
        await ensureRecordingServed(ctx, store, r);
        out.push({
          id: r.id,
          studentId: r.studentId,
          kind: r.kind,
          refId: r.refId,
          url: await ctx.blobs.getUrl(r.blobKey),
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt)
        });
      }
      return { recordings: out };
    }
  }),
  deleteRecording: defineAction({
    description: "Delete a stored audio recording and its blob.",
    request: object({ teacherToken: teacherTokenField, id: number2() }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await store.recordingDelete(args.id);
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  getClip: defineAction({
    description: "Return a playable URL for one audio clip by id, preferring a recorded voice take when one exists.",
    request: object({ id: string2().min(1).max(80) }),
    response: object({ ok: boolean2(), url: string2() }),
    privileged: [privileged.readClipsBatch, privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      try {
        const store = await getStore(ctx);
        const recs = await store.recordingsList("voice");
        const mine = recs.find((r) => r.refId === args.id);
        if (mine) {
          await ensureRecordingServed(ctx, store, mine);
          return { ok: true, url: await ctx.blobs.getUrl(mine.blobKey) };
        }
      } catch {}
      const key = `audio/${args.id}`;
      const head = await ctx.blobs.head(key);
      if (head) {
        return { ok: true, url: await ctx.blobs.getUrl(key) };
      }
      const { clips } = await ctx.executePrivileged(privileged.readClipsBatch, { ids: [args.id] });
      const clip = clips[0];
      if (!clip)
        return { ok: false, url: "" };
      const bytes = Uint8Array.from(Buffer.from(clip.base64, "base64"));
      await ctx.blobs.put(key, bytes, { contentType: "audio/mpeg" });
      return { ok: true, url: await ctx.blobs.getUrl(key) };
    }
  }),
  getArtAsset: defineAction({
    description: "Return a playable URL for one storybook art asset by id, copying it into blob storage on first use.",
    request: object({ id: string2().min(1).max(40) }),
    response: object({ ok: boolean2(), url: string2() }),
    privileged: [privileged.readArtBatch],
    async handler(ctx, args) {
      const key = `art/${args.id}`;
      const head = await ctx.blobs.head(key);
      if (head)
        return { ok: true, url: await ctx.blobs.getUrl(key) };
      const { art } = await ctx.executePrivileged(privileged.readArtBatch, { ids: [args.id] });
      const item = art[0];
      if (!item)
        return { ok: false, url: "" };
      const bytes = Uint8Array.from(Buffer.from(item.base64, "base64"));
      await ctx.blobs.put(key, bytes, { contentType: "image/webp" });
      return { ok: true, url: await ctx.blobs.getUrl(key) };
    }
  }),
  getArtAssetsBatch: defineAction({
    description: "Return playable URLs for several art assets in one call.",
    request: object({ ids: array(string2().min(1).max(40)).min(1).max(20) }),
    response: object({
      results: array(object({ id: string2(), ok: boolean2(), url: string2() }))
    }),
    privileged: [privileged.readArtBatch],
    async handler(ctx, args) {
      const results = [];
      const missing = [];
      for (const id of args.ids) {
        const key = `art/${id}`;
        const head = await ctx.blobs.head(key);
        if (head)
          results.push({ id, ok: true, url: await ctx.blobs.getUrl(key) });
        else
          missing.push(id);
      }
      if (missing.length > 0) {
        const { art } = await ctx.executePrivileged(privileged.readArtBatch, { ids: missing });
        const byId = new Map(art.map((a) => [a.id, a.base64]));
        for (const id of missing) {
          const base64 = byId.get(id);
          if (!base64) {
            results.push({ id, ok: false, url: "" });
            continue;
          }
          const bytes = Uint8Array.from(Buffer.from(base64, "base64"));
          await ctx.blobs.put(`art/${id}`, bytes, { contentType: "image/webp" });
          results.push({ id, ok: true, url: await ctx.blobs.getUrl(`art/${id}`) });
        }
      }
      return { results };
    }
  }),
  getVideoAsset: defineAction({
    description: "Return a playable URL for one video asset by id.",
    request: object({ id: string2().min(1).max(40) }),
    response: object({ ok: boolean2(), url: string2() }),
    privileged: [privileged.readVideoBatch],
    async handler(ctx, args) {
      const key = `video/${args.id}`;
      const head = await ctx.blobs.head(key);
      if (head)
        return { ok: true, url: await ctx.blobs.getUrl(key) };
      const { videos } = await ctx.executePrivileged(privileged.readVideoBatch, { ids: [args.id] });
      const item = videos[0];
      if (!item)
        return { ok: false, url: "" };
      const bytes = Uint8Array.from(Buffer.from(item.base64, "base64"));
      await ctx.blobs.put(key, bytes, { contentType: "video/mp4" });
      return { ok: true, url: await ctx.blobs.getUrl(key) };
    }
  }),
  getRoster: defineAction({
    description: "Return the student roster with saved game states. Requires a valid teacher session (linked emails included) or the current class code; any other caller gets an empty roster with authorized:false.",
    request: object({ teacherToken: teacherTokenField, classCode: string2().max(12).optional() }),
    response: object({ authorized: boolean2(), students: array(studentOut) }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const teacher = await isTeacher(ctx, args.teacherToken);
      let authorized = teacher;
      if (!authorized && args.classCode) {
        const want = (await store.metaGet("class_code") ?? "").trim().toUpperCase();
        const got = args.classCode.trim().toUpperCase().replace(/[\s-]/g, "");
        authorized = !!want && got === want;
      }
      if (!authorized)
        return { authorized: false, students: [] };
      await ensureRoster(ctx);
      const rows = await store.studentsByName();
      const radioMaster = await readRadioLeoMaster(ctx);
      return {
        authorized: true,
        students: rows.map((r) => studentRowOut(r, { teacher, radioMaster }))
      };
    }
  }),
  saveStudent: defineAction({
    description: "Save one student's complete game state after a meaningful play event.",
    request: object({ id: string2().min(1), state: unknown() }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const next = args.state ?? {};
      const existing = await store.studentById(args.id);
      if (existing) {
        const stored = parseState(existing.stateJson);
        next.googleEmail = stored.googleEmail ?? "";
      }
      await store.studentUpdateState(args.id, JSON.stringify(next));
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  googleSignIn: defineAction({
    description: "Sign a student in with their Google identity and return their roster record and saved state.",
    request: object({ email: string2().min(3).max(120) }),
    response: object({ kind: _enum(["student", "teacher", "none"]), studentId: string2(), student: studentOut.nullable() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const email = args.email.trim().toLowerCase();
      const store = await getStore(ctx);
      const tval = await store.metaGet("teacher_google_email");
      if (email && tval && tval.trim().toLowerCase() === email) {
        return { kind: "none", studentId: "", student: null };
      }
      await ensureRoster(ctx);
      const rows = await store.studentsAll();
      for (const r of rows) {
        const st = parseState(r.stateJson);
        if (st.googleEmail && st.googleEmail.trim().toLowerCase() === email) {
          st.googleEmail = "";
          return {
            kind: "student",
            studentId: r.id,
            student: studentRowOut(r, { teacher: false, radioMaster: await readRadioLeoMaster(ctx) })
          };
        }
      }
      return { kind: "none", studentId: "", student: null };
    }
  }),
  linkGoogleAccount: defineAction({
    description: "Link a Google account identity to a roster student (teacher session required).",
    request: object({ teacherToken: teacherTokenField, studentId: string2().min(1), email: string2().max(120) }),
    response: object({ ok: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const email = args.email.trim().toLowerCase();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { ok: false, reason: "bad-email" };
      const store = await getStore(ctx);
      const tval = await store.metaGet("teacher_google_email");
      if (email && tval && tval.trim().toLowerCase() === email) {
        return { ok: false, reason: "teacher-email" };
      }
      const rows = await store.studentsAll();
      for (const r of rows) {
        if (r.id === args.studentId)
          continue;
        const st = parseState(r.stateJson);
        if (email && st.googleEmail && st.googleEmail.trim().toLowerCase() === email) {
          return { ok: false, reason: "in-use" };
        }
      }
      const target = rows.find((r) => r.id === args.studentId);
      if (!target)
        return { ok: false, reason: "no-student" };
      const st = parseState(target.stateJson);
      st.googleEmail = email;
      await store.studentUpdateState(args.studentId, JSON.stringify(st));
      ctx.invalidateQueries();
      return { ok: true, reason: "" };
    }
  }),
  setTeacherGoogleEmail: defineAction({
    description: "Record the teacher's Google email for account linking (teacher session required).",
    request: object({ teacherToken: teacherTokenField, email: string2().max(120) }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const email = args.email.trim().toLowerCase();
      const store = await getStore(ctx);
      await store.metaSet("teacher_google_email", email);
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  getTeacherGoogleEmail: defineAction({
    description: "Return the recorded teacher Google email (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ email: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      return { email: await store.metaGet("teacher_google_email") ?? "" };
    }
  }),
  getTeacherSetupStatus: defineAction({
    description: "Report whether a teacher email and teacher PIN have been recorded, for the Maestro-door setup flow (booleans only, never the email itself).",
    request: object({}),
    response: object({ emailRecorded: boolean2(), pinConfigured: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      return { emailRecorded: await readTeacherEmail(ctx) !== "", pinConfigured: await readTeacherPin(ctx) !== null };
    }
  }),
  claimTeacherEmail: defineAction({
    description: "Record the teacher Google email during first-run Maestro setup, only while no teacher email is recorded yet.",
    request: object({ email: string2().min(3).max(120) }),
    response: object({ ok: boolean2(), reason: string2(), pinConfigured: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const pinConfigured = await readTeacherPin(ctx) !== null;
      const email = args.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { ok: false, reason: "bad-email", pinConfigured };
      if (await readTeacherEmail(ctx) !== "")
        return { ok: false, reason: "already-recorded", pinConfigured };
      await ensureRoster(ctx);
      const store = await getStore(ctx);
      const rows = await store.studentsAll();
      for (const r of rows) {
        const st = parseState(r.stateJson);
        if (st.googleEmail && st.googleEmail.trim().toLowerCase() === email) {
          return { ok: false, reason: "student-email", pinConfigured };
        }
      }
      await writeMeta(ctx, TEACHER_EMAIL_KEY, email);
      ctx.invalidateQueries();
      return { ok: true, reason: "", pinConfigured };
    }
  }),
  checkTeacherEmail: defineAction({
    description: "Check whether a Google sign-in email matches the recorded teacher email for the Maestro-door entry step (boolean only, separately rate-limited).",
    request: object({ email: string2().min(3).max(120) }),
    response: object({ match: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const recorded = await readTeacherEmail(ctx);
      if (!recorded)
        return { match: false, reason: "no-email" };
      const fails = await readEmailFails(ctx);
      if (fails.lockedUntil > Date.now())
        return { match: false, reason: "locked" };
      const email = args.email.trim().toLowerCase();
      if (email === recorded) {
        await writeMeta(ctx, TEACHER_EMAIL_FAILS_KEY, JSON.stringify({ count: 0, lockedUntil: 0 }));
        return { match: true, reason: "" };
      }
      const count = fails.count + 1;
      await writeMeta(ctx, TEACHER_EMAIL_FAILS_KEY, JSON.stringify({ count, lockedUntil: count >= 5 ? Date.now() + 5 * 60 * 1000 : 0 }));
      return { match: false, reason: count >= 5 ? "locked" : "mismatch" };
    }
  }),
  addStudent: defineAction({
    description: "Add a new student to the roster, seeded at the class grade start (teacher session required).",
    request: object({ teacherToken: teacherTokenField, name: string2().min(1).max(40), groupName: string2().max(20).default("") }),
    response: object({ id: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      await ensureRoster(ctx);
      const store = await getStore(ctx);
      const id = `st-${Date.now().toString(36)}-${randomHex(4)}`;
      const colors = ["#C1272D", "#0E7C7B", "#E85D9E", "#1565C0", "#2E7D32", "#EF6C00"];
      const grade = await readClassGrade(ctx);
      await store.studentInsert({
        id,
        name: args.name,
        groupName: args.groupName,
        badgeColor: colors[Math.floor(Math.random() * colors.length)] ?? "#C1272D",
        stateJson: JSON.stringify(defaultState("es", grade))
      });
      ctx.invalidateQueries();
      return { id };
    }
  }),
  addStudentsBulk: defineAction({
    description: "Add many students at once from a pasted class list, skipping blanks and names already on the roster (teacher session required).",
    request: object({ teacherToken: teacherTokenField, names: array(string2().max(60)).max(200), groupName: string2().max(20).default("") }),
    response: object({ added: number2(), skipped: number2(), addedNames: array(string2()) }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      await ensureRoster(ctx);
      const store = await getStore(ctx);
      const existing = new Set((await store.studentsAll()).map((r) => r.name));
      const colors = ["#C1272D", "#0E7C7B", "#E85D9E", "#1565C0", "#2E7D32", "#EF6C00"];
      const grade = await readClassGrade(ctx);
      let added = 0;
      let skipped = 0;
      const addedNames = [];
      for (const raw of args.names) {
        const name = raw.trim().slice(0, 40);
        if (!name || existing.has(name)) {
          skipped += 1;
          continue;
        }
        const id = `st-${Date.now().toString(36)}-${randomHex(4)}`;
        await store.studentInsert({
          id,
          name,
          groupName: args.groupName,
          badgeColor: colors[Math.floor(Math.random() * colors.length)] ?? "#C1272D",
          stateJson: JSON.stringify(defaultState("es", grade))
        });
        existing.add(name);
        added += 1;
        addedNames.push(name);
      }
      ctx.invalidateQueries();
      return { added, skipped, addedNames };
    }
  }),
  setClassGrade: defineAction({
    description: "Record the class grade level used to seed new students' starting rungs (teacher session required).",
    request: object({ teacherToken: teacherTokenField, grade: _enum(["K", "1", "2", "3", "4", "5"]) }),
    response: object({ ok: literal(true), grade: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await store.metaSet("class_grade", args.grade);
      ctx.invalidateQueries();
      return { ok: true, grade: args.grade };
    }
  }),
  clearClassGrade: defineAction({
    description: "Clear the class grade level so future students start with placement instead (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ ok: literal(true), grade: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await store.metaDelete("class_grade");
      ctx.invalidateQueries();
      return { ok: true, grade: "" };
    }
  }),
  applyClassGradeStart: defineAction({
    description: "Raise existing students to the class grade starting rungs without lowering anyone or touching rewards (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ ok: boolean2(), grade: string2(), updated: number2(), total: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const grade = await readClassGrade(ctx);
      const start = gradeStart(grade);
      const store = await getStore(ctx);
      const rows = await store.studentsAll();
      if (!start)
        return { ok: false, grade: "", updated: 0, total: rows.length };
      let updated = 0;
      for (const r of rows) {
        const st = parseState(r.stateJson);
        let changed = false;
        if (st.esRung < start.esRung) {
          st.esRung = start.esRung;
          st.esFamily = 0;
          st.placedEs = false;
          changed = true;
        }
        if (st.enRung < start.enRung) {
          st.enRung = start.enRung;
          st.enFamily = 0;
          st.placedEn = false;
          changed = true;
        }
        for (const mode of ["math", "en", "es"]) {
          const cur = st.belts[mode] ?? 0;
          if (cur < start.belt) {
            st.belts[mode] = start.belt;
            st.beltWins[mode] = 0;
            changed = true;
          }
        }
        if (changed || st.gradeSeed !== grade) {
          st.gradeSeed = grade;
          await store.studentUpdateState(r.id, JSON.stringify(st));
          if (changed)
            updated += 1;
        }
      }
      ctx.invalidateQueries();
      return { ok: true, grade, updated, total: rows.length };
    }
  }),
  getEventSettings: defineAction({
    description: "Return the seasonal event override settings (preview on / forced off).",
    request: object({}),
    response: object({ preview: boolean2(), off: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      return readEventSettings(ctx);
    }
  }),
  setEventSettings: defineAction({
    description: "Update the seasonal event overrides for the whole class (teacher session required).",
    request: object({ teacherToken: teacherTokenField, preview: boolean2(), off: boolean2() }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      for (const [key, on] of [["event_preview", args.preview], ["event_off", args.off]]) {
        await store.metaSet(key, on ? "1" : "0");
      }
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  renameStudent: defineAction({
    description: "Rename a roster student (teacher session required).",
    request: object({ teacherToken: teacherTokenField, id: string2().min(1), name: string2().min(1).max(40) }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await store.studentUpdateName(args.id, args.name);
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  deleteStudent: defineAction({
    description: "Permanently delete one student, their saved game state, points/progress, linked Google email, and their recordings (teacher session required).",
    request: object({ teacherToken: teacherTokenField, id: string2().min(1).max(60) }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const recs = await store.recordingsByStudent(args.id);
      for (const r of recs) {
        try {
          await ctx.blobs.delete(r.blobKey);
        } catch {}
      }
      await store.recordingsDeleteByStudent(args.id);
      await store.assignmentsDeleteByTarget(args.id);
      await store.metaDelete(`feelings_entries:${args.id}`);
      await store.metaDelete(`checkin_dismissed:${args.id}`);
      await store.studentDelete(args.id);
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  getPictureChallenge: defineAction({
    description: "Return a shuffled set of picture tiles (the student's secret picture hidden among decoys) for the badge-entry picture challenge.",
    request: object({ studentId: string2().min(1).max(60) }),
    response: object({ hasPicture: boolean2(), tiles: array(string2()) }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const row = await store.studentById(args.studentId);
      const secret = row?.secretPicture ?? "";
      if (!row || !isSecretPictureId(secret))
        return { hasPicture: false, tiles: [] };
      const decoys = shuffled(SECRET_PICTURE_IDS.filter((id) => id !== secret)).slice(0, 7);
      return { hasPicture: true, tiles: shuffled([secret, ...decoys]) };
    }
  }),
  verifySecretPicture: defineAction({
    description: "Check a tapped picture against the student's secret picture server-side; on success return the student's saved state for entry, on failure a plain not-ok.",
    request: object({ studentId: string2().min(1).max(60), pictureId: string2().min(1).max(40) }),
    response: object({ ok: boolean2(), student: studentOut.nullable() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const r = await store.studentById(args.studentId);
      if (!r)
        return { ok: false, student: null };
      const radioMaster = await readRadioLeoMaster(ctx);
      if (!isSecretPictureId(r.secretPicture))
        return { ok: true, student: studentRowOut(r, { teacher: false, radioMaster }) };
      if (args.pictureId !== r.secretPicture)
        return { ok: false, student: null };
      return { ok: true, student: studentRowOut(r, { teacher: false, radioMaster }) };
    }
  }),
  setSecretPicture: defineAction({
    description: "Set or clear (empty pictureId) a student's secret picture for badge-entry picture lock (teacher session required).",
    request: object({ teacherToken: teacherTokenField, studentId: string2().min(1).max(60), pictureId: string2().max(40) }),
    response: object({ ok: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      if (args.pictureId !== "" && !isSecretPictureId(args.pictureId))
        return { ok: false, reason: "bad-picture" };
      const store = await getStore(ctx);
      if (!await store.studentExists(args.studentId))
        return { ok: false, reason: "no-student" };
      await store.studentUpdateSecretPicture(args.studentId, args.pictureId);
      ctx.invalidateQueries();
      return { ok: true, reason: "" };
    }
  }),
  verifyFamilyPeek: defineAction({
    description: "Verify a family's tapped secret picture for the family progress peek; only on success return a read-only progress summary for that one student.",
    request: object({ studentId: string2().min(1).max(60), pictureId: string2().min(1).max(40) }),
    response: familyPeekResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const r = await store.studentById(args.studentId);
      if (!r)
        return { status: "wrong", summary: null };
      if (!isSecretPictureId(r.secretPicture))
        return { status: "no-picture", summary: null };
      if (args.pictureId !== r.secretPicture)
        return { status: "wrong", summary: null };
      const st = parseState(r.stateJson);
      const numTrack = (src) => {
        const o = {};
        for (const mode of ["math", "en", "es"])
          o[mode] = typeof src?.[mode] === "number" ? src[mode] : 0;
        return o;
      };
      const beltDates = {};
      for (const [k, v] of Object.entries(st.beltDates ?? {}))
        if (typeof v === "string")
          beltDates[k] = v;
      const mastery = {};
      for (const [k, v] of Object.entries(st.mastery ?? {})) {
        const m = v;
        if (typeof m?.correct === "number" && typeof m?.total === "number")
          mastery[k] = { correct: m.correct, total: m.total };
      }
      const recent = {};
      for (const [k, v] of Object.entries(st.recent ?? {})) {
        if (Array.isArray(v))
          recent[k] = v.filter((n) => typeof n === "number");
      }
      return {
        status: "ok",
        summary: {
          name: r.name,
          badgeColor: r.badgeColor,
          lang: st.lang === "en" ? "en" : "es",
          avatar: {
            mask: st.equipped.mask,
            suit: st.equipped.suit,
            cape: st.equipped.cape,
            gear: st.equipped.gear,
            trim: st.equipped.trim
          },
          puntos: st.puntosTotal,
          rayos: st.rayos,
          battlesWon: st.battlesWon,
          belts: numTrack(st.belts),
          beltWins: numTrack(st.beltWins),
          beltDates,
          esRung: st.esRung,
          enRung: st.enRung,
          gradeSeed: st.gradeSeed,
          mastery,
          recent,
          booksRead: [...st.gardenDone ?? []],
          scienceDone: [...st.scienceDone ?? []]
        }
      };
    }
  }),
  getRadioLeoSettings: defineAction({
    description: "Return the class-wide Radio Leo master switch state (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ masterEnabled: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      return { masterEnabled: await readRadioLeoMaster(ctx) };
    }
  }),
  setRadioLeoMaster: defineAction({
    description: "Set the class-wide Radio Leo master switch (teacher session required).",
    request: object({ teacherToken: teacherTokenField, enabled: boolean2() }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await store.metaSet(RADIO_LEO_MASTER_KEY, args.enabled ? "1" : "0");
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  setRadioLeoStudent: defineAction({
    description: "Set one student's Radio Leo switch (teacher session required).",
    request: object({ teacherToken: teacherTokenField, studentId: string2().min(1).max(60), enabled: boolean2() }),
    response: object({ ok: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      if (!await store.studentExists(args.studentId))
        return { ok: false, reason: "no-student" };
      await store.studentUpdateRadioLeo(args.studentId, args.enabled);
      ctx.invalidateQueries();
      return { ok: true, reason: "" };
    }
  }),
  awardClassBattle: defineAction({
    description: "Record a class battle win in the shared class tally.",
    request: object({ rayos: number2().int().min(1).max(50) }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await ensureRoster(ctx);
      const store = await getStore(ctx);
      const rows = await store.studentsAll();
      for (const r of rows) {
        const st = parseState(r.stateJson);
        st.rayos += args.rayos;
        st.puntosTotal += args.rayos;
        await store.studentUpdateState(r.id, JSON.stringify(st));
      }
      const winsVal = await store.metaGet("class_battle_wins");
      const n = (winsVal !== undefined ? Number(winsVal) || 0 : 0) + 1;
      await store.metaSet("class_battle_wins", String(n));
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  listAssignments: defineAction({
    description: "List teacher assignments (class, group, or student targeted) with their windows.",
    request: object({}),
    response: object({ assignments: array(assignmentOut), classBattleWins: number2(), classGrade: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const store = await getStore(ctx);
      const rows = await store.assignmentsAll();
      const winsVal = await store.metaGet("class_battle_wins");
      const classGrade = await readClassGrade(ctx);
      return {
        assignments: rows.map((r) => ({
          id: r.id,
          title: r.title,
          targetType: r.targetType,
          targetId: r.targetId,
          section: r.section,
          skillId: r.skillId,
          stdCode: r.stdCode,
          grade: r.grade,
          windowStart: r.windowStart,
          windowEnd: r.windowEnd
        })),
        classBattleWins: winsVal !== undefined ? Number(winsVal) || 0 : 0,
        classGrade
      };
    }
  }),
  createAssignment: defineAction({
    description: "Create a teacher assignment for the whole class, a group, or one student (teacher session required).",
    request: object({
      teacherToken: teacherTokenField,
      title: string2().min(1).max(80),
      targetType: _enum(["class", "group", "student"]),
      targetId: string2().max(60).default(""),
      section: string2().min(1).max(40),
      skillId: string2().max(40).default(""),
      stdCode: string2().max(20).default(""),
      grade: string2().max(4).default(""),
      windowStart: string2().min(8).max(12),
      windowEnd: string2().min(8).max(12)
    }),
    response: object({ id: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const id = await store.assignmentInsert({
        title: args.title,
        targetType: args.targetType,
        targetId: args.targetId,
        section: args.section,
        skillId: args.skillId,
        stdCode: args.stdCode,
        grade: args.grade,
        windowStart: args.windowStart,
        windowEnd: args.windowEnd
      });
      ctx.invalidateQueries();
      return { id };
    }
  }),
  deleteAssignment: defineAction({
    description: "Delete a teacher assignment (teacher session required).",
    request: object({ teacherToken: teacherTokenField, id: number2().int() }),
    response: okResponse,
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      await store.assignmentDelete(args.id);
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  createTreasureSession: defineAction({
    description: "Start a La Lucha del Tesoro hosted session and return its join code (teacher session required).",
    request: object({
      teacherToken: teacherTokenField,
      bank: _enum(["en-sight", "es-sight", "math"]),
      lang: _enum(["en", "es"]),
      shape: _enum(["solo", "coop"]),
      durationMin: number2().int().min(3).max(20)
    }),
    response: object({ ok: literal(true), code: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const code = makeClassCode().slice(0, 4);
      const now = Date.now();
      const session = {
        code,
        bank: args.bank,
        lang: args.lang,
        shape: args.shape,
        durationMin: args.durationMin,
        startedAt: now,
        endsAt: now + args.durationMin * 60000,
        endedAt: 0,
        active: true,
        ended: false,
        classPool: 0,
        rudoStash: 100,
        lastTick: now,
        respiraSignal: 0,
        totalQuestions: 0,
        totalGold: 0,
        perStudent: {},
        summary: null
      };
      await writeMeta(ctx, "treasure_session", JSON.stringify(session));
      ctx.invalidateQueries();
      return { ok: true, code };
    }
  }),
  getTreasureSession: defineAction({
    description: "Return the live state of the current treasure session.",
    request: object({}),
    response: object({ session: unknown() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("treasure_session");
      try {
        return { session: raw ? JSON.parse(raw) : null };
      } catch {
        return { session: null };
      }
    }
  }),
  joinTreasureSession: defineAction({
    description: "Join the live treasure session as a roster student using the join code.",
    request: object({ code: string2().min(1).max(8), studentId: string2().min(1).max(60), name: string2().min(1).max(40) }),
    response: object({ ok: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("treasure_session");
      if (!raw)
        return { ok: false, reason: "no-session" };
      const s = JSON.parse(raw);
      if (!s.active || s.ended)
        return { ok: false, reason: "ended" };
      if (args.code.trim().toUpperCase() !== s.code.toUpperCase())
        return { ok: false, reason: "bad-code" };
      if (!s.perStudent[args.studentId]) {
        s.perStudent[args.studentId] = { name: args.name, gold: 0, correct: 0, answered: 0, respira: 0, puente: 0, comebacks: 0 };
        await writeMeta(ctx, "treasure_session", JSON.stringify(s));
        ctx.invalidateQueries();
      }
      return { ok: true, reason: "" };
    }
  }),
  treasureAnswer: defineAction({
    description: "Record one student's answer in the treasure session and update the class pool and rival stash.",
    request: object({
      studentId: string2().min(1).max(60),
      name: string2().min(1).max(40),
      goldDelta: number2().int().min(-2000).max(4000),
      rudoDelta: number2().int().min(-4000).max(4000),
      countAnswer: boolean2(),
      correct: boolean2(),
      kind: _enum(["normal", "respira", "puente", "catchup"])
    }),
    response: object({ ok: boolean2(), gold: number2(), classPool: number2(), rudoStash: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("treasure_session");
      if (!raw)
        return { ok: false, gold: 0, classPool: 0, rudoStash: 0 };
      const s = JSON.parse(raw);
      if (!s.active || s.ended)
        return { ok: false, gold: 0, classPool: s.classPool ?? 0, rudoStash: s.rudoStash ?? 0 };
      const me = s.perStudent[args.studentId] ?? { name: args.name, gold: 0, correct: 0, answered: 0, respira: 0, puente: 0, comebacks: 0 };
      me.name = args.name;
      if (args.countAnswer) {
        me.answered += 1;
        if (args.correct)
          me.correct += 1;
        s.totalQuestions += 1;
      }
      if (args.kind === "respira") {
        me.respira += 1;
        s.respiraSignal = Date.now();
      }
      if (args.kind === "puente")
        me.puente += 1;
      if (args.kind === "catchup")
        me.comebacks += 1;
      me.gold = Math.max(0, me.gold + args.goldDelta);
      if (args.goldDelta > 0)
        s.totalGold += args.goldDelta;
      if (s.shape === "coop")
        s.classPool = Math.max(0, s.classPool + args.goldDelta);
      s.rudoStash = Math.max(0, s.rudoStash + args.rudoDelta);
      s.perStudent[args.studentId] = me;
      await writeMeta(ctx, "treasure_session", JSON.stringify(s));
      return { ok: true, gold: me.gold, classPool: s.classPool, rudoStash: s.rudoStash };
    }
  }),
  treasureTick: defineAction({
    description: "Advance the treasure session clock check and report whether time remains.",
    request: object({}),
    response: object({ ok: boolean2(), rudoStash: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("treasure_session");
      if (!raw)
        return { ok: false, rudoStash: 0 };
      const s = JSON.parse(raw);
      if (!s.active || s.ended || Date.now() > s.endsAt)
        return { ok: true, rudoStash: s.rudoStash };
      const elapsed = Date.now() - (s.lastTick || Date.now());
      if (elapsed >= 15000) {
        const steps = Math.min(4, Math.floor(elapsed / 15000));
        s.rudoStash += steps * 4;
        s.lastTick = Date.now();
        await writeMeta(ctx, "treasure_session", JSON.stringify(s));
      }
      return { ok: true, rudoStash: s.rudoStash };
    }
  }),
  endTreasureSession: defineAction({
    description: "End the live treasure session and compute its class summary (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ ok: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const raw = await store.metaGet("treasure_session");
      if (!raw)
        return { ok: false };
      const s = JSON.parse(raw);
      if (s.ended)
        return { ok: true };
      s.active = false;
      s.ended = true;
      s.endedAt = Date.now();
      const players = Object.entries(s.perStudent).map(([id, p]) => ({ id, ...p }));
      const helpers = [...players].sort((a, b) => b.respira + b.puente - (a.respira + a.puente))[0];
      const comeback = [...players].sort((a, b) => b.comebacks - a.comebacks)[0];
      const sharpest = [...players].filter((p) => p.answered >= 3).sort((a, b) => b.correct / Math.max(1, b.answered) - a.correct / Math.max(1, a.answered))[0];
      s.summary = {
        totalQuestions: s.totalQuestions,
        totalGold: s.totalGold,
        classPool: s.classPool,
        rudoStash: s.rudoStash,
        coopWin: s.shape === "coop" ? s.classPool >= s.rudoStash : null,
        players: players.length,
        mostHelper: helpers && helpers.respira + helpers.puente > 0 ? { id: helpers.id, name: helpers.name, count: helpers.respira + helpers.puente } : null,
        biggestComeback: comeback && comeback.comebacks > 0 ? { id: comeback.id, name: comeback.name, count: comeback.comebacks } : null,
        sharpest: sharpest ? { id: sharpest.id, name: sharpest.name, correct: sharpest.correct, answered: sharpest.answered } : null
      };
      await writeMeta(ctx, "treasure_session", JSON.stringify(s));
      if (s.shape === "coop") {
        const award = s.classPool >= s.rudoStash ? 10 : 5;
        for (const p of players) {
          if (p.answered < 1)
            continue;
          const row = await store.studentById(p.id);
          if (!row)
            continue;
          const st = parseState(row.stateJson);
          st.rayos += award;
          await store.studentUpdateState(p.id, JSON.stringify(st));
        }
      }
      ctx.invalidateQueries();
      return { ok: true };
    }
  }),
  createHostedSession: defineAction({
    description: "Start a hosted game session for a registered game and return its join code (teacher session required).",
    request: object({
      teacherToken: teacherTokenField,
      gameId: string2().min(1).max(40),
      bank: string2().min(1).max(40),
      lang: _enum(["en", "es"]),
      shape: _enum(["solo", "coop"]),
      durationMin: number2().int().min(3).max(20),
      rivalStart: number2().int().min(0).max(1e4).default(100),
      themeId: string2().min(1).max(40).default("oro")
    }),
    response: object({ ok: literal(true), code: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const code = makeClassCode().slice(0, 4);
      const now = Date.now();
      const session = {
        gameId: args.gameId,
        themeId: args.themeId,
        code,
        bank: args.bank,
        lang: args.lang,
        shape: args.shape,
        durationMin: args.durationMin,
        startedAt: now,
        endsAt: now + args.durationMin * 60000,
        endedAt: 0,
        active: true,
        ended: false,
        classPool: 0,
        rivalStash: args.rivalStart,
        lastTick: now,
        signal: 0,
        signalKind: "",
        totalQuestions: 0,
        totalScore: 0,
        perStudent: {},
        summary: null
      };
      await writeMeta(ctx, "hosted_session", JSON.stringify(session));
      ctx.invalidateQueries();
      return { ok: true, code };
    }
  }),
  getHostedSession: defineAction({
    description: "Return the live hosted session state, including the names-and-gold-only scoreboard projection.",
    request: object({}),
    response: object({ session: unknown() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("hosted_session");
      try {
        if (!raw)
          return { session: null };
        const s = JSON.parse(raw);
        const scoreboard = Object.values(s.perStudent ?? {}).map((p) => ({ name: p.name, gold: p.gold })).sort((a, b) => b.gold - a.gold || a.name.localeCompare(b.name));
        return {
          session: {
            gameId: s.gameId ?? "tesoro",
            themeId: s.themeId ?? "oro",
            code: s.code,
            bank: s.bank,
            lang: s.lang,
            shape: s.shape,
            durationMin: s.durationMin,
            startedAt: s.startedAt,
            endsAt: s.endsAt,
            endedAt: s.endedAt,
            active: s.active,
            ended: s.ended,
            classPool: s.classPool,
            rivalStash: s.rivalStash,
            rudoStash: s.rivalStash,
            signal: s.signal,
            signalKind: s.signalKind,
            totalQuestions: s.totalQuestions,
            totalScore: s.totalScore,
            totalGold: s.totalScore,
            summary: s.summary ?? null,
            scoreboard
          }
        };
      } catch {
        return { session: null };
      }
    }
  }),
  getHostedOwnRow: defineAction({
    description: "Return one student's own hosted-session row (their gold and tallies) for their private celebration screen.",
    request: object({ studentId: string2().min(1).max(60) }),
    response: object({
      row: object({
        name: string2(),
        gold: number2(),
        correct: number2(),
        answered: number2(),
        respira: number2(),
        puente: number2(),
        comebacks: number2()
      }).nullable()
    }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("hosted_session");
      try {
        if (!raw)
          return { row: null };
        const s = JSON.parse(raw);
        const me = s.perStudent?.[args.studentId];
        return {
          row: me ? { name: me.name, gold: me.gold, correct: me.correct, answered: me.answered, respira: me.respira, puente: me.puente, comebacks: me.comebacks } : null
        };
      } catch {
        return { row: null };
      }
    }
  }),
  joinHostedSession: defineAction({
    description: "Join the live hosted session as a roster student using the join code.",
    request: object({ code: string2().min(1).max(8), studentId: string2().min(1).max(60), name: string2().min(1).max(40) }),
    response: object({ ok: boolean2(), reason: string2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("hosted_session");
      if (!raw)
        return { ok: false, reason: "no-session" };
      const s = JSON.parse(raw);
      if (!s.active || s.ended)
        return { ok: false, reason: "ended" };
      if (args.code.trim().toUpperCase() !== s.code.toUpperCase())
        return { ok: false, reason: "bad-code" };
      if (!s.perStudent[args.studentId]) {
        s.perStudent[args.studentId] = { name: args.name, gold: 0, correct: 0, answered: 0, respira: 0, puente: 0, comebacks: 0 };
        await writeMeta(ctx, "hosted_session", JSON.stringify(s));
        ctx.invalidateQueries();
      }
      return { ok: true, reason: "" };
    }
  }),
  hostedAnswer: defineAction({
    description: "Record one student's answer in the hosted session and update the session totals.",
    request: object({
      studentId: string2().min(1).max(60),
      name: string2().min(1).max(40),
      scoreDelta: number2().int().min(-2000).max(4000),
      rivalDelta: number2().int().min(-4000).max(4000),
      countAnswer: boolean2(),
      correct: boolean2(),
      kind: string2().min(1).max(20)
    }),
    response: object({ ok: boolean2(), gold: number2(), classPool: number2(), rivalStash: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("hosted_session");
      if (!raw)
        return { ok: false, gold: 0, classPool: 0, rivalStash: 0 };
      const s = JSON.parse(raw);
      if (!s.active || s.ended)
        return { ok: false, gold: 0, classPool: s.classPool ?? 0, rivalStash: s.rivalStash ?? 0 };
      const me = s.perStudent[args.studentId] ?? { name: args.name, gold: 0, correct: 0, answered: 0, respira: 0, puente: 0, comebacks: 0 };
      me.name = args.name;
      if (args.countAnswer) {
        me.answered += 1;
        if (args.correct)
          me.correct += 1;
        s.totalQuestions += 1;
      }
      if (args.kind === "respira") {
        me.respira += 1;
        s.signal = Date.now();
        s.signalKind = "respira";
      }
      if (args.kind === "puente")
        me.puente += 1;
      if (args.kind === "catchup")
        me.comebacks += 1;
      me.gold = Math.max(0, me.gold + args.scoreDelta);
      if (args.scoreDelta > 0)
        s.totalScore += args.scoreDelta;
      if (s.shape === "coop")
        s.classPool = Math.max(0, s.classPool + args.scoreDelta);
      s.rivalStash = Math.max(0, s.rivalStash + args.rivalDelta);
      s.perStudent[args.studentId] = me;
      await writeMeta(ctx, "hosted_session", JSON.stringify(s));
      return { ok: true, gold: me.gold, classPool: s.classPool, rivalStash: s.rivalStash };
    }
  }),
  hostedTick: defineAction({
    description: "Advance the hosted session clock check and report whether time remains.",
    request: object({ amount: number2().int().min(1).max(10).default(4) }),
    response: object({ ok: boolean2(), rivalStash: number2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      const store = await getStore(ctx);
      const raw = await store.metaGet("hosted_session");
      if (!raw)
        return { ok: false, rivalStash: 0 };
      const s = JSON.parse(raw);
      if (!s.active || s.ended || Date.now() > s.endsAt)
        return { ok: true, rivalStash: s.rivalStash };
      const elapsed = Date.now() - (s.lastTick || Date.now());
      if (elapsed >= 15000) {
        const steps = Math.min(4, Math.floor(elapsed / 15000));
        s.rivalStash += steps * args.amount;
        s.lastTick = Date.now();
        await writeMeta(ctx, "hosted_session", JSON.stringify(s));
      }
      return { ok: true, rivalStash: s.rivalStash };
    }
  }),
  endHostedSession: defineAction({
    description: "End the live hosted session and compute its class-level summary (teacher session required).",
    request: object({ teacherToken: teacherTokenField }),
    response: object({ ok: boolean2() }),
    privileged: [privileged.pgMode, privileged.pgQuery],
    async handler(ctx, args) {
      await requireTeacher(ctx, args.teacherToken);
      const store = await getStore(ctx);
      const raw = await store.metaGet("hosted_session");
      if (!raw)
        return { ok: false };
      const s = JSON.parse(raw);
      if (s.ended)
        return { ok: true };
      s.active = false;
      s.ended = true;
      s.endedAt = Date.now();
      const players = Object.entries(s.perStudent).map(([id, p]) => ({ id, ...p }));
      const helpers = [...players].sort((a, b) => b.respira + b.puente - (a.respira + a.puente))[0];
      const comeback = [...players].sort((a, b) => b.comebacks - a.comebacks)[0];
      const sharpest = [...players].filter((p) => p.answered >= 3).sort((a, b) => b.correct / Math.max(1, b.answered) - a.correct / Math.max(1, a.answered))[0];
      s.summary = {
        gameId: s.gameId,
        totalQuestions: s.totalQuestions,
        totalScore: s.totalScore,
        totalGold: s.totalScore,
        classPool: s.classPool,
        rivalStash: s.rivalStash,
        rudoStash: s.rivalStash,
        coopWin: s.shape === "coop" ? s.classPool >= s.rivalStash : null,
        players: players.length,
        mostHelper: helpers && helpers.respira + helpers.puente > 0 ? { id: helpers.id, name: helpers.name, count: helpers.respira + helpers.puente } : null,
        biggestComeback: comeback && comeback.comebacks > 0 ? { id: comeback.id, name: comeback.name, count: comeback.comebacks } : null,
        sharpest: sharpest ? { id: sharpest.id, name: sharpest.name, correct: sharpest.correct, answered: sharpest.answered } : null
      };
      await writeMeta(ctx, "hosted_session", JSON.stringify(s));
      if (s.shape === "coop") {
        const award = s.classPool >= s.rivalStash ? 10 : 5;
        for (const p of players) {
          if (p.answered < 1)
            continue;
          const row = await store.studentById(p.id);
          if (!row)
            continue;
          const st = parseState(row.stateJson);
          st.rayos += award;
          await store.studentUpdateState(p.id, JSON.stringify(st));
        }
      }
      ctx.invalidateQueries();
      return { ok: true };
    }
  })
};
export {
  Actions,
  CLASS_GRADES,
  SECRET_PICTURE_IDS
};
