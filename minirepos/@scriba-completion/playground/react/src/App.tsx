import { useCallback } from 'react';
import './App.css';


import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';

function App() {
  const onChange = useCallback((value, viewUpdate) => {
    console.log('value:', value);
  }, []);
  return (
    <CodeMirror
      value="console.log('hello world!');"
      height="200px"
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
    />
  );
}

export default App
