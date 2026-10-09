class Bedroom extends React.Component {
    render() {
        return(
            <main>
                <div id="wall">
                    <div className="row">
                        <div className="col-10">
                        </div>
                        <div className="col-2">
                            <button onClick="alert('You found my secret easter egg!')" className="btn">
                                <img className="img-fluid" src="bedroom-images/BedroomLogo.webp" alt="BedRoom" />
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5"></div>
                        <div id="exit" className="col-2">
                            <a className="ml-2" href="hub.html">
                                <img className="img-fluid" src="bedroom-images/exitDoor.webp" />
                            </a>
                        </div>
                        <div className="col-5"></div>
                    </div>
                    <div className="bg-warning">
                        <br />
                    </div>
                </div>
                <div id="floor-wrapper">
                    <div className="row">
                        <div className="col-12">
                            <br />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-2 btn">
                            <button onclick="david.sleep()" className="btn">
                                <img className="img-fluid" src="bedroom-images/GoobBedWeb.png" alt="" title="Click Here to sleep!" />
                            </button>
                        </div>
                        <div className="col-4"></div>
                        <div className="col-2 btn">
                            <button onclick="david.sleep()" className="btn">
                                <img className="img-fluid" src="bedroom-images/GoobBedWeb.png" alt="" title="Click Here to sleep!" />
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2 btn">
                            <button onclick="david.sleep()" className="btn">
                                <img className="img-fluid" src="bedroom-images/GoobBedWeb.png" alt="" title="Click Here to sleep!" />
                            </button>
                        </div>
                        <div className="col-8"></div>
                        <div className="col-2 btn">
                            <button onclick="david.sleep()" className="btn">
                                <img className="img-fluid" src="bedroom-images/GoobBedWeb.png" alt="" title="Click Here to sleep!" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}