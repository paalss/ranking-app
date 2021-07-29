import './App.css';
import ListOfLists from './components/ListOfLists';

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   database : 'ranking_app'
// });

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// connection.end();

function App() {
  return (
    <div className="App">
      <ListOfLists/>
    </div>
  );
}

export default App;
