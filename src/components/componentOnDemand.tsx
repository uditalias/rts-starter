import * as React from "react";

class ComponentOnDemand extends React.Component<any, any> {
    private WrappedComponent;

    constructor(props, context) {
        super(props, context);
        this.WrappedComponent = null;
        this.state = { isLoaded: false };
    }

    public async componentDidMount() {
        const { loader } = this.props;

        const res = await loader;

        this.WrappedComponent = res.default;

        this.setState({ isLoaded: true });
    }

    public render() {
        const { WrappedComponent, state: { isLoaded }, props: { loading } } = this;

        return isLoaded ? <WrappedComponent /> : loading;
    }
}

export default ({ loader, loading = null }) => {
    return () => <ComponentOnDemand loader={loader} loading={loading} />;
};
