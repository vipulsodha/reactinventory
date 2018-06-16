import React from 'react';
import { connect } from 'react-redux';


import SideBarElem from '../components/sideBarListElem'


const mapStateToProps = (store) => {
    return store.sideBar;
}

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.isOpen = this.isOpen.bind(this);
        this.getRenderedList = this.getRenderedList.bind(this);
    }

    isOpen() {
        return 'transition-all side-bar '+((this.props.hideSideBar) ?'side-bar-close':'side-bar-open');
    }

    getRenderedList() {
        let temp =  this.props.list.map((elem, index) => {
            return (
                <SideBarElem defaultOpen={elem.defaultOpen} listHeader={elem.key} giveHeaderLink = {elem.giveHeaderLink} link={elem.link} subList = {elem.subList} icon={elem.icon} key={index} />
                )

        });
        return temp;
    }

    render() {
        return(
            <div className={this.isOpen()} key="sideBarElemParentList">
                <div className="side-bar-company-details">
                    <img src="img/factory.png"/>
                    <span><b>Company Name</b></span>
                </div>
                {this.getRenderedList()}
            </div>
        )
    }
}

SideBar.defaultProps = {
    list:[]
};

export default connect(mapStateToProps)(SideBar);
