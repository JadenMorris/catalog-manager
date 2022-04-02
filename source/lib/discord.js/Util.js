module.exports = {
    verifyString(data, allowEmpty = true, errorMessage = `Expected a string, got ${data} instead.`, error = Error) {
        if (typeof data !== 'string') throw new error(errorMessage);
        if (!allowEmpty && data.length === 0) throw new error(errorMessage);
        return data;
    },

    resolvePartialEmoji(emoji) {
        if (!emoji) return null;
        if (typeof emoji === 'string') return /^\d{17,19}$/.test(emoji) ? { id: emoji } : this.parseEmoji(emoji);
        const { id, name, animated } = emoji;
        if (!id && !name) return null;
        return { id, name, animated };
    },

    parseEmoji(text) {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null };
        const match = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
        return match && { animated: Boolean(match[1]), name: match[2], id: match[3] ?? null };
    },

    flatten(obj, ...props) {
        if (!isObject(obj)) return obj;
    
        const objProps = Object.keys(obj)
          .filter(k => !k.startsWith('_'))
          .map(k => ({ [k]: true }));
    
        props = objProps.length ? Object.assign(...objProps, ...props) : Object.assign({}, ...props);
    
        const out = {};
    
        for (let [prop, newProp] of Object.entries(props)) {
          if (!newProp) continue;
          newProp = newProp === true ? prop : newProp;
    
          const element = obj[prop];
          const elemIsObj = isObject(element);
          const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;
    
          if (element instanceof Collection) out[newProp] = Array.from(element.keys());
          else if (valueOf instanceof Collection) out[newProp] = Array.from(valueOf.keys());
          else if (Array.isArray(element)) out[newProp] = element.map(e => Util.flatten(e));
          else if (typeof valueOf !== 'object') out[newProp] = valueOf;
          else if (!elemIsObj) out[newProp] = element;
        }
    
        return out;
    }
}