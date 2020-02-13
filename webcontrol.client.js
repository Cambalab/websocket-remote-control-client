export default class WebControl {
  ACTIONS = {
    screen: {
      urlRedirect: (url) => {
        window.location.href = url
      },
      getSpecialNumber: (data) => {
        document.getElementById(this.specialNumberTag).textContent = data.specialNumber
        sessionStorage.setItem('specialNumber', data.specialNumber)
      }
    },
    controller: {
      linkController: (response) => {
        if (response !== 'error') {
          sessionStorage.setItem('specialNumber', response.specialNumber)
          sessionStorage.setItem('widgetOn', true)
          return response
        }
      }
    }
  }

  CUSTOMACTIONS = {
    sendData: (value) => {
      const specialNumber = parseInt(sessionStorage.getItem('specialNumber'), 10)
      this.emit('data', value, this.socket.id, specialNumber)
    }
  }

  constructor (url, type, actions) {
    // socket.io-client is global required
    // eslint-disable-next-line
    this.socket = io(url)
    // only allowed values are screen and controller
    this.controlType = type
    // config has the form of a list of actions
    this.actions = actions
  }

  controlActions (event) {
    return this.ACTIONS[this.controlType][event]
  }

  onAction (event) {
    this.socket.on(event, this.controlActions(event))
  }

  customActions (event) {
    return this.CUSTOMACTIONS[event]
  }

  emit (event, data, param1, param2) {
    this.socket.emit(event, data, param1, param2)
  }

  subscribeToEvents () {
    this.actions.forEach(action => {
      this.onAction(action)
    })
  }

  getSpecialNumber () {
    return sessionStorage.getItem('specialNumber')
  }
}

export class WebControlScreen extends WebControl {
  constructor (url, actions, specialNumberTag = 'specialNumber') {
    super(url, 'screen', actions)
    this.screen()
    this.subscribeToEvents()
    this.specialNumberTag = specialNumberTag
  }

  screen () {
    const socket = this.socket
    socket.on('connect', () => {
      socket.emit('getSpecialNumber', socket.id, parseInt(this.getSpecialNumber(), 10))
    })

    this.onAction('getSpecialNumber')
  }
}

export class WebControlController extends WebControl {
  constructor (url) {
    super(url, 'controller', [])
    this.controller()
  }

  controller () {
    const socket = this.socket
    socket.on('connect', () => {
      socket.emit('alreadyLinked', parseInt(this.getSpecialNumber(), 10), socket.id)
    })
    socket.on('alreadyLinked', (value) => {
      console.log('alreadyLinked', value)
      value ? sessionStorage.setItem('widgetOn', true) : sessionStorage.setItem('widgetOn', false)
      this.postAlreadyLinkedFunction(value)
    })
    socket.on('data', (value) => {
      console.log('data', value)
    })
    socket.on('linkController', (value) => {
      console.log('linkController', value)
    })
    this.onAction('linkController')
    this.postAlreadyLinkedFunction = (value) => {}
  }

  // receives a function that will excute after alreadyLinked() with the returned value as param
  postAlreadyLinked (aFunction) {
    this.postAlreadyLinkedFunction = aFunction
  }

  linkController (numberValue) {
    this.socket.emit('linkController', parseInt(numberValue, 10), this.socket.id)
    this.alreadyLinked(numberValue)
  }

  alreadyLinked (numberValue) {
    this.socket.emit('alreadyLinked', parseInt(numberValue, 10), this.socket.id)
  }

  send (value) {
    this.customActions('sendData')(value)
  }
}
