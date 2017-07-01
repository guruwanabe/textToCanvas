# textToCanvas

textToCanvas.js is a small plugin witch allows you to easily write text on canvas elements.

## Installation
Just add '<script src="../textToCanvas.js"></script>' anywhere after jQuery.

## Usage

`TextToCanvas.DEFAULTS = {
    handler: false,  
    disabled: false,  
    fontStyle: 'lighter 12px Arial,Helvetica,Geneva,sans-serif',  
    fillStyle: '#000000',  
    background: 'white',  
    message: '',  
    textParams: {  
        x: 0,  
        y: 12  
    }  
};`  

//js  
`$('#selector').textToCanvas({$options}),`

//Data API  
`<div data-canvas="true" data-text="some text to be written on canvas" data-fillStyle="#333333" data-container="body"></div>`

## Credits

Bogdan Stanciu
bp.stanciu@gmail.com
@bp.stanciu

## License

MIT
