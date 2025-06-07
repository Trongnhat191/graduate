import React, { Component } from 'react';
import { connect } from 'react-redux';

class Revenue extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='text-center'>
                Revenue
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Revenue);
