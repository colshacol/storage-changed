# storage-changed

A tiny function that dispatches events in the same tab that `localStorage` and `sessionStorage` are changed in.

**No dependencies!**  
**Much blazing!**  
**Only 1kb!**

```sh
npm i storage-changed
# or, if you are cool...
yarn add storage-changed
```


## The Problem

When `localStorage` or `sessionStorage` are changed, a `storage` event is emitted, but it can only be picked up by other open tabs of the same origin. Sometimes you need access to that event in the tab that it was dispatched from, as well.

```js
// Does not work.
window.addEventListener('storage', doCoolShit)
localStorage.setItem('foo', 'bar')
```

## The Solution

The solution is `storage-changed`, obviously.

```js
import storageChangedEmitter from 'storage-changed'

storageChangedEmitter(window.localStorage)

// Now this shit do work!
window.addEventListener('storageChanged', doCoolShit)
```

## The Options

You can pass an options object as the second argument to `storageChangedEmitter`. This options object currently supports one property: `eventName`. Setting the `eventName` will allow you flexibility to have different names for different targets, such as `localStorage` and `sessionStorage`.

```js
storageChangedEmitter(window.sessionStorage, {
  eventName: 'TonyDanza'
})

window.addEventListener('TonyDanza', doBadAssShit)
```

## The Event

As with any event listener, an event is provided to your callback. In this instance, I don't know what the fuck all is in the event, but I can guarantee you that `event.detail` will have two properties: `key`, and `value`. These values represent the storage key that changed and the new value that accompanies the change.

```js
storageChangedEmitter(window.localStorage, {
  eventName: 'TonyDanza'
})

window.addEventListener('TonyDanza', (event) => {
  console.log(event)
})

localStorage.setItem('foo', 'bar')
// { key: 'foo', value: 'bar' }
```
