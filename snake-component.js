"use strict";

class SnakeGame extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("script", {
      src: "games/snake-game.js",
      defer: true
    }), /*#__PURE__*/React.createElement("div", {
      id: "main",
      className: "container bg-primary"
    }), /*#__PURE__*/React.createElement("div", {
      id: "keys",
      className: "d-block d-md-none"
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup",
      onClick: setSnakeVelocity('up')
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("i", {
      className: "bi bi-arrow-left text-white bg-warning p-1 rounded-pill key keyleft",
      onClick: setSnakeVelocity('left')
    }), /*#__PURE__*/React.createElement("i", {
      className: "bi bi-arrow-down text-white bg-warning p-1 rounded-pill key keydown",
      onClick: setSnakeVelocity('down')
    }), /*#__PURE__*/React.createElement("i", {
      className: "bi bi-arrow-right text-white bg-warning p-1 rounded-pill key keyright",
      onClick: setSnakeVelocity('right')
    })));
  }
}
