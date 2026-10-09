"use strict";
class GameRoom {
    render() {
        return (
            <main>
                <div class="bg-primary text-white">Game room</div>
                <div class="container" id="main"></div>
                <div class="bg-warning text-white">
                    <a href="hub.html">
                        Click here to go to the main hub!
                    </a>
                </div>
        
                {/* <!--Stolen from index.html--> */}
                {/* <!-- This is a button + Modal for the snake game --> */}
                <div class="row justify-content-center my-3">
                    <div class="col-3">
                        <button
                            type="button"
                            class="btn bg-secondary text-white text-lg w-100"
                            data-bs-toggle="modal"
                            data-bs-target="#snakeModal">
                            <h1>Play Snake</h1>
                        </button>
                    </div>
                </div>
        
                <div class="modal" id="snakeModal">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
        
                            <div class="modal-header">
                                <h5 class="modal-title">Difficulty</h5>
        
                                <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal">
                                </button>
                            </div>
        
                            <div class="modal-body">
        
                                {/* <!-- Save slot Placeholders --> */}
        
                                <a 
                                    type="button" class="btn menu-button w-100 mb-3" 
                                    href="snake-game.html?width=10&height=10"
                                >
                                    <p>10x10</p>
                                </a>
        
                                <a 
                                    type="button" class="btn menu-button w-100 mb-3"
                                    href="snake-game.html?width=17&height=17"
                                >
                                    <p>17x17</p>
                                </a>
        
                                <a 
                                    type="button" class="btn menu-button w-100"
                                    href="snake-game.html?width=25&height=25"
                                >
                                    <p>25x25</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
        
                {/* <!-- Flappy Goobert Button --> */}
                <div class="row justify-content-center my-3">
                    <div class="col-3">
                        <a
                            type="button"
                            class="btn bg-secondary text-white text-lg w-100"
                            href="flappy-goobert.html">
                            <h1>Play Flappy Goobert</h1>
                        </a>
                    </div>
                </div>

            </main>
        );
    }
}