import React, { Component } from 'react';
import { connect } from 'react-redux';

class History extends Component {

    state = {}

    componentDidMount() {}

    render() {
        return (
            <div className="text-center">Lịch sử</div>
        );
    }

}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
