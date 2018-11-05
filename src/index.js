import storageUtils from 'storage-utilities'

const emit = (which, target, detail, options) => {
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

// onStorageChanged
export default (which, options = {}) => {
  // Set up missing options.
  options.eventName = options.eventName || `${which}StorageChanged`
  options.timeout = options.timeout ? options.timeout / 10 : 15

  // Get correct storage target and ref setItem.
  const target = window[`${which}Storage`]
  const setItem = target.setItem.bind(target)

  target.setItem = (key, value) => {
    const v = storageUtils.stringify(value)

    emit(which, target, { key, value: v }, options)
    setItem(key, v)
  }
}
