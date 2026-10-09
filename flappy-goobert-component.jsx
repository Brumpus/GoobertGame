class FlappyGoobert {
    render() {
        return (
            <div id="main" class="container bg-primary">
                <div id="keys" class="d-block d-md-none vw-100">
                    <i class="bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup vw-100" onclick="jump()"></i>
                </div>
            </div>
        );
    }
}