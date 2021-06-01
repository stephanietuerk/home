export const FLIPCOLORS = {
    rColor:  "#f4003d",
    dColor: "#2437ff",
    dMapColor: "#394bff",
    oColor: "#f6b500",
    initialColor: "#cccccc"
};

export const FLIPTRANSITIONS = {
    delay: 8,
    pause: 500 
};

const FLIPBARDIMS = {
    width: 25,
    height: 200,
    squareSize: 5
};

export const FLIPBARLAYOUT = {
    width: FLIPBARDIMS.width,
    height: FLIPBARDIMS.height,
    squareSize: FLIPBARDIMS.squareSize,
    rows: FLIPBARDIMS.height / FLIPBARDIMS.squareSize,
    cols: FLIPBARDIMS.width / FLIPBARDIMS.squareSize,
    numSquares: FLIPBARDIMS.height * FLIPBARDIMS.width / Math.pow(FLIPBARDIMS.squareSize, 2)
};

const FLIPGRIDDIMS = {
    width: 250,
    height: 250,
    squareSize: 5
};

export const FLIPGRIDLAYOUT = {
    width: FLIPGRIDDIMS.width,
    height: FLIPGRIDDIMS.height,
    squareSize: FLIPGRIDDIMS.squareSize,
    rows: FLIPGRIDDIMS.height / FLIPGRIDDIMS.squareSize,
    cols: FLIPGRIDDIMS.width / FLIPGRIDDIMS.squareSize,
    numSquares: FLIPGRIDDIMS.height * FLIPGRIDDIMS.width / Math.pow(FLIPGRIDDIMS.squareSize, 2)
}