import React, { Component } from "react";
import { connect } from 'react-redux';

class LanguageProviderWrapper extends Component {
    render() {
        const { children } = this.props;
        return <>{children}</>;
    }
}

const mapStateToProps = state => {
    return {
        // Bạn có thể bỏ qua language nếu không cần thiết
    };
};

export default connect(mapStateToProps, null)(LanguageProviderWrapper);
