export default class PushId {
  // Modeled after base64 web-safe chars, but ordered by ASCII.
  static PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'

  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
  static lastPushTime = 0

  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
  // timestamp to prevent collisions with other clients.  We store the last characters we
  // generated because in the event of a collision, we'll use those same characters except
  // "incremented" by one.
  static lastRandChars = []

  static generate (time = false) {
    let now = time !== false ? time : new Date().getTime()
    let duplicateTime = (now === this.lastPushTime)
    this.lastPushTime = now

    let timeStampChars = new Array(8)
    let i
    for (i = 7; i >= 0; i--) {
      timeStampChars[i] = this.PUSH_CHARS.charAt(now % 64)
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64)
    }
    if (now !== 0) throw new Error('We should have converted the entire timestamp.')

    let id = timeStampChars.join('')

    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        this.lastRandChars[i] = Math.floor(Math.random() * 64)
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && this.lastRandChars[i] === 63; i--) {
        this.lastRandChars[i] = 0
      }
      this.lastRandChars[i]++
    }
    for (i = 0; i < 12; i++) {
      id += this.PUSH_CHARS.charAt(this.lastRandChars[i])
    }
    if (id.length !== 20) throw new Error('Length should be 20.')

    return id
  }

  static getTimePrefix (time = false) {
    let now = time !== false ? time : new Date().getTime()
    let timeStampChars = new Array(8)

    for (let i = 7; i >= 0; i--) {
      timeStampChars[i] = this.PUSH_CHARS.charAt(now % 64)
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64)
    }

    if (now !== 0) throw new Error('We should have converted the entire timestamp.')

    return timeStampChars.join('')
  }
}
