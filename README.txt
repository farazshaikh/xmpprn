React native XMPP Client using stanza.io

1. This is based off Matt Folley's implementation of XMPP client using stanza.io
2. Adding some caveats from my experience.
        -> Doesn't WORK WITH EXPO based packaging i.e. create-react-naitve-app (CRNA) xmpprn WON'T WORK.  CRNA has limitation on including node core modules.

	-> Code doesn't cross compile for some linking reasons RNRandomBytes.seed not defined
           i.e. Linux machine cannot create a ios app and vice versa
        -> Works with ejabberd
        -> the virtual host name in ejabberd has to be same as the domain name of the JID
           Example alice@myhost should be hosted on a host named 'myhost'
           If not then you need to modiy the connect call to specify the jabber server.
 
3. Steps.
     install ejabberd
     create a virtualhost named 'emacsdesktop' or any hostname you like
     create 3 users with following user name password. (Simple password for demo)
       Username Password
       admin    amdin
       alice    alice
       bob      bob 

    3.3 Create the app
        # react-native init xmpprn
        # cd xmpprn
        # npm install stanza.io --save
        # npm install react-native-browser-builtins --save
        # npm install rn-nodeify --save-dev
        # ./node_modules/.bin/rn-nodeify --install --hack
        # Add the following line package.json
          "postinstall": "rn-nodeify --install --hack"

        # You should now be able to do a
          import "./shim.js" # first line in roject 
          ........ 
          import XMPP from 'stanza.io' 
          <Normal stanza.io code>

        # see Sample in App.js


Happy Hacking !

