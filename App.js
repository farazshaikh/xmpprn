/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import "./shim.js"
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

import XMPP from 'stanza.io';





type Props = {};

class UselessTextInput extends Component {
  render() {
    return (
<View style={{
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderTopWidth: 1,
  borderBottomWidth: 1
}}>
      <TextInput
        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable = {true}
        maxLength = {40}
      />
</View>
    );
  }
}

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            text: "Say something"
        };

        this.addLog = this.addLog.bind(this);
    }

    componentWillMount() {
        this.connectServer(); // uygulama başlayınca otomatik çalıştırıyorum
    }

    addLog(log, align="right") {
        while (this.state.logs.length > 10) {
		this.state.logs.shift();
        }
        this.state.logs.push({text:String(log), align:String(align)});
        this.setState({logs: this.state.logs});
    }



    connectServer() {
        //This is tested using a locally configured ejabberd docker container
        let client = this.state.client = XMPP.createClient({
            jid: 'alice@emacsdesktop',
            password: 'alice',

            // If you have a .well-known/host-meta.json file for your
            // domain, the connection transport config can be skipped.
            transport: 'websocket',
            wsURL: 'ws://emacsdesktop:5280/ws/'
            // (or `boshURL` if using 'bosh' as the transport)
        });


        client.on('session:started', () => {
            this.addLog('session:started');
            client.getRoster();
            client.sendPresence();
        });

        client.on('chat', (msg) => {
            /*client.sendMessage({
                to: msg.from,
                body: 'You sent: ' + msg.body
            });
	    console.log(msg)*/
            this.addLog(msg.from.local + ':' + msg.body)
        });

        client.on('raw:incoming', (xml) => {
            //this.addLog('xml received: ' + xml);
        });

        client.on('raw:outgoing', (xml) => {
            //this.addLog('xml sent:' + xml);
        });

        client.on('stream:data', (thing) => {
            //this.addLog('stream:data' + thing);
        });

        client.on('auth:failed', (xml) => {
            this.addLog('Auth Failed ');
        });

        client.on('connected', () => {
            this.addLog('connected');
        });

        client.on('disconnected', (xml) => {
            this.addLog('disconnected ' + Object.keys(xml));
        });

        client.on('connected', (xml) => {
            this.addLog('connected ' + Object.keys(xml));
        })

        client.on('stream:error', () => {
            this.addLog('stream:error');
        });

        client.on('session:error', () => {
            this.addLog('session:error');
        });

        this.addLog('Tried creating a client');

        //  client.connect();
        this.addLog('Client Connected');
        client.connect();

        this.addLog('Tried connecting to a client');
    }

  sendChat() {

            this.state.client.sendMessage({
                to: "bob@emacsdesktop",
                body: this.state.text
            });
         this.addLog("Alice:" + this.state.text, align="left");
        this.setState({text: ""});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>XMPP React native using stanza.io</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
	<View style={{alignSelf:'stretch'}}>
            {
                this.state.logs.map((x, i) => (
                        <Text key={i} 
                        style={
                               {...styles.messages, ...{textAlign: x.align}}
                              }>
                        {x.text}
                        </Text>
                ))
            }

 	<UselessTextInput
         blurOnSubmit={false}
         multiline = {false}
         numberOfLines = {4}
         onChangeText={(text) => this.setState({text})}
         onSubmitEditing={this.sendChat.bind(this)}
         value={this.state.text}
       />
         </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 100,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  messages: {
    color: 'darkblue',
  },
});
