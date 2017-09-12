import React, { Component } from 'react';
import './App.css';

console.log(ScrollArea);

class App extends Component {
  render() {
    return (
      <div style={{ width: '200px', height: '200px', 'margin': 'auto' }}>
        <ScrollArea ref="scrollarea">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt est fugit adipisci, ea fuga natus, eos recusandae, culpa, possimus ipsum modi minima voluptatibus nisi suscipit repellat in reiciendis distinctio beatae.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt est fugit adipisci, ea fuga natus, eos recusandae, culpa, possimus ipsum modi minima voluptatibus nisi suscipit repellat in reiciendis distinctio beatae.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt est fugit adipisci, ea fuga natus, eos recusandae, culpa, possimus ipsum modi minima voluptatibus nisi suscipit repellat in reiciendis distinctio beatae.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt est fugit adipisci, ea fuga natus, eos recusandae, culpa, possimus ipsum modi minima voluptatibus nisi suscipit repellat in reiciendis distinctio beatae.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt est fugit adipisci, ea fuga natus, eos recusandae, culpa, possimus ipsum modi minima voluptatibus nisi suscipit repellat in reiciendis distinctio beatae.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt est fugit adipisci, ea fuga natus, eos recusandae, culpa, possimus ipsum modi minima voluptatibus nisi suscipit repellat in reiciendis distinctio beatae.
        </ScrollArea>
      </div>
    );
  }
}

export default App;
