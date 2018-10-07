import React from 'react';
import './searchbar.css';
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: '' };

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  handleTermChange(e) {
    e.preventDefault();
    const term = e.target.value;
    sessionStorage.setItem('term', term); // store the current search term to local storage
    this.setState({ term : term })
}
  search () {
    this.props.onSearch(this.state.term);
  }

  handleEnter(e) { // feature: pressing enter triggers a search 
    if (e.keyCode === 13) {
        this.search()
    }
  }
  componentWillMount() { // set the previous search term in the state, if it exists in sessionStorage
    let term = sessionStorage.getItem('term'); 
    if (term) {
        this.setState({ term: term })
    }
}

    render() {
      return (
        <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" 
                      onKeyDown={this.handleEnter} value={this.state.term} 
                      onChange= {this.handleTermChange} />
                <a onClick = {this.search}>SEARCH</a>
                
          
      </div>
      );
    }
  };

  export default SearchBar;