"use strict";

class Hub extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("main", {
      className: "background"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tree-container"
    }, /*#__PURE__*/React.createElement("img", {
      src: "hub-images/gooberts_tree.png",
      alt: "GOOBERTS HUB",
      className: "pixelated-tree",
      id: "goobert-tree"
    }), /*#__PURE__*/React.createElement("div", {
      id: "tree-body-area"
    }), /*#__PURE__*/React.createElement("div", {
      id: "tree-legs-area"
    }), /*#__PURE__*/React.createElement("div", {
      id: "tree-mouth-area"
    }), /*#__PURE__*/React.createElement("div", {
      id: "tree-eyes-area"
    }), /*#__PURE__*/React.createElement("div", {
      id: "tree-body-color"
    }), /*#__PURE__*/React.createElement("div", {
      id: "tree-legs-color"
    }), /*#__PURE__*/React.createElement("div", {
      className: "goobert-container"
    }, /*#__PURE__*/React.createElement("img", {
      id: "goobert-legs",
      src: "assets/goobert-parts/Transparent-BG.png"
    }), /*#__PURE__*/React.createElement("img", {
      id: "goobert-body",
      src: "assets/goobert-parts/Transparent-BG.png"
    }), /*#__PURE__*/React.createElement("img", {
      id: "goobert-mouth",
      src: "assets/goobert-parts/Transparent-BG.png"
    }), /*#__PURE__*/React.createElement("img", {
      id: "goobert-eyes",
      src: "assets/goobert-parts/Transparent-BG.png"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "sleep-door-container"
    }, /*#__PURE__*/React.createElement("img", {
      src: "index-images/DreamDoor.webp",
      alt: "BEDROOM",
      id: "sleep-door",
      onClick: () => {
        load("bedroom");
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "game-door-container"
    }, /*#__PURE__*/React.createElement("img", {
      src: "hub-images/game-door.png",
      alt: "GAME",
      id: "game-door",
      onClick: () => {
        load("gameroom");
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "shop-door-container"
    }, /*#__PURE__*/React.createElement("img", {
      src: "hub-images/shop-door.png",
      alt: "SHOP",
      id: "shop-door",
      onClick: () => {
        load("shop");
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "leave-door-container"
    }, /*#__PURE__*/React.createElement("img", {
      src: "hub-images/leave-door.png",
      alt: "LEAVE",
      id: "leave-door"
    })));
  }
}
