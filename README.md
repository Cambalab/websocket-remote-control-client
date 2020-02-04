# websocket-remote-control-client

Websockets-remote-control is a JS project that provides two libraries: a client and a
server that can link two devices through websockets.

- Client (this library)
- [Server](https://github.com/Cambalab/websocket-remote-control-server)

This library initializes the Websockets client. Here, the `screen` and `controller` 
features are used. Both parts can be customized with different configurations to take
 advantage of its set of actions.

### Usage

#### Installation

`npm install websocket-remote-control-client`

#### Example

In the `/demo` folder

#### Creation

 Socket.io script should be added in every HTML file that uses the library before de body tag is closed.

 `<script src="/socket.io/socket.io.js"></script>`

You can instantiate a Screen or Controller object in a script tag or in a separate file 
and import it.

##### Screen

To create a `WebControlScreen` object:

`new WebControlScreen('serverUrl', actions, specialNumberTag);`

Where serverUrl is the url to the **websockets server**, **actions** is a list of 
actions, for example, `['urlRedirect']` and `specialNumberTag` is the HTML tag id where the 
Special Number will be displayed.

##### Controller

To create a `WebControlController` object:

`new WebControlController('serverUrl');`

Where serverUrl is the url to the **websockets server**.

#### Actions

The superclass `Webcontrol` models the generic behaviour of `WebControlScreen` and `WebControlController`. 

Webcontrol has a dictionary called `ACTIONS`. Different actions will be performed depending
 which class uses it (`screen` or `controller`).
Also, `CUSTOMACTIONS` dictionary is present for the user to add any functionality they need.

The **screen** actions present in `ACTIONS` are:

- `'urlRedirect'`: redirects the current **screen** to the received url.

- `'getSpecialNumber'`: sets the **Special Number** into the HTML tag selected at 
initialization. In addition, saves the **Special Number** in the Session Storage (with the
 key  `specialNumber`).

 The **controller** actions present in `ACTIONS` are:

 - `'linkController'`: if the response is not an error, then the data received is a Special Number.
 The Special Number is saved on the **sessionStorage** and the `widgetOn` variable is set to `true`.

The `CUSTOMACTIONS` present are:

- `'sendData'`: sends the **Special Number** to the server to pair both devices.

 #### Methods

 - `linkController(specialNumber)`: sends the special number to the server in order to be 
 paired.  

 - `postAlreadyLinked(function)`: a function executed just after the pairing is done. 
 In our example in the demo folder, this function is used to show or hide a QR widget.

 - `send(value)`: executes the `'sendData'` action with a value (special number).




