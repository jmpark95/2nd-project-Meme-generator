import { css } from "styled-components"

export const small = (props) => {
    return css`
        @media only screen and (min-width: 30em) {
            ${props}
        }
    `;
};

export const medium = (props) => {
    return css`
        @media only screen and (min-width: 40em) {
            ${props}
        }
    `;
};

export const large = (props) => {
    return css`
        @media only screen and (min-width: 70em) {
            ${props}
        }
    `;
};