"use strict";

class GameRoom {
  render() {
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("div", {
      class: "bg-primary text-white"
    }, "Game room"), /*#__PURE__*/React.createElement("div", {
      class: "container",
      id: "main"
    }), /*#__PURE__*/React.createElement("div", {
      class: "bg-warning text-white"
    }, /*#__PURE__*/React.createElement("a", {
      href: "hub.html"
    }, "Click here to go to the main hub!")), /*#__PURE__*/React.createElement("div", {
      class: "row justify-content-center my-3"
    }, /*#__PURE__*/React.createElement("div", {
      class: "col-3"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      class: "btn bg-secondary text-white text-lg w-100",
      "data-bs-toggle": "modal",
      "data-bs-target": "#snakeModal"
    }, /*#__PURE__*/React.createElement("h1", null, "Play Snake")))), /*#__PURE__*/React.createElement("div", {
      class: "modal",
      id: "snakeModal"
    }, /*#__PURE__*/React.createElement("div", {
      class: "modal-dialog modal-dialog-centered"
    }, /*#__PURE__*/React.createElement("div", {
      class: "modal-content"
    }, /*#__PURE__*/React.createElement("div", {
      class: "modal-header"
    }, /*#__PURE__*/React.createElement("h5", {
      class: "modal-title"
    }, "Difficulty"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      class: "btn-close",
      "data-bs-dismiss": "modal"
    })), /*#__PURE__*/React.createElement("div", {
      class: "modal-body"
    }, /*#__PURE__*/React.createElement("a", {
      type: "button",
      class: "btn menu-button w-100 mb-3",
      href: "snake-game.html?width=10&height=10"
    }, /*#__PURE__*/React.createElement("p", null, "10x10")), /*#__PURE__*/React.createElement("a", {
      type: "button",
      class: "btn menu-button w-100 mb-3",
      href: "snake-game.html?width=17&height=17"
    }, /*#__PURE__*/React.createElement("p", null, "17x17")), /*#__PURE__*/React.createElement("a", {
      type: "button",
      class: "btn menu-button w-100",
      href: "snake-game.html?width=25&height=25"
    }, /*#__PURE__*/React.createElement("p", null, "25x25")))))), /*#__PURE__*/React.createElement("div", {
      class: "row justify-content-center my-3"
    }, /*#__PURE__*/React.createElement("div", {
      class: "col-3"
    }, /*#__PURE__*/React.createElement("a", {
      type: "button",
      class: "btn bg-secondary text-white text-lg w-100",
      href: "flappy-goobert.html"
    }, /*#__PURE__*/React.createElement("h1", null, "Play Flappy Goobert")))));
  }
}
