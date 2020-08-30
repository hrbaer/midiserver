# midiserver
 This Node.js command line tool provides MIDI connections over a WebSocket server.
 
 ## Installing
 Install with npm:
  ```
 npm install midiserver
 ```

## Run Test
To test this MIDI WebSocket server, proceed as follows:
1. Run MIDI WebSocket server
2. Run MIDI player (e. g. Sforzando by Plogue) and open soundfont
3. Connect to MIDI output "WSS Out"
4. Open TestRun.html in browser and push the test button

## Command Line arguments
The command line tools recognizes the following options:
  Usage: node index.js [options]
  -i <midi input>: Use the specified input device
  -o <midi output>: Use the specified output device
  -h This help
  -p <n>: Port number (default: 8888)
  -l List available midi devices or drivers
  -v Verbose MIDI events
 
### Links
Known to co-operate with these applications:
[sforzando](https://www.plogue.com/products/sforzando.html): Sample player, SFZ 2.0 compliant, MIDI interface.
[webDX7](https://www.webaudiomodules.org/wamsynths/webdx7/): Virtual Yamaha DX7 synthesizer, Web Audio Module, MIDI interface.
[Clavier](http://www.ursamedia.ch/clavier/): Web app for musical interpretation, MIDI over WebSocket.




 

