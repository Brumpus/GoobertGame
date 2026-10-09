class FlappyGoobert {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "main",
      class: "container bg-primary"
    }, /*#__PURE__*/React.createElement("div", {
      id: "keys",
      class: "d-block d-md-none vw-100"
    }, /*#__PURE__*/React.createElement("i", {
      class: "bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup vw-100",
      onclick: "jump()"
    })));
  }
}
