//react class that displays the information written in class Songs
import Songs from "./Songs"
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <Songs/>
        </p>
      </header>
    </div>
  );
}

export default App;
