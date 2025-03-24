// components/StyleInputField.js
const NumberInputStyle = {
    "& input": {
        MozAppearance: "textfield", // Hides arrows in Firefox
    },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none", // Hides arrows in Chrome, Edge, and Opera
    }
};

export default NumberInputStyle;
