import * as React from "react";
import { render } from "react-dom";
import { Provider } from "mobx-react";
import * as stores from "stores";

export default (container: HTMLElement) =>
    render(
        <Provider {...stores}>
            <h1>It Works!</h1>
        </Provider>,
        container
    );
