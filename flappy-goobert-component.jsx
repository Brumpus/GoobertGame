"use strict";

class FlappyGoobert {
    render() {
        return (
            <div id="main" className="container bg-primary">
                <div id="keys" className="d-block d-md-none vw-100">
                    <i className="bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup vw-100" onClick="jump()"></i>
                </div>
            </div>
        );
    }
}