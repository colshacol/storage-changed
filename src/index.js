const emit = (detail, options) => {
  return new Promise(() => {
    const interval = setInterval(() => {
      if ((window.localStorage[detail.key] = detail.value)) {
        window.dispatchEvent(new CustomEvent(options.eventName, { detail }))
        clearInterval(interval)
      }
    }, 10)
  })
}

const DEFAULT_OPTIONS = {
  eventName: 'storageChanged'
}

// storageChangedEmitter
module.exports = (target, options = DEFAULT_OPTIONS) => {
  target.setItem = new Proxy(target.setItem, {
    apply(target, self, [key, value]) {
      emit({ key, value }, options)
      Reflect.apply(target, self, [key, value])
    }
  })
}