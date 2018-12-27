import storageUtils from 'storage-utilities'

const emit = (target, detail, options) => {
  return new Promise(() => {
    let attempts = 0

    const interval = setInterval(() => {
      if (attempts++ >= options.timeout) clearInterval(interval)

      const event = new CustomEvent(options.eventName, { detail })

      if (target[detail.key] === detail.value) {
        window.dispatchEvent(event)
        clearInterval(interval)
      }
    }, 10)
  })
}

const getEventName = (options) => {
  return options.eventName || options.targetName + 'StorageChanged'
}

const getTimeout = (options) => {
  return options.timeout ? options.timeout / 10 : 15
}

const getTarget = (storage) => {
  if (typeof storage === 'string') {
    return window[`${storage}Storage`]
  }

  return storage
}

const getTargetName = (storage) => {
  return typeof storage === 'string'
    ? storage === 'session'
      ? 'session'
      : `local`
    : storage === window.sessionStorage
      ? 'session'
      : 'local'
}

export default (storage, options) => {
  const opts = options || {}
  // Set up missing options.
  opts.targetName = getTargetName(storage)
  opts.eventName = getEventName(opts)
  opts.timeout = getTimeout(opts)

  // Get correct storage target and ref setItem.
  const target = getTarget(storage)
  const setItem = target.setItem.bind(target)
  const removeItem = target.removeItem.bind(target)

  target.setItem = (key, value) => {
    const _value = storageUtils.stringify(value)

    emit(target, { key, value: _value, _target: opts.targetName }, opts)
    setItem(key, _value)
  }

  target.removeItem = (key) => {
    emit(target, { key, _target: opts.targetName }, opts)
    removeItem(key)
  }
}
