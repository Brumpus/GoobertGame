"use strict";

class Shop extends React.Component {
    render() {
        return(
            <main>
                
                {/* <!-- SHOP TITLE --> */}
                <div className="row">
                    <div className="col text-center">
        
                        {/* <!-- SHOP AWNING --> */}
                        <div className="awning">
                        <h1 className="shop-title">THE GOOBIE SHOP</h1>
                        </div>
                    </div>
                </div>
        
                {/* <!-- SHOP WALL --> */}
                <div className="shop-wall">
        
                    {/* <!-- SHOP WINDOW --> */}
                    <div className="shop-window">
                        <div className="window-horizontal"></div>
                        <div className="window-vertical"></div>
                    </div>
                </div>
        
                {/* <!-- LEFT SHELF --> */}
                <div className="left-shelf">
                    <div className="shelf-row"></div>
                    <div className="shelf-row"></div>
                    <div className="shelf-row"></div>
                </div>
        
                {/* <!-- RIGHT SHELF --> */}
                <div className="right-shelf">
                    <div className="shelf-row"></div>
                    <div className="shelf-row"></div>
                    <div className="shelf-row"></div>
                </div>
                {/* <!-- SHOP COUNTER --> */}
                <div className="counter">
                    {/* <!-- BUY BUTTON --> */}
                    <button className="buy-button" onClick={openShop}>BUY!</button>
                </div>
        
                {/* <!-- ACCESSORIES POPUP --> */}
                <div className="accessories-popup" id="accessoriesPopup">
        
                    {/* <!-- POPUP TITLE --> */}
                    <h2>ACCESSORIES</h2>
        
                    {/* <!-- ACCESSORIES WILL GO HERE --> */}
                    <div className="accessories">
                        <p>Accessories will go here!</p>
                    </div>
        
                    {/* <!-- CLOSE BUTTON --> */}
                    <button className="close-button" onClick={closeShop}>
                        CLOSE
                    </button>
                </div>
                {/* <!-- MAIN HUB LINK --> */}
                <div className="bg-warning text-white">
                    <a href="hub.html">
                        Click here to go to the main hub!
                    </a>
                </div>
            </main>
        );
    }
}


// OPENS ACCESSORIES POPUP
function openShop() {
	document.getElementById("accessoriesPopup").style.display = "block";
}

// CLOSES ACCESSORIES POPUP
function closeShop() {
	document.getElementById("accessoriesPopup").style.display = "none";
}