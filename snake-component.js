"use strict";

import "games/snake-stylesheet.css";
class Snake extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("script", {
      src: "games/snake-game.js",
      defer: true
    }), /*#__PURE__*/React.createElement("div", {
      id: "main",
      class: "container bg-primary"
    }), /*#__PURE__*/React.createElement("div", {
      id: "keys",
      class: "d-block d-md-none"
    }, /*#__PURE__*/React.createElement("i", {
      class: "bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup",
      onclick: "setSnakeVelocity('up')"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("i", {
      class: "bi bi-arrow-left text-white bg-warning p-1 rounded-pill key keyleft",
      onclick: "setSnakeVelocity('left')"
    }), /*#__PURE__*/React.createElement("i", {
      class: "bi bi-arrow-down text-white bg-warning p-1 rounded-pill key keydown",
      onclick: "setSnakeVelocity('down')"
    }), /*#__PURE__*/React.createElement("i", {
      class: "bi bi-arrow-right text-white bg-warning p-1 rounded-pill key keyright",
      onclick: "setSnakeVelocity('right')"
    })));
  }
}
