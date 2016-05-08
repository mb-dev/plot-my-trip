import React from 'react';

import Header      from '../../components/header/header';
import Footer      from '../../components/footer/footer';

const App = (props) => (
  <div>
    <Header />
    {props.children}
    <Footer />
  </div>
);

export default App;
