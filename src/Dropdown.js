import React, { Component } from 'react'

export default class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
    this.props.onChange(event);
  }
  render() {
    return (
     <select onChange={this.handleChange} defaultValue={this.props.value}>
      {this.props.options.map((item, index) => <option key={index}>{index}</option>)}
    </select>
    )
  }

}

