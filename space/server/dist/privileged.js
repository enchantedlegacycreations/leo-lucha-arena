// @bun
// node_modules/zod/v4/core/core.js
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
// node_modules/zod/v4/core/util.js
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

// node_modules/zod/v4/core/errors.js
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

// node_modules/zod/v4/core/parse.js
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
// node_modules/zod/v4/core/regexes.js
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

// node_modules/zod/v4/core/checks.js
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

// node_modules/zod/v4/core/doc.js
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

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 4,
  patch: 3
};

// node_modules/zod/v4/core/schemas.js
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
var $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "innerType", () => {
    const d = def;
    if (!d._cachedInner)
      d._cachedInner = def.getter();
    return d._cachedInner;
  });
  defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
  defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
  defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? undefined);
  defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? undefined);
  inst._zod.parse = (payload, ctx) => {
    const inner = inst._zod.innerType;
    return inner._zod.run(payload, ctx);
  };
});
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
// node_modules/zod/v4/core/registries.js
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
// node_modules/zod/v4/core/api.js
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
// node_modules/zod/v4/core/to-json-schema.js
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
function process2(schema, ctx, _params = { path: [], schemaPath: [] }) {
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
      process2(parent, ctx, params);
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
  process2(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process2(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
// node_modules/zod/v4/core/json-schema-processors.js
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
  json.items = process2(def.element, ctx, {
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
    json.properties[key] = process2(shape[key], ctx, {
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
    json.additionalProperties = process2(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process2(x, ctx, {
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
  const a = process2(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process2(def.right, ctx, {
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
    const valueSchema = process2(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      json.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = process2(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json.additionalProperties = process2(def.valueType, ctx, {
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
  const inner = process2(def.innerType, ctx, params);
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
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
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
  process2(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var lazyProcessor = (schema, ctx, _json, params) => {
  const innerType = schema._zod.innerType;
  process2(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
// node_modules/zod/v4/classic/iso.js
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

// node_modules/zod/v4/classic/errors.js
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

// node_modules/zod/v4/classic/parse.js
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

// node_modules/zod/v4/classic/schemas.js
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
var ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
  $ZodLazy.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => lazyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
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
function json(params) {
  const jsonSchema = lazy(() => {
    return union([string2(params), number2(), boolean2(), _null3(), array(jsonSchema), record(string2(), jsonSchema)]);
  });
  return jsonSchema;
}
// node_modules/@hatch/space-sdk/dist/server-contract.js
var PRIVILEGED_CONTRACT_BRAND = "@hatch/space-sdk/privileged-contract/v1";
var PRIVILEGED_HANDLERS_FORMAT = "hatch-space-privileged-handlers-v1";
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
function definePrivilegedHandlers(contracts, handlers) {
  const entries = [];
  for (const [key, handler] of Object.entries(handlers)) {
    if (handler === undefined) {
      continue;
    }
    const contract = contracts[key];
    if (!isPrivilegedContract(contract)) {
      throw new Error(`privileged handler '${key}' does not have a contract descriptor`);
    }
    entries.push({
      contract,
      handler
    });
  }
  return {
    format: PRIVILEGED_HANDLERS_FORMAT,
    entries
  };
}
function isPrivilegedContract(value) {
  return typeof value === "object" && value !== null && "__brand" in value && value.__brand === PRIVILEGED_CONTRACT_BRAND;
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
// node_modules/drizzle-orm/entity.js
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

// node_modules/drizzle-orm/column.js
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

// node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");

// node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}

// node_modules/drizzle-orm/pg-core/columns/enum.js
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}

// node_modules/drizzle-orm/subquery.js
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

// node_modules/drizzle-orm/version.js
var version2 = "0.45.2";

// node_modules/drizzle-orm/tracing.js
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

// node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// node_modules/drizzle-orm/table.js
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

// node_modules/drizzle-orm/sql/sql.js
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

// node_modules/@hatch/space-sdk/dist/saved_product_lists.js
var SAVED_PRODUCT_LISTS_OWNER_ONLY_CODE = "saved_product_lists_owner_only";
var SAVED_PRODUCT_LISTS_UNAVAILABLE_BRAND = "@hatch/space-sdk/SavedProductListsUnavailableError/v1";

class SavedProductListsUnavailableError extends Error {
  __brand = SAVED_PRODUCT_LISTS_UNAVAILABLE_BRAND;
  code = SAVED_PRODUCT_LISTS_OWNER_ONLY_CODE;
  constructor(message = "Live saved products are available only to the Space owner", options) {
    super(message, options);
    this.name = "SavedProductListsUnavailableError";
  }
  static is(value) {
    if (value instanceof SavedProductListsUnavailableError)
      return true;
    return typeof value === "object" && value !== null && value.__brand === SAVED_PRODUCT_LISTS_UNAVAILABLE_BRAND;
  }
}
var CHECKED_FIELDS = ["name", "price", "sale_price", "currency"];
function sameSave(a, b) {
  return a.product.citation_id !== undefined && a.product.citation_id === b.product.citation_id && a.product.url === b.product.url && a.savedAt !== null && a.savedAt === b.savedAt;
}
function mergeSavedProductListsCache(previous, next) {
  if (!previous)
    return next;
  return {
    lists: next.lists.map((list) => {
      const earlier = previous.lists.find((candidate) => candidate.list === list.list);
      if (!earlier)
        return list;
      return {
        ...list,
        items: list.items.map((item) => {
          if (item.product.type !== "catalog" || item.price !== "saved" && item.price !== "refreshing") {
            return item;
          }
          const checked = earlier.items.find((candidate) => (candidate.price === "current" || candidate.price === "cached") && sameSave(candidate, item));
          if (!checked)
            return item;
          const product = { ...item.product };
          for (const field of CHECKED_FIELDS) {
            if (checked.product[field] === undefined)
              delete product[field];
            else
              product[field] = checked.product[field];
          }
          return { ...item, product, price: "cached" };
        })
      };
    })
  };
}

// node_modules/@hatch/space-sdk/dist/saved_products_action.js
var MAX_LISTS = 20;
var MAX_LIST_NAME_BYTES = 256;
var CACHE_TABLE = "hatch_saved_products";
var IMAGE_KEY = /^saved-products\/[0-9a-f]{64}\.img$/;
var IMAGE_CONTENT_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
var MAX_COMMIT_ATTEMPTS = 5;
var displayMessage = string2().refine((message) => message.trim().length > 0);
var savedProductsMessagesSchema = object({
  currentPrice: displayMessage,
  lastCheckedPrice: displayMessage,
  savedPrice: displayMessage,
  snapshotNotice: displayMessage,
  unavailableNotice: displayMessage,
  ownerSharedCopyNotice: displayMessage
});
var ENGLISH_MESSAGES = {
  currentPrice: "Current price",
  lastCheckedPrice: "Last checked price",
  savedPrice: "Saved price",
  snapshotNotice: "These are the saved products from the owner's last visit; prices may have changed since.",
  unavailableNotice: "Saved products aren't available in this copy.",
  ownerSharedCopyNotice: "This is your shared copy. Open the original Space in Muse to see live saved products."
};
var SAVED_PRODUCTS_REQUEST_SCHEMA = object({}).strict();
var PRODUCT_SCHEMA = object({
  type: _enum(["catalog", "marketplace", "browser"]),
  url: string2(),
  name: string2(),
  image_url: string2().nullable().optional(),
  citation_id: string2().optional(),
  product_id: string2().optional(),
  provider: string2().optional(),
  retailer_name: string2().optional(),
  brand: string2().optional(),
  price: string2().optional(),
  sale_price: string2().optional(),
  currency: string2().optional()
}).catchall(json());
var SAVED_PRODUCTS_RESPONSE_SCHEMA = object({
  lists: array(object({
    list: string2(),
    missing: boolean2(),
    items: array(object({
      product: PRODUCT_SCHEMA,
      image: string2().nullable(),
      priceLabel: string2().nullable()
    }))
  })),
  snapshotAt: string2().nullable(),
  notice: string2().nullable()
});
function savedProductsActionFor() {
  const defineAction = createDefineAction();
  return function savedProductsAction(options) {
    const configured = options?.messages;
    const messages = configured === "en" ? ENGLISH_MESSAGES : authoredMessages(configured);
    const selection = selectionOf(options);
    return defineAction({
      request: SAVED_PRODUCTS_REQUEST_SCHEMA,
      response: SAVED_PRODUCTS_RESPONSE_SCHEMA,
      description: "Returns the owner's saved product lists for this page: live for the owner, and the owner's last saved copy for anyone else.",
      handler: (ctx) => readSavedProducts(ctx, selection, messages)
    });
  };
}
function authoredMessages(configured) {
  const result = savedProductsMessagesSchema.safeParse(configured);
  if (!result.success) {
    throw new TypeError(`savedProductsAction requires messages: "en" for an English Space or all six display messages in the Space's language`);
  }
  return result.data;
}
function selectionOf(options) {
  if (options.lists === undefined)
    return { key: "declared", lists: [] };
  const lists = [...options.lists];
  if (lists.length === 0 || lists.length > MAX_LISTS) {
    throw new TypeError("savedProductsAction takes 1 to 20 list names");
  }
  const encoder = new TextEncoder;
  for (const name of lists) {
    if (typeof name !== "string" || name.length === 0 || encoder.encode(name).length > MAX_LIST_NAME_BYTES) {
      throw new TypeError("savedProductsAction takes list names of 1 to 256 UTF-8 bytes");
    }
  }
  if (new Set(lists).size !== lists.length) {
    throw new TypeError("savedProductsAction takes unique list names");
  }
  return { key: `lists:${JSON.stringify(lists)}`, lists };
}
async function readSavedProducts(ctx, selection, messages) {
  const startedMs = Date.now();
  let live;
  try {
    live = await ctx.tool.saved_product_lists(selection.lists);
  } catch (error) {
    if (!SavedProductListsUnavailableError.is(error))
      throw error;
    return savedCopy(ctx, selection, messages);
  }
  const lists = await commitLiveRead(ctx, selection, live, startedMs);
  return {
    lists: await publicLists(ctx, lists, { live: true, messages }),
    snapshotAt: null,
    notice: null
  };
}
async function savedCopy(ctx, selection, messages) {
  const ownerCopy = ctx.viewer?.source === "cloudflare" && ctx.viewer.isOwner === true;
  const unavailable = { lists: [], snapshotAt: null, notice: ownerCopy ? messages.ownerSharedCopyNotice : messages.unavailableNotice };
  const declared = ctx.savedProductLists;
  const names = selection.lists.length === 0 ? declared : selection.lists;
  if (declared === undefined || names === undefined || names.some((name) => !declared.includes(name))) {
    return unavailable;
  }
  const db = ctx.db();
  const row = await cacheTableExists(db) ? await readRow(db, selection) : null;
  if (row === null)
    return unavailable;
  const saved = new Map(row.lists.lists.map((list) => [list.list, list]));
  const lists = names.flatMap((name) => saved.get(name) ?? []);
  if (lists.length === 0)
    return unavailable;
  return {
    lists: await publicLists(ctx, { lists }, { live: false, messages }),
    snapshotAt: row.readAt,
    notice: ownerCopy ? messages.ownerSharedCopyNotice : messages.snapshotNotice
  };
}
async function commitLiveRead(ctx, selection, live, startedMs) {
  const db = ctx.db();
  await db.run(sql`CREATE TABLE IF NOT EXISTS hatch_saved_products (
      selection TEXT PRIMARY KEY NOT NULL,
      revision INTEGER NOT NULL,
      started_ms INTEGER NOT NULL,
      read_at TEXT NOT NULL,
      fingerprint TEXT NOT NULL,
      lists TEXT NOT NULL
    )`);
  const readAt = new Date().toISOString();
  const fresh = withoutPhotoUrls(live);
  for (let attempt = 0;attempt < MAX_COMMIT_ATTEMPTS; attempt += 1) {
    const row = await readRow(db, selection);
    if (row !== null && row.startedMs > startedMs)
      return row.lists;
    const merged = mergeSavedProductListsCache(row?.lists, fresh);
    const fingerprint = await fingerprintOf(merged);
    const body = JSON.stringify(merged);
    const committed = row === null ? await db.all(sql`INSERT INTO hatch_saved_products (selection, revision, started_ms, read_at, fingerprint, lists)
              VALUES (${selection.key}, 1, ${startedMs}, ${readAt}, ${fingerprint}, ${body})
              ON CONFLICT(selection) DO NOTHING RETURNING revision`) : await db.all(sql`UPDATE hatch_saved_products
              SET revision = revision + 1, started_ms = ${startedMs}, read_at = ${readAt},
                fingerprint = ${fingerprint}, lists = ${body}
              WHERE selection = ${selection.key} AND revision = ${row.revision} RETURNING revision`);
    if (committed.length === 0)
      continue;
    if (row?.fingerprint !== fingerprint)
      ctx.invalidateQueries();
    return merged;
  }
  throw new Error("the saved products cache kept changing during this read; try again");
}
async function cacheTableExists(db) {
  const rows = await db.all(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${CACHE_TABLE}`);
  return rows.length > 0;
}
var STORED_ITEM = object({
  product: PRODUCT_SCHEMA,
  image: _null3(),
  imageKey: string2().regex(IMAGE_KEY).nullable(),
  imageVersion: string2().min(1).nullable(),
  savedAt: string2().nullable(),
  price: _enum(["current", "saved", "refreshing", "cached"])
});
var STORED_LISTS = object({
  lists: array(object({ list: string2(), missing: boolean2(), items: array(STORED_ITEM) }))
});
var STORED_ROW = object({
  revision: number2().int(),
  started_ms: number2().int(),
  read_at: string2(),
  fingerprint: string2(),
  lists: string2()
});
async function readRow(db, selection) {
  const rows = await db.all(sql`SELECT revision, started_ms, read_at, fingerprint, lists FROM hatch_saved_products
      WHERE selection = ${selection.key}`);
  if (rows.length === 0)
    return null;
  const row = STORED_ROW.safeParse(rows[0]);
  let lists;
  try {
    lists = row.success ? JSON.parse(row.data.lists) : undefined;
  } catch {
    lists = undefined;
  }
  const parsed = STORED_LISTS.safeParse(lists);
  if (!row.success || !parsed.success) {
    throw new Error("the saved products cache in this Space's database is unreadable");
  }
  return {
    revision: row.data.revision,
    startedMs: row.data.started_ms,
    readAt: row.data.read_at,
    fingerprint: row.data.fingerprint,
    lists: parsed.data
  };
}
function withoutPhotoUrls(lists) {
  return {
    lists: lists.lists.map((list) => ({
      ...list,
      items: list.items.map((item) => ({ ...item, image: null }))
    }))
  };
}
async function fingerprintOf(lists) {
  const shown = lists.lists.map((list) => ({
    list: list.list,
    missing: list.missing,
    items: list.items.map((item) => {
      const { image_url: _expiring, ...product } = item.product;
      return {
        product,
        imageKey: item.imageKey,
        imageVersion: item.imageVersion,
        savedAt: item.savedAt,
        price: item.price === "current" || item.price === "cached" ? "checked" : "saved"
      };
    })
  }));
  const bytes = new TextEncoder().encode(canonicalJson(shown));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function canonicalJson(value) {
  if (Array.isArray(value))
    return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value).filter(([, field]) => field !== undefined).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
    return `{${entries.map(([key, field]) => `${JSON.stringify(key)}:${canonicalJson(field)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
async function publicLists(ctx, lists, { live, messages }) {
  const photos = new Map;
  const photo = (item) => {
    const { imageKey: key, imageVersion: version } = item;
    if (key === null || version === null)
      return Promise.resolve(null);
    const cacheKey = `${key}
${version}`;
    let url = photos.get(cacheKey);
    if (url === undefined) {
      url = live ? versionedUrl(ctx, key, version) : storedPhotoUrl(ctx, key);
      photos.set(cacheKey, url);
    }
    return url;
  };
  return Promise.all(lists.lists.map(async (list) => ({
    list: list.list,
    missing: list.missing,
    items: await Promise.all(list.items.map(async (item) => ({
      product: item.product,
      image: await photo(item),
      priceLabel: priceLabel(item, live, messages)
    })))
  })));
}
async function storedPhotoUrl(ctx, key) {
  const stored = await ctx.blobs.head(key);
  if (stored === null || stored.key !== key || !IMAGE_CONTENT_TYPES.has(stored.contentType) || stored.size <= 0 || stored.etag.length === 0) {
    return null;
  }
  return versionedUrl(ctx, key, stored.etag);
}
async function versionedUrl(ctx, key, version) {
  const url = await ctx.blobs.getUrl(key);
  const hash = url.indexOf("#");
  const [base, fragment] = hash === -1 ? [url, ""] : [url.slice(0, hash), url.slice(hash)];
  return `${base}${base.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}${fragment}`;
}
function priceLabel(item, live, messages) {
  const { price, sale_price: sale } = item.product;
  if (!price && !sale)
    return null;
  switch (item.price) {
    case "current":
      return live ? messages.currentPrice : messages.lastCheckedPrice;
    case "cached":
      return messages.lastCheckedPrice;
    case "saved":
    case "refreshing":
      return messages.savedPrice;
  }
}

// node_modules/@hatch/space-sdk/dist/index.js
var defineAction = createDefineAction();
var savedProductsAction = savedProductsActionFor();

// server/src/privileged.ts
var {SQL: SQL2 } = globalThis.Bun;
import { existsSync } from "fs";
import { readFile, stat } from "fs/promises";
import { join } from "path";
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
var VIDEO_IDS = ["vocales", "colores-1", "colores-2", "numeros", "formas", "sonidos", "familias", "rimas", "numeros-6-10", "de-2-en-2", "de-5-en-5", "readalong-catrina", "readalong-serpent"];
var ART_IDS = [
  "leo-hero",
  "leo-portrait",
  "zaza",
  "profe-buho",
  "avatar-base",
  "avatar-nocape",
  "avatar-mask-red",
  "avatar-mask-blue",
  "avatar-mask-green",
  "avatar-mask-purple",
  "avatar-mask-gold",
  "avatar-mask-silver",
  "avatar-mask-teal",
  "avatar-suit-red",
  "avatar-suit-blue",
  "avatar-suit-green",
  "avatar-suit-black",
  "avatar-suit-purple",
  "avatar-cape-blue",
  "avatar-cape-green",
  "avatar-cape-gold",
  "avatar-cape-red",
  "avatar-skin-light",
  "avatar-skin-deep",
  "avatar-hair-black",
  "avatar-hair-gold",
  "avatar-hair-red",
  "avatar-face-freckles",
  "avatar-face-rosy",
  "avatar-skin-lighter",
  "avatar-skin-richdeep",
  "avatar-hair-pink",
  "avatar-hair-teal",
  "avatar-face-dimples",
  "rudo-atajo",
  "rudo-revuelto",
  "rudo-niebla",
  "bg-ring",
  "bg-forest",
  "bg-forest-fog",
  "bg-gym",
  "bg-library",
  "bg-music",
  "bg-atelier",
  "belt-plate",
  "bg-highlands",
  "door-reading",
  "door-math",
  "door-lands",
  "door-ring",
  "door-atrapa",
  "door-belts",
  "door-science",
  "door-garden",
  "door-games",
  "card-tesoro",
  "card-carrera",
  "card-clasico",
  "comp-coco",
  "comp-pio",
  "comp-chispa",
  "comp-eco",
  "comp-trueno",
  "comp-veloz",
  "lib-s1b1-cover",
  "lib-s1b1-p0",
  "lib-s1b1-p1",
  "lib-s1b1-p2",
  "lib-s1b1-p3",
  "lib-s1b1-p4",
  "lib-s1b1-p5",
  "lib-s1b1-p6",
  "lib-s1b1-p7",
  "lib-s1b1-p8",
  "lib-s1b1-p9",
  "lib-s1b2-cover",
  "lib-s1b2-p0",
  "lib-s1b2-p1",
  "lib-s1b2-p2",
  "lib-s1b2-p3",
  "lib-s1b2-p4",
  "lib-s1b2-p5",
  "lib-s1b2-p6",
  "lib-s1b2-p7",
  "lib-s1b2-p8",
  "lib-s1b2-p9",
  "lib-s1b3-cover",
  "lib-s1b3-p0",
  "lib-s1b3-p1",
  "lib-s1b3-p2",
  "lib-s1b3-p3",
  "lib-s1b3-p4",
  "lib-s1b3-p5",
  "lib-s1b3-p6",
  "lib-s1b3-p7",
  "lib-s1b3-p8",
  "lib-s1b3-p9",
  "lib-s1b4-cover",
  "lib-s1b4-p0",
  "lib-s1b4-p1",
  "lib-s1b4-p2",
  "lib-s1b4-p3",
  "lib-s1b4-p4",
  "lib-s1b4-p5",
  "lib-s1b4-p6",
  "lib-s1b4-p7",
  "lib-s1b4-p8",
  "lib-s1b4-p9",
  "lib-s1b5-cover",
  "lib-s1b5-p0",
  "lib-s1b5-p1",
  "lib-s1b5-p2",
  "lib-s1b5-p3",
  "lib-s1b5-p4",
  "lib-s1b5-p5",
  "lib-s1b5-p6",
  "lib-s1b5-p7",
  "lib-s1b5-p8",
  "lib-s1b5-p9",
  "lib-s1b6-cover",
  "lib-s1b6-p0",
  "lib-s1b6-p1",
  "lib-s1b6-p2",
  "lib-s1b6-p3",
  "lib-s1b6-p4",
  "lib-s1b6-p5",
  "lib-s1b6-p6",
  "lib-s1b6-p7",
  "lib-s1b6-p8",
  "lib-s1b6-p9",
  "lib-s1b7-cover",
  "lib-s1b7-p0",
  "lib-s1b7-p1",
  "lib-s1b7-p2",
  "lib-s1b7-p3",
  "lib-s1b7-p4",
  "lib-s1b7-p5",
  "lib-s1b7-p6",
  "lib-s1b7-p7",
  "lib-s1b7-p8",
  "lib-s1b7-p9",
  "lib-s1b8-cover",
  "lib-s1b8-p0",
  "lib-s1b8-p1",
  "lib-s1b8-p2",
  "lib-s1b8-p3",
  "lib-s1b8-p4",
  "lib-s1b8-p5",
  "lib-s1b8-p6",
  "lib-s1b8-p7",
  "lib-s1b8-p8",
  "lib-s1b8-p9",
  "gar-g1-p0",
  "gar-g1-p1",
  "gar-g1-p2",
  "gar-g1-p3",
  "gar-g2-p0",
  "gar-g2-p1",
  "gar-g2-p2",
  "gar-g2-p3",
  "gar-g3-p0",
  "gar-g3-p1",
  "gar-g3-p2",
  "gar-g3-p3",
  "gar-g4-p0",
  "gar-g4-p1",
  "gar-g4-p2",
  "gar-g4-p3",
  "gar-g5-p0",
  "gar-g5-p1",
  "gar-g5-p2",
  "gar-g5-p3",
  "gar-g6-p0",
  "gar-g6-p1",
  "gar-g6-p2",
  "gar-g6-p3",
  "gar-g7-p0",
  "gar-g7-p1",
  "gar-g7-p2",
  "gar-g7-p3",
  "gar-g8-p0",
  "gar-g8-p1",
  "gar-g8-p2",
  "gar-g8-p3",
  "gar-g9-p0",
  "gar-g9-p1",
  "gar-g9-p2",
  "gar-g9-p3",
  "gar-g10-p0",
  "gar-g10-p1",
  "gar-g10-p2",
  "gar-g10-p3",
  "pas-enf-0",
  "pas-enf-1",
  "pas-enf-2",
  "pas-enf-3",
  "pas-enf-4",
  "pas-enf-5",
  "pas-esf-0",
  "pas-esf-1",
  "pas-esf-2",
  "pas-esf-3",
  "pas-esf-4",
  "pas-esf-5",
  "pas-enc-0",
  "pas-enc-1",
  "pas-enc-2",
  "pas-enc-3",
  "pas-enc-4",
  "pas-enc-5",
  "pas-esc-0",
  "pas-esc-1",
  "pas-esc-2",
  "pas-esc-3",
  "pas-esc-4",
  "pas-esc-5",
  "pas-enf-6",
  "pas-enf-7",
  "pas-enf-8",
  "pas-enf-9",
  "pas-enf-10",
  "pas-enf-11",
  "pas-esf-6",
  "pas-esf-7",
  "pas-esf-8",
  "pas-esf-9",
  "pas-esf-10",
  "pas-esf-11",
  "pas-enc-6",
  "pas-enc-7",
  "pas-enc-8",
  "pas-enc-9",
  "pas-enc-10",
  "pas-enc-11",
  "pas-esc-6",
  "pas-esc-7",
  "pas-esc-8",
  "pas-esc-9",
  "pas-esc-10",
  "pas-esc-11",
  "fin-a-0",
  "fin-a-1",
  "fin-a-2",
  "fin-b-0",
  "fin-b-1",
  "fin-b-2",
  "fin-c-0",
  "fin-c-1",
  "fin-c-2",
  "sci-s1",
  "sci-s2",
  "sci-s3",
  "sci-s4",
  "sci-s5",
  "sci-s6",
  "sci-s7",
  "sci-s8",
  "sci-s9",
  "sci-s10",
  "qz-sci-s1-q0",
  "qz-sci-s1-q1",
  "qz-sci-s1-q2",
  "qz-sci-s2-q0",
  "qz-sci-s2-q1",
  "qz-sci-s2-q2",
  "qz-sci-s3-q0",
  "qz-sci-s3-q1",
  "qz-sci-s3-q2",
  "qz-sci-s4-q0",
  "qz-sci-s4-q1",
  "qz-sci-s4-q2",
  "qz-sci-s5-q0",
  "qz-sci-s5-q1",
  "qz-sci-s5-q2",
  "qz-sci-s6-q0",
  "qz-sci-s6-q1",
  "qz-sci-s6-q2",
  "qz-sci-s7-q0",
  "qz-sci-s7-q1",
  "qz-sci-s7-q2",
  "qz-sci-s8-q0",
  "qz-sci-s8-q1",
  "qz-sci-s8-q2",
  "qz-sci-s9-q0",
  "qz-sci-s9-q1",
  "qz-sci-s9-q2",
  "qz-sci-s10-q0",
  "qz-sci-s10-q1",
  "qz-sci-s10-q2",
  "qz-gar-g1-q0",
  "qz-gar-g1-q1",
  "qz-gar-g2-q0",
  "qz-gar-g2-q1",
  "qz-gar-g3-q0",
  "qz-gar-g3-q1",
  "qz-gar-g4-q0",
  "qz-gar-g4-q1",
  "qz-gar-g5-q0",
  "qz-gar-g5-q1",
  "qz-gar-g6-q0",
  "qz-gar-g6-q1",
  "qz-gar-g7-q0",
  "qz-gar-g7-q1",
  "qz-gar-g8-q0",
  "qz-gar-g8-q1",
  "qz-gar-g9-q0",
  "qz-gar-g9-q1",
  "qz-gar-g10-q0",
  "qz-gar-g10-q1",
  "qz-lib-s1b1-q0",
  "qz-lib-s1b1-q1",
  "qz-lib-s1b1-q2",
  "qz-lib-s1b2-q0",
  "qz-lib-s1b2-q1",
  "qz-lib-s1b2-q2",
  "qz-lib-s1b3-q0",
  "qz-lib-s1b3-q1",
  "qz-lib-s1b3-q2",
  "qz-lib-s1b4-q0",
  "qz-lib-s1b4-q1",
  "qz-lib-s1b4-q2",
  "qz-lib-s1b5-q0",
  "qz-lib-s1b5-q1",
  "qz-lib-s1b5-q2",
  "qz-lib-s1b6-q0",
  "qz-lib-s1b6-q1",
  "qz-lib-s1b6-q2",
  "qz-lib-s1b7-q0",
  "qz-lib-s1b7-q1",
  "qz-lib-s1b7-q2",
  "qz-lib-s1b8-q0",
  "qz-lib-s1b8-q1",
  "qz-lib-s1b8-q2",
  "ch-sci-s1-q0-c0",
  "ch-sci-s1-q0-c1",
  "ch-sci-s1-q0-c2",
  "ch-sci-s1-q1-c0",
  "ch-sci-s1-q1-c1",
  "ch-sci-s1-q1-c2",
  "ch-sci-s1-q2-c0",
  "ch-sci-s1-q2-c1",
  "ch-sci-s1-q2-c2",
  "ch-sci-s2-q0-c0",
  "ch-sci-s2-q0-c1",
  "ch-sci-s2-q0-c2",
  "ch-sci-s2-q1-c0",
  "ch-sci-s2-q1-c1",
  "ch-sci-s2-q1-c2",
  "ch-sci-s2-q2-c0",
  "ch-sci-s2-q2-c1",
  "ch-sci-s2-q2-c2",
  "ch-sci-s3-q0-c0",
  "ch-sci-s3-q0-c1",
  "ch-sci-s3-q0-c2",
  "ch-sci-s3-q1-c0",
  "ch-sci-s3-q1-c1",
  "ch-sci-s3-q1-c2",
  "ch-sci-s3-q2-c0",
  "ch-sci-s3-q2-c1",
  "ch-sci-s3-q2-c2",
  "ch-sci-s4-q0-c0",
  "ch-sci-s4-q0-c1",
  "ch-sci-s4-q0-c2",
  "ch-sci-s4-q1-c0",
  "ch-sci-s4-q1-c1",
  "ch-sci-s4-q1-c2",
  "ch-sci-s4-q2-c0",
  "ch-sci-s4-q2-c1",
  "ch-sci-s4-q2-c2",
  "ch-sci-s5-q0-c0",
  "ch-sci-s5-q0-c1",
  "ch-sci-s5-q0-c2",
  "ch-sci-s5-q1-c0",
  "ch-sci-s5-q1-c1",
  "ch-sci-s5-q1-c2",
  "ch-sci-s5-q2-c0",
  "ch-sci-s5-q2-c1",
  "ch-sci-s5-q2-c2",
  "ch-sci-s6-q0-c0",
  "ch-sci-s6-q0-c1",
  "ch-sci-s6-q0-c2",
  "ch-sci-s6-q1-c0",
  "ch-sci-s6-q1-c1",
  "ch-sci-s6-q1-c2",
  "ch-sci-s6-q2-c0",
  "ch-sci-s6-q2-c1",
  "ch-sci-s6-q2-c2",
  "ch-sci-s7-q0-c0",
  "ch-sci-s7-q0-c1",
  "ch-sci-s7-q0-c2",
  "ch-sci-s7-q1-c0",
  "ch-sci-s7-q1-c1",
  "ch-sci-s7-q1-c2",
  "ch-sci-s7-q2-c0",
  "ch-sci-s7-q2-c1",
  "ch-sci-s7-q2-c2",
  "ch-sci-s8-q0-c0",
  "ch-sci-s8-q0-c1",
  "ch-sci-s8-q0-c2",
  "ch-sci-s8-q1-c0",
  "ch-sci-s8-q1-c1",
  "ch-sci-s8-q1-c2",
  "ch-sci-s8-q2-c0",
  "ch-sci-s8-q2-c1",
  "ch-sci-s8-q2-c2",
  "ch-sci-s9-q0-c0",
  "ch-sci-s9-q0-c1",
  "ch-sci-s9-q0-c2",
  "ch-sci-s9-q1-c0",
  "ch-sci-s9-q1-c1",
  "ch-sci-s9-q1-c2",
  "ch-sci-s9-q2-c0",
  "ch-sci-s9-q2-c1",
  "ch-sci-s9-q2-c2",
  "ch-sci-s10-q0-c0",
  "ch-sci-s10-q0-c1",
  "ch-sci-s10-q0-c2",
  "ch-sci-s10-q1-c0",
  "ch-sci-s10-q1-c1",
  "ch-sci-s10-q1-c2",
  "ch-sci-s10-q2-c0",
  "ch-sci-s10-q2-c1",
  "ch-sci-s10-q2-c2",
  "ch-gar-g1-q0-c0",
  "ch-gar-g1-q0-c1",
  "ch-gar-g1-q0-c2",
  "ch-gar-g1-q1-c0",
  "ch-gar-g1-q1-c1",
  "ch-gar-g1-q1-c2",
  "ch-gar-g2-q0-c0",
  "ch-gar-g2-q0-c1",
  "ch-gar-g2-q0-c2",
  "ch-gar-g2-q1-c0",
  "ch-gar-g2-q1-c1",
  "ch-gar-g2-q1-c2",
  "ch-gar-g3-q0-c0",
  "ch-gar-g3-q0-c1",
  "ch-gar-g3-q0-c2",
  "ch-gar-g3-q1-c0",
  "ch-gar-g3-q1-c1",
  "ch-gar-g3-q1-c2",
  "ch-gar-g4-q0-c0",
  "ch-gar-g4-q0-c1",
  "ch-gar-g4-q0-c2",
  "ch-gar-g4-q1-c0",
  "ch-gar-g4-q1-c1",
  "ch-gar-g4-q1-c2",
  "ch-gar-g5-q0-c0",
  "ch-gar-g5-q0-c1",
  "ch-gar-g5-q0-c2",
  "ch-gar-g5-q1-c0",
  "ch-gar-g5-q1-c1",
  "ch-gar-g5-q1-c2",
  "ch-gar-g6-q0-c0",
  "ch-gar-g6-q0-c1",
  "ch-gar-g6-q0-c2",
  "ch-gar-g6-q1-c0",
  "ch-gar-g6-q1-c1",
  "ch-gar-g6-q1-c2",
  "ch-gar-g7-q0-c0",
  "ch-gar-g7-q0-c1",
  "ch-gar-g7-q0-c2",
  "ch-gar-g7-q1-c0",
  "ch-gar-g7-q1-c1",
  "ch-gar-g7-q1-c2",
  "ch-gar-g8-q0-c0",
  "ch-gar-g8-q0-c1",
  "ch-gar-g8-q0-c2",
  "ch-gar-g8-q1-c0",
  "ch-gar-g8-q1-c1",
  "ch-gar-g8-q1-c2",
  "ch-gar-g9-q0-c0",
  "ch-gar-g9-q0-c1",
  "ch-gar-g9-q0-c2",
  "ch-gar-g9-q1-c0",
  "ch-gar-g9-q1-c1",
  "ch-gar-g9-q1-c2",
  "ch-gar-g10-q0-c0",
  "ch-gar-g10-q0-c1",
  "ch-gar-g10-q0-c2",
  "ch-gar-g10-q1-c0",
  "ch-gar-g10-q1-c1",
  "ch-gar-g10-q1-c2",
  "ch-lib-s1b1-q0-c0",
  "ch-lib-s1b1-q0-c1",
  "ch-lib-s1b1-q0-c2",
  "ch-lib-s1b1-q1-c0",
  "ch-lib-s1b1-q1-c1",
  "ch-lib-s1b1-q1-c2",
  "ch-lib-s1b1-q2-c0",
  "ch-lib-s1b1-q2-c1",
  "ch-lib-s1b1-q2-c2",
  "ch-lib-s1b2-q0-c0",
  "ch-lib-s1b2-q0-c1",
  "ch-lib-s1b2-q0-c2",
  "ch-lib-s1b2-q1-c0",
  "ch-lib-s1b2-q1-c1",
  "ch-lib-s1b2-q1-c2",
  "ch-lib-s1b2-q2-c0",
  "ch-lib-s1b2-q2-c1",
  "ch-lib-s1b2-q2-c2",
  "ch-lib-s1b3-q0-c0",
  "ch-lib-s1b3-q0-c1",
  "ch-lib-s1b3-q0-c2",
  "ch-lib-s1b3-q1-c0",
  "ch-lib-s1b3-q1-c1",
  "ch-lib-s1b3-q1-c2",
  "ch-lib-s1b3-q2-c0",
  "ch-lib-s1b3-q2-c1",
  "ch-lib-s1b3-q2-c2",
  "ch-lib-s1b4-q0-c0",
  "ch-lib-s1b4-q0-c1",
  "ch-lib-s1b4-q0-c2",
  "ch-lib-s1b4-q1-c0",
  "ch-lib-s1b4-q1-c1",
  "ch-lib-s1b4-q1-c2",
  "ch-lib-s1b4-q2-c0",
  "ch-lib-s1b4-q2-c1",
  "ch-lib-s1b4-q2-c2",
  "ch-lib-s1b5-q0-c0",
  "ch-lib-s1b5-q0-c1",
  "ch-lib-s1b5-q0-c2",
  "ch-lib-s1b5-q1-c0",
  "ch-lib-s1b5-q1-c1",
  "ch-lib-s1b5-q1-c2",
  "ch-lib-s1b5-q2-c0",
  "ch-lib-s1b5-q2-c1",
  "ch-lib-s1b5-q2-c2",
  "ch-lib-s1b6-q0-c0",
  "ch-lib-s1b6-q0-c1",
  "ch-lib-s1b6-q0-c2",
  "ch-lib-s1b6-q1-c0",
  "ch-lib-s1b6-q1-c1",
  "ch-lib-s1b6-q1-c2",
  "ch-lib-s1b6-q2-c0",
  "ch-lib-s1b6-q2-c1",
  "ch-lib-s1b6-q2-c2",
  "ch-lib-s1b7-q0-c0",
  "ch-lib-s1b7-q0-c1",
  "ch-lib-s1b7-q0-c2",
  "ch-lib-s1b7-q1-c0",
  "ch-lib-s1b7-q1-c1",
  "ch-lib-s1b7-q1-c2",
  "ch-lib-s1b7-q2-c0",
  "ch-lib-s1b7-q2-c1",
  "ch-lib-s1b7-q2-c2",
  "ch-lib-s1b8-q0-c0",
  "ch-lib-s1b8-q0-c1",
  "ch-lib-s1b8-q0-c2",
  "ch-lib-s1b8-q1-c0",
  "ch-lib-s1b8-q1-c1",
  "ch-lib-s1b8-q1-c2",
  "ch-lib-s1b8-q2-c0",
  "ch-lib-s1b8-q2-c1",
  "ch-lib-s1b8-q2-c2",
  "mis-b1-cover",
  "mis-b1-p0",
  "mis-b1-p1",
  "mis-b1-p10",
  "mis-b1-p11",
  "mis-b1-p12",
  "mis-b1-p13",
  "mis-b1-p14",
  "mis-b1-p15",
  "mis-b1-p2",
  "mis-b1-p3",
  "mis-b1-p4",
  "mis-b1-p5",
  "mis-b1-p6",
  "mis-b1-p7",
  "mis-b1-p8",
  "mis-b1-p9",
  "mis-b1-wastronaut",
  "mis-b1-wearth",
  "mis-b1-wfloat",
  "mis-b1-worbit",
  "mis-b1-wrocket",
  "mis-b1-wsolar-panel",
  "mis-b1-wspace-station",
  "mis-b1-wspacewalk",
  "mis-b2-cover",
  "mis-b2-p0",
  "mis-b2-p1",
  "mis-b2-p10",
  "mis-b2-p11",
  "mis-b2-p12",
  "mis-b2-p13",
  "mis-b2-p14",
  "mis-b2-p15",
  "mis-b2-p2",
  "mis-b2-p3",
  "mis-b2-p4",
  "mis-b2-p5",
  "mis-b2-p6",
  "mis-b2-p7",
  "mis-b2-p8",
  "mis-b2-p9",
  "mis-b2-wcanyon",
  "mis-b2-wdust",
  "mis-b2-wgravity",
  "mis-b2-wmars",
  "mis-b2-wplanet",
  "mis-b2-wrover",
  "mis-b2-wsunset",
  "mis-b2-wvolcano",
  "mis-b3-cover",
  "mis-b3-p0",
  "mis-b3-p1",
  "mis-b3-p10",
  "mis-b3-p11",
  "mis-b3-p12",
  "mis-b3-p13",
  "mis-b3-p14",
  "mis-b3-p15",
  "mis-b3-p2",
  "mis-b3-p3",
  "mis-b3-p4",
  "mis-b3-p5",
  "mis-b3-p6",
  "mis-b3-p7",
  "mis-b3-p8",
  "mis-b3-p9",
  "mis-b3-wbase",
  "mis-b3-wcrater",
  "mis-b3-wdrill",
  "mis-b3-wflag",
  "mis-b3-wfootprint",
  "mis-b3-wice",
  "mis-b3-wmoon",
  "mis-b3-wshadow",
  "mis-b4-cover",
  "mis-b4-p0",
  "mis-b4-p1",
  "mis-b4-p10",
  "mis-b4-p11",
  "mis-b4-p12",
  "mis-b4-p13",
  "mis-b4-p14",
  "mis-b4-p15",
  "mis-b4-p2",
  "mis-b4-p3",
  "mis-b4-p4",
  "mis-b4-p5",
  "mis-b4-p6",
  "mis-b4-p7",
  "mis-b4-p8",
  "mis-b4-p9",
  "mis-b4-wcrab",
  "mis-b4-wdeep",
  "mis-b4-wlight",
  "mis-b4-wocean",
  "mis-b4-wsnow",
  "mis-b4-wsubmarine",
  "mis-b4-wtrench",
  "mis-b4-wwhale",
  "mis-b5-cover",
  "mis-b5-p0",
  "mis-b5-p1",
  "mis-b5-p10",
  "mis-b5-p11",
  "mis-b5-p12",
  "mis-b5-p13",
  "mis-b5-p14",
  "mis-b5-p15",
  "mis-b5-p2",
  "mis-b5-p3",
  "mis-b5-p4",
  "mis-b5-p5",
  "mis-b5-p6",
  "mis-b5-p7",
  "mis-b5-p8",
  "mis-b5-p9",
  "mis-b5-wblood",
  "mis-b5-wbone",
  "mis-b5-wbrain",
  "mis-b5-wcell",
  "mis-b5-wheart",
  "mis-b5-wlungs",
  "mis-b5-wmuscle",
  "mis-b5-wstomach",
  "mis-b6-cover",
  "mis-b6-p0",
  "mis-b6-p1",
  "mis-b6-p10",
  "mis-b6-p11",
  "mis-b6-p12",
  "mis-b6-p13",
  "mis-b6-p14",
  "mis-b6-p15",
  "mis-b6-p2",
  "mis-b6-p3",
  "mis-b6-p4",
  "mis-b6-p5",
  "mis-b6-p6",
  "mis-b6-p7",
  "mis-b6-p8",
  "mis-b6-p9",
  "mis-b6-wash",
  "mis-b6-wearthquake",
  "mis-b6-wlava",
  "mis-b6-wmask",
  "mis-b6-wsensor",
  "mis-b6-wshelter",
  "mis-b6-wvolcano",
  "mis-b6-wvolcanologist",
  "mis-b7-cover",
  "mis-b7-p0",
  "mis-b7-p1",
  "mis-b7-p10",
  "mis-b7-p11",
  "mis-b7-p12",
  "mis-b7-p13",
  "mis-b7-p14",
  "mis-b7-p15",
  "mis-b7-p2",
  "mis-b7-p3",
  "mis-b7-p4",
  "mis-b7-p5",
  "mis-b7-p6",
  "mis-b7-p7",
  "mis-b7-p8",
  "mis-b7-p9",
  "mis-b7-wbear",
  "mis-b7-wcold",
  "mis-b7-wfox",
  "mis-b7-wice",
  "mis-b7-wnorthern-lights",
  "mis-b7-wrope",
  "mis-b7-wstation",
  "mis-b7-wsun",
  "mis-b8-cover",
  "mis-b8-p0",
  "mis-b8-p1",
  "mis-b8-p10",
  "mis-b8-p11",
  "mis-b8-p12",
  "mis-b8-p13",
  "mis-b8-p14",
  "mis-b8-p15",
  "mis-b8-p2",
  "mis-b8-p3",
  "mis-b8-p4",
  "mis-b8-p5",
  "mis-b8-p6",
  "mis-b8-p7",
  "mis-b8-p8",
  "mis-b8-p9",
  "mis-b8-wcloud",
  "mis-b8-weye",
  "mis-b8-whurricane",
  "mis-b8-winstrument",
  "mis-b8-wplane",
  "mis-b8-wrain",
  "mis-b8-wsea",
  "mis-b8-wwind",
  "mis-b9-cover",
  "mis-b9-p0",
  "mis-b9-p1",
  "mis-b9-p10",
  "mis-b9-p11",
  "mis-b9-p12",
  "mis-b9-p13",
  "mis-b9-p14",
  "mis-b9-p15",
  "mis-b9-p2",
  "mis-b9-p3",
  "mis-b9-p4",
  "mis-b9-p5",
  "mis-b9-p6",
  "mis-b9-p7",
  "mis-b9-p8",
  "mis-b9-p9",
  "mis-b9-wcamera",
  "mis-b9-wfootprint",
  "mis-b9-wjaguar",
  "mis-b9-wnight",
  "mis-b9-wrainforest",
  "mis-b9-wriver",
  "mis-b9-wspots",
  "mis-b9-wtree",
  "mis-b10-cover",
  "mis-b10-p0",
  "mis-b10-p1",
  "mis-b10-p10",
  "mis-b10-p11",
  "mis-b10-p12",
  "mis-b10-p13",
  "mis-b10-p14",
  "mis-b10-p15",
  "mis-b10-p2",
  "mis-b10-p3",
  "mis-b10-p4",
  "mis-b10-p5",
  "mis-b10-p6",
  "mis-b10-p7",
  "mis-b10-p8",
  "mis-b10-p9",
  "mis-b10-wbone",
  "mis-b10-wbrush",
  "mis-b10-wdinosaur",
  "mis-b10-whorn",
  "mis-b10-wmap",
  "mis-b10-wmuseum",
  "mis-b10-wplaster",
  "mis-b10-wskull",
  "ch-mis-b1-q0-c0",
  "ch-mis-b1-q0-c1",
  "ch-mis-b1-q0-c2",
  "ch-mis-b1-q1-c0",
  "ch-mis-b1-q1-c1",
  "ch-mis-b1-q1-c2",
  "ch-mis-b10-q0-c0",
  "ch-mis-b10-q0-c1",
  "ch-mis-b10-q0-c2",
  "ch-mis-b10-q1-c0",
  "ch-mis-b10-q1-c1",
  "ch-mis-b10-q1-c2",
  "ch-mis-b2-q0-c0",
  "ch-mis-b2-q0-c1",
  "ch-mis-b2-q0-c2",
  "ch-mis-b2-q1-c0",
  "ch-mis-b2-q1-c1",
  "ch-mis-b2-q1-c2",
  "ch-mis-b3-q0-c0",
  "ch-mis-b3-q0-c1",
  "ch-mis-b3-q0-c2",
  "ch-mis-b3-q1-c0",
  "ch-mis-b3-q1-c1",
  "ch-mis-b3-q1-c2",
  "ch-mis-b4-q0-c0",
  "ch-mis-b4-q0-c1",
  "ch-mis-b4-q0-c2",
  "ch-mis-b4-q1-c0",
  "ch-mis-b4-q1-c1",
  "ch-mis-b4-q1-c2",
  "ch-mis-b5-q0-c0",
  "ch-mis-b5-q0-c1",
  "ch-mis-b5-q0-c2",
  "ch-mis-b5-q1-c0",
  "ch-mis-b5-q1-c1",
  "ch-mis-b5-q1-c2",
  "ch-mis-b6-q0-c0",
  "ch-mis-b6-q0-c1",
  "ch-mis-b6-q0-c2",
  "ch-mis-b6-q1-c0",
  "ch-mis-b6-q1-c1",
  "ch-mis-b6-q1-c2",
  "ch-mis-b7-q0-c0",
  "ch-mis-b7-q0-c1",
  "ch-mis-b7-q0-c2",
  "ch-mis-b7-q1-c0",
  "ch-mis-b7-q1-c1",
  "ch-mis-b7-q1-c2",
  "ch-mis-b8-q0-c0",
  "ch-mis-b8-q0-c1",
  "ch-mis-b8-q0-c2",
  "ch-mis-b8-q1-c0",
  "ch-mis-b8-q1-c1",
  "ch-mis-b8-q1-c2",
  "ch-mis-b9-q0-c0",
  "ch-mis-b9-q0-c1",
  "ch-mis-b9-q0-c2",
  "ch-mis-b9-q1-c0",
  "ch-mis-b9-q1-c1",
  "ch-mis-b9-q1-c2",
  "ch-sci-s1-q3-c0",
  "ch-sci-s1-q3-c1",
  "ch-sci-s1-q3-c2",
  "ch-sci-s10-q3-c0",
  "ch-sci-s10-q3-c1",
  "ch-sci-s10-q3-c2",
  "ch-sci-s2-q3-c0",
  "ch-sci-s2-q3-c1",
  "ch-sci-s2-q3-c2",
  "ch-sci-s3-q3-c0",
  "ch-sci-s3-q3-c1",
  "ch-sci-s3-q3-c2",
  "ch-sci-s4-q3-c0",
  "ch-sci-s4-q3-c1",
  "ch-sci-s4-q3-c2",
  "ch-sci-s5-q3-c0",
  "ch-sci-s5-q3-c1",
  "ch-sci-s5-q3-c2",
  "ch-sci-s6-q3-c0",
  "ch-sci-s6-q3-c1",
  "ch-sci-s6-q3-c2",
  "ch-sci-s7-q3-c0",
  "ch-sci-s7-q3-c1",
  "ch-sci-s7-q3-c2",
  "ch-sci-s8-q3-c0",
  "ch-sci-s8-q3-c1",
  "ch-sci-s8-q3-c2",
  "ch-sci-s9-q3-c0",
  "ch-sci-s9-q3-c1",
  "ch-sci-s9-q3-c2",
  "exp-s1",
  "exp-s10",
  "exp-s2",
  "exp-s3",
  "exp-s4",
  "exp-s5",
  "exp-s6",
  "exp-s7",
  "exp-s8",
  "exp-s9",
  "qz-sci-s1-q3",
  "qz-sci-s10-q3",
  "qz-sci-s2-q3",
  "qz-sci-s3-q3",
  "qz-sci-s4-q3",
  "qz-sci-s5-q3",
  "qz-sci-s6-q3",
  "qz-sci-s7-q3",
  "qz-sci-s8-q3",
  "qz-sci-s9-q3",
  "emo-b1-cover",
  "emo-b1-p0",
  "emo-b1-p1",
  "emo-b1-p10",
  "emo-b1-p11",
  "emo-b1-p12",
  "emo-b1-p13",
  "emo-b1-p14",
  "emo-b1-p15",
  "emo-b1-p2",
  "emo-b1-p3",
  "emo-b1-p4",
  "emo-b1-p5",
  "emo-b1-p6",
  "emo-b1-p7",
  "emo-b1-p8",
  "emo-b1-p9",
  "emo-b1-wbrave",
  "emo-b1-wcalm",
  "emo-b1-wnervous",
  "emo-b1-wproud",
  "emo-b1-wrestless",
  "emo-b1-wsafe",
  "emo-b1-wshy",
  "emo-b1-wworried",
  "emo-b10-cover",
  "emo-b10-p0",
  "emo-b10-p1",
  "emo-b10-p10",
  "emo-b10-p11",
  "emo-b10-p12",
  "emo-b10-p13",
  "emo-b10-p14",
  "emo-b10-p15",
  "emo-b10-p2",
  "emo-b10-p3",
  "emo-b10-p4",
  "emo-b10-p5",
  "emo-b10-p6",
  "emo-b10-p7",
  "emo-b10-p8",
  "emo-b10-p9",
  "emo-b10-wcalm",
  "emo-b10-wconfident",
  "emo-b10-wfriendly",
  "emo-b10-wgrateful",
  "emo-b10-wkind",
  "emo-b10-wloved",
  "emo-b10-wpleased",
  "emo-b10-wproud",
  "emo-b10-wstrong",
  "emo-b2-cover",
  "emo-b2-p0",
  "emo-b2-p1",
  "emo-b2-p10",
  "emo-b2-p11",
  "emo-b2-p12",
  "emo-b2-p13",
  "emo-b2-p14",
  "emo-b2-p15",
  "emo-b2-p2",
  "emo-b2-p3",
  "emo-b2-p4",
  "emo-b2-p5",
  "emo-b2-p6",
  "emo-b2-p7",
  "emo-b2-p8",
  "emo-b2-p9",
  "emo-b2-wangry",
  "emo-b2-wannoyed",
  "emo-b2-wcalmer",
  "emo-b2-wfrustrated",
  "emo-b2-wgrumpy",
  "emo-b2-wimpatient",
  "emo-b2-wpeaceful",
  "emo-b2-wtense",
  "emo-b3-cover",
  "emo-b3-p0",
  "emo-b3-p1",
  "emo-b3-p10",
  "emo-b3-p11",
  "emo-b3-p12",
  "emo-b3-p13",
  "emo-b3-p14",
  "emo-b3-p15",
  "emo-b3-p2",
  "emo-b3-p3",
  "emo-b3-p4",
  "emo-b3-p5",
  "emo-b3-p6",
  "emo-b3-p7",
  "emo-b3-p8",
  "emo-b3-p9",
  "emo-b3-wcomforted",
  "emo-b3-wdown",
  "emo-b3-wempty",
  "emo-b3-whomesick",
  "emo-b3-whopeful",
  "emo-b3-wloved",
  "emo-b3-wsad",
  "emo-b3-wteary",
  "emo-b4-cover",
  "emo-b4-p0",
  "emo-b4-p1",
  "emo-b4-p10",
  "emo-b4-p11",
  "emo-b4-p12",
  "emo-b4-p13",
  "emo-b4-p14",
  "emo-b4-p15",
  "emo-b4-p2",
  "emo-b4-p3",
  "emo-b4-p4",
  "emo-b4-p5",
  "emo-b4-p6",
  "emo-b4-p7",
  "emo-b4-p8",
  "emo-b4-p9",
  "emo-b4-wbrave",
  "emo-b4-wfriendly",
  "emo-b4-wignored",
  "emo-b4-wincluded",
  "emo-b4-winvisible",
  "emo-b4-wleft-out",
  "emo-b4-wsad",
  "emo-b4-wwelcome",
  "emo-b5-cover",
  "emo-b5-p0",
  "emo-b5-p1",
  "emo-b5-p10",
  "emo-b5-p11",
  "emo-b5-p12",
  "emo-b5-p13",
  "emo-b5-p14",
  "emo-b5-p15",
  "emo-b5-p2",
  "emo-b5-p3",
  "emo-b5-p4",
  "emo-b5-p5",
  "emo-b5-p6",
  "emo-b5-p7",
  "emo-b5-p8",
  "emo-b5-p9",
  "emo-b5-weager",
  "emo-b5-wenvious",
  "emo-b5-wgrateful",
  "emo-b5-whappy-for-you",
  "emo-b5-wjealous",
  "emo-b5-wproud",
  "emo-b5-wresentful",
  "emo-b5-wunfair",
  "emo-b6-cover",
  "emo-b6-p0",
  "emo-b6-p1",
  "emo-b6-p10",
  "emo-b6-p11",
  "emo-b6-p12",
  "emo-b6-p13",
  "emo-b6-p14",
  "emo-b6-p15",
  "emo-b6-p2",
  "emo-b6-p3",
  "emo-b6-p4",
  "emo-b6-p5",
  "emo-b6-p6",
  "emo-b6-p7",
  "emo-b6-p8",
  "emo-b6-p9",
  "emo-b6-wbrave",
  "emo-b6-wcalm",
  "emo-b6-wfearful",
  "emo-b6-wnervous",
  "emo-b6-wsafe",
  "emo-b6-wscared",
  "emo-b6-wsleepy",
  "emo-b6-wstartled",
  "emo-b7-cover",
  "emo-b7-p0",
  "emo-b7-p1",
  "emo-b7-p10",
  "emo-b7-p11",
  "emo-b7-p12",
  "emo-b7-p13",
  "emo-b7-p14",
  "emo-b7-p15",
  "emo-b7-p2",
  "emo-b7-p3",
  "emo-b7-p4",
  "emo-b7-p5",
  "emo-b7-p6",
  "emo-b7-p7",
  "emo-b7-p8",
  "emo-b7-p9",
  "emo-b7-wbrave",
  "emo-b7-wconfident",
  "emo-b7-wembarrassed",
  "emo-b7-wforgiven",
  "emo-b7-wfrustrated",
  "emo-b7-wnervous",
  "emo-b7-wproud",
  "emo-b7-wsorry",
  "emo-b8-cover",
  "emo-b8-p0",
  "emo-b8-p1",
  "emo-b8-p10",
  "emo-b8-p11",
  "emo-b8-p12",
  "emo-b8-p13",
  "emo-b8-p14",
  "emo-b8-p15",
  "emo-b8-p2",
  "emo-b8-p3",
  "emo-b8-p4",
  "emo-b8-p5",
  "emo-b8-p6",
  "emo-b8-p7",
  "emo-b8-p8",
  "emo-b8-p9",
  "emo-b8-wcalm",
  "emo-b8-wexcited",
  "emo-b8-wfocused",
  "emo-b8-wimpatient",
  "emo-b8-wready",
  "emo-b8-wrestless",
  "emo-b8-wsquirmy",
  "emo-b8-wthrilled",
  "emo-b9-cover",
  "emo-b9-p0",
  "emo-b9-p1",
  "emo-b9-p10",
  "emo-b9-p11",
  "emo-b9-p12",
  "emo-b9-p13",
  "emo-b9-p14",
  "emo-b9-p15",
  "emo-b9-p2",
  "emo-b9-p3",
  "emo-b9-p4",
  "emo-b9-p5",
  "emo-b9-p6",
  "emo-b9-p7",
  "emo-b9-p8",
  "emo-b9-p9",
  "emo-b9-wbored",
  "emo-b9-wconnected",
  "emo-b9-wforgotten",
  "emo-b9-wfriendly",
  "emo-b9-whopeful",
  "emo-b9-wlonely",
  "emo-b9-wloved",
  "emo-b9-wsad",
  "sel-door",
  "sel-feel-angry",
  "sel-feel-embarrassed",
  "sel-feel-excited",
  "sel-feel-jealous",
  "sel-feel-left-out",
  "sel-feel-lonely",
  "sel-feel-nervous",
  "sel-feel-proud",
  "sel-feel-sad",
  "sel-feel-scared",
  "sel-toolbox",
  "out-tortoise-cover",
  "out-tortoise-p0",
  "out-tortoise-p1",
  "out-tortoise-p2",
  "out-tortoise-p3",
  "out-tortoise-p4",
  "out-tortoise-p5",
  "qz-out-tortoise-q0",
  "qz-out-tortoise-q1",
  "qz-out-tortoise-q2",
  "ch-out-tortoise-q0-c0",
  "ch-out-tortoise-q0-c1",
  "ch-out-tortoise-q0-c2",
  "ch-out-tortoise-q1-c0",
  "ch-out-tortoise-q1-c1",
  "ch-out-tortoise-q1-c2",
  "ch-out-tortoise-q2-c0",
  "ch-out-tortoise-q2-c1",
  "ch-out-tortoise-q2-c2",
  "out-lionmouse-cover",
  "out-lionmouse-p0",
  "out-lionmouse-p1",
  "out-lionmouse-p2",
  "out-lionmouse-p3",
  "out-lionmouse-p4",
  "out-lionmouse-p5",
  "qz-out-lionmouse-q0",
  "qz-out-lionmouse-q1",
  "qz-out-lionmouse-q2",
  "ch-out-lionmouse-q0-c0",
  "ch-out-lionmouse-q0-c1",
  "ch-out-lionmouse-q0-c2",
  "ch-out-lionmouse-q1-c0",
  "ch-out-lionmouse-q1-c1",
  "ch-out-lionmouse-q1-c2",
  "ch-out-lionmouse-q2-c0",
  "ch-out-lionmouse-q2-c1",
  "ch-out-lionmouse-q2-c2",
  "out-wolfboy-cover",
  "out-wolfboy-p0",
  "out-wolfboy-p1",
  "out-wolfboy-p2",
  "out-wolfboy-p3",
  "out-wolfboy-p4",
  "out-wolfboy-p5",
  "qz-out-wolfboy-q0",
  "qz-out-wolfboy-q1",
  "qz-out-wolfboy-q2",
  "ch-out-wolfboy-q0-c0",
  "ch-out-wolfboy-q0-c1",
  "ch-out-wolfboy-q0-c2",
  "ch-out-wolfboy-q1-c0",
  "ch-out-wolfboy-q1-c1",
  "ch-out-wolfboy-q1-c2",
  "ch-out-wolfboy-q2-c0",
  "ch-out-wolfboy-q2-c1",
  "ch-out-wolfboy-q2-c2",
  "out-antgrass-cover",
  "out-antgrass-p0",
  "out-antgrass-p1",
  "out-antgrass-p2",
  "out-antgrass-p3",
  "out-antgrass-p4",
  "out-antgrass-p5",
  "qz-out-antgrass-q0",
  "qz-out-antgrass-q1",
  "qz-out-antgrass-q2",
  "ch-out-antgrass-q0-c0",
  "ch-out-antgrass-q0-c1",
  "ch-out-antgrass-q0-c2",
  "ch-out-antgrass-q1-c0",
  "ch-out-antgrass-q1-c1",
  "ch-out-antgrass-q1-c2",
  "ch-out-antgrass-q2-c0",
  "ch-out-antgrass-q2-c1",
  "ch-out-antgrass-q2-c2",
  "out-dinosaur-big-tree-cover",
  "out-dinosaur-big-tree-p0",
  "out-dinosaur-big-tree-p1",
  "out-dinosaur-big-tree-p2",
  "out-dinosaur-big-tree-w0",
  "out-dinosaur-big-tree-w1",
  "out-dinosaur-big-tree-w2",
  "out-dinosaur-big-tree-w3",
  "out-dinosaur-big-tree-w4",
  "qz-out-dinosaur-big-tree-q0",
  "qz-out-dinosaur-big-tree-q1",
  "qz-out-dinosaur-big-tree-q2",
  "ch-out-dinosaur-big-tree-q0-c0",
  "ch-out-dinosaur-big-tree-q0-c1",
  "ch-out-dinosaur-big-tree-q0-c2",
  "ch-out-dinosaur-big-tree-q1-c0",
  "ch-out-dinosaur-big-tree-q1-c1",
  "ch-out-dinosaur-big-tree-q1-c2",
  "ch-out-dinosaur-big-tree-q2-c0",
  "ch-out-dinosaur-big-tree-q2-c1",
  "ch-out-dinosaur-big-tree-q2-c2",
  "out-little-star-cover",
  "out-little-star-p0",
  "out-little-star-p1",
  "out-little-star-p2",
  "out-little-star-p3",
  "out-little-star-p4",
  "out-little-star-p5",
  "out-little-star-w0",
  "out-little-star-w1",
  "out-little-star-w2",
  "out-little-star-w3",
  "out-little-star-w4",
  "qz-out-little-star-q0",
  "qz-out-little-star-q1",
  "qz-out-little-star-q2",
  "ch-out-little-star-q0-c0",
  "ch-out-little-star-q0-c1",
  "ch-out-little-star-q0-c2",
  "ch-out-little-star-q1-c0",
  "ch-out-little-star-q1-c1",
  "ch-out-little-star-q1-c2",
  "ch-out-little-star-q2-c0",
  "ch-out-little-star-q2-c1",
  "ch-out-little-star-q2-c2",
  "out-i-like-to-read-cover",
  "out-i-like-to-read-p0",
  "out-i-like-to-read-p1",
  "out-i-like-to-read-p2",
  "out-i-like-to-read-p3",
  "out-i-like-to-read-p4",
  "out-i-like-to-read-p5",
  "out-i-like-to-read-p6",
  "out-i-like-to-read-p7",
  "out-i-like-to-read-w0",
  "out-i-like-to-read-w1",
  "out-i-like-to-read-w2",
  "out-i-like-to-read-w3",
  "out-i-like-to-read-w4",
  "out-i-like-to-read-w5",
  "qz-out-i-like-to-read-q0",
  "qz-out-i-like-to-read-q1",
  "qz-out-i-like-to-read-q2",
  "ch-out-i-like-to-read-q0-c0",
  "ch-out-i-like-to-read-q0-c1",
  "ch-out-i-like-to-read-q0-c2",
  "ch-out-i-like-to-read-q1-c0",
  "ch-out-i-like-to-read-q1-c1",
  "ch-out-i-like-to-read-q1-c2",
  "ch-out-i-like-to-read-q2-c0",
  "ch-out-i-like-to-read-q2-c1",
  "ch-out-i-like-to-read-q2-c2",
  "out-who-is-it-cover",
  "out-who-is-it-p0",
  "out-who-is-it-p1",
  "out-who-is-it-p2",
  "out-who-is-it-p3",
  "out-who-is-it-p4",
  "out-who-is-it-p5",
  "out-who-is-it-p6",
  "out-who-is-it-p7",
  "out-who-is-it-w0",
  "out-who-is-it-w1",
  "out-who-is-it-w2",
  "out-who-is-it-w3",
  "out-who-is-it-w4",
  "out-who-is-it-w5",
  "qz-out-who-is-it-q0",
  "qz-out-who-is-it-q1",
  "qz-out-who-is-it-q2",
  "ch-out-who-is-it-q0-c0",
  "ch-out-who-is-it-q0-c1",
  "ch-out-who-is-it-q0-c2",
  "ch-out-who-is-it-q1-c0",
  "ch-out-who-is-it-q1-c1",
  "ch-out-who-is-it-q1-c2",
  "ch-out-who-is-it-q2-c0",
  "ch-out-who-is-it-q2-c1",
  "ch-out-who-is-it-q2-c2",
  "out-my-body-cover",
  "out-my-body-p0",
  "out-my-body-p1",
  "out-my-body-p2",
  "out-my-body-p3",
  "out-my-body-p4",
  "out-my-body-p5",
  "out-my-body-p6",
  "out-my-body-p7",
  "out-my-body-w0",
  "out-my-body-w1",
  "out-my-body-w2",
  "out-my-body-w3",
  "out-my-body-w4",
  "out-my-body-w5",
  "qz-out-my-body-q0",
  "ch-out-my-body-q0-c0",
  "ch-out-my-body-q0-c1",
  "ch-out-my-body-q0-c2",
  "qz-out-my-body-q1",
  "ch-out-my-body-q1-c0",
  "ch-out-my-body-q1-c1",
  "ch-out-my-body-q1-c2",
  "qz-out-my-body-q2",
  "ch-out-my-body-q2-c0",
  "ch-out-my-body-q2-c1",
  "ch-out-my-body-q2-c2",
  "out-busy-ants-cover",
  "out-busy-ants-p0",
  "out-busy-ants-p1",
  "out-busy-ants-p2",
  "out-busy-ants-p3",
  "out-busy-ants-p4",
  "out-busy-ants-p5",
  "out-busy-ants-p6",
  "out-busy-ants-p7",
  "out-busy-ants-p8",
  "out-busy-ants-p9",
  "out-busy-ants-p10",
  "out-busy-ants-w0",
  "out-busy-ants-w1",
  "out-busy-ants-w2",
  "out-busy-ants-w3",
  "out-busy-ants-w4",
  "out-busy-ants-w5",
  "qz-out-busy-ants-q0",
  "ch-out-busy-ants-q0-c0",
  "ch-out-busy-ants-q0-c1",
  "ch-out-busy-ants-q0-c2",
  "qz-out-busy-ants-q1",
  "ch-out-busy-ants-q1-c0",
  "ch-out-busy-ants-q1-c1",
  "ch-out-busy-ants-q1-c2",
  "qz-out-busy-ants-q2",
  "ch-out-busy-ants-q2-c0",
  "ch-out-busy-ants-q2-c1",
  "ch-out-busy-ants-q2-c2",
  "out-the-race-cover",
  "out-the-race-p0",
  "out-the-race-p1",
  "out-the-race-p2",
  "out-the-race-p3",
  "out-the-race-p4",
  "out-the-race-w0",
  "out-the-race-w1",
  "out-the-race-w2",
  "out-the-race-w3",
  "out-the-race-w4",
  "qz-out-the-race-q0",
  "ch-out-the-race-q0-c0",
  "ch-out-the-race-q0-c1",
  "ch-out-the-race-q0-c2",
  "qz-out-the-race-q1",
  "ch-out-the-race-q1-c0",
  "ch-out-the-race-q1-c1",
  "ch-out-the-race-q1-c2",
  "qz-out-the-race-q2",
  "ch-out-the-race-q2-c0",
  "ch-out-the-race-q2-c1",
  "ch-out-the-race-q2-c2",
  "out-two-hungry-boys-cover",
  "out-two-hungry-boys-p0",
  "out-two-hungry-boys-p1",
  "out-two-hungry-boys-p2",
  "out-two-hungry-boys-p3",
  "out-two-hungry-boys-p4",
  "out-two-hungry-boys-w0",
  "out-two-hungry-boys-w1",
  "out-two-hungry-boys-w2",
  "out-two-hungry-boys-w3",
  "out-two-hungry-boys-w4",
  "qz-out-two-hungry-boys-q0",
  "ch-out-two-hungry-boys-q0-c0",
  "ch-out-two-hungry-boys-q0-c1",
  "ch-out-two-hungry-boys-q0-c2",
  "qz-out-two-hungry-boys-q1",
  "ch-out-two-hungry-boys-q1-c0",
  "ch-out-two-hungry-boys-q1-c1",
  "ch-out-two-hungry-boys-q1-c2",
  "qz-out-two-hungry-boys-q2",
  "ch-out-two-hungry-boys-q2-c0",
  "ch-out-two-hungry-boys-q2-c1",
  "ch-out-two-hungry-boys-q2-c2",
  "out-incredible-insects-cover",
  "out-incredible-insects-p0",
  "out-incredible-insects-p1",
  "out-incredible-insects-p2",
  "out-incredible-insects-p3",
  "out-incredible-insects-p4",
  "out-incredible-insects-p5",
  "out-incredible-insects-p6",
  "out-incredible-insects-p7",
  "out-incredible-insects-p8",
  "out-incredible-insects-p9",
  "out-incredible-insects-p10",
  "out-incredible-insects-w0",
  "out-incredible-insects-w1",
  "out-incredible-insects-w2",
  "out-incredible-insects-w3",
  "out-incredible-insects-w4",
  "qz-out-incredible-insects-q0",
  "ch-out-incredible-insects-q0-c0",
  "ch-out-incredible-insects-q0-c1",
  "ch-out-incredible-insects-q0-c2",
  "qz-out-incredible-insects-q1",
  "ch-out-incredible-insects-q1-c0",
  "ch-out-incredible-insects-q1-c1",
  "ch-out-incredible-insects-q1-c2",
  "qz-out-incredible-insects-q2",
  "ch-out-incredible-insects-q2-c0",
  "ch-out-incredible-insects-q2-c1",
  "ch-out-incredible-insects-q2-c2",
  "out-silkworm-cover",
  "out-silkworm-p0",
  "out-silkworm-p1",
  "out-silkworm-p2",
  "out-silkworm-p3",
  "out-silkworm-p4",
  "out-silkworm-p5",
  "out-silkworm-p6",
  "out-silkworm-p7",
  "out-silkworm-w0",
  "out-silkworm-w1",
  "out-silkworm-w2",
  "out-silkworm-w3",
  "out-silkworm-w4",
  "qz-out-silkworm-q0",
  "ch-out-silkworm-q0-c0",
  "ch-out-silkworm-q0-c1",
  "ch-out-silkworm-q0-c2",
  "qz-out-silkworm-q1",
  "ch-out-silkworm-q1-c0",
  "ch-out-silkworm-q1-c1",
  "ch-out-silkworm-q1-c2",
  "qz-out-silkworm-q2",
  "ch-out-silkworm-q2-c0",
  "ch-out-silkworm-q2-c1",
  "ch-out-silkworm-q2-c2",
  "out-palm-tree-cover",
  "out-palm-tree-p0",
  "out-palm-tree-p1",
  "out-palm-tree-p2",
  "out-palm-tree-p3",
  "out-palm-tree-p4",
  "out-palm-tree-p5",
  "out-palm-tree-p6",
  "out-palm-tree-p7",
  "out-palm-tree-w0",
  "out-palm-tree-w1",
  "out-palm-tree-w2",
  "out-palm-tree-w3",
  "out-palm-tree-w4",
  "qz-out-palm-tree-q0",
  "ch-out-palm-tree-q0-c0",
  "ch-out-palm-tree-q0-c1",
  "ch-out-palm-tree-q0-c2",
  "qz-out-palm-tree-q1",
  "ch-out-palm-tree-q1-c0",
  "ch-out-palm-tree-q1-c1",
  "ch-out-palm-tree-q1-c2",
  "qz-out-palm-tree-q2",
  "ch-out-palm-tree-q2-c0",
  "ch-out-palm-tree-q2-c1",
  "ch-out-palm-tree-q2-c2",
  "out-tiger-is-here-cover",
  "out-tiger-is-here-p0",
  "out-tiger-is-here-p1",
  "out-tiger-is-here-p2",
  "out-tiger-is-here-p3",
  "out-tiger-is-here-p4",
  "out-tiger-is-here-p5",
  "out-tiger-is-here-p6",
  "out-tiger-is-here-w0",
  "out-tiger-is-here-w1",
  "out-tiger-is-here-w2",
  "out-tiger-is-here-w3",
  "out-tiger-is-here-w4",
  "qz-out-tiger-is-here-q0",
  "ch-out-tiger-is-here-q0-c0",
  "ch-out-tiger-is-here-q0-c1",
  "ch-out-tiger-is-here-q0-c2",
  "qz-out-tiger-is-here-q1",
  "ch-out-tiger-is-here-q1-c0",
  "ch-out-tiger-is-here-q1-c1",
  "ch-out-tiger-is-here-q1-c2",
  "qz-out-tiger-is-here-q2",
  "ch-out-tiger-is-here-q2-c0",
  "ch-out-tiger-is-here-q2-c1",
  "ch-out-tiger-is-here-q2-c2",
  "out-rainbow-colours-cover",
  "out-rainbow-colours-p0",
  "out-rainbow-colours-p1",
  "out-rainbow-colours-p2",
  "out-rainbow-colours-p3",
  "out-rainbow-colours-p4",
  "out-rainbow-colours-p5",
  "out-rainbow-colours-p6",
  "out-rainbow-colours-p7",
  "out-rainbow-colours-p8",
  "out-rainbow-colours-p9",
  "out-rainbow-colours-p10",
  "out-rainbow-colours-p11",
  "out-rainbow-colours-p12",
  "out-rainbow-colours-p13",
  "out-rainbow-colours-p14",
  "out-rainbow-colours-p15",
  "out-rainbow-colours-w0",
  "out-rainbow-colours-w1",
  "out-rainbow-colours-w2",
  "out-rainbow-colours-w3",
  "out-rainbow-colours-w4",
  "out-rainbow-colours-w5",
  "qz-out-rainbow-colours-q0",
  "ch-out-rainbow-colours-q0-c0",
  "ch-out-rainbow-colours-q0-c1",
  "ch-out-rainbow-colours-q0-c2",
  "qz-out-rainbow-colours-q1",
  "ch-out-rainbow-colours-q1-c0",
  "ch-out-rainbow-colours-q1-c1",
  "ch-out-rainbow-colours-q1-c2",
  "qz-out-rainbow-colours-q2",
  "ch-out-rainbow-colours-q2-c0",
  "ch-out-rainbow-colours-q2-c1",
  "ch-out-rainbow-colours-q2-c2",
  "out-come-stay-with-me-cover",
  "out-come-stay-with-me-p0",
  "out-come-stay-with-me-p1",
  "out-come-stay-with-me-p2",
  "out-come-stay-with-me-p3",
  "out-come-stay-with-me-p4",
  "out-come-stay-with-me-p5",
  "out-come-stay-with-me-p6",
  "out-come-stay-with-me-p7",
  "out-come-stay-with-me-p8",
  "out-come-stay-with-me-p9",
  "out-come-stay-with-me-p10",
  "out-come-stay-with-me-p11",
  "out-come-stay-with-me-p12",
  "out-come-stay-with-me-p13",
  "out-come-stay-with-me-p14",
  "out-come-stay-with-me-p15",
  "out-come-stay-with-me-p16",
  "out-come-stay-with-me-p17",
  "out-come-stay-with-me-p18",
  "out-come-stay-with-me-p19",
  "out-come-stay-with-me-w0",
  "out-come-stay-with-me-w1",
  "out-come-stay-with-me-w2",
  "out-come-stay-with-me-w3",
  "out-come-stay-with-me-w4",
  "qz-out-come-stay-with-me-q0",
  "ch-out-come-stay-with-me-q0-c0",
  "ch-out-come-stay-with-me-q0-c1",
  "ch-out-come-stay-with-me-q0-c2",
  "qz-out-come-stay-with-me-q1",
  "ch-out-come-stay-with-me-q1-c0",
  "ch-out-come-stay-with-me-q1-c1",
  "ch-out-come-stay-with-me-q1-c2",
  "qz-out-come-stay-with-me-q2",
  "ch-out-come-stay-with-me-q2-c0",
  "ch-out-come-stay-with-me-q2-c1",
  "ch-out-come-stay-with-me-q2-c2",
  "out-cats-fault-cover",
  "out-cats-fault-p0",
  "out-cats-fault-p1",
  "out-cats-fault-p2",
  "out-cats-fault-p3",
  "out-cats-fault-p4",
  "out-cats-fault-p5",
  "out-cats-fault-p6",
  "out-cats-fault-p7",
  "out-cats-fault-p8",
  "out-cats-fault-w0",
  "out-cats-fault-w1",
  "out-cats-fault-w2",
  "out-cats-fault-w3",
  "out-cats-fault-w4",
  "qz-out-cats-fault-q0",
  "ch-out-cats-fault-q0-c0",
  "ch-out-cats-fault-q0-c1",
  "ch-out-cats-fault-q0-c2",
  "qz-out-cats-fault-q1",
  "ch-out-cats-fault-q1-c0",
  "ch-out-cats-fault-q1-c1",
  "ch-out-cats-fault-q1-c2",
  "qz-out-cats-fault-q2",
  "ch-out-cats-fault-q2-c0",
  "ch-out-cats-fault-q2-c1",
  "ch-out-cats-fault-q2-c2",
  "out-flying-high-cover",
  "out-flying-high-p0",
  "out-flying-high-p1",
  "out-flying-high-p2",
  "out-flying-high-p3",
  "out-flying-high-p4",
  "out-flying-high-p5",
  "out-flying-high-p6",
  "out-flying-high-p7",
  "out-flying-high-w0",
  "out-flying-high-w1",
  "out-flying-high-w2",
  "out-flying-high-w3",
  "out-flying-high-w4",
  "out-flying-high-w5",
  "qz-out-flying-high-q0",
  "ch-out-flying-high-q0-c0",
  "ch-out-flying-high-q0-c1",
  "ch-out-flying-high-q0-c2",
  "qz-out-flying-high-q1",
  "ch-out-flying-high-q1-c0",
  "ch-out-flying-high-q1-c1",
  "ch-out-flying-high-q1-c2",
  "qz-out-flying-high-q2",
  "ch-out-flying-high-q2-c0",
  "ch-out-flying-high-q2-c1",
  "ch-out-flying-high-q2-c2",
  "out-new-pussy-cat-cover",
  "out-new-pussy-cat-p0",
  "out-new-pussy-cat-p1",
  "out-new-pussy-cat-p2",
  "out-new-pussy-cat-p3",
  "out-new-pussy-cat-p4",
  "out-new-pussy-cat-p5",
  "out-new-pussy-cat-p6",
  "out-new-pussy-cat-p7",
  "out-new-pussy-cat-w0",
  "out-new-pussy-cat-w1",
  "out-new-pussy-cat-w2",
  "out-new-pussy-cat-w3",
  "out-new-pussy-cat-w4",
  "qz-out-new-pussy-cat-q0",
  "ch-out-new-pussy-cat-q0-c0",
  "ch-out-new-pussy-cat-q0-c1",
  "ch-out-new-pussy-cat-q0-c2",
  "qz-out-new-pussy-cat-q1",
  "ch-out-new-pussy-cat-q1-c0",
  "ch-out-new-pussy-cat-q1-c1",
  "ch-out-new-pussy-cat-q1-c2",
  "qz-out-new-pussy-cat-q2",
  "ch-out-new-pussy-cat-q2-c0",
  "ch-out-new-pussy-cat-q2-c1",
  "ch-out-new-pussy-cat-q2-c2",
  "out-have-you-seen-sundari-cover",
  "out-have-you-seen-sundari-p0",
  "out-have-you-seen-sundari-p1",
  "out-have-you-seen-sundari-p2",
  "out-have-you-seen-sundari-p3",
  "out-have-you-seen-sundari-p4",
  "out-have-you-seen-sundari-p5",
  "out-have-you-seen-sundari-p6",
  "out-have-you-seen-sundari-p7",
  "out-have-you-seen-sundari-p8",
  "out-have-you-seen-sundari-p9",
  "out-have-you-seen-sundari-p10",
  "out-have-you-seen-sundari-p11",
  "out-have-you-seen-sundari-w0",
  "out-have-you-seen-sundari-w1",
  "out-have-you-seen-sundari-w2",
  "out-have-you-seen-sundari-w3",
  "out-have-you-seen-sundari-w4",
  "qz-out-have-you-seen-sundari-q0",
  "ch-out-have-you-seen-sundari-q0-c0",
  "ch-out-have-you-seen-sundari-q0-c1",
  "ch-out-have-you-seen-sundari-q0-c2",
  "qz-out-have-you-seen-sundari-q1",
  "ch-out-have-you-seen-sundari-q1-c0",
  "ch-out-have-you-seen-sundari-q1-c1",
  "ch-out-have-you-seen-sundari-q1-c2",
  "qz-out-have-you-seen-sundari-q2",
  "ch-out-have-you-seen-sundari-q2-c0",
  "ch-out-have-you-seen-sundari-q2-c1",
  "ch-out-have-you-seen-sundari-q2-c2"
];
function assetsDir() {
  const candidates = [
    join(import.meta.dir, "..", "assets"),
    join(import.meta.dir, "..", "..", "server", "assets"),
    join(process.cwd(), "server", "assets"),
    join(process.cwd(), "assets")
  ];
  for (const c of candidates) {
    if (existsSync(join(c, "manifest.json")))
      return c;
  }
  return candidates[0];
}
async function manifestIds() {
  const raw = await readFile(join(assetsDir(), "manifest.json"), "utf8");
  const rows = JSON.parse(raw);
  const map = new Map;
  for (const r of rows)
    map.set(r.id, r.file);
  return map;
}
function pgDatabaseUrl() {
  return (process.env.DATABASE_URL ?? "").trim();
}
var PG_DDL = [
  `CREATE TABLE IF NOT EXISTS entries (
     id BIGSERIAL PRIMARY KEY,
     text TEXT NOT NULL,
     created_at BIGINT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS students (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     group_name TEXT NOT NULL DEFAULT '',
     badge_color TEXT NOT NULL DEFAULT '#C1272D',
     secret_picture TEXT NOT NULL DEFAULT '',
     radio_leo INTEGER NOT NULL DEFAULT 0,
     state_json TEXT NOT NULL DEFAULT '{}',
     updated_at BIGINT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS assignments (
     id BIGSERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     target_type TEXT NOT NULL,
     target_id TEXT NOT NULL DEFAULT '',
     section TEXT NOT NULL,
     skill_id TEXT NOT NULL DEFAULT '',
     std_code TEXT NOT NULL DEFAULT '',
     grade TEXT NOT NULL DEFAULT '',
     window_start TEXT NOT NULL,
     window_end TEXT NOT NULL,
     created_at BIGINT NOT NULL
   )`,
  `ALTER TABLE students ADD COLUMN IF NOT EXISTS radio_leo INTEGER NOT NULL DEFAULT 0`,
  `CREATE TABLE IF NOT EXISTS meta (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL DEFAULT ''
   )`,
  `CREATE TABLE IF NOT EXISTS recordings (
     id BIGSERIAL PRIMARY KEY,
     student_id TEXT NOT NULL DEFAULT '',
     kind TEXT NOT NULL,
     ref_id TEXT NOT NULL DEFAULT '',
     blob_key TEXT NOT NULL,
     created_at BIGINT NOT NULL,
     data BYTEA,
     content_type TEXT NOT NULL DEFAULT ''
   )`
];
var pgClient = null;
var pgInitPromise = null;
function pgEnsureReady(url) {
  pgInitPromise ??= (async () => {
    pgClient = new SQL2(url, { max: 4, idleTimeout: 20, connectionTimeout: 15, prepare: false });
    for (const stmt of PG_DDL)
      await pgClient.unsafe(stmt);
  })().catch((err) => {
    pgInitPromise = null;
    try {
      pgClient?.close();
    } catch {}
    pgClient = null;
    throw err;
  });
  return pgInitPromise;
}
function pgIsConnectionError(err) {
  const e = err;
  const code = typeof e?.code === "string" ? e.code : "";
  if ([
    "08000",
    "08001",
    "08003",
    "08004",
    "08006",
    "08007",
    "57P03",
    "57P04",
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "EPIPE",
    "ENOTFOUND",
    "EAI_AGAIN"
  ].includes(code))
    return true;
  const msg = typeof e?.message === "string" ? e.message : String(err ?? "");
  return /failed to connect|connection (closed|reset|refused|terminated)|socket (closed|hang up)|server closed the connection|timed out connecting/i.test(msg);
}
function pgJsonSafe(value) {
  if (typeof value === "bigint")
    return Number(value);
  if (value instanceof Date)
    return value.getTime();
  if (value instanceof Uint8Array)
    return Buffer.from(value).toString("base64");
  return value;
}
async function pgExec(sqlText, params) {
  const url = pgDatabaseUrl();
  if (!url)
    throw new Error("External database query attempted without DATABASE_URL set.");
  for (let attempt = 0;attempt < 2; attempt += 1) {
    try {
      await pgEnsureReady(url);
      const client = pgClient;
      if (!client)
        throw new Error("External database client unavailable.");
      const rows = await client.unsafe(sqlText, params);
      return rows.map((row) => {
        const out = {};
        for (const [k, v] of Object.entries(row))
          out[k] = pgJsonSafe(v);
        return out;
      });
    } catch (err) {
      if (attempt === 0 && pgIsConnectionError(err)) {
        pgInitPromise = null;
        try {
          pgClient?.close();
        } catch {}
        pgClient = null;
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      throw err;
    }
  }
  throw new Error("External database query failed.");
}
var privilegedHandlers = definePrivilegedHandlers(privileged, {
  async readGameData() {
    const json = await readFile(join(assetsDir(), "gamedata.json"), "utf8");
    return { json };
  },
  async readManifest() {
    const json = await readFile(join(assetsDir(), "manifest.json"), "utf8");
    return { json };
  },
  async readClipsBatch(args) {
    const ids = await manifestIds();
    const clips = [];
    const missing = [];
    for (const id of args.ids) {
      const file = ids.get(id);
      if (!file) {
        missing.push(id);
        continue;
      }
      try {
        const bytes = await readFile(join(assetsDir(), file));
        clips.push({ id, base64: bytes.toString("base64") });
      } catch {
        missing.push(id);
      }
    }
    return { clips, missing };
  },
  async readClipSizes(args) {
    const ids = await manifestIds();
    const sizes = [];
    const missing = [];
    for (const id of args.ids) {
      const file = ids.get(id);
      if (!file) {
        missing.push(id);
        continue;
      }
      try {
        const st = await stat(join(assetsDir(), file));
        sizes.push({ id, size: st.size });
      } catch {
        missing.push(id);
      }
    }
    return { sizes, missing };
  },
  async readArtBatch(args) {
    const allowed = new Set(ART_IDS);
    const art = [];
    const missing = [];
    for (const id of args.ids) {
      if (!allowed.has(id)) {
        missing.push(id);
        continue;
      }
      try {
        const bytes = await readFile(join(assetsDir(), "art", `${id}.webp`));
        art.push({ id, base64: bytes.toString("base64") });
      } catch {
        missing.push(id);
      }
    }
    return { art, missing };
  },
  async readArtSizes(args) {
    const allowed = new Set(ART_IDS);
    const sizes = [];
    const missing = [];
    for (const id of args.ids) {
      if (!allowed.has(id)) {
        missing.push(id);
        continue;
      }
      try {
        const st = await stat(join(assetsDir(), "art", `${id}.webp`));
        sizes.push({ id, size: st.size });
      } catch {
        missing.push(id);
      }
    }
    return { sizes, missing };
  },
  async listArtIds() {
    return { ids: [...ART_IDS] };
  },
  async readVideoBatch(args) {
    const allowed = new Set(VIDEO_IDS);
    const videos = [];
    const missing = [];
    for (const id of args.ids) {
      if (!allowed.has(id)) {
        missing.push(id);
        continue;
      }
      try {
        const bytes = await readFile(join(assetsDir(), "video", `${id}.mp4`));
        videos.push({ id, base64: bytes.toString("base64") });
      } catch {
        missing.push(id);
      }
    }
    return { videos, missing };
  },
  async pgMode() {
    return { external: pgDatabaseUrl() !== "" };
  },
  async pgQuery(args) {
    const rows = await pgExec(args.sql, [...args.params]);
    return { rows };
  }
});
export {
  ART_IDS,
  VIDEO_IDS,
  privileged,
  privilegedHandlers
};
